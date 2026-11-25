# Bale Bot API: protocol and update delivery

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

The response is JSON. A successful response has ok=true and result. A failed response has ok=false and error_code, and may include description and parameters.

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

The offset must be one greater than the highest update_id already received. A higher offset acknowledges earlier updates. Advance it only after the application has reached the intended durable processing point.

### Webhook

setWebhook configures an HTTPS URL that receives JSON POST requests. The documentation lists ports 443 and 88 as currently supported. An empty URL disables the webhook.

Do not run getUpdates and webhook as competing delivery mechanisms for one bot.

### Update shape

Update contains update_id and at most one optional event payload. Documented examples include message, edited_message, callback_query and pre_checkout_query. Route on the actual field present; do not assume every update contains a normal text message.

Bale documents that update_id can be used to ignore duplicate webhook updates or restore the correct sequence if deliveries arrive out of order.

The docs state that up to 2,000 latest messages are retained for 24 hours. This is a delivery buffer, not a durable application event store.

## Rate limiting

The Bot API documentation describes interactive rate limits and business messaging APIs with separate, higher quotas and account credit. When a rate limit error includes ResponseParameters.retry_after, use that value to determine when a retry may be attempted.

Do not invent a fixed global messages-per-second limit. The documented interactive capacity depends on the bot's private-chat interaction activity.

## Polling or webhook?

| Situation | Recommendation | Reason |
|---|---|---|
| Local development or a single simple worker | Long polling | Fewer public infrastructure requirements |
| Production service with stable public HTTPS ingress | Webhook | Bale pushes updates to the service |
| Multiple workers or horizontal scaling | Webhook plus durable queue/deduplication | Centralized ingress can control duplicate and concurrent processing |

The last two recommendations are engineering guidance, not guarantees about Bale throughput or delivery latency.

## Failure modes

- Offset advanced before the update was durably processed.
- Duplicate webhook delivery repeats a payment, order or booking action.
- Both polling and webhook are enabled and compete for updates.
- A Telegram-only method is used without checking Bale support.
- Token-bearing URLs leak through HTTP logs or tracing.
- A worker assumes update.message always exists.
- User or chat IDs are truncated to 32 bits.

## Verification checklist

- Verify a success and failure API envelope.
- Confirm file upload uses multipart/form-data.
- Simulate duplicate update_id.
- Restart the worker during processing and verify recovery.
- Verify the chosen update mechanism is the only active consumer.
- Confirm secrets are redacted in logs.
- Round-trip IDs larger than 2^31 through the database without loss.

## Source

- https://docs.bale.ai/ (creating requests, getUpdates, setWebhook, Update, User and Chat)
