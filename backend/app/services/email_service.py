"""
Email service – all DB access and business logic for emails.

Does NOT import FastAPI or HTTPException.
Returns None / False where the route layer translates to 404.
"""

import json
import sqlite3
from datetime import datetime, timezone

from app.database import get_db
from app.schemas.email import (
    Attachment,
    EmailCreate,
    EmailFilter,
    EmailListEntry,
    EmailResponse,
    EmailUpdate,
)

# ---------------------------------------------------------------------------
# Private helpers – convert sqlite3.Row -> Pydantic model
# ---------------------------------------------------------------------------


def _row_to_email_response(row: sqlite3.Row) -> EmailResponse:
    """Map a full DB row to an EmailResponse model."""
    raw_attachments = row["attachments"]
    attachments = (
        [Attachment(**a) for a in json.loads(raw_attachments)]
        if raw_attachments
        else []
    )
    return EmailResponse(
        id=row["id"],
        sender_name=row["sender_name"],
        sender_email=row["sender_email"],
        recipient=row["recipient"],
        subject=row["subject"],
        body=row["body"],
        preview=row["preview"],
        created_at=row["created_at"],
        is_read=bool(row["is_read"]),
        archived=bool(row["archived"]),
        attachments=attachments,
    )


def _row_to_email_list_entry(row: sqlite3.Row) -> EmailListEntry:
    """Map a list-query row to an EmailListEntry model (no body/attachments)."""
    return EmailListEntry(
        id=row["id"],
        sender_name=row["sender_name"],
        sender_email=row["sender_email"],
        subject=row["subject"],
        preview=row["preview"],
        created_at=row["created_at"],
        is_read=bool(row["is_read"]),
        archived=bool(row["archived"]),
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

# Mapping from EmailFilter enum value to SQL WHERE clause
_FILTER_CLAUSES: dict[EmailFilter, str] = {
    EmailFilter.all: "archived = 0",
    EmailFilter.unread: "archived = 0 AND is_read = 0",
    EmailFilter.archive: "archived = 1",
}


def list_emails(filter: EmailFilter) -> list[EmailListEntry]:
    """Return emails matching *filter*, newest first."""
    where = _FILTER_CLAUSES[filter]
    sql = f"""
        SELECT id, sender_name, sender_email, subject, preview,
               created_at, is_read, archived
        FROM emails
        WHERE {where}
        ORDER BY created_at DESC
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(sql)
        return [_row_to_email_list_entry(row) for row in cursor.fetchall()]


def get_email_by_id(email_id: int) -> EmailResponse | None:
    """Return a single email by ID, or None if not found."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
        row = cursor.fetchone()
        if row is None:
            return None
        return _row_to_email_response(row)


def create_email(data: EmailCreate) -> EmailResponse:
    """Insert a new email and return the created record."""
    preview = data.body[:80]
    created_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    attachments_json = (
        json.dumps([a.model_dump() for a in data.attachments])
        if data.attachments
        else None
    )

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO emails
                (sender_name, sender_email, recipient, subject, body,
                 preview, created_at, is_read, archived, attachments)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
            """,
            (
                data.sender_name,
                data.sender_email,
                data.recipient,
                data.subject,
                data.body,
                preview,
                created_at,
                attachments_json,
            ),
        )
        new_id = cursor.lastrowid

        # Fetch the newly created row to return a complete model
        cursor.execute("SELECT * FROM emails WHERE id = ?", (new_id,))
        return _row_to_email_response(cursor.fetchone())


def update_email(email_id: int, data: EmailUpdate) -> EmailResponse | None:
    """Update status fields of an email. Returns None if not found."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Check existence
        cursor.execute("SELECT id FROM emails WHERE id = ?", (email_id,))
        if cursor.fetchone() is None:
            return None

        # Build dynamic SET clause from provided fields
        set_parts: list[str] = []
        params: list[int] = []

        if data.is_read is not None:
            set_parts.append("is_read = ?")
            params.append(int(data.is_read))

        if data.archived is not None:
            set_parts.append("archived = ?")
            params.append(int(data.archived))

        if set_parts:
            params.append(email_id)
            sql = f"UPDATE emails SET {', '.join(set_parts)} WHERE id = ?"
            cursor.execute(sql, params)

        # Return the (possibly updated) full email
        cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
        return _row_to_email_response(cursor.fetchone())


def delete_email(email_id: int) -> bool:
    """Delete an email by ID. Returns True if deleted, False if not found."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Check existence
        cursor.execute("SELECT id FROM emails WHERE id = ?", (email_id,))
        if cursor.fetchone() is None:
            return False

        cursor.execute("DELETE FROM emails WHERE id = ?", (email_id,))
        return True
