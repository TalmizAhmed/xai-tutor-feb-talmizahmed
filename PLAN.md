# Email Client – High-Level Plan

Goal: **fully functional** app that implements every requirement in the README. The evaluation % (Visual 40%, Functionality 30%, Code Quality 20%, Layout 10%) are minimum criteria; we aim to meet the full required scope. API-first; backend then frontend.

**In scope (README only):** Header, sidebar, email list with tabs, email detail view, reply composer, and all five email REST endpoints.  
**Out of scope (per README):** Auth, mobile/responsive, real-time, actual sending, settings/analytics pages, drag-and-drop.

---

## Current state

- **Backend:** FastAPI + SQLite; migration runner and `items` CRUD exist. No emails schema or `/emails` API.
- **Frontend:** Next.js 16 + Tailwind default starter. No email UI.
- **Step 1 status:** Migration *system* is done. Emails *data model* and a new migration (e.g. `002_create_emails_table`) still to do.

---

## Phase 1 – Backend

1. **Emails data model + migration**  
   Design schema (list/detail/filters: sender, subject, body, is_read, archived, attachments). Add migration `002_create_emails_table.py` and optional seed data.

2. **REST API**  
   Implement with Pydantic schemas:
   - `GET /emails` (optional `?filter=all|unread|archive`)
   - `GET /emails/{id}`
   - `POST /emails`
   - `PUT /emails/{id}` (e.g. mark read, archive)
   - `DELETE /emails/{id}`

---

## Phase 2 – Frontend

3. **Layout shell**  
   From `implementation.jpeg`: header, sidebar, two-panel main (email list | detail/composer). Semantic HTML, flex/grid.

4. **Email list + detail**  
   Tabs (All / Unread / Archive) → `GET /emails`. List rows + click → detail via `GET /emails/{id}`. Mark read / archive → `PUT /emails/{id}`.

5. **Reply composer**  
   Recipient + body + “Send Now” → `POST /emails`.

6. **Visual polish**  
   Match design: colors, typography, spacing, shadows, borders.

---

## Order of work

1. Backend: emails migration  
2. Backend: `/emails` endpoints + seed  
3. Frontend: layout shell  
4. Frontend: list + detail + composer  
5. Polish: visual accuracy
