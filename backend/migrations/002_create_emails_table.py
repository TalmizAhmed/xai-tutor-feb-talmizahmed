"""
Migration: Create emails table
Version: 002
Description: Creates the emails table with fields for list, detail, filters, and attachments.
             Seeds 9 realistic email rows matching the implementation design.
"""

import sqlite3
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import DATABASE_PATH

MIGRATION_NAME = "002_create_emails_table"


def upgrade():
    """Apply the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Check if this migration has already been applied
    cursor.execute("SELECT 1 FROM _migrations WHERE name = ?", (MIGRATION_NAME,))
    if cursor.fetchone():
        print(f"Migration {MIGRATION_NAME} already applied. Skipping.")
        conn.close()
        return

    # Create emails table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_name TEXT NOT NULL,
            sender_email TEXT NOT NULL,
            recipient TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            preview TEXT NOT NULL,
            created_at TEXT NOT NULL,
            is_read INTEGER NOT NULL DEFAULT 0,
            archived INTEGER NOT NULL DEFAULT 0,
            attachments TEXT
        )
    """)

    # Seed data matching the implementation design
    seed_emails = [
        (
            "Michael Lee",
            "michael.lee@business.com",
            "Richard Brown",
            "Follow-Up: Product Demo Feedback",
            "Hi John,\n\nThank you for attending the product demo yesterday. I wanted to follow up and gather your thoughts on the presentation. Your feedback is invaluable as we continue to refine our offering.\n\nPlease let me know if you have any questions or need additional information.\n\nBest regards,\nMichael Lee",
            "Hi John, Thank you for attending the product...",
            "2024-12-10T09:00:00Z",
            0,  # unread
            0,  # not archived
            None,
        ),
        (
            "Jane Doe",
            "jane.doe@business.com",
            "Richard Brown",
            "Proposal for Partnership 🎉",
            "Hi John,\n\nhope this message finds you well! I'm reaching out to explore a potential partnership between our companies. At Jane Corp, which could complement your offerings at John Organisation Corp.\n\nI've attached a proposal detailing how we envision our collaboration, including key benefits, timelines, and implementation strategies. I believe this partnership could unlock exciting opportunities for both of us!\n\nLet me know your thoughts or a convenient time to discuss this further. I'm happy to schedule a call or meeting at your earliest convenience. Looking forward to hearing from you!\n\nWarm regards,\nJane Doe",
            "Hi John, Hope this email finds you well. I'm rea...",
            "2024-12-10T09:00:00Z",
            1,  # read
            0,  # not archived
            '[{"name": "Proposal Partnership.pdf", "size": "1.5 MB", "url": "#"}]',
        ),
        (
            "Support Team",
            "support@business.com",
            "Richard Brown",
            "Contract Renewal Due 👹",
            "Dear John,\n\nThis is a reminder that the contract for your current subscription is due for renewal on December 31, 2024. Please review the terms and let us know if you'd like to make any changes.\n\nIf you have any questions about the renewal process, don't hesitate to reach out.\n\nBest regards,\nSupport Team",
            "Dear John, This is a reminder that the contract...",
            "2024-12-11T10:30:00Z",
            1,  # read
            0,  # not archived
            None,
        ),
        (
            "Sarah Connor",
            "sarah.connor@business.com",
            "Richard Brown",
            "Meeting Recap: Strategies for 2...",
            "Hi John,\n\nThank you for your insights during yesterday's strategy meeting. I've compiled the key takeaways and action items from our discussion.\n\nPlease review the attached summary and let me know if I've missed anything. Looking forward to our next steps.\n\nBest,\nSarah Connor",
            "Hi John, Thank you for your insights during ye...",
            "2024-12-11T14:00:00Z",
            1,  # read
            0,  # not archived
            '[{"name": "Meeting-Recap-Q4.pdf", "size": "2.3 MB", "url": "#"}]',
        ),
        (
            "Downe Johnson",
            "downe.johnson@business.com",
            "Richard Brown",
            "Invitation: Annual Client Appreciation Event",
            "Dear John,\n\nWe are delighted to invite you to our Annual Client Appreciation Event, taking place on January 15, 2025. It will be a wonderful opportunity to network and celebrate our achievements together.\n\nPlease RSVP by December 20 to confirm your attendance.\n\nWarm regards,\nDowne Johnson",
            "Dear John, We are delighted to invite you to a...",
            "2024-12-11T08:15:00Z",
            1,  # read
            0,  # not archived
            None,
        ),
        (
            "Lily Alexa",
            "lily.alexa@business.com",
            "Richard Brown",
            "Technical Support Update",
            "Dear John,\n\nYour issue regarding server connectivity has been resolved. Our engineering team identified and fixed a configuration issue that was causing intermittent disconnections.\n\nPlease verify on your end and let us know if you experience any further issues.\n\nBest regards,\nLily Alexa",
            "Dear John, Your issue regarding server conne...",
            "2024-12-10T16:45:00Z",
            1,  # read
            0,  # not archived
            None,
        ),
        (
            "Natasha Brown",
            "natasha.brown@business.com",
            "Richard Brown",
            "Happy Holidays from Kozuki tea...",
            "Hi John,\n\nAs the holiday season approaches, we wanted to take a moment to express our gratitude for your continued partnership. Wishing you and your team a joyful holiday season and a prosperous New Year!\n\nWarm wishes,\nNatasha Brown",
            "Hi John, As the holiday season approaches, w...",
            "2024-12-10T11:00:00Z",
            1,  # read
            0,  # not archived
            None,
        ),
        (
            "Downe Johnson",
            "downe.johnson@business.com",
            "Richard Brown",
            "Invitation: Annual Client Appreciation Event",
            "Dear John,\n\nThis is a follow-up to our earlier invitation. We are delighted to invite you to our Annual Client Appreciation Event. Please confirm your attendance at your earliest convenience.\n\nWarm regards,\nDowne Johnson",
            "Dear John, We are delighted to invite you to a...",
            "2024-12-11T07:00:00Z",
            1,  # read
            0,  # not archived
            None,
        ),
        (
            "Alex Martinez",
            "alex.martinez@business.com",
            "Richard Brown",
            "Q4 Financial Report Summary 📊",
            "Hi John,\n\nPlease find attached the Q4 financial report summary. Revenue is up 12% compared to last quarter, and we've exceeded our annual targets.\n\nLet me know if you'd like to schedule a review meeting.\n\nBest,\nAlex Martinez",
            "Hi John, Please find attached the Q4 financial...",
            "2024-12-09T13:20:00Z",
            1,  # read
            1,  # archived
            '[{"name": "Q4-Financial-Report.pdf", "size": "3.1 MB", "url": "#"}]',
        ),
    ]

    cursor.executemany(
        """
        INSERT INTO emails
            (sender_name, sender_email, recipient, subject, body, preview, created_at, is_read, archived, attachments)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        seed_emails,
    )

    # Record this migration
    cursor.execute("INSERT INTO _migrations (name) VALUES (?)", (MIGRATION_NAME,))

    conn.commit()
    conn.close()
    print(f"Migration {MIGRATION_NAME} applied successfully.")


def downgrade():
    """Revert the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Remove migration record
    cursor.execute("DELETE FROM _migrations WHERE name = ?", (MIGRATION_NAME,))

    # Drop emails table
    cursor.execute("DROP TABLE IF EXISTS emails")

    conn.commit()
    conn.close()
    print(f"Migration {MIGRATION_NAME} reverted successfully.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run database migration")
    parser.add_argument(
        "action",
        choices=["upgrade", "downgrade"],
        help="Migration action to perform",
    )

    args = parser.parse_args()

    if args.action == "upgrade":
        upgrade()
    elif args.action == "downgrade":
        downgrade()
