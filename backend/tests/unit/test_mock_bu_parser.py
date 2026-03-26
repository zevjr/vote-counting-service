"""Unit tests for MockBUParser."""

import pytest

from app.parsers.base import ParsedBU
from app.parsers.mock_bu_parser import MockBUParser


@pytest.fixture
def parser() -> MockBUParser:
    return MockBUParser()


def test_parse_returns_parsed_bu(parser: MockBUParser) -> None:
    """MockBUParser.parse() must return a ParsedBU instance."""
    result = parser.parse("/tmp/test_bu.pdf")
    assert isinstance(result, ParsedBU)


def test_parse_has_municipality(parser: MockBUParser) -> None:
    """Parsed BU must have a non-empty municipality."""
    result = parser.parse("/tmp/test_bu.pdf")
    assert result.municipality
    assert isinstance(result.municipality, str)


def test_parse_has_zone_and_section(parser: MockBUParser) -> None:
    """Parsed BU must have valid zone and section numbers."""
    result = parser.parse("/tmp/test_bu.pdf")
    assert isinstance(result.zone, int)
    assert isinstance(result.section, int)
    assert result.zone > 0
    assert result.section > 0


def test_parse_has_votes(parser: MockBUParser) -> None:
    """Parsed BU must contain vote records."""
    result = parser.parse("/tmp/test_bu.pdf")
    assert len(result.votes) > 0


def test_parse_votes_have_required_fields(parser: MockBUParser) -> None:
    """Each vote record must have all required fields."""
    result = parser.parse("/tmp/test_bu.pdf")
    for vote in result.votes:
        assert vote.office
        assert vote.candidate_number
        assert vote.candidate_name
        assert vote.party
        assert vote.vote_count >= 1


def test_parse_is_deterministic(parser: MockBUParser) -> None:
    """Same file path must always produce the same result."""
    result1 = parser.parse("/tmp/same_file.pdf")
    result2 = parser.parse("/tmp/same_file.pdf")
    assert result1.municipality == result2.municipality
    assert result1.zone == result2.zone
    assert result1.section == result2.section
    assert len(result1.votes) == len(result2.votes)


def test_parse_different_files_may_differ(parser: MockBUParser) -> None:
    """Different file paths should produce different zone/section values."""
    result1 = parser.parse("/tmp/file_a.pdf")
    result2 = parser.parse("/tmp/file_b.pdf")
    # At least one field should differ (zone or section)
    assert (result1.zone, result1.section) != (result2.zone, result2.section)


def test_parse_covers_multiple_offices(parser: MockBUParser) -> None:
    """Parsed BU must contain votes for multiple offices."""
    result = parser.parse("/tmp/test_bu.pdf")
    offices = {v.office for v in result.votes}
    assert len(offices) >= 2


def test_parse_total_votes_positive(parser: MockBUParser) -> None:
    """Total vote count across all candidates must be positive."""
    result = parser.parse("/tmp/test_bu.pdf")
    total = sum(v.vote_count for v in result.votes)
    assert total > 0
