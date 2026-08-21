from __future__ import annotations

import re
from collections.abc import Iterable
from dataclasses import dataclass
from heapq import nsmallest
from itertools import islice

MAX_QUERY_LENGTH = 1_000
MAX_DOCUMENTS = 1_000
MAX_DOCUMENT_TEXT_LENGTH = 20_000


@dataclass(frozen=True)
class KnowledgeDocument:
    document_id: str
    text: str


@dataclass(frozen=True)
class RetrievalResult:
    document_id: str
    excerpt: str
    score: int


def _terms(value: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", value.casefold()))


def retrieve(
    query: str, documents: Iterable[KnowledgeDocument], *, limit: int = 3
) -> list[RetrievalResult]:
    if limit < 1:
        raise ValueError("limit must be positive")
    if len(query) > MAX_QUERY_LENGTH:
        raise ValueError(f"query must not exceed {MAX_QUERY_LENGTH} characters")
    query_terms = _terms(query)

    def ranked_documents() -> Iterable[RetrievalResult]:
        for index, document in enumerate(islice(documents, MAX_DOCUMENTS + 1)):
            if index == MAX_DOCUMENTS:
                raise ValueError(f"documents must not exceed {MAX_DOCUMENTS} items")
            if len(document.text) > MAX_DOCUMENT_TEXT_LENGTH:
                raise ValueError(
                    f"document text must not exceed {MAX_DOCUMENT_TEXT_LENGTH} characters"
                )
            yield RetrievalResult(
                document_id=document.document_id,
                excerpt=document.text,
                score=len(query_terms & _terms(document.text)),
            )

    return nsmallest(
        limit,
        ranked_documents(),
        key=lambda item: (-item.score, item.document_id),
    )
