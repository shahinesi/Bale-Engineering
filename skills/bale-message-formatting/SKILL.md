---
name: bale-message-formatting
description: Use when composing, formatting or validating text sent through Bale messages, including bold, italic, links, code, short text, checklists, mentions and Markdown compatibility assumptions.
---

# Bale Message Formatting

## Core rule
Bale's message formatting is Markdown-like but is not standard Markdown. Use exact documented syntax and test the result in a real Bale client.

## Supported patterns documented by Bale
- Bold uses one asterisk at each end: *متن برجسته*.
- Italic uses one underscore at each end: _متن کج_.
- Links use [عنوان](https://example.com) with no space between the closing bracket and opening parenthesis.
- Code uses triple backticks.
- Short text opens a longer preview; follow the exact syntax in the knowledge reference and verify delimiter behavior.
- Mentions can use @username.
- Hashtags use #موضوع.
- Bot commands start with /.
- Checklists use - [ ] and - [x] when enabled for that message and editable by the user.
- Internal user mentions can use [نام](uid:12345).
- A send action can use [شروع](send:/start) in supported bot messages and groups.

## Avoid standard Markdown assumptions
The docs explicitly state that double-asterisk bold and double-underscore italic are not supported. Do not assume Markdown tables, Mermaid, HTML or arbitrary extensions render.

For dense tables, dashboards, multi-column layouts or diagrams, choose a Mini App or concise plain text. Link to a rendered diagram rather than assuming Mermaid source is rendered in chat.

## Composition workflow
1. Identify target client and message type.
2. Choose only documented formatting.
3. Sanitize user-provided text that could be interpreted as formatting or a link.
4. Keep long messages scannable.
5. Prefer a Mini App for complex interaction.
6. Verify on the clients in scope.

## Example
~~~text
*وضعیت سفارش*
شماره: ۱۰۲۴
وضعیت: _در حال آماده‌سازی_

[مشاهده سفارش](https://ble.ir/example_bot?startapp=order_1024)
~~~

## Verification
Check rendered emphasis, link target, code readability, preview behavior and checklist interactivity in the actual Bale client.

## References
- ../../knowledge/messaging/markdown-formatting.md
- https://docs.bale.ai/markdown-formatting
