---
name: bale-wallet-payments
description: Use when implementing Bale wallet invoices, Mini App invoice links, pre-checkout validation, payment confirmation, transaction inquiry or payment reconciliation.
---

# Bale Wallet Payments Engineering

## When to use

Use this skill when a Bale bot or Mini App needs to request and receive wallet payments. The current documented bot payment flow is wallet-based; the previous card-to-card payment request flow has been removed.

## Critical payment lifecycle

1. Create a pending application order.
2. Generate an application-owned invoice payload and store the expected amount and currency.
3. Send an invoice using sendInvoice, or create an invoice link for a Mini App.
4. Receive pre_checkout_query.
5. Validate order ownership, status, amount, inventory and expiry.
6. Call answerPreCheckoutQuery within 10 seconds.
7. Wait for SuccessfulPayment.
8. Validate invoice_payload and payment details.
9. Persist the payment idempotently.
10. Fulfil the order only after confirmed payment.
11. Reconcile uncertain cases with inquireTransaction where appropriate.

## Never treat pre-checkout as payment success

pre_checkout_query is a request to approve or reject the payment before finalization. It is not proof that money was received.

Only a SuccessfulPayment update proves the payment succeeded for the bot flow documented by Bale. Never fulfil an order from the pre-checkout event alone.

## Important documented constraints

- sendInvoice title: 1–32 characters.
- sendInvoice description: 1–255 characters.
- payload: 1–128 bytes, not shown to the user and returned in SuccessfulPayment.
- LabeledPrice.amount is an integer amount in IRR (rials).
- answerPreCheckoutQuery must be answered within 10 seconds or the payment is cancelled.
- createInvoiceLink creates an invoice identifier for Mini Apps.
- inquireTransaction returns pending, paid, failed or rejected.
- inquireTransaction is not included in standard Telegram bot libraries; direct HTTP may be required.

## Security and reliability

- Never put secrets or personal data in invoice_payload.
- Use an opaque, unguessable correlation identifier and resolve it server-side.
- Re-check amount, currency, ownership and order state during pre-checkout.
- Use a unique database constraint for payment provider IDs and invoice payloads.
- Make duplicate SuccessfulPayment updates harmless.
- Do not fulfil twice if the same payment event is replayed.
- Record a ledger entry and order transition in one transaction where possible.
- Reconcile uncertain provider states; do not guess from a timeout.

## Example decision

- Chat invoice: use sendInvoice.
- Mini App checkout: use createInvoiceLink and the documented openInvoice flow.
- Payment event: handle pre_checkout_query, then wait for SuccessfulPayment.
- Uncertain transaction: use inquireTransaction with transaction_id.

## Verification

Test valid and invalid payloads, amount mismatch, expired order, out-of-stock item, pre-checkout timeout, duplicate SuccessfulPayment, delayed payment update, and all transaction statuses.

## Reference

- ../../knowledge/bot-api/payments-and-wallet.md
- ../../knowledge/bot-api/methods-catalog.md
- https://docs.bale.ai/
