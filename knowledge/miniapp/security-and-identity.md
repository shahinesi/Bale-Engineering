# Bale Mini App: identity and trust boundaries

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/miniapp

## Treat the browser as untrusted

The Mini App runs in a client controlled by the user. URL parameters, JavaScript state, local storage and initDataUnsafe can be modified or replayed. The backend must establish identity from the raw initData string and verify its signature.

## Verify raw initData on the server

Bale documents the following procedure:
1. Receive the raw URL-encoded string from Bale.WebApp.initData.
2. Parse the key/value fields.
3. Exclude the hash field.
4. Sort the remaining fields alphabetically.
5. Join key=value lines using newline characters to form data_check_string.
6. Derive the secret key using HMAC-SHA-256 with the fixed string WebAppData and the bot token.
7. Calculate HMAC-SHA-256 over data_check_string using the derived secret key.
8. Compare the hexadecimal result with the received hash.

The Node.js interpretation below follows the standard HMAC key/message ordering: WebAppData is the HMAC key and the bot token is the message for the first HMAC. Keep the bot token only on the server.

~~~typescript
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyBaleInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 300
): boolean {
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  const authDateRaw = params.get("auth_date");

  if (!receivedHash || !/^[a-f0-9]{64}$/i.test(receivedHash)) return false;
  if (!authDateRaw || !/^\d+$/.test(authDateRaw)) return false;

  const authDate = Number(authDateRaw);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(authDate)) return false;
  if (authDate > now + 30 || now - authDate > maxAgeSeconds) return false;

  const dataCheckString = [...params.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => key + "=" + value)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const expectedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest();

  const actualHash = Buffer.from(receivedHash, "hex");
  return actualHash.length === expectedHash.length &&
    timingSafeEqual(actualHash, expectedHash);
}
~~~

This is a reference implementation to adapt and test, not a substitute for a security review. The five-minute age is an application policy default in this example, not a Bale-mandated limit. Choose the acceptable age for the application and account for clock skew.

## After signature verification

Only after successful verification:
- Parse the verified user data.
- Resolve the Bale user ID to an application account.
- Create or refresh an application session.
- Apply authorization to every backend request.
- Consider one-time/replay controls for sensitive flows.

A valid signature proves the data was issued by Bale; it does not automatically grant access to every application resource.

## requestContact is a separate trust boundary

Bale explicitly warns that the phone number delivered to the Mini App requestContact callback is for UI and user experience. It must not be used by itself for authentication, access grants or sensitive operations.

After the user shares a contact, Bale sends a contact update to the bot. The server must check:

~~~text
contact.user_id == from.id
~~~

Only after this condition is true should the server store or use contact.phone_number for verification or sensitive actions.

## Required security tests

- Valid signature is accepted.
- Modified hash is rejected.
- Missing hash is rejected.
- Invalid hex hash is rejected.
- Stale auth_date is rejected.
- Future auth_date outside the permitted clock skew is rejected.
- A valid Mini App identity without application authorization is denied.
- requestContact callback data alone does not mark a phone number as verified.
- A contact update with a different user_id is rejected.
- Bot tokens never reach the browser or logs.

## Source

- https://docs.bale.ai/miniapp (WebApp, WebAppInitData and validation of received data)
