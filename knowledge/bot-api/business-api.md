# Bale Business API: outbound messaging beyond the active chat

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/ (sections: increasing send limits and Business API)

## What it is

The Bale Business API is a business-account messaging route with an independent, higher rate quota for scenarios such as notifying users who have previously started the bot, reconnecting with them outside an active conversation and sending bulk notifications.

It is not Safir. Business API targets an existing private chat by chat_id. Safir targets a phone number through a separate REST messaging service.

## Base URL

~~~text
https://tapi.bale.ai/business/bot<TOKEN>/<METHOD_NAME>
~~~

The difference from the standard Bot API route is the /business segment. Authentication, request formats, parameters and response structure are documented as the same as the standard Bot API.

## Currently documented methods

The official Bale page currently lists only:

- getMe
- sendMessage
- forwardMessage
- sendPhoto
- sendVideo
- sendAudio
- sendDocument

Do not assume that any other standard Bot API method is available on the Business API route.

## Important constraints

- The chat_id parameter can be used only for private chats.
- For file sending methods, only file_id is supported.
- Sending files by URL or multipart upload is not supported on the Business API route.
- The business account must be charged/credited before using the higher-quota service.
- Sending costs are automatically deducted from the business account balance.
- The Business API quota is independent and higher than the standard interactive Bot API quota, but the exact numeric quota is not specified as a universal constant in the cited documentation.

## When to choose it

Choose Business API when:
- The recipient has previously started the bot.
- The application needs to send a notification outside the currently active conversation.
- The business account has the required credit.
- The destination is a private chat identified by chat_id.

Do not choose it when:
- The only identifier available is a phone number. Use Safir if the requirement is phone-number delivery.
- The destination is a group or channel. The documented Business API restriction says chat_id is for private chats only.
- The application needs an API method not in the documented supported-method list.

## Engineering design

1. Persist the business notification intent before attempting delivery.
2. Check business-account credit and quota operationally; do not assume a request will be free.
3. Use only the seven documented methods.
4. Resolve and store the recipient's Bale chat_id from a legitimate bot interaction.
5. Store a delivery record and application-level idempotency key. The Business API page does not document a provider-level request_id equivalent to Safir, so do not claim it provides Safir-style idempotency.
6. Use file_id values that belong to the same bot. Do not attempt URL or multipart file transfer through this route.
7. Record provider response and business credit impact without logging the bot token.

## Example

~~~http
POST https://tapi.bale.ai/business/bot<YOUR_BOT_TOKEN>/sendMessage
Content-Type: application/json
~~~

~~~json
{
  "chat_id": 123456789,
  "text": "گزارش شما آماده است."
}
~~~

The chat_id must represent a private chat. The example is illustrative; use a real ID obtained from a valid bot interaction.

## Business API versus Safir

| Dimension | Business API | Safir |
|---|---|---|
| Recipient identifier | Bale private chat_id | Phone number |
| Entry requirement | User previously started the bot | Phone number and Safir service eligibility |
| Endpoint family | Bot API with /business route | Separate Safir REST API |
| Authentication | Bot token in route | api-access-key header |
| Quota / billing | Separate higher quota, business credit | Safir account and service rules |
| Documented idempotency key | Not specified on this page | request_id |
| File sending | file_id only | upload_file then file_id |
| Callback interaction | Standard Bot API methods are not all available; documented list is limited | Safir keyboard schema; no Bot API callback_data documented |

## Verification checklist

- Confirm the recipient is a private chat.
- Confirm the method is in the documented seven-method list.
- Confirm business account credit is available.
- Confirm file_id belongs to this bot.
- Confirm no URL or multipart file upload is attempted.
- Confirm application-level duplicate prevention.
- Verify the actual provider response and account charge.

## Source

- https://docs.bale.ai/ (increasing send limits, Business API usage, supported methods and limitations)
