from __future__ import annotations

from dataclasses import dataclass


class PermissionDenied(RuntimeError):
    pass


@dataclass(frozen=True)
class Actor:
    actor_id: str
    roles: frozenset[str]


@dataclass(frozen=True)
class ModerationAction:
    action_id: str
    guild_id: str
    actor_id: str
    subject_id: str
    reason: str


class InMemoryAuditStore:
    def __init__(self) -> None:
        self.entries: list[ModerationAction] = []

    async def append(self, action: ModerationAction) -> None:
        self.entries.append(action)


class ModerationService:
    def __init__(self, store: InMemoryAuditStore) -> None:
        self._store = store
        self._next_id = 1

    async def record_warning(
        self,
        *,
        guild_id: str,
        actor: Actor,
        subject_id: str,
        reason: str,
    ) -> ModerationAction:
        if not actor.roles.intersection({"moderator", "administrator"}):
            raise PermissionDenied("moderator role required")
        action = ModerationAction(
            action_id=f"demo-action-{self._next_id:04d}",
            guild_id=guild_id,
            actor_id=actor.actor_id,
            subject_id=subject_id,
            reason=reason,
        )
        self._next_id += 1
        await self._store.append(action)
        return action

