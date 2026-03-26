"""Pydantic schemas for Vote and aggregated results."""

from pydantic import BaseModel, ConfigDict


class VoteResponse(BaseModel):
    """Schema for returning a Vote record."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    boletim_urna_id: int
    office: str
    candidate_number: str
    candidate_name: str
    party: str | None = None
    vote_count: int


class CandidateResult(BaseModel):
    """Aggregated result for a single candidate."""

    number: str
    name: str
    party: str | None = None
    votes: int


class OfficeResult(BaseModel):
    """Aggregated results for a single office."""

    office: str
    candidates: list[CandidateResult]
