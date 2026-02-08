"""
Email route handlers – thin layer that validates input, calls the service,
and maps results to HTTP responses. No SQL here.
"""

from fastapi import APIRouter, HTTPException, Query

from app.schemas.email import (
    EmailCreate,
    EmailFilter,
    EmailResponse,
    EmailUpdate,
)
from app.services import email_service

router = APIRouter(prefix="/emails", tags=["emails"])


@router.get("")
def list_emails(filter: EmailFilter = Query(default=EmailFilter.all)):
    """Fetch emails filtered by tab (all / unread / archive)."""
    emails = email_service.list_emails(filter)
    return {"emails": [e.model_dump() for e in emails]}


@router.get("/{email_id}")
def get_email(email_id: int) -> EmailResponse:
    """Fetch a single email by ID."""
    email = email_service.get_email_by_id(email_id)
    if email is None:
        raise HTTPException(status_code=404, detail="Email not found")
    return email


@router.post("", status_code=201)
def create_email(body: EmailCreate) -> EmailResponse:
    """Create a new email."""
    return email_service.create_email(body)


@router.put("/{email_id}")
def update_email(email_id: int, body: EmailUpdate) -> EmailResponse:
    """Update email status fields (mark as read, archive, etc.)."""
    email = email_service.update_email(email_id, body)
    if email is None:
        raise HTTPException(status_code=404, detail="Email not found")
    return email


@router.delete("/{email_id}", status_code=204)
def delete_email(email_id: int):
    """Delete an email by ID."""
    if not email_service.delete_email(email_id):
        raise HTTPException(status_code=404, detail="Email not found")
    return None
