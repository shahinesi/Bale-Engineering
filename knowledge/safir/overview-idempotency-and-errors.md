# Bale Safir: outbound messaging and idempotency

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/safir

## What Safir is

Safir is Bale's RESTful message-sending service for delivering messages to phone numbers. Each request requires the organization's API access key in the api-access-key header.

## Send message endpoint

~~~text
POST https://safir.bale.ai/api/v3/send_message
Content-Type: application/json
api-access-key: YOUR_SAFIR_API_ACCESS_KEY
~~~

The documented body includes:
- request_id: optional identifier used to prevent duplicate delivery.
- bot_id: required numeric sender bot identifier.
- phone_number: required destination, beginning with 98 and without extra characters.
- message_data: required message details.

MessageData documents message, otp_message and is_secure. Message documents text, file_id, copy_text and reply_markup.

## Idempotency

The official documentation says:
- Use request_id to prevent duplicate message delivery.
- Repeating the same request_id does not send a duplicate message.
- request_id is optional in the schema but always recommended.

Engineering recommendation:
- Generate and persist a stable request_id for the business event before sending.
- Reuse it for retries of that same event.
- Generate a different request_id only for a new business event.
- Keep the business delivery record separate from individual HTTP attempts.

Example:

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

## OTP and secure messages

The OTPMessage schema requires otp. The docs currently say only numeric OTP values are supported.

For a secure message, set message_data.is_secure to true. Do not confuse this with transport encryption: HTTPS is still required, and the access key must remain secret.

## Templates: documentation discrepancy

The Safir page shows template_message examples, including template_id and text_fields. However, the MessageData summary table lists message, otp_message and is_secure but does not list template_message.

Record this as a source inconsistency. Before depending on templates, verify the current behavior in the business panel and with the current official service contract. The field names in text_fields must match the approved template exactly.

## File upload

For media, first use the documented upload_file service and then use the returned file identifier in message_data. The upload endpoint uses multipart/form-data.

## Safir inline buttons are not Bot API buttons

The Safir page lists url, web_app and copy_text for its InlineKeyboardButton and says at least one must be supplied. It does not list callback_data in this schema section. Do not assume callback interactions from Bot API are available in Safir.

## Retry policy

The following are engineering recommendations, not Bale guarantees:
- Retry transient network failures with the same request_id.
- Do not retry permanent validation or authorization failures without changing the request.
- Use bounded exponential backoff and jitter.
- If a timeout occurs after the provider may have accepted the request, retry with the same request_id rather than creating a new one.
- Track the business state as pending, sent, failed or unknown; do not convert an ambiguous timeout into a confirmed failure without reconciliation.

## Verification checklist

- API access key is stored server-side and redacted in logs.
- Phone number begins with 98 and contains no extra characters.
- Same request_id is reused on retry.
- Duplicate request_id behavior is verified.
- OTP payload is numeric.
- Secure message is only enabled when needed.
- Uploaded file_id is used for media.
- Template schema is verified because the docs contain a discrepancy.

## Source

- https://docs.bale.ai/safir
