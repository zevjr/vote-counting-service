"""Repository for Vote database operations."""

import logging
from collections import defaultdict

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.vote import Vote
from app.parsers.base import ParsedVote

logger = logging.getLogger(__name__)


class VoteRepository:
    """Encapsulates all database operations for Vote."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def create_bulk(self, boletim_urna_id: int, votes: list[ParsedVote]) -> list[Vote]:
        """Insert multiple vote records for a given BoletimUrna."""
        vote_models = [
            Vote(
                boletim_urna_id=boletim_urna_id,
                office=v.office,
                candidate_number=v.candidate_number,
                candidate_name=v.candidate_name,
                party=v.party,
                vote_count=v.vote_count,
            )
            for v in votes
        ]
        self._db.add_all(vote_models)
        self._db.flush()
        logger.info(
            "Inserted %d vote records for boletim_urna_id=%d",
            len(vote_models),
            boletim_urna_id,
        )
        return vote_models

    def get_aggregated_results(self) -> list[dict[str, object]]:
        """Return vote totals aggregated by office and candidate."""
        rows = (
            self._db.query(
                Vote.office,
                Vote.candidate_number,
                Vote.candidate_name,
                Vote.party,
                func.sum(Vote.vote_count).label("total_votes"),
            )
            .group_by(
                Vote.office,
                Vote.candidate_number,
                Vote.candidate_name,
                Vote.party,
            )
            .order_by(Vote.office, func.sum(Vote.vote_count).desc())
            .all()
        )

        # Group by office
        office_map: dict[str, list[dict[str, object]]] = defaultdict(list)
        for row in rows:
            office_map[row.office].append(
                {
                    "number": row.candidate_number,
                    "name": row.candidate_name,
                    "party": row.party,
                    "votes": int(row.total_votes),
                }
            )

        return [
            {"office": office, "candidates": candidates}
            for office, candidates in office_map.items()
        ]

    def get_total_votes_counted(self) -> int:
        """Return the total number of votes counted across all BUs."""
        result = self._db.query(func.sum(Vote.vote_count)).scalar()
        return int(result) if result else 0
