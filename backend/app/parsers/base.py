"""Abstract base interface for BU parsers."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class ParsedVote:
    """Represents a single vote record extracted from a BU."""

    office: str
    candidate_number: str
    candidate_name: str
    party: str
    vote_count: int


@dataclass
class ParsedBU:
    """Structured data extracted from a Boletim de Urna."""

    municipality: str
    zone: int
    section: int
    votes: list[ParsedVote] = field(default_factory=list)


class BUParser(ABC):
    """Abstract interface for BU parsers.

    All concrete parsers must implement this interface.
    Only this class (and its subclasses) may parse BU documents.
    If the BU layout changes, only the concrete implementation needs modification.
    """

    @abstractmethod
    def parse(self, file_path: str) -> ParsedBU:
        """Parse a BU PDF file and return structured election data.

        Args:
            file_path: Absolute path to the BU PDF file.

        Returns:
            ParsedBU containing municipality, zone, section, and vote records.

        Raises:
            ValueError: If the file cannot be parsed.
        """
        ...
