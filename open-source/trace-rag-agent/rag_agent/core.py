from __future__ import annotations

from dataclasses import dataclass
import math
import re
from typing import Iterable


TOKEN_RE = re.compile(r"[A-Za-z0-9_+-]+|[\u4e00-\u9fff]+")
ACTION_WORDS = ("下发", "修改", "删除", "重启", "开启", "关闭", "执行", "写入")


def tokenize(value: str) -> list[str]:
    """Use words plus Chinese bigrams so offline matching avoids single-character noise."""
    tokens: list[str] = []
    for raw in TOKEN_RE.findall(value or ""):
        if raw[0].isascii():
            tokens.append(raw.lower())
            continue
        if len(raw) <= 2:
            tokens.append(raw)
            continue
        tokens.extend(raw[index:index + 2] for index in range(len(raw) - 1))
    return tokens


def chunk_text(text: str, max_chars: int = 420, overlap: int = 48) -> list[str]:
    """Split paragraphs into bounded chunks while retaining a small context window."""
    if max_chars <= overlap:
        raise ValueError("max_chars must be greater than overlap")
    paragraphs = [part.strip() for part in re.split(r"\n{2,}", text or "") if part.strip()]
    chunks: list[str] = []
    for paragraph in paragraphs:
        if len(paragraph) <= max_chars:
            chunks.append(paragraph)
            continue
        start = 0
        while start < len(paragraph):
            end = min(start + max_chars, len(paragraph))
            chunks.append(paragraph[start:end].strip())
            if end == len(paragraph):
                break
            start = end - overlap
    return chunks


@dataclass(frozen=True)
class Document:
    id: str
    title: str
    content: str
    tags: tuple[str, ...] = ()


@dataclass(frozen=True)
class SearchHit:
    document_id: str
    title: str
    excerpt: str
    score: float
    matched_terms: tuple[str, ...]

    def as_dict(self) -> dict[str, object]:
        return {
            "document_id": self.document_id,
            "title": self.title,
            "excerpt": self.excerpt,
            "score": round(self.score, 3),
            "matched_terms": list(self.matched_terms),
        }


class KnowledgeBase:
    def __init__(self, documents: Iterable[Document] = ()) -> None:
        self._documents: dict[str, Document] = {}
        self._chunks: dict[str, list[str]] = {}
        self._term_frequency: dict[str, dict[str, int]] = {}
        self.ingest(documents)

    @property
    def document_count(self) -> int:
        return len(self._documents)

    def ingest(self, documents: Iterable[Document]) -> int:
        added = 0
        for document in documents:
            if not document.id or not document.title or not document.content:
                raise ValueError("document id, title and content are required")
            self._documents[document.id] = document
            chunks = chunk_text(document.content)
            self._chunks[document.id] = chunks
            self._term_frequency[document.id] = {}
            for token in tokenize(" ".join((document.title, document.content, *document.tags))):
                self._term_frequency[document.id][token] = self._term_frequency[document.id].get(token, 0) + 1
            added += 1
        return added

    def search(self, query: str, limit: int = 4) -> list[SearchHit]:
        query_terms = tuple(dict.fromkeys(tokenize(query)))
        if not query_terms:
            return []
        hits: list[SearchHit] = []
        total = max(len(self._documents), 1)
        for document_id, document in self._documents.items():
            frequencies = self._term_frequency[document_id]
            matched = tuple(term for term in query_terms if term in frequencies)
            if not matched:
                continue
            score = 0.0
            for term in matched:
                tf = frequencies[term]
                document_frequency = sum(term in terms for terms in self._term_frequency.values())
                idf = math.log((total + 1) / (document_frequency + 1)) + 1
                score += (1 + math.log(tf)) * idf
            if any(term in tokenize(document.title) for term in matched):
                score += 1.2
            excerpt = self._best_excerpt(document, matched)
            hits.append(SearchHit(document_id, document.title, excerpt, score, matched))
        hits.sort(key=lambda hit: (-hit.score, hit.document_id))
        return hits[:limit]

    def _best_excerpt(self, document: Document, terms: tuple[str, ...]) -> str:
        for chunk in self._chunks[document.id]:
            if any(term in tokenize(chunk) for term in terms):
                return chunk[:220]
        return document.content[:220]


@dataclass(frozen=True)
class AgentResponse:
    route: str
    answer: str
    confidence: float
    citations: tuple[str, ...]
    needs_human: bool
    trace: tuple[dict[str, object], ...]
    hits: tuple[SearchHit, ...]

    def as_dict(self) -> dict[str, object]:
        return {
            "route": self.route,
            "answer": self.answer,
            "confidence": round(self.confidence, 3),
            "citations": list(self.citations),
            "needs_human": self.needs_human,
            "trace": list(self.trace),
            "hits": [hit.as_dict() for hit in self.hits],
        }


class AgentRuntime:
    """A deterministic agent loop with explicit routing and human gates."""

    def __init__(self, knowledge_base: KnowledgeBase, confidence_threshold: float = 0.35) -> None:
        self.knowledge_base = knowledge_base
        self.confidence_threshold = confidence_threshold

    def run(self, query: str, approved: bool = False) -> AgentResponse:
        clean_query = (query or "").strip()
        trace: list[dict[str, object]] = []

        def event(stage: str, label: str, detail: str, status: str = "ok") -> None:
            trace.append({"stage": stage, "label": label, "detail": detail, "status": status})

        event("input", "接收任务", clean_query or "空输入")
        if not clean_query:
            event("route", "请求澄清", "缺少可检索的问题", "hold")
            return AgentResponse("clarification", "请补充场景、对象或验收条件后再查询。", 0.0, (), True, tuple(trace), ())

        is_action = any(word in clean_query for word in ACTION_WORDS)
        route = "controlled_action" if is_action else "knowledge_retrieval"
        event("route", "选择路由", "变更类请求进入人工闸门" if is_action else "先检索知识库")
        if is_action and not approved:
            event("human_gate", "等待人工确认", "请求包含可能改变设备或数据状态的动作", "hold")
            return AgentResponse(route, "这是一个可能改变系统状态的请求。请先确认目标设备、影响范围和回滚方式。", 0.0, (), True, tuple(trace), ())
        if is_action:
            event("human_gate", "人工确认已记录", "继续生成可审查的 mock 动作计划，不执行外部副作用")

        hits = tuple(self.knowledge_base.search(clean_query))
        confidence = self._confidence(clean_query, hits)
        event("retrieval", "检索知识库", f"命中 {len(hits)} 条候选证据")
        if not hits or confidence < self.confidence_threshold:
            event("grounding", "证据不足", "置信度低于闸门，保留候选并请求人工判断", "hold")
            return AgentResponse("clarification", "当前知识库没有足够证据支持可靠回答，请补充资料或由负责人确认。", confidence, tuple(hit.document_id for hit in hits), True, tuple(trace), hits)

        citations = tuple(hit.document_id for hit in hits[:2])
        if is_action:
            answer = f"已根据《{hits[0].title}》生成 mock 动作计划：确认目标设备、影响范围、回滚方式后再由授权执行器处理（引用：{hits[0].document_id}）。当前 demo 不会触碰外部系统。"
            event("tool_preview", "生成受控动作预览", "计划可审查，副作用由授权执行器负责")
        else:
            answer = self._grounded_answer(clean_query, hits)
        event("grounding", "引用与置信度检查", f"回答绑定 {', '.join(citations)}")
        event("handoff", "生成交接摘要", "保留路由、引用、置信度和下一步")
        return AgentResponse(route, answer, confidence, citations, False, tuple(trace), hits)

    @staticmethod
    def _confidence(query: str, hits: tuple[SearchHit, ...]) -> float:
        if not hits:
            return 0.0
        query_size = max(len(set(tokenize(query))), 1)
        coverage = len(hits[0].matched_terms) / query_size
        score_signal = min(hits[0].score / (query_size * 2.2), 1.0)
        return min(1.0, 0.55 * coverage + 0.45 * score_signal)

    @staticmethod
    def _grounded_answer(query: str, hits: tuple[SearchHit, ...]) -> str:
        lead = hits[0]
        return f"围绕“{query}”，优先参考《{lead.title}》：{lead.excerpt}（引用：{lead.document_id}）。如需改变设备或数据状态，应先走人工确认并记录回滚方案。"
