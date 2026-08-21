from __future__ import annotations

import sqlite3
from dataclasses import asdict, dataclass

from .demo_data import build_demo_payload


@dataclass(frozen=True)
class WorkspaceRecord:
    id: str
    name: str
    account_email: str
    document_count: int
    financial_activity: str
    storage: str = "in-memory-sqlite"


class SyntheticWorkspaceStore:
    """Read-only demo store populated exclusively with generated example data."""

    def __init__(self) -> None:
        self._connection = sqlite3.connect(":memory:", check_same_thread=False)
        self._connection.row_factory = sqlite3.Row
        self._connection.execute(
            """
            CREATE TABLE workspaces (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                account_email TEXT NOT NULL,
                document_count INTEGER NOT NULL,
                financial_activity TEXT NOT NULL
            )
            """
        )
        payload = build_demo_payload()
        account = payload["account"]
        documents = payload["documents"]
        if not isinstance(account, dict) or not isinstance(documents, list):
            raise TypeError("invalid synthetic demo payload")
        self._connection.execute(
            """
            INSERT INTO workspaces (
                id, name, account_email, document_count, financial_activity
            ) VALUES (?, ?, ?, ?, ?)
            """,
            (
                payload["workspace_id"],
                payload["workspace_name"],
                account["email"],
                len(documents),
                payload["financial_activity"],
            ),
        )
        self._connection.commit()

    def get(self, workspace_id: str) -> dict[str, str | int] | None:
        row = self._connection.execute(
            """
            SELECT id, name, account_email, document_count, financial_activity
            FROM workspaces
            WHERE id = ?
            """,
            (workspace_id,),
        ).fetchone()
        if row is None:
            return None
        return asdict(
            WorkspaceRecord(
                id=row["id"],
                name=row["name"],
                account_email=row["account_email"],
                document_count=row["document_count"],
                financial_activity=row["financial_activity"],
            )
        )
