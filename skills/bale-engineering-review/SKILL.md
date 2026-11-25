---
name: bale-engineering-review
description: Use when reviewing a Bale bot, Business API, Mini App, Safir or wallet-payment implementation for correctness, security, platform compatibility, reliability, test coverage and operational readiness.
---

# Bale Engineering Review

Review the complete user journey and trust boundaries, not only the changed lines.

## Review order
1. **Platform correctness:** every method, field, payload and limit is supported by Bale documentation.
2. **Channel selection:** Bot API, Business API, Mini App and Safir are not confused; recipient identity and endpoint match the requirement.
3. **User journey:** clear entry, progress, success, cancellation and recovery.
4. **Authorization:** sensitive actions are checked server-side against actor and resource.
5. **Input validation:** callback payloads, URL parameters, Mini App data, phone numbers and external inputs are bounded.
6. **Idempotency:** duplicate updates, callbacks, Safir retries and concurrent submissions cannot repeat a business effect.
7. **Business API constraints:** only documented methods, private chat_id recipients, file_id-only media and business-credit implications.
8. **Payments:** pre_checkout_query is answered within 10 seconds; fulfilment waits for a validated SuccessfulPayment.
9. **Failure handling:** timeouts, provider errors, expired sessions and partial failures are recoverable.
10. **Client compatibility:** responsive layout, old clients, theme behavior and navigation are tested.
11. **Observability:** logs have correlation identifiers but no tokens, OTPs or personal data.
12. **Tests:** normal, invalid, duplicate, expired, unauthorized and interrupted cases are covered.
13. **Operations:** deployment, secrets, health checks, alerting, rollback and support ownership are defined.

## Severity
- **Critical:** credential exposure, unauthorized sensitive action, account takeover, payment or data-integrity failure.
- **High:** primary journey broken, duplicate business actions, identity trusted without verification, or order fulfilled before payment confirmation.
- **Medium:** recoverable flow failure, important edge cases untested, unsupported behavior assumed or provider constraints ignored.
- **Low:** clarity, maintainability or non-critical UX issue.

Do not invent a finding. Every finding needs evidence, impact, reproduction path and smallest safe correction.

## Required review output
For each finding: severity, confidence, file/function, current behavior, impact, reproduction evidence, fix and regression test.

Finish with GO, CONDITIONAL GO or NO-GO and list checks not performed.

## Never waive
Never waive server-side authorization, Mini App initData verification, Safir idempotency for retried business sends, Business API private-chat/file restrictions, payment confirmation checks, secret handling or the user's explicit requirements.
