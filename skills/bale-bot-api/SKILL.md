---
name: bale-bot-api
description: Use when building or debugging Bale bots, commands, updates, webhooks, long polling, messages, reply keyboards, inline keyboards, callbacks, media or chat administration.
---

# Bale Bot API Engineering

Use this skill for chat-native workflows: commands, incoming messages, contact/location sharing, inline actions, groups, files, message editing, topics, sticker operations and payment-related updates.

Do not use it as a substitute for a Mini App when the user needs a dense visual interface. Do not use Bot API as a substitute for Business API notifications outside active chat or Safir phone-number delivery.

## Verify the platform contract

Bale says its Bot API is based on Telegram's API with some changes. This is not a promise of complete compatibility. Confirm each method and field in Bale's docs.

The documented HTTPS endpoint pattern is:

~~~text
https://tapi.bale.ai/bot<token>/METHOD_NAME
~~~

Never log the complete URL because it contains the token. Use HTTPS, UTF-8 and a supported request encoding. JSON is supported except for file upload; multipart/form-data is used for file upload.

A successful response has ok=true and result. A failure has ok=false and error_code, and may include description and parameters. When retry_after is returned in ResponseParameters, respect it instead of guessing a retry delay.

## Choose update delivery

- **getUpdates / long polling:** suitable for local development or a simple worker. Advance offset to one greater than the highest update_id already processed.
- **Webhook:** suitable when the application has a stable public HTTPS endpoint. Bale documents ports 443 and 88.

Do not run getUpdates and webhook as competing consumers. Deduplicate webhook deliveries using update_id. Bale documents retention of up to 2,000 recent messages for 24 hours; this is not durable business storage.

## Model updates explicitly

An Update has update_id and at most one optional event payload such as message, edited_message, callback_query or pre_checkout_query. Route by the actual field present; do not assume every update is a text message.

Persist processing outcomes when duplicate delivery could repeat a business action. Advance offset only after the intended durable processing point.

## Design keyboards

- Reply keyboard: user replies, contact sharing or location sharing.
- Inline keyboard: actions attached to a message, including callback actions, URLs, Mini App launch and copy text.
- Confirmation: success.
- Destructive or cancel: danger.
- Primary next action: primary.
- Unavailable action: disabled object, while also enforcing the rule server-side.

Only one action field should be used on an InlineKeyboardButton. callback_data is documented as 1–64 bytes. Calculate UTF-8 bytes, not JavaScript string length.

## Callback handling

1. Parse the bounded callback payload.
2. Identify the actor from the authenticated update.
3. Load the target entity from the backend.
4. Check ownership, permission and current state.
5. Apply the state transition transactionally.
6. Make duplicate callbacks harmless.
7. Call answerCallbackQuery for every callback, even when no user-facing notification is needed.
8. Update the original message or keyboard when appropriate.

Bale says a pressed inline button remains in a waiting state until answerCallbackQuery is called. The method is unavailable in older clients; the docs say callback_query_id beginning with 1 indicates an older client. Provide a fallback such as a normal bot message for those clients.

Treat callback data as untrusted: the docs note that data may arrive even when the message no longer has a button with that data.

## Media and file limits

Bale documents these current limits:
- Reusing file_id: no upload limit is documented for this path.
- Sending by HTTP URL: images up to 5 MB; other content up to 20 MB.
- Uploading with multipart/form-data: images up to 10 MB; other files up to 50 MB.
- getFile downloads: up to 20 MB; generated download URL is guaranteed for one hour.
- file_id belongs to one bot and cannot be transferred to another bot.
- sendAudio accepts MP3 or M4A up to 50 MB.
- sendDocument, sendVideo, sendAnimation and sendVoice currently document 50 MB limits.

Limits may change. Read the relevant method's current table before implementing a specific media workflow.

## Payment updates

answerPreCheckoutQuery must be called within 10 seconds. Receiving pre_checkout_query does not prove payment success. Fulfil only after receiving SuccessfulPayment and validating the invoice payload.

## Example: confirm or cancel

~~~json
{
  "inline_keyboard": [
    [
      { "text": "تأیید", "callback_data": "order:v1:confirm:1024", "style": "success" },
      { "text": "لغو", "callback_data": "order:v1:cancel:1024", "style": "danger" }
    ],
    [
      { "text": "ظرفیت تکمیل است", "disabled": {} }
    ]
  ]
}
~~~

The callback format is an application convention, not a Bale-defined syntax. The server must still verify that the user may confirm or cancel order 1024.

## Failure modes
- Duplicate update_id or callback delivery.
- Expired business state.
- User does not own the target object.
- callback_data outside the 1–64 byte limit.
- Callback query never answered, leaving the button in a waiting state.
- Unsupported method copied from Telegram.
- Webhook timeout, restart or out-of-order updates.
- File upload encoded as JSON instead of multipart/form-data.
- File ID reused with another bot.
- Order fulfilled from pre_checkout_query before SuccessfulPayment.

## Verification
Check the response envelope, persisted offset, callback acknowledgement, server-side permission check, file constraints and state transition. Test success and rejection paths.

## References
- ../../knowledge/bot-api/overview.md
- ../../knowledge/bot-api/methods-catalog.md
- ../../knowledge/bot-api/keyboards-and-callbacks.md
- ../../knowledge/bot-api/payments-and-wallet.md
- https://docs.bale.ai/
