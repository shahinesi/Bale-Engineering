# Bale message formatting: supported syntax and limits

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/markdown-formatting

## Important distinction

Bale formats message text with a Markdown-like syntax, but it differs from standard Markdown. Use the exact documented syntax rather than assuming GitHub-flavored Markdown or HTML support.

## Documented syntax

| Feature | Bale syntax | Notes |
|---|---|---|
| Bold | *متن برجسته* | One asterisk at each end; double asterisks are not supported |
| Italic | _متن کج_ | One underscore at each end; double underscores are not supported |
| Link | [عنوان](https://docs.bale.ai) | No space between ] and ( |
| Code | Three backticks around the source | Use for source code |
| Short text / نمایش آنی | Three backticks + [عنوان] + full text + three backticks | Displays a short title; touching it opens a preview |
| Mention | @username | A valid username becomes clickable |
| Hashtag | #موضوع | Clickable tag |
| Bot command | /command | Recognized in bot and group messages |
| Checklist | - [ ] / - [x] | Can be interactive when enabled for the message and the user may edit it |
| Internal user mention | [نام](uid:12345) | Uses a Bale user ID |
| Send value to bot | [شروع](send:/start) | Sends the value as a message to the bot in supported bot/group contexts |

## Bold and italic spacing

Bale's guide says to put a space before the opening marker and after the closing marker. Keep formatting markers separated from adjacent words; do not attach them directly to surrounding Persian or Latin text.

## Short text: exact syntax

The documented form is a title in square brackets followed by the full content, all enclosed in three backticks:

~~~text
```[اطلاعات بیشتر]این متن در صفحه پیش‌نمایش نمایش داده می‌شود.```
~~~

Only the title appears in the chat message. Touching it opens a preview containing the full content. This is the feature commonly described as نمایش آنی.

## Checklists are conditional

The syntax is:
~~~text
- [ ] انجام‌نشده
- [x] انجام‌شده
~~~

The user can change a checklist item only when checklist functionality is enabled for that message and the user has permission to edit the message. Do not use a checklist as a durable task database.

## What is not established

The cited formatting page does not establish native rendering for Markdown tables, Mermaid diagrams, arbitrary HTML, GitHub-flavored Markdown extensions or language-specific syntax highlighting.

Do not tell an agent these are supported. For tabular data, use concise text rows or a Mini App. For a diagram, render it externally and link to the image or use a Mini App.

## Example message

~~~text
سلام *دوست من* امیدوارم خوب باشید.

این یک متن _توضیحی_ با لینک [مستندات بله](https://docs.bale.ai) است.

کد نمونه:
```
sendMessage
```

```[اطلاعات بیشتر]این متن در صفحه پیش‌نمایش نمایش داده می‌شود.```

موارد زیر را بررسی کنید:
- [ ] مستندات را بخوانید
- [x] پیام را ارسال کنید

برای ارسال دستور به بازو، [شروع](send:/start) را لمس کنید.
~~~

## Security and escaping

User-provided content may contain formatting markers or links. Escape, sanitize or encode untrusted content before composing a message. Do not let user text inject a misleading link, command or mention.

## Verification

Render examples in the actual Bale clients in scope. Check emphasis, link behavior, code blocks, preview behavior and checklist interactivity separately. Some additional formats depend on message type, chat type or client version.

## Source

- https://docs.bale.ai/markdown-formatting
