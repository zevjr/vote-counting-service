"""SQLAlchemy model for BoletimUrna."""

import datetime

from sqlalchemy import DateTime, Index, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class BoletimUrna(Base):
    """Represents a single Boletim de Urna document."""

    __tablename__ = "boletim_urna"

    __table_args__ = (
        UniqueConstraint(
            "municipality", "zone", "section", name="uq_bu_municipality_zone_section"
        ),
        Index("ix_bu_municipality", "municipality"),
        Index("ix_bu_zone", "zone"),
        Index("ix_bu_section", "section"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    municipality: Mapped[str] = mapped_column(String(255), nullable=False)
    zone: Mapped[int] = mapped_column(Integer, nullable=False)
    section: Mapped[int] = mapped_column(Integer, nullable=False)
    file_name: Mapped[str] = mapped_column(String(512), nullable=False)
    file_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    s3_key: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")
    error_message: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    uploaded_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    uploaded_by_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    votes: Mapped[list["Vote"]] = relationship(  # noqa: F821
        "Vote",
        back_populates="boletim_urna",
        cascade="all, delete-orphan",
    )
