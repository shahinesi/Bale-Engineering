# Bale deep links

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/links

## Link families

### Public username

~~~text
https://ble.ir/<username>
~~~

Opens the public user, bot, group or channel associated with the username. The documented username is written without @ and contains Latin letters, digits and underscore.

### Message link

~~~text
https://ble.ir/<username>/<message_id>/<date>
https://ble.ir/post/<group_id>/<message_id>/<date>
~~~

The first form is for public-username groups/channels. The second is for groups/channels without a public username and only opens for their members.

Do not construct these links manually. Bale says message_id and date together identify the message and instructs developers to copy the link from the message menu in the Bale client.

### Invitation

~~~text
https://ble.ir/join/<token>
~~~

Shows a group or channel preview and allows the user to join. Bot API methods createChatInviteLink, exportChatInviteLink and revokeChatInviteLink are documented for managing invite links.

### Bot start

~~~text
https://ble.ir/<bot_username>?start=<parameter>
~~~

Opens the bot conversation and sends /start with the optional parameter. Use it for bot-side campaign attribution, referral entry or selecting a conversational flow.

### Mini App start

~~~text
https://ble.ir/<bot_username>?startapp
https://ble.ir/<bot_username>?startapp=<start_param>
https://ble.ir/<bot_username>?startapp=<start_param>&mode=<mode>
~~~

Opens the Mini App directly. start_param is available as tgWebAppStartParam and in initData.start_param. mode is documented as fullscreen or compact.

### Share

~~~text
https://ble.ir/share?url=<url>&text=<text>
~~~

Opens the user's conversation list and pre-fills a share message. The user can edit it; the message is not sent without user confirmation.

## URL encoding

Encode query parameter values. Never concatenate raw user-controlled values into a deep link. Use URL and URLSearchParams where possible.

## Decision guide

- Need the bot to receive a command? Use start.
- Need the Mini App to open directly with context? Use startapp.
- Need to invite to a private group/channel? Use the invite token.
- Need a share chooser? Use the share link.
- Need a specific historical message? Copy the link from Bale instead of synthesizing it.

## Verification

Open links in a Bale client. Verify the destination, parameter decoding, first-time user behavior and Mini App entry point.

## Source

- https://docs.bale.ai/links
