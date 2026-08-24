# Audit Premium PDF Email V1

## Delivery contract

The public pre-audit email is successful only when the canonical Novekia PDF has been fetched server-to-server from the audit engine, validated as a bounded PDF, and accepted by Resend as an attachment.

- The browser never receives the audit ingress secret.
- The PDF request uses the existing `X-Novekia-Audit-Key` server credential.
- `Content-Type` must be `application/pdf` and the body must start with `%PDF-`.
- PDF payloads above 8 MiB are rejected.
- The engine filename is sanitized; a deterministic Novekia filename is used as fallback.
- PDF failure is fail-closed: the visitor is invited to retry rather than receiving a message that falsely claims successful report delivery.
- The existing public audit score and evidence payload are not modified by email delivery.
- Internal lead notification does not receive the client PDF attachment.

This boundary implements the Novekia professional evidence principle: presentation can improve, but measured facts, uncertainty and scoring remain unchanged.
