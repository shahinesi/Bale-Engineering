# Choosing between Bale Bot API, Mini App and Safir

## Decision matrix

| Requirement | Bot API | Mini App | Safir |
|---|---|---|---|
| Chat commands and short conversations | Best fit | Not needed | Not applicable |
| Rich forms and dense data | Possible but awkward | Best fit | Not applicable |
| Outbound delivery to a phone number | Not the same service | Not applicable | Best fit |
| OTP via organization message delivery | Not assumed | Not applicable | Documented |
| Callback buttons | Documented | Use web UI events | Not listed in Safir button schema |
| Searchable catalog or dashboard | Poor fit for complex views | Best fit | Not applicable |
| Launch from a chat message | Native | Via web_app | Not a user interaction surface |

## Common patterns

### Bot API only
Use for commands, short stateful conversations, simple selection and callback actions.

### Mini App only
Use when the user can enter through the main Mini App or a direct link and the workflow does not need a chat conversation.

### Bot API + Mini App
Use a bot message as a notification or entry point, then open a Mini App for the rich task.

### Safir + Bot API or Mini App
Use Safir for phone-number delivery and a separate Bot API or Mini App path for interaction. Do not assume a Safir message can receive Bot API callback_query events.

## Decision questions
1. Is the user interacting inside a chat or with a rich interface?
2. Does the task need a phone-number delivery channel?
3. Does the user need to edit, search, compare or review many fields?
4. Is a user action expected immediately after notification?
5. Which channel is authoritative for identity and authorization?
6. What happens if a notification is duplicated, delayed or never opened?

## Engineering recommendations
- Keep business logic in the backend, not in the bot handler or Mini App.
- Treat each channel as an adapter around the same application use cases.
- Use a durable business state machine for actions that can be retried.
- Keep delivery status separate from business completion.
- Do not use UI state as business state.
