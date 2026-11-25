# Bale Bot API: wallet invoices and payment verification

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/

## Current payment model

Bale's Bot API supports wallet-payment invoices. The documentation says the older card-to-card payment request flow has been removed; wallet payment is the current supported way for bots to request and receive money.

The bot needs a wallet payment provider_token created for that bot through the official bot management flow. A test token is documented for testing and does not transfer real money.

## sendInvoice

Use sendInvoice to send a payment request in a chat.

Important fields:
- chat_id: target chat.
- title: 1–32 characters.
- description: 1–255 characters.
- payload: application-defined value, 1–128 bytes, not displayed to the user and returned after successful payment.
- provider_token: wallet payment token for the bot.
- prices: JSON array of LabeledPrice entries.
- LabeledPrice.amount is an integer amount in Iranian rials (IRR).

Use payload as a correlation key for your internal order or invoice. Do not put secrets or personal data in it.

## createInvoiceLink

Use createInvoiceLink to create a wallet invoice identifier for a Mini App. The Mini App can then open the invoice using the documented openInvoice SDK flow.

Do not treat the invoice link as proof of payment. It is only the payment entry point.

## Pre-checkout is not payment success

After the user confirms payment, Bale sends a pre_checkout_query before finalizing the payment.

The bot must answer using answerPreCheckoutQuery within 10 seconds. If the response is not received in time, the payment is cancelled.

The bot may set ok=true only after checking the order, price, availability and business constraints. If it rejects the payment, return ok=false with a user-readable error_message.

**Critical:** receiving pre_checkout_query does not mean the payment is complete. Fulfil the order only after receiving a message containing SuccessfulPayment and validating its payload against the expected order.

## Transaction inquiry

Bale documents inquireTransaction for checking a transaction by transaction_id. It returns a Transaction with:
- id
- status: pending, paid, failed or rejected
- userID
- amount in rials
- createdAt

The docs note that inquireTransaction is not present in standard Telegram bot libraries and may require a direct HTTP request.

## Engineering workflow

1. Create a pending order and unique invoice payload in the application database.
2. Create/send the invoice.
3. Validate pre_checkout_query against the authoritative order and price.
4. Respond within 10 seconds.
5. Wait for SuccessfulPayment before fulfilment.
6. Persist the payment event idempotently.
7. Reconcile uncertain states with inquireTransaction when available.
8. Keep financial ledger entries immutable and auditable.

## Failure cases to test

- Invalid or expired order payload.
- Price mismatch.
- Product becomes unavailable before checkout.
- Pre-checkout handler exceeds 10 seconds.
- Duplicate SuccessfulPayment update.
- Payment notification arrives after the user closes the Mini App.
- Transaction inquiry reports pending, failed or rejected.
- A payment event is received for an already fulfilled order.

## Sources

- https://docs.bale.ai/ (sendInvoice, createInvoiceLink, answerPreCheckoutQuery, PreCheckoutQuery, SuccessfulPayment, inquireTransaction)
