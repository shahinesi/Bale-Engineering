---
name: bale-safir
description: Use when implementing Bale Safir outbound messages, OTP delivery, secure messages, approved templates, file upload, delivery retries or duplicate-send prevention.
---

# Bale Safir Engineering

## When to use
Use Safir when the requirement is to send a message to a phone number through Bale's organization messaging service. It is a REST service and requires the organization's API access key on each request.

Do not confuse Safir with a bot conversation. Safir's documented request schema and keyboard capabilities are not identical to Bot API.

## Required design
1. Keep the organization API access key in a server-side secret store.
2. Validate the documented phone format: it starts with 98 and contains no extra characters.
3. Persist the business delivery intent and a stable request_id before calling Safir.
4. Reuse the same request_id when retrying the same business delivery.
5. Create a new request_id only for a genuinely new business delivery.
6. Record message_id and error_data without logging secrets or OTP values.
7. Define retry, expiry, support and reconciliation behavior.

## Idempotency
Safir documents request_id as the mechanism that prevents duplicate delivery when the same request is repeated. It is optional in the schema but explicitly recommended.

Do not generate a fresh random request_id on every retry. Persist a stable identifier for the business event, not the individual HTTP attempt.

## Message types
The documented MessageData supports message, otp_message and is_secure. The docs also show template_message examples, although the MessageData summary table does not list template_message. Treat this as a documentation inconsistency and verify the current contract before relying on templates.

The documentation currently describes numeric OTP values. Do not assume arbitrary alphanumeric OTP support.

For a secure message, set is_secure=true only when the user journey and policy require the recipient to unlock the content.

## Retry and failure policy
- Retry transient network failures using the same request_id.
- Do not retry permanent validation or authorization errors without correcting the request.
- Do not send a second OTP merely because the first HTTP response timed out; reconcile using the same idempotency key.
- Bounded exponential backoff and jitter are engineering recommendations, not Bale guarantees.
- Keep business delivery status separate from HTTP attempt status.

## Example: text message

~~~json
{
  "request_id": "order-1024-confirmation-v1",
  "bot_id": 123456789,
  "phone_number": "989000000000",
  "message_data": {
    "message": {
      "text": "سفارش شما ثبت شد."
    }
  }
}
~~~

~~~text
POST https://safir.bale.ai/api/v3/send_message
api-access-key: YOUR_SAFIR_API_ACCESS_KEY
Content-Type: application/json
~~~

## Example: OTP

~~~json
{
  "request_id": "login-opaque-challenge-id",
  "bot_id": 123456789,
  "phone_number": "989000000000",
  "message_data": {
    "otp_message": {
      "otp": "482193"
    }
  }
}
~~~

Never put a real OTP in logs, analytics, exception messages or public test fixtures.

## Verification
Test malformed phone numbers, missing request_id warning, stable request_id on retry, duplicate request behavior, message_id handling, secure message behavior and numeric OTP format.

## References
- ../../knowledge/safir/overview-idempotency-and-errors.md
- https://docs.bale.ai/safir
