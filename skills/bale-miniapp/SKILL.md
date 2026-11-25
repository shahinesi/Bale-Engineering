---
name: bale-miniapp
description: Use when building a Bale Mini App, choosing an entry point, integrating the WebApp SDK, handling initData, theme, navigation, contact requests or Mini App security.
---

# Bale Mini App Engineering

## When to use
Choose a Mini App when a chat flow becomes too dense: multi-field forms, searchable catalogues, dashboards, order management, complex filters or multi-step visual tasks.

Keep simple commands and short exchanges in the Bot API. Use a hybrid flow when a bot message is a useful entry point into a richer Mini App.

## Entry-point decisions
Bale documents:
- Main Mini App configured for the bot.
- Direct Mini App links with a registered short name.
- Bot menu button.
- Inline keyboard and reply keyboard buttons using web_app.

Do not conflate start and startapp:
- start opens the bot conversation and sends /start with an optional parameter.
- startapp opens the Mini App and passes its optional parameter as tgWebAppStartParam and initData.start_param.

Use start for bot-side referral or conversational entry. Use startapp for Mini App context such as an order or campaign. Both values are untrusted input.

## SDK integration
Load the documented script before other scripts in the document head:

~~~html
<script src="https://tapi.bale.ai/miniapp.js"></script>
~~~

This creates window.Bale.WebApp. Check SDK version and method support; older clients may do nothing for newer methods.

## UX rules
- Design mobile-first and responsive.
- Respect the light/dark theme and ThemeParams.
- Aim for smooth animation; the guide recommends 60 FPS as an ideal target.
- The bot input-bar button label has a documented 20-character maximum on Android.
- Use in-memory routing for correct BackButton behavior in the Bale Web client.
- Haptic feedback is supplementary, never the only success/error signal.

## Security model
The browser is not an authority. Verify raw initData on the server before trusting the user object. Never authorize from initDataUnsafe, URL parameters, local storage or frontend state.

Use the security reference for HMAC-SHA-256 verification, auth_date freshness and the requestContact caveat.

## Implementation workflow
1. Define the Mini App job and entry point.
2. Decide which context arrives through startapp and which data must be fetched.
3. Load the SDK before application scripts.
4. Build responsive, theme-aware screens.
5. Send raw initData to the backend.
6. Verify signature and freshness on the server.
7. Create an application session using verified identity.
8. Enforce authorization on every sensitive backend operation.
9. Handle old clients and unavailable SDK methods.
10. Test in supported Bale clients and browsers.

## Do not
- Trust initDataUnsafe as proof of identity.
- Trust only the Mini App requestContact callback for a verified phone number.
- Assume browser history routing works with BackButton.
- Treat start_param as an authorization token.
- Assume every Telegram WebApp method exists in Bale.

## Verification
Prove valid initData is accepted, modified hash rejected, stale auth_date rejected, unauthorized users denied, responsive layouts work and navigation behaves in Bale.

## References
- ../../knowledge/miniapp/overview-and-navigation.md
- ../../knowledge/miniapp/security-and-identity.md
- https://docs.bale.ai/miniapp
- https://docs.bale.ai/links
