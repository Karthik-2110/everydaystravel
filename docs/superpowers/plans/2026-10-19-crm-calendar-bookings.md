# CRM Calendar, Bookings and Email Intake Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. The user requested implementation and confirmed that bookings reserve a specific vehicle for a date/time with overlap checks.

**Goal:** Monthly calendar, vehicle reservations and reviewed email-to-enquiry intake in the existing local CRM.

**Architecture:** Extend the atomic local repository with actual vehicle units and bookings. Server-side overlap checks apply to holds and confirmations. Calendar dates and booking inputs use Europe/London, including DST validation. Gmail messages remain on this Mac: local pattern extraction suggests fields; staff review and save. No third-party AI service receives email content. Google Calendar event export is a separate explicit action with deterministic IDs and retry-safe writes.

**Tech Stack:** Existing Next.js, React, TypeScript, shadcn/ui, Node fs/crypto and Vitest. No new dependency.

**Spec:** User request in this conversation, confirmed vehicle allocation; existing CRM design and local-milestone setup docs.

## Global Constraints
- Monochrome shadcn throughout. Enquiry/booking sheets use 35% desktop width.
- No browser interaction or opening tabs; use automated code checks only.
- Local development workspace persists records on this Mac, production API remains closed.
- Only actual registered vehicle units may be reserved; marketing vehicle types are not physical inventory.
- Holds and confirmed bookings both block overlapping time ranges; touching endpoints are allowed; cancellation releases the vehicle.
- Email intake never automatically confirms, cancels or reserves a booking; source identity and review are retained.
- Never send mail or Calendar invitations while testing.

## Review Focus
- Concurrent overlapping reservations: serialize conflict checks and save atomically.
- Overnight/month-boundary bookings and Google all-day exclusive ends.
- UK DST missing/repeated local times: reject rather than guess.
- Missing or ambiguous email fields, non-booking messages and duplicates.
- Google outages: local bookings stay saved and export failures remain visible/retryable.

## Tasks
- [x] 1. Write failing tests; implement booking, vehicle, calendar/time and local email extraction domain helpers.
- [x] 2. Add atomic booking CRUD, email import/linking, Google month retrieval and explicit booking export routes; test persistence and conflicts.
- [x] 3. Build monthly view, day agenda, actual-vehicle manager, booking editor and reviewed email funnel using shadcn components.
- [x] 4. Run full tests, TypeScript, scoped lint and build. Independent code review. Update setup docs with limits.

## Decisions and progress
- Planning complete. Email parsing is deliberately a local suggestion engine in this milestone; no external model integration or unreviewed automation is implied.
- Google APIs were disabled on the connected project during the previous sync attempt; this feature works locally while setup is finished.
- Simplified sidebar per user steering: brand logo, Quick capture and navigation buttons only; removed workspace labels, profile, local-storage notices and footer links.
- Verification: 337 tests across 34 files passed; TypeScript, scoped lint and production build passed. Build used a nonworking build-only Resend placeholder because the existing website key is empty. No browser interaction or live mail/calendar writes used for verification.
- Independent review completed; fixed registration punctuation normalisation and exact-message association priority with regression tests. No remaining important review findings.
