from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from typing import Literal

Decision = Literal["REJECT", "ABSTAIN"]


@dataclass(frozen=True)
class AssistantOutput:
    decision: Decision
    reason: str
    used_fallback: bool


def validate_research_assistant_output(payload: Mapping[str, object]) -> AssistantOutput:
    decision = payload.get("decision")
    reason = payload.get("reason")
    if decision == "REJECT" and isinstance(reason, str) and reason.strip():
        return AssistantOutput("REJECT", reason.strip(), False)
    if decision == "ABSTAIN" and isinstance(reason, str) and reason.strip():
        return AssistantOutput("ABSTAIN", reason.strip(), False)
    return AssistantOutput("ABSTAIN", "invalid assistant output", True)
