from __future__ import annotations

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from typing import Any

from .core import AgentRuntime, Document, KnowledgeBase


ROOT = Path(__file__).resolve().parent.parent
KNOWLEDGE_FILE = ROOT / "knowledge" / "base.json"


def load_runtime() -> AgentRuntime:
    payload = json.loads(KNOWLEDGE_FILE.read_text(encoding="utf-8"))
    documents = [
        Document(item["id"], item["title"], item["content"], tuple(item.get("tags", [])))
        for item in payload["documents"]
    ]
    return AgentRuntime(KnowledgeBase(documents))


class ApiHandler(BaseHTTPRequestHandler):
    runtime = load_runtime()

    def _send(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/health":
            self._send(200, {"status": "ok", "documents": self.runtime.knowledge_base.document_count})
            return
        self._send(404, {"error": "not_found"})

    def do_POST(self) -> None:  # noqa: N802
        length = int(self.headers.get("Content-Length", "0"))
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            self._send(400, {"error": "invalid_json"})
            return
        if self.path == "/api/query":
            query = payload.get("query", "")
            if not isinstance(query, str):
                self._send(400, {"error": "query_must_be_string"})
                return
            self._send(200, self.runtime.run(query, bool(payload.get("approved"))).as_dict())
            return
        if self.path == "/api/ingest":
            documents = payload.get("documents", [])
            if not isinstance(documents, list):
                self._send(400, {"error": "documents_must_be_array"})
                return
            try:
                count = self.runtime.knowledge_base.ingest(
                    Document(item["id"], item["title"], item["content"], tuple(item.get("tags", [])))
                    for item in documents
                )
            except (KeyError, TypeError, ValueError) as exc:
                self._send(400, {"error": str(exc)})
                return
            self._send(200, {"ingested": count, "documents": self.runtime.knowledge_base.document_count})
            return
        self._send(404, {"error": "not_found"})

    def log_message(self, format: str, *args: object) -> None:
        return


def run_server(host: str = "127.0.0.1", port: int = 8788) -> None:
    server = ThreadingHTTPServer((host, port), ApiHandler)
    print(f"TraceRAG Agent listening on http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
