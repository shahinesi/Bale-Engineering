# Bale keyboards, button styles and callbacks

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/

## Choose the keyboard type

### Reply keyboard

Use a reply keyboard when the user is expected to send a choice as a chat message, or share contact/location through a keyboard action.

A KeyboardButton can be a plain string for simple text. The object form supports:
- text: visible button label.
- request_contact: ask the user to share a contact.
- request_location: ask the user to share a location.
- web_app: open a Mini App.
- style: choose a documented button color.

A custom reply keyboard remains visible until another custom keyboard replaces it or the bot sends ReplyKeyboardRemove with remove_keyboard=true.

### Inline keyboard

Use an inline keyboard when the action belongs to a particular message. It is appropriate for confirm/cancel, opening a URL, launching a Mini App, copying text or sending callback data to the bot.

Do not make a complex data-entry form out of dozens of chat buttons. Use a Mini App when the interaction is naturally a form or rich workspace.

## Button styles

The official Bot API docs say style is optional on KeyboardButton and InlineKeyboardButton.

| Value | Color | Intended use documented by Bale |
|---|---|---|
| primary | #00b894 | Main action in the message |
| success | #24863d | Confirm or continue |
| danger | #e82a3c | Delete or cancel |

If style is omitted, the default button appearance is used.

## Disabled buttons

The documented disabled field is an empty object. Bale says a disabled button appears muted and pressing it does nothing.

~~~json
{
  "inline_keyboard": [
    [
      { "text": "تأیید", "callback_data": "confirm", "style": "success" },
      { "text": "لغو", "callback_data": "cancel", "style": "danger" }
    ],
    [
      { "text": "ظرفیت تکمیل است", "disabled": {} }
    ]
  ]
}
~~~

**Security distinction:** disabled is a visual/interaction state. It is not an authorization rule. The backend must still reject a forbidden action.

## Inline button action fields

The official Bot API reference says only one optional action field should be used on an InlineKeyboardButton:

- url: open a URL.
- callback_data: send data to the bot when pressed; documented size is 1–64 bytes.
- web_app: open a Mini App; WebAppInfo.url must use HTTPS.
- copy_text: copy the configured text; its text field is documented as 1–256 characters.

style and disabled are additional presentation fields, not action fields.

Measure callback_data in UTF-8 bytes. Persian text can use multiple bytes per visible character.

### Good callback payload

~~~json
{
  "text": "تأیید سفارش",
  "callback_data": "order:v1:confirm:1024",
  "style": "success"
}
~~~

The order:v1:confirm:1024 convention is an application design example, not a Bale-defined syntax.

### Disabled action

~~~json
{
  "text": "ظرفیت تکمیل است",
  "disabled": {}
}
~~~

Do not attach an active action to a disabled button. Even if the UI disables it, the backend must enforce the rule independently.

### Bad callback payload

~~~json
{
  "text": "تأیید",
  "callback_data": "confirm-order-for-customer-989000000000-with-secret-token-...",
  "style": "success"
}
~~~

Do not put personal information, secrets or permissions in callback_data. Keep it compact and resolve the referenced object on the server.

## Callback processing

A callback is delivered as callback_query in an Update. The data field contains the callback_data value configured on the button. Bale notes that callback data may arrive even when the message no longer has a button with that data, so treat it as untrusted input.

Recommended server workflow:
1. Parse the bounded callback payload.
2. Identify the actor from the authenticated update.
3. Load the referenced resource.
4. Check actor permission and resource ownership.
5. Check the current state allows the transition.
6. Apply the state transition transactionally.
7. Make repeated callbacks harmless.
8. Call answerCallbackQuery for every callback, even when no user-facing notification is needed.
9. Update the original message or keyboard when appropriate.

Bale says a pressed inline button remains in a waiting state until answerCallbackQuery is called. Never assume that a button click is proof of permission.

## Mini App data from a bot update

The Bot API WebAppData object contains data sent from the Mini App. Bale explicitly warns that this field can contain fabricated data. Validate it on the backend; do not treat it as proof of identity or authorization.

## Safir is different

Do not copy this entire schema into Safir. Safir's documented InlineKeyboardButton schema lists url, web_app and copy_text; it does not list callback_data, style or disabled in that section. Read the Safir reference separately.

## Verification

- All buttons have non-empty text.
- Exactly one action field is used for Bot API inline buttons.
- callback_data is between 1 and 64 UTF-8 bytes.
- style is one of primary, success or danger.
- disabled is an empty object and has no active action.
- web_app.url uses HTTPS.
- copy_text.text is between 1 and 256 characters.
- Backend authorization works even if a user forges or replays callback data.
- Every callback is answered.
- Repeated confirm/cancel callbacks do not repeat a business transition.

## Source

- https://docs.bale.ai/ (KeyboardButton, InlineKeyboardButton, style, CallbackQuery, WebAppData, WebAppInfo, CopyTextButton)
