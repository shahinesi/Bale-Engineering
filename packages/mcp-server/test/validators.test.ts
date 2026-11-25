import { describe, expect, it } from "vitest";
import { validateInlineKeyboard, validateSafirPayload } from "../src/validators.js";

describe("validateInlineKeyboard", () => {
  it("accepts success and danger actions plus a disabled button", () => {
    const result = validateInlineKeyboard({
      inline_keyboard: [
        [
          { text: "تأیید", callback_data: "confirm", style: "success" },
          { text: "لغو", callback_data: "cancel", style: "danger" }
        ],
        [{ text: "ظرفیت تکمیل است", disabled: {} }]
      ]
    });

    expect(result.valid).toBe(true);
    expect(result.issues.some(item => item.severity === "warning")).toBe(true);
  });

  it("rejects unsupported style values", () => {
    const result = validateInlineKeyboard({
      inline_keyboard: [[{ text: "Continue", callback_data: "next", style: "green" }]]
    });

    expect(result.valid).toBe(false);
    expect(result.issues.some(item => item.path.endsWith(".style"))).toBe(true);
  });

  it("counts callback_data as UTF-8 bytes", () => {
    const result = validateInlineKeyboard({
      inline_keyboard: [[{ text: "Continue", callback_data: "سلام".repeat(6) }]]
    });

    expect(result.valid).toBe(false);
    expect(result.issues.some(item => item.path.endsWith(".callback_data"))).toBe(true);
  });

  it("requires exactly one inline action", () => {
    const result = validateInlineKeyboard({
      inline_keyboard: [[{ text: "Open", url: "https://example.com", callback_data: "open" }]]
    });

    expect(result.valid).toBe(false);
  });

  it("validates copy_text as an object with 1 to 256 characters", () => {
    const accepted = validateInlineKeyboard({
      inline_keyboard: [[{ text: "Copy", copy_text: { text: "شماره سفارش ۱۲۳" } }]]
    });
    const rejected = validateInlineKeyboard({
      inline_keyboard: [[{ text: "Copy", copy_text: { text: "" } }]]
    });

    expect(accepted.valid).toBe(true);
    expect(rejected.valid).toBe(false);
  });

  it("requires HTTPS for Mini App buttons", () => {
    const result = validateInlineKeyboard({
      inline_keyboard: [[{ text: "Open app", web_app: { url: "http://example.com" } }]]
    });

    expect(result.valid).toBe(false);
  });
});

describe("validateSafirPayload", () => {
  it("accepts a documented text-message shape and warns when request_id is missing", () => {
    const result = validateSafirPayload({
      bot_id: 123456789,
      phone_number: "989000000000",
      message_data: { message: { text: "سلام" } }
    });

    expect(result.valid).toBe(true);
    expect(result.issues.some(item => item.path === "request_id" && item.severity === "warning")).toBe(true);
  });

  it("rejects phone numbers with separators or a missing 98 prefix", () => {
    const result = validateSafirPayload({
      request_id: "test-1",
      bot_id: 123456789,
      phone_number: "+98 900 000 0000",
      message_data: { message: { text: "سلام" } }
    });

    expect(result.valid).toBe(false);
    expect(result.issues.some(item => item.path === "phone_number")).toBe(true);
  });

  it("rejects non-numeric OTP values", () => {
    const result = validateSafirPayload({
      request_id: "otp-1",
      bot_id: 123456789,
      phone_number: "989000000000",
      message_data: { otp_message: { otp: "AB1234" } }
    });

    expect(result.valid).toBe(false);
  });

  it("warns when Bot API-only callback fields are used in Safir buttons", () => {
    const result = validateSafirPayload({
      request_id: "safir-1",
      bot_id: 123456789,
      phone_number: "989000000000",
      message_data: {
        message: {
          text: "Open",
          reply_markup: {
            inline_keyboard: [[{ text: "Action", callback_data: "go" }]]
          }
        }
      }
    });

    expect(result.valid).toBe(false);
    expect(result.issues.some(item => item.message.includes("not listed in Safir"))).toBe(true);
  });
});
