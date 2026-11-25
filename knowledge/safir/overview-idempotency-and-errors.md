# Bale Safir: outbound messaging, templates, errors and idempotency

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/safir

## What Safir is

Safir is Bale's REST service for sending messages to phone numbers. Every API call requires the organization's API access key in the api-access-key header.

## Send message endpoint

~~~text
POST https://safir.bale.ai/api/v3/send_message
Content-Type: application/json
api-access-key: YOUR_SAFIR_API_ACCESS_KEY
~~~

The documented request fields are:
- request_id: optional idempotency identifier.
- bot_id: required numeric sender bot identifier.
- phone_number: required destination.
- message_data: required message details.

## Phone number format

Bale accepts a phone number beginning with 98 or +98 followed by exactly ten digits. Do not include spaces, hyphens, parentheses or other characters.

Valid examples:
- 989196111003
- +98919611003

Invalid examples:
- 09196111003
- 0919-611-1003
- 9196111003

For validation, the documented pattern can be represented as ^\+?98[0-9]{10}$. Keep the original accepted format or normalize to the format agreed by your integration; do not silently strip arbitrary characters.

## MessageData and message types

The summary table lists message, otp_message and is_secure. The dedicated template-message section also documents template_message, although it is omitted from that summary table. Treat the dedicated section and its examples as the template contract, and record the summary-table omission as a documentation maintenance issue rather than assuming templates are unsupported.

### Text and media message

The Message object documents:
- text: message text.
- file_id: identifier returned by upload_file.
- copy_text: a string that the recipient can copy.
- reply_markup: inline keyboard.

A media message is uploaded first, then sent using the returned file_id. A message may include a caption in text.

### OTP message

OTPMessage contains otp. Bale currently supports numeric OTP values only.

Bale automatically adds the sender bot's name and a copy action to the OTP message. This is different from manually composing an ordinary text message.

### Secure message

Set message_data.is_secure=true to send a password-protected message. The recipient must enter the correct password to view the content.

This feature is separate from HTTPS transport security and does not justify exposing the API access key or sensitive payloads in logs.

### Template message

Templates must first be created in the Bale business panel and approved by Bale support. The request uses:
- template_id: the approved template identifier.
- text_fields: key/value fields whose keys must exactly match the names defined in the template.

The official page also shows secure template messages by combining is_secure=true with template_message.

## Safir inline keyboard is not Bot API inline keyboard

The Safir InlineKeyboardButton schema documents:
- text: required label.
- url: optional URL.
- web_app: optional WebAppInfo object.
- copy_text: optional string.

At least one of url, web_app or copy_text must be supplied. The Safir page does not list callback_data, style or disabled in this schema. Do not copy those Bot API fields into Safir payloads.

## File upload

~~~text
POST https://safir.bale.ai/api/v3/upload_file
Content-Type: multipart/form-data
api-access-key: YOUR_SAFIR_API_ACCESS_KEY
~~~

The required multipart field is file. The documented maximum upload size is 500 MB. A successful response returns file_id, which is then used in the send_message payload.

## Response and error model

The send_message response includes message_id and error_data. The docs state that error_data can contain a separate error for each phone number; do not assume a single top-level error explains every recipient.

Documented error codes:

| Code | Name | Meaning | Engineering response |
|---:|---|---|---|
| 2 | InternalServerError | Internal server error | Treat as potentially transient; retry same request_id with bounded backoff |
| 3 | RateLimitExceeded | Rate limit exceeded | Respect rate controls; retry after a delay |
| 4 | InvalidInput | Invalid JSON input | Correct payload; do not retry unchanged |
| 8 | InvalidPhone | Invalid phone number | Correct destination; do not retry unchanged |
| 17 | NotBaleUser | Recipient has no Bale account | Mark recipient unavailable; do not loop retries |
| 20 | PaymentRequired | Insufficient credit | Resolve account credit before retry |
| 21 | MaximumContactLimitReached | Bot contact limit reached | Resolve the business account limit before retry |

These retry recommendations are engineering guidance. Use the actual error_data returned by Safir as the evidence for each recipient.

## Idempotency

The official documentation says:
- Use request_id to prevent duplicate message delivery.
- Repeating the same request_id does not send a duplicate message.
- request_id is optional in the schema but always recommended.

Engineering recommendation:
1. Generate and persist a stable request_id for the business delivery event.
2. Reuse it for retries of that same event.
3. Generate a new request_id only for a genuinely new business delivery.
4. Keep business delivery state separate from individual HTTP attempt state.

Example:

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

## Retry and failure policy

The following are engineering recommendations, not Bale guarantees:
- Retry transient network failures using the same request_id.
- Do not retry permanent validation, invalid-phone, no-account, insufficient-credit or contact-limit errors without correcting the cause.
- Use bounded exponential backoff and jitter for transient failures.
- If a timeout occurs after the provider may have accepted the request, retry with the same request_id rather than creating a new one.
- Track delivery as pending, sent, failed or unknown; do not convert an ambiguous timeout into confirmed failure without reconciliation.

## Verification checklist

- API access key is stored server-side and redacted in logs.
- Phone number matches 98 or +98 plus ten digits, without separators.
- Same request_id is reused on retry.
- Duplicate request_id behavior is verified.
- OTP is numeric and the sender/copy affordance is shown as expected.
- Secure message behavior is tested in the recipient client.
- Template is approved and text_fields keys match exactly.
- File upload uses multipart/form-data and respects the 500 MB limit.
- error_data is inspected per recipient.
- Safir buttons use only the documented Safir schema.

## Source

- https://docs.bale.ai/safir
