"""SQLAlchemy model for Vote."""

from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Vote(Base):
    """Represents votes extracted from a BoletimUrna."""

    __tablename__ = "vote"

    __table_args__ = (
        Index("ix_vote_candidate_number", "candidate_number"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    boletim_urna_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("boletim_urna.id", ondelete="CASCADE"),
        nullable=False,
    )
    office: Mapped[str] = mapped_column(String(255), nullable=False)
    candidate_number: Mapped[str] = mapped_column(String(20), nullable=False)
    candidate_name: Mapped[str] = mapped_column(String(255), nullable=False)
    party: Mapped[str | None] = mapped_column(String(50), nullable=True)
    vote_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    boletim_urna: Mapped["BoletimUrna"] = relationship(  # noqa: F821
        "BoletimUrna",
        back_populates="votes",
    )
