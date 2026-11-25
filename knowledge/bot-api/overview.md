# Bale Bot API: protocol, update delivery and operational constraints

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/

## What it is

Bale documents its Bot API as based on Telegram's Bot API with some changes. This allows reuse of general integration concepts, but it does not establish full method or field parity.

## Request construction

The documented HTTPS endpoint pattern is:

~~~text
https://tapi.bale.ai/bot<token>/METHOD_NAME
~~~

Bale documents GET and POST and supports query strings, application/x-www-form-urlencoded, application/json (except file upload) and multipart/form-data for file upload.

The response is JSON. A successful response has ok=true and result. A failed response has ok=false and error_code, and may include description and parameters. ResponseParameters can contain retry guidance; respect retry_after when returned.

### Engineering implications

- Keep the bot token server-side.
- Redact the full request URL from logs because the token appears in the path.
- Use HTTPS and UTF-8.
- Use multipart/form-data for file upload rather than JSON.
- Handle both HTTP/network failures and the API's ok=false response.
- Do not assume a Telegram SDK's type declarations exactly match Bale.

## Identifier width

Bale documents that User.id and Chat.id can exceed the signed 32-bit range. The documentation says these identifiers can use up to 52 significant bits.

Engineering implications:
- Do not store Bale user or chat IDs in 32-bit integer columns.
- Use a database BIGINT or a lossless decimal-string representation.
- In JavaScript, keep IDs as Number only while they remain within Number.MAX_SAFE_INTEGER; avoid lossy conversions through 32-bit bitwise operators.
- Do not use a floating-point display formatter that changes the identifier.

## Update delivery

Bale documents two ways to receive updates: getUpdates (long polling) and webhook.

### Long polling

getUpdates returns an array of Update objects. The documented limit is 1–100, default 100. timeout controls how long the server waits.

The offset must be one greater than the highest update_id already received. A higher offset acknowledges earlier updates. Advance it only after the application has reached the intended durable processing point. Bale also documents negative offsets for reading from the end of the update queue; using a negative offset forgets earlier updates, so do not use it in a normal durable consumer.

### Webhook

setWebhook configures an HTTPS URL that receives JSON POST requests. The documentation lists ports 443 and 88 as currently supported. An empty URL disables the webhook. deleteWebhook can be used before switching back to getUpdates.

Do not run getUpdates and webhook as competing delivery mechanisms for one bot.

### Update shape

Update contains update_id and at most one optional event payload. Documented examples include message, edited_message, callback_query and pre_checkout_query. Route on the actual field present; do not assume every update contains a normal text message.

Bale documents that update_id can be used to ignore duplicate webhook updates or restore the correct sequence if deliveries arrive out of order.

The docs state that up to 2,000 latest messages are retained for 24 hours. This is a delivery buffer, not a durable application event store.

## Rate limiting

The standard Bot API has interactive rate behavior: each bot's sending capacity is calculated based on user interaction in private chats. For bulk or out-of-active-chat notifications, Bale offers a separate Business API with a higher independent quota and credit-based billing.

Do not invent a fixed global messages-per-second limit. Read ResponseParameters and respect retry_after when returned.

## File handling summary

Bale documents three ways to send files:

| Method | Image maximum | Other content maximum |
|---|---:|---:|
| Existing file_id | No upload limit documented for this path | No upload limit documented for this path |
| HTTP URL | 5 MB | 20 MB |
| multipart/form-data upload | 10 MB | 50 MB |

Additional rules:
- file_id is unique to one bot and cannot be transferred to another bot.
- Re-sending a file_id does not allow changing the media type.
- Thumbnails cannot be reused.
- URL-based sending requires the correct MIME type.
- sendDocument URL delivery is documented only for GIF, PDF and ZIP.
- sendVoice by URL requires audio/ogg and a size no greater than 1 MB to appear as a voice message; 1–20 MB is sent as a file.
- getFile supports downloading files up to 20 MB. The generated download URL is guaranteed for one hour; request a new URL after expiry.
- sendAudio accepts MP3 or M4A and currently supports up to 50 MB.
- sendDocument, sendVideo, sendAnimation and sendVoice currently document 50 MB limits. Limits may change.

## Business API

Business API uses a different base route:

~~~text
https://tapi.bale.ai/business/bot<TOKEN>/<METHOD_NAME>
~~~

It shares Bot API authentication and request/response formats, but has its own quota and business-credit billing. The currently documented methods are getMe, sendMessage, forwardMessage, sendPhoto, sendVideo, sendAudio and sendDocument. chat_id is limited to private chats and file sending supports file_id only.

See business-api.md for the full decision guide and constraints.

## Polling or webhook?

| Situation | Recommendation | Reason |
|---|---|---|
| Local development or a single simple worker | Long polling | Fewer public infrastructure requirements |
| Production service with stable public HTTPS ingress | Webhook | Bale pushes updates to the service |
| Multiple workers or horizontal scaling | Webhook plus durable queue/deduplication | Centralized ingress can control duplicate and concurrent processing |

The last two recommendations are engineering guidance, not guarantees about Bale throughput or delivery latency.

## Failure modes

- Offset advanced before the update was durably processed.
- Negative offset used in a durable consumer and earlier updates discarded.
- Duplicate webhook delivery repeats a payment, order or booking action.
- Both polling and webhook are enabled and compete for updates.
- A Telegram-only method is used without checking Bale support.
- Token-bearing URLs leak through HTTP logs or tracing.
- A worker assumes update.message always exists.
- User or chat IDs are truncated to 32 bits.
- File ID from one bot is reused by another bot.
- A file is uploaded through an unsupported Business API transfer method.

## Verification checklist

- Verify a success and failure API envelope.
- Confirm file upload uses multipart/form-data.
- Simulate duplicate update_id.
- Restart the worker during processing and verify recovery.
- Verify the chosen update mechanism is the only active consumer.
- Confirm secrets are redacted in logs.
- Round-trip IDs larger than 2^31 through the database without loss.
- Verify file size and transfer method for the exact media method.
- Verify retry_after handling.

## Source

- https://docs.bale.ai/ (creating requests, Update, getUpdates, setWebhook, User, Chat, file handling and Business API)
