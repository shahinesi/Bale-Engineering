# Bale message formatting: supported syntax and limits

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/markdown-formatting

## Important distinction

Bale says message text is formatted using Markdown, but its formatting differs from standard Markdown. Use the syntax below rather than assuming GitHub-flavored Markdown or HTML support.

## Documented syntax

| Feature | Bale syntax | Notes |
|---|---|---|
| Bold | *متن برجسته* | One asterisk at each end; double asterisks are not supported |
| Italic | _متن کج_ | One underscore at each end; double underscores are not supported |
| Link | [عنوان](https://docs.bale.ai) | No space between ] and ( |
| Code | Triple backticks | Use for source code |
| Mention | @username | Requires a valid public username |
| Hashtag | #موضوع | No spaces in the tag |
| Bot command | /command | Recognized in bot and group messages |
| Checklist | - [ ] / - [x] | Interactive only when enabled for that message and the user can edit it |
| Internal user mention | [نام](uid:12345) | Uses a Bale user ID |
| Send value to bot | [شروع](send:/start) | Documented for bot messages and groups where the bot is active |

## Short text preview

The official page documents a short-text format where a title is shown in the message and the full content opens in a preview when the title is touched. The source describes the title in square brackets and the full content inside a triple-backtick block. Because the rendered documentation's delimiter notation is easy to misread, verify the exact literal delimiters in a real client before generating this format automatically.

## What is not established

The cited formatting page does not establish native rendering for Markdown tables, Mermaid diagrams, arbitrary HTML, GitHub-flavored Markdown extensions or language-specific syntax highlighting.

Do not tell an agent these are supported. For tabular data, use concise text rows or a Mini App. For a diagram, render it externally and link to the image or use a Mini App.

## Example message

~~~text
*وضعیت سفارش*
شماره: ۱۰۲۴
وضعیت: _در حال آماده‌سازی_

[مشاهده سفارش](https://ble.ir/example_bot?startapp=order_1024)
~~~

## Security and escaping

User-provided content may contain formatting markers or links. Escape, sanitize or encode untrusted content before composing a message. Do not let user text inject a misleading link, command or mention.

## Verification

Render examples in the actual Bale clients in scope. Check emphasis, link behavior, code blocks, preview behavior and checklist interactivity separately.

## Source

- https://docs.bale.ai/markdown-formatting
