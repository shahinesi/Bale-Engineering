---
name: bale-business-api
description: Use when designing outbound Bale notifications to users who previously started a bot, using the higher-quota, credit-funded Business API rather than Safir phone-number delivery.
---

# Bale Business API Engineering

## When to use

Use the Business API when an application needs to send a notification to a user's existing private Bale chat outside the active conversation flow, and the business account has the required credit.

Do not confuse it with:
- Standard Bot API interactive messaging.
- Safir phone-number delivery.
- A Mini App user interface.

## Supported methods

The official documentation currently lists only:
- getMe
- sendMessage
- forwardMessage
- sendPhoto
- sendVideo
- sendAudio
- sendDocument

Do not assume other standard Bot API methods work on the Business API route.

## Endpoint

~~~text
https://tapi.bale.ai/business/bot<TOKEN>/<METHOD_NAME>
~~~

Authentication, request formats, parameters and response structures are documented as the same as the standard Bot API.

## Hard constraints

- chat_id is only for private chats.
- File-sending methods support file_id only.
- URL-based and multipart file uploads are not supported on this route.
- The account must have business credit; message costs are deducted automatically.
- The quota is separate and higher than the interactive Bot API quota. Do not invent a universal numeric quota.

## Engineering workflow

1. Confirm the user has previously started the bot and the application has a legitimate private chat_id.
2. Confirm the use case is a notification outside the active chat, not a phone-number message.
3. Check the seven-method allowlist.
4. Check the business credit and cost implications.
5. Persist the notification intent and an application-level idempotency key.
6. Use only a private chat_id.
7. For media, use a file_id belonging to this bot.
8. Record response, outcome and cost-relevant metadata without logging the token.

The Business API page does not document a provider-level request_id equivalent to Safir. Do not claim Safir-style idempotency. Implement duplicate prevention in the application.

## Example

~~~json
{
  "chat_id": 123456789,
  "text": "گزارش شما آماده است."
}
~~~

Send it to the Business API sendMessage endpoint, not the standard Bot API endpoint.

## Choose Business API or Safir?

- Existing Bale private chat_id and outbound bot notification: Business API.
- Phone number is the destination: Safir.
- User needs to interact in chat: standard Bot API.
- User needs a rich visual task: Mini App, often launched by Bot API.

## Verification

Test a private-chat recipient, a group/channel rejection path, missing business credit, a supported method, an unsupported method, file_id belonging to another bot, and duplicate application event delivery.

## Reference

- ../../knowledge/bot-api/business-api.md
- ../../knowledge/bot-api/overview.md
- https://docs.bale.ai/
