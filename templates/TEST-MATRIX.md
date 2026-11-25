# Test Matrix

| Scenario | Input / setup | Expected behavior | Evidence |
|---|---|---|---|
| Happy path | Valid actor and payload | Intended state transition | Response + persisted state |
| Invalid input | Missing or malformed field | Rejected without side effect | Validation error |
| Unauthorized | Actor lacks permission | Denied | 403 / domain error |
| Duplicate | Same update or request repeated | No duplicate business effect | One persisted effect |
| Expired | Expired token or state | Rejected or refreshed safely | Explicit expiry result |
| Timeout | Provider response lost | Retry/reconcile safely | Stable idempotency key |
| Concurrent | Two requests race | One valid transition | Database invariant |
| Old client | Unsupported SDK feature | Safe fallback | Client test |
| Provider error | Bale/Safir returns failure | Mapped and observable | Error record |
| Recovery | Worker restarts mid-flow | Resume safely | Recovered state |
