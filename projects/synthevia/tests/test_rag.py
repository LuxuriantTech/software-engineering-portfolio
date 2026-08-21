import pytest

from synthevia_showcase import rag


def test_retrieval_is_deterministic_and_uses_only_supplied_documents() -> None:
    documents = [
        rag.KnowledgeDocument("demo-1", "Synthetic onboarding guide for a fictional workspace."),
        rag.KnowledgeDocument("demo-2", "Synthetic billing guide for a fictional subscription."),
    ]

    first = rag.retrieve("How does onboarding work?", documents, limit=1)
    second = rag.retrieve("How does onboarding work?", documents, limit=1)

    assert first == second
    assert [item.document_id for item in first] == ["demo-1"]
    assert all(item.document_id.startswith("demo-") for item in first)


def test_retrieval_rejects_an_oversized_query() -> None:
    with pytest.raises(ValueError, match="query must not exceed"):
        rag.retrieve("q" * (rag.MAX_QUERY_LENGTH + 1), [])


def test_retrieval_rejects_an_oversized_document_text() -> None:
    documents = [
        rag.KnowledgeDocument("demo-1", "x" * (rag.MAX_DOCUMENT_TEXT_LENGTH + 1)),
    ]

    with pytest.raises(ValueError, match="document text must not exceed"):
        rag.retrieve("query", documents)


def test_retrieval_rejects_too_many_documents_after_bounded_consumption() -> None:
    consumed = 0

    def documents():
        nonlocal consumed
        for index in range(rag.MAX_DOCUMENTS + 2):
            consumed += 1
            if consumed > rag.MAX_DOCUMENTS + 1:
                raise AssertionError("retrieve consumed beyond its validation budget")
            yield rag.KnowledgeDocument(f"demo-{index:04d}", "synthetic text")

    with pytest.raises(ValueError, match="documents must not exceed"):
        rag.retrieve("query", documents())

    assert consumed == rag.MAX_DOCUMENTS + 1
