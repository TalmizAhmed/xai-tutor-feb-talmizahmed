from enum import Enum

from pydantic import BaseModel


class EmailFilter(str, Enum):
    """Filter options for the email list endpoint."""
    all = "all"
    unread = "unread"
    archive = "archive"


class Attachment(BaseModel):
    """File attachment metadata."""
    name: str
    size: str = ""
    url: str


# --- Request models ---

class EmailCreate(BaseModel):
    """Request body for creating a new email (POST /emails)."""
    sender_name: str
    sender_email: str
    recipient: str
    subject: str
    body: str
    attachments: list[Attachment] | None = None


class EmailUpdate(BaseModel):
    """Request body for updating an email (PUT /emails/{id}).

    Only status fields are updatable; body/subject editing is not supported.
    All fields are optional; only provided fields are applied.
    """
    is_read: bool | None = None
    archived: bool | None = None


# --- Response models ---

class EmailResponse(BaseModel):
    """Full email representation returned by GET /emails/{id}, POST, and PUT."""
    id: int
    sender_name: str
    sender_email: str
    recipient: str
    subject: str
    body: str
    preview: str
    created_at: str
    is_read: bool
    archived: bool
    attachments: list[Attachment]


class EmailListEntry(BaseModel):
    """Compact email representation for the list endpoint (GET /emails).

    Omits body and attachments to keep payloads small.
    """
    id: int
    sender_name: str
    sender_email: str
    subject: str
    preview: str
    created_at: str
    is_read: bool
    archived: bool
