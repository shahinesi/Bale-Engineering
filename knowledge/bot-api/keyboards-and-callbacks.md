# Bale keyboards, button styles and callbacks

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/

## Choose the keyboard type

### Reply keyboard

Use a reply keyboard when the user is expected to send a choice as a chat message, or share contact/location through a keyboard action. The keyboard can remain visible until another custom keyboard replaces it or it is explicitly removed.

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

The official Bot API reference lists url, callback_data, web_app and copy_text as optional action fields and says only one optional field should be used.

callback_data has a documented size of 1–64 bytes. Measure UTF-8 bytes. Persian text can use multiple bytes per visible character.

### Good callback payload

~~~json
{
  "text": "تأیید سفارش",
  "callback_data": "order:v1:confirm:1024",
  "style": "success"
}
~~~

The order:v1:confirm:1024 convention is an application design example, not a Bale-defined syntax.

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

A callback is delivered as callback_query in an Update. The data field contains the callback_data value configured on the button.

Recommended server workflow:
1. Parse the bounded callback payload.
2. Authenticate the actor from the incoming update.
3. Load the referenced resource.
4. Check actor permission and resource ownership.
5. Check the current state allows the transition.
6. Apply the state transition transactionally.
7. Make repeated callbacks harmless.
8. Answer the callback query and update the original message when appropriate.

Never assume that a button click is proof of permission.

## Safir is different

Do not copy this entire schema into Safir. Safir's documented InlineKeyboardButton schema lists url, web_app and copy_text; it does not list callback_data in that section. Read the Safir reference separately.

## Verification

- All buttons have non-empty text.
- Exactly one action field is used for Bot API inline buttons.
- callback_data is between 1 and 64 UTF-8 bytes.
- style is one of primary, success or danger.
- disabled is an empty object.
- Backend authorization works even if a user forges or replays callback data.
- Repeated confirm/cancel callbacks do not repeat a business transition.

## Source

- https://docs.bale.ai/ (ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, style)
