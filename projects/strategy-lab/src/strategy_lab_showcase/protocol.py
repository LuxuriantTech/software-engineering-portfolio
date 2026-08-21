from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass


class UnreachablePnl(RuntimeError):
    pass


class HoldoutAlreadyConsumed(RuntimeError):
    pass


@dataclass(frozen=True)
class PositionSpecification:
    quantities_fixed_at_entry: bool
    executable_fill: bool
    price_source: str

    def assert_realisable(self) -> None:
        if not self.quantities_fixed_at_entry:
            raise UnreachablePnl("quantities must be fixed at entry")
        if not self.executable_fill:
            raise UnreachablePnl("fill must be executable")
        if self.price_source not in {"trade", "executable_quote"}:
            raise UnreachablePnl("price source is not executable")


class ResearchProtocol[T]:
    def __init__(
        self, observations: Iterable[T], *, train_size: int, validation_size: int
    ) -> None:
        self._observations: Sequence[T] = tuple(observations)
        if train_size <= 0 or validation_size <= 0:
            raise ValueError("split sizes must be positive")
        if train_size + validation_size >= len(self._observations):
            raise ValueError("holdout must contain at least one observation")
        self.train = self._observations[:train_size]
        self.validation = self._observations[train_size : train_size + validation_size]
        self._holdout = self._observations[train_size + validation_size :]
        self._consumed = False

    def consume_holdout(self) -> Sequence[T]:
        if self._consumed:
            raise HoldoutAlreadyConsumed("holdout was already consumed")
        self._consumed = True
        return self._holdout
