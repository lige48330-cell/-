import unittest

from rag_agent.core import AgentRuntime, Document, KnowledgeBase, chunk_text, tokenize


class TraceRagCoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.runtime = AgentRuntime(
            KnowledgeBase(
                [
                    Document("doc-a", "设备离线排查", "设备离线先检查心跳、电源和网络。"),
                    Document("doc-b", "任务回执", "任务需要目标设备和控制回执。"),
                ]
            )
        )

    def test_tokenize_supports_chinese_and_ascii(self) -> None:
        self.assertIn("设备", tokenize("设备 offline"))
        self.assertIn("offline", tokenize("设备 offline"))
        self.assertIn("offline", tokenize("设备 offline"))

    def test_chunk_text_has_bounded_chunks(self) -> None:
        chunks = chunk_text("a" * 30, max_chars=12, overlap=3)
        self.assertGreater(len(chunks), 1)
        self.assertTrue(all(len(chunk) <= 12 for chunk in chunks))

    def test_query_returns_grounded_answer_and_trace(self) -> None:
        result = self.runtime.run("设备离线怎么排查")
        self.assertFalse(result.needs_human)
        self.assertEqual(result.citations[0], "doc-a")
        self.assertTrue(any(item["stage"] == "handoff" for item in result.trace))

    def test_low_evidence_stops_for_human(self) -> None:
        result = self.runtime.run("财务报表怎么导出")
        self.assertTrue(result.needs_human)
        self.assertEqual(result.route, "clarification")

    def test_unrelated_query_does_not_pass_grounding_gate(self) -> None:
        result = self.runtime.run("完全无关问题")
        self.assertTrue(result.needs_human)

    def test_mutation_request_requires_approval(self) -> None:
        result = self.runtime.run("直接下发消毒任务")
        self.assertTrue(result.needs_human)
        self.assertEqual(result.route, "controlled_action")
        self.assertTrue(any(item["stage"] == "human_gate" for item in result.trace))

    def test_approved_mutation_only_returns_mock_plan(self) -> None:
        result = self.runtime.run("下发任务", approved=True)
        self.assertFalse(result.needs_human)
        self.assertIn("mock", result.answer)
        self.assertTrue(any(item["stage"] == "tool_preview" for item in result.trace))


if __name__ == "__main__":
    unittest.main()
