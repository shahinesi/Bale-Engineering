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
2. Validate phone numbers as 98 or +98 followed by exactly ten digits, without spaces or separators.
3. Persist the business delivery intent and a stable request_id before calling Safir.
4. Reuse the same request_id when retrying the same business delivery.
5. Create a new request_id only for a genuinely new business delivery.
6. Record message_id and error_data without logging secrets, OTPs or full phone numbers.
7. Define retry, expiry, support and reconciliation behavior.

## Idempotency
Safir documents request_id as the mechanism that prevents duplicate delivery when the same request is repeated. It is optional in the schema but explicitly recommended.

Do not generate a fresh random request_id on every retry. Persist a stable identifier for the business event, not the individual HTTP attempt.

## Message types
- **message:** text, uploaded file_id, copy_text or reply_markup.
- **otp_message:** numeric OTP. Bale automatically adds the sender bot name and a copy action.
- **is_secure:** password-protects the message; the recipient must enter the password to view it.
- **template_message:** documented in a dedicated section of the official page. The summary MessageData table omits it, but the dedicated section documents template_id and text_fields. Use only an approved template; its field keys must exactly match the business-panel definition.

## Safir buttons
Safir's InlineKeyboardButton documents text plus at least one of url, web_app or copy_text. Its schema does not list Bot API callback_data, style or disabled. Do not reuse a Bot API inline keyboard payload unchanged.

## File upload
Upload media first using the Safir upload_file endpoint with multipart/form-data. The documented maximum file size is 500 MB. Use the returned file_id in the send_message request.

## Errors
Safir returns message_id and error_data. error_data can contain a separate error for each phone number.

| Code | Meaning | Recommended handling |
|---:|---|---|
| 2 | Internal server error | Potentially transient; bounded retry with same request_id |
| 3 | Rate limit exceeded | Back off and respect rate limits |
| 4 | Invalid JSON input | Fix payload; no unchanged retry |
| 8 | Invalid phone | Fix destination |
| 17 | Recipient has no Bale account | Mark unavailable |
| 20 | Insufficient credit | Resolve account credit |
| 21 | Maximum contact limit reached | Resolve account limit |

These retry decisions are engineering recommendations; use the provider's error_data as the source of truth.

## Retry policy
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
  "phone_number": "989196111003",
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
  "phone_number": "+989196111003",
  "message_data": {
    "otp_message": {
      "otp": "482193"
    }
  }
}
~~~

Never put a real OTP in logs, analytics, exception messages or public test fixtures.

## Verification
Test both accepted phone formats, malformed numbers, missing request_id warning, stable request_id on retry, duplicate request behavior, per-recipient error_data, message_id handling, secure message behavior, template approval and numeric OTP format.

## References
- ../../knowledge/safir/overview-idempotency-and-errors.md
- https://docs.bale.ai/safir
