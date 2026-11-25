# Choosing between Bale Bot API, Business API, Mini App and Safir

## Do not collapse the channels

These are different platform surfaces with different recipient identities and operational constraints.

| Requirement | Best fit | Recipient / entry |
|---|---|---|
| Commands, short conversations and callback actions | Bot API | Active Bale bot conversation |
| Outbound notification to a user who previously started the bot, outside active chat | Business API | Existing private chat_id |
| Rich forms, dashboards, searchable catalogues and dense data | Mini App | Bale WebApp launch context |
| Outbound message to a phone number, OTP or approved template | Safir | Phone number |
| Wallet payment inside chat | Bot API invoice | Chat invoice + pre-checkout + SuccessfulPayment |
| Wallet payment inside a Mini App | Mini App + createInvoiceLink | Mini App checkout flow |

## Key differences

| Dimension | Bot API | Business API | Mini App | Safir |
|---|---|---|---|---|
| Primary job | Interactive chat | Outbound chat notifications | Rich web UI | Phone-number delivery |
| Recipient identity | Bale update/user/chat | Existing private chat_id | Verified initData identity | Phone number |
| Authentication | Bot token | Bot token + business route | HMAC verification of initData | api-access-key |
| Billing / quota | Interactive rate behavior | Separate higher quota; business credit | Application hosting/backend | Safir service/account rules |
| File sending | file_id, URL or multipart under documented limits | file_id only | Web/backend file flow | upload_file then file_id |
| Provider idempotency documented | Not assumed | Not documented on Business API page | Application/backend | request_id |
| Interactive callback | Yes, Bot API inline keyboard | Only documented methods; no assumption beyond list | Web UI events | Safir schema does not document callback_data |

## Common patterns

### Bot API only
Use for commands, short stateful conversations, simple selection and callback actions.

### Business API only
Use when the user already has a private chat with the bot and the application needs to send an outbound notification outside the active conversation. Do not use it for phone-number delivery or groups/channels.

### Mini App only
Use when the user can enter through the main Mini App or a direct link and the workflow does not need a chat conversation.

### Bot API + Mini App
Use a bot message as a notification or entry point, then open a Mini App for the rich task.

### Safir + Bot API or Mini App
Use Safir for phone-number delivery and a separate Bot API or Mini App path for interaction. Do not assume a Safir message can receive Bot API callback_query events.

### Business API + Mini App
Use Business API to notify an existing private chat and link the user into a Mini App when a rich follow-up task is needed. Validate Mini App initData independently.

## Decision questions

1. Is the user interacting inside a chat or with a rich interface?
2. Does the application already know a legitimate private Bale chat_id?
3. Is the destination only a phone number?
4. Does the user need to edit, search, compare or review many fields?
5. Is a user action expected immediately after notification?
6. Which channel is authoritative for identity and authorization?
7. What happens if a notification is duplicated, delayed or never opened?
8. Is the business account funded for Business API delivery?

## Engineering recommendations

- Keep business logic in the backend, not in the bot handler or Mini App.
- Treat each channel as an adapter around the same application use cases.
- Use a durable business state machine for actions that can be retried.
- Keep delivery status separate from business completion.
- Do not use UI state as business state.
- Do not assume Business API has Safir's provider-level request_id behavior.
