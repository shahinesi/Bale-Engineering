---
name: bale-links
description: Use when generating, validating or choosing Bale ble.ir deep links for users, bots, messages, group invitations, bot start parameters, Mini Apps or sharing.
---

# Bale Deep Links

## Choose the link by destination

| Goal | Link family |
|---|---|
| Open a public user, bot, group or channel | Username link |
| Open a particular message | Message link |
| Preview and join a group or channel | Invitation link |
| Open a bot conversation and send /start | start link |
| Open a Mini App and pass launch context | startapp link |
| Open the share chooser with a URL and text | share link |

## Important distinctions
- start opens the bot conversation and sends /start with an optional parameter.
- startapp opens the Mini App directly; the user need not have started a bot conversation.
- start_param is Mini App launch context, not authorization.
- mode can be fullscreen or compact where documented.
- URL-encode query parameter values.
- Do not construct message links manually. Bale says to copy them from the message menu because message_id and date identify the message.

## Examples
~~~text
https://ble.ir/example_bot
https://ble.ir/example_bot?start=campaign_42
https://ble.ir/example_bot?startapp=order_1024&mode=compact
https://ble.ir/join/INVITE_TOKEN
https://ble.ir/share?url=https%3A%2F%2Fexample.com&text=سلام
~~~

Use the documented username format without @ where the link grammar requires it.

## Verification
Open each link in a Bale client and verify destination, parameter delivery and behavior for users who have not started the bot.

## Reference
- ../../knowledge/links/deep-links.md
- https://docs.bale.ai/links
