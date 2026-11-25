# Bale Engineering glossary

| Term | Meaning |
|---|---|
| Bot API | HTTPS API used by a Bale bot to send messages and receive updates |
| Business API | Credit-funded, higher-quota route for outbound messages to existing private Bale chats |
| Update | Event envelope received by a bot, identified by update_id |
| Long polling | Repeated getUpdates requests that wait for new updates |
| Webhook | HTTPS endpoint to which Bale sends update payloads |
| Reply keyboard | Custom keyboard whose button choices are sent as user messages |
| Inline keyboard | Buttons attached to a message |
| callback_data | Compact data sent to the bot when an inline callback button is pressed |
| answerCallbackQuery | Bot API method that ends the inline-button waiting state |
| Mini App | Web interface launched inside the Bale client |
| initData | Raw signed initialization data supplied to a Mini App |
| initDataUnsafe | Parsed convenience object; not trusted until raw initData is verified |
| start | Bot conversation start parameter |
| startapp | Mini App launch parameter |
| Safir | Bale organization REST service for sending messages to phone numbers |
| request_id | Safir idempotency key used to prevent duplicate delivery |
| Wallet invoice | Bot/Mini App payment entry point for Bale wallet payments |
| pre_checkout_query | Payment validation request that must be answered within 10 seconds |
| SuccessfulPayment | Update payload that confirms a successful wallet payment |
| Idempotency | Property that repeating the same operation does not repeat its business effect |
| HMAC | Keyed message authentication code used to verify integrity and authenticity |
| data_check_string | Alphabetically sorted key=value lines joined with newline for Mini App verification |
| Trust boundary | Point where data crosses from an untrusted client or external service into a trusted backend |
