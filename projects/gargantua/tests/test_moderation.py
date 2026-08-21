import pytest

from gargantua_showcase.moderation import (
    Actor,
    InMemoryAuditStore,
    ModerationService,
    PermissionDenied,
)


@pytest.mark.asyncio
async def test_member_cannot_create_a_moderation_action() -> None:
    service = ModerationService(InMemoryAuditStore())

    with pytest.raises(PermissionDenied):
        await service.record_warning(
            guild_id="demo-guild-01",
            actor=Actor("demo-member", roles=frozenset({"member"})),
            subject_id="demo-user-02",
            reason="Synthetic policy example",
        )


@pytest.mark.asyncio
async def test_moderator_action_is_audited_without_message_content() -> None:
    store = InMemoryAuditStore()
    service = ModerationService(store)

    action = await service.record_warning(
        guild_id="demo-guild-01",
        actor=Actor("demo-moderator", roles=frozenset({"moderator"})),
        subject_id="demo-user-02",
        reason="Synthetic policy example",
    )

    assert action.action_id.startswith("demo-action-")
    assert store.entries == [action]
    assert not hasattr(action, "message_content")

