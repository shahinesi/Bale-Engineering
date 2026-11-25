# API Contract

## Purpose
What business capability does this endpoint or handler provide?

## Authentication
How is the caller authenticated?

## Authorization
Which actor may perform which operation on which resource?

## Request
~~~json
{
  "example": "replace with a sanitized example"
}
~~~

## Response
~~~json
{
  "ok": true
}
~~~

## Validation
Required fields, formats, size limits and semantic rules.

## State transitions
Current state, allowed transition and resulting state.

## Idempotency
Key, scope, retention and duplicate behavior.

## Errors
| Condition | Response | Retry? |
|---|---|---|
| Invalid input | 400 | No, correct input |
| Unauthorized | 403 | No |
| Temporary provider failure | 503 | Maybe, bounded |
| Duplicate business request | Stable result | Do not repeat side effect |

## Security notes
Secrets, personal data, logging and trust boundaries.

## Tests
Success, invalid, duplicate, expired, unauthorized and concurrent requests.
