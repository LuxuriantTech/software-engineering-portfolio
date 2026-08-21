from __future__ import annotations

import math
from collections.abc import Sequence
from dataclasses import dataclass


def benjamini_hochberg(p_values: Sequence[float]) -> list[float]:
    if any(value < 0 or value > 1 for value in p_values):
        raise ValueError("p-values must be within [0, 1]")
    total = len(p_values)
    ranked = sorted(enumerate(p_values), key=lambda item: item[1])
    adjusted = [0.0] * total
    running_minimum = 1.0
    for reverse_index in range(total - 1, -1, -1):
        original_index, value = ranked[reverse_index]
        rank = reverse_index + 1
        running_minimum = min(running_minimum, value * total / rank)
        adjusted[original_index] = min(1.0, running_minimum)
    return adjusted


@dataclass(frozen=True)
class NeweyWestResult:
    mean: float
    standard_error: float
    observations: int
    max_lag: int


def newey_west_mean(values: Sequence[float], *, max_lag: int) -> NeweyWestResult:
    observations = len(values)
    if observations < 2:
        raise ValueError("at least two observations are required")
    if max_lag < 0 or max_lag >= observations:
        raise ValueError("max_lag must be between zero and n - 1")
    mean = sum(values) / observations
    centred = [value - mean for value in values]
    long_run_variance = sum(value * value for value in centred) / observations
    for lag in range(1, max_lag + 1):
        weight = 1 - lag / (max_lag + 1)
        covariance = sum(
            centred[index] * centred[index - lag]
            for index in range(lag, observations)
        ) / observations
        long_run_variance += 2 * weight * covariance
    standard_error = math.sqrt(max(long_run_variance, 0.0) / observations)
    return NeweyWestResult(mean, standard_error, observations, max_lag)

