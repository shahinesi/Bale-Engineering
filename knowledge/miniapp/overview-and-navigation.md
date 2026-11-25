# Bale Mini Apps: entry points, SDK and UX

**Source verified:** 2026-11-25  
**Official sources:** https://docs.bale.ai/miniapp and https://docs.bale.ai/links

## What a Mini App is

A Bale Mini App brings a web interface into the Bale client. It is appropriate for rich visual workflows that are awkward in a chat transcript.

## Entry points

Bale documents these access patterns:
- Main Mini App configured for the bot.
- Direct Mini App links with a registered short name.
- Bot menu button.
- Inline keyboard button with web_app.
- Reply keyboard button with web_app.

A main Mini App can be opened without the user first starting a conversation with the bot.

## start and startapp are different

| Parameter | Destination | What Bale does |
|---|---|---|
| start | Bot conversation | Opens the conversation and sends /start with an optional parameter |
| startapp | Mini App | Opens the Mini App and passes an optional parameter as tgWebAppStartParam and initData.start_param |

Use start for bot-side referral, command routing or conversational entry. Use startapp for Mini App launch context such as an order or campaign. Both values are untrusted input.

For compatibility with older Android and Web clients, the Mini App documentation says to include startapp in direct Mini App links, even when it has no value.

## SDK integration

The documentation says to include the following script before any other script in the document head:

~~~html
<script src="https://tapi.bale.ai/miniapp.js"></script>
~~~

This creates window.Bale.WebApp. The raw initData string is used for server verification. initDataUnsafe is convenient for display, but Bale warns not to use it before validation.

The SDK exposes methods and events for opening links, requesting contact, controlling BackButton and SettingsButton, home-screen shortcuts, popups and haptic feedback. Check the documented SDK version for every method; older clients may ignore methods they do not support.

## UX rules documented by Bale

- Use responsive, mobile-first design.
- Aim for smooth animation; 60 FPS is described as ideal.
- Reduce animation and visual effects on low-performance devices.
- Respect the device's light/dark theme.
- The bot input-bar button label is limited to 20 characters on Android.
- Use in-memory routing for correct BackButton behavior in the Bale Web client.
- Haptic feedback is supplementary and should not be the only feedback.

## Choosing Bot API or Mini App

Use a bot message for a short notification or action. Use a Mini App for data-dense or multi-step UI. A common hybrid design is a bot message with an inline web_app button that opens the exact Mini App task.

## Verification

Test:
- Main Mini App and direct link entry.
- start and startapp parameters separately.
- Older supported clients.
- Mobile layout, light and dark themes.
- BackButton navigation in Bale Web.
- SDK method availability and fallback UI.
- Server verification of raw initData before protected data is returned.

## Sources

- https://docs.bale.ai/miniapp
- https://docs.bale.ai/links
