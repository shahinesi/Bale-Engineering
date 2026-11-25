---
name: bale-engineering-review
description: Use when reviewing a Bale bot, Mini App or Safir implementation for correctness, security, platform compatibility, reliability, test coverage and operational readiness.
---

# Bale Engineering Review

Review the complete user journey and trust boundaries, not only the changed lines.

## Review order
1. **Platform correctness:** every method, field, payload and limit is supported by Bale documentation.
2. **User journey:** clear entry, progress, success, cancellation and recovery.
3. **Authorization:** sensitive actions are checked server-side against actor and resource.
4. **Input validation:** callback payloads, URL parameters, Mini App data, phone numbers and external inputs are bounded.
5. **Idempotency:** duplicate updates, callbacks, Safir retries and concurrent submissions cannot repeat a business effect.
6. **Failure handling:** timeouts, provider errors, expired sessions and partial failures are recoverable.
7. **Client compatibility:** responsive layout, old clients, theme behavior and navigation are tested.
8. **Observability:** logs have correlation identifiers but no tokens, OTPs or personal data.
9. **Tests:** normal, invalid, duplicate, expired, unauthorized and interrupted cases are covered.
10. **Operations:** deployment, secrets, health checks, alerting, rollback and support ownership are defined.

## Severity
- **Critical:** credential exposure, unauthorized sensitive action, account takeover, payment or data-integrity failure.
- **High:** primary journey broken, duplicate business actions, or identity trusted without verification.
- **Medium:** recoverable flow failure, important edge cases untested, or unsupported behavior assumed.
- **Low:** clarity, maintainability or non-critical UX issue.

Do not invent a finding. Every finding needs evidence, impact, reproduction path and smallest safe correction.

## Required review output
For each finding: severity, confidence, file/function, current behavior, impact, reproduction evidence, fix and regression test.

Finish with GO, CONDITIONAL GO or NO-GO and list checks not performed.

## Never waive
Never waive server-side authorization, Mini App initData verification, Safir idempotency for retried business sends, secret handling or the user's explicit requirements.
