"""Mock BU parser that generates simulated vote data.

This parser is used during Phase 02 before real PDF parsing is implemented.
It generates deterministic but realistic vote data based on the file path.
"""

import hashlib
import logging

from app.parsers.base import BUParser, ParsedBU, ParsedVote

logger = logging.getLogger(__name__)

# Simulated candidates per office
_MOCK_CANDIDATES: dict[str, list[dict[str, str]]] = {
    "Presidente": [
        {"number": "13", "name": "Lula", "party": "PT"},
        {"number": "22", "name": "Bolsonaro", "party": "PL"},
        {"number": "12", "name": "Ciro Gomes", "party": "PDT"},
    ],
    "Governador": [
        {"number": "45", "name": "Jorginho Mello", "party": "PL"},
        {"number": "40", "name": "Décio Lima", "party": "PT"},
    ],
    "Senador": [
        {"number": "180", "name": "Dário Berger", "party": "MDB"},
        {"number": "456", "name": "Esperidião Amin", "party": "PP"},
    ],
}

_TOTAL_VOTERS_PER_SECTION = 300


class MockBUParser(BUParser):
    """Mock implementation of BUParser.

    Generates deterministic simulated vote data based on the file path hash.
    Used in Phase 02 before real PDF parsing is implemented.

    Replace this class with a real implementation in Phase 03.
    """

    def parse(self, file_path: str) -> ParsedBU:
        """Generate simulated vote data for a given file path.

        Args:
            file_path: Path to the BU PDF file (used as seed for determinism).

        Returns:
            ParsedBU with simulated municipality, zone, section, and votes.
        """
        logger.info("MockBUParser: parsing file %s", file_path)

        # Use file path hash as a deterministic seed
        seed = int(hashlib.md5(file_path.encode()).hexdigest(), 16)  # noqa: S324

        zone = 100 + (seed % 10)
        section = 1 + (seed % 50)

        votes: list[ParsedVote] = []

        for office, candidates in _MOCK_CANDIDATES.items():
            remaining = _TOTAL_VOTERS_PER_SECTION
            for i, candidate in enumerate(candidates):
                if i == len(candidates) - 1:
                    vote_count = remaining
                else:
                    # Distribute votes pseudo-randomly but deterministically
                    share_seed = (seed + i + ord(office[0])) % 100
                    vote_count = int(remaining * (0.3 + share_seed / 300))
                    remaining -= vote_count

                votes.append(
                    ParsedVote(
                        office=office,
                        candidate_number=candidate["number"],
                        candidate_name=candidate["name"],
                        party=candidate["party"],
                        vote_count=max(1, vote_count),
                    )
                )

        return ParsedBU(
            municipality="Florianópolis",
            zone=zone,
            section=section,
            votes=votes,
        )
