import { describe, expect, it } from "vitest";
import {
  validateBusinessApiRequest,
  validateInlineKeyboard,
  validateSafirPayload
} from "../src/validators.js";

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
      inline_keyboard: [[{ text: "Continue", callback_data: "سلام".repeat(9) }]]
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
  it("accepts documented phone formats with and without plus", () => {
    const noPlus = validateSafirPayload({
      request_id: "send-1",
      bot_id: 123456789,
      phone_number: "989196111003",
      message_data: { message: { text: "سلام" } }
    });
    const withPlus = validateSafirPayload({
      request_id: "send-2",
      bot_id: 123456789,
      phone_number: "+989196111003",
      message_data: { message: { text: "سلام" } }
    });

    expect(noPlus.valid).toBe(true);
    expect(withPlus.valid).toBe(true);
  });

  it("rejects phone numbers with separators, wrong prefix or wrong digit count", () => {
    const candidates = ["+98 919 611 1003", "09196111003", "98919611100"];
    const results = candidates.map(phone_number => validateSafirPayload({
      request_id: "test-1",
      bot_id: 123456789,
      phone_number,
      message_data: { message: { text: "سلام" } }
    }));

    expect(results.every(result => !result.valid)).toBe(true);
  });

  it("warns when request_id is missing", () => {
    const result = validateSafirPayload({
      bot_id: 123456789,
      phone_number: "989196111003",
      message_data: { message: { text: "سلام" } }
    });

    expect(result.valid).toBe(true);
    expect(result.issues.some(item => item.path === "request_id" && item.severity === "warning")).toBe(true);
  });

  it("rejects non-numeric OTP values", () => {
    const result = validateSafirPayload({
      request_id: "otp-1",
      bot_id: 123456789,
      phone_number: "989196111003",
      message_data: { otp_message: { otp: "AB1234" } }
    });

    expect(result.valid).toBe(false);
  });

  it("accepts a template payload but warns that its field names need approval", () => {
    const result = validateSafirPayload({
      request_id: "template-1",
      bot_id: 123456789,
      phone_number: "989196111003",
      message_data: {
        template_message: {
          template_id: "approved-template",
          text_fields: { name: "Test", credit: "50000" }
        }
      }
    });

    expect(result.valid).toBe(true);
    expect(result.issues.some(item => item.path === "message_data.template_message" && item.severity === "warning")).toBe(true);
  });

  it("warns when Bot API-only callback fields are used in Safir buttons", () => {
    const result = validateSafirPayload({
      request_id: "safir-1",
      bot_id: 123456789,
      phone_number: "989196111003",
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

describe("validateBusinessApiRequest", () => {
  it("accepts a supported private-chat text message", () => {
    const result = validateBusinessApiRequest(
      "sendMessage",
      { chat_id: 123456789, text: "گزارش آماده است." },
      "private"
    );

    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("rejects a non-private destination", () => {
    const result = validateBusinessApiRequest(
      "sendMessage",
      { chat_id: -100123, text: "Notification" },
      "group"
    );

    expect(result.valid).toBe(false);
    expect(result.issues.some(item => item.path === "chat_type")).toBe(true);
  });

  it("rejects methods outside the documented allowlist", () => {
    const result = validateBusinessApiRequest(
      "copyMessage",
      { chat_id: 123456789 },
      "private"
    );

    expect(result.valid).toBe(false);
    expect(result.issues.some(item => item.path === "method")).toBe(true);
  });

  it("rejects URL media because Business API supports file_id only", () => {
    const result = validateBusinessApiRequest(
      "sendPhoto",
      { chat_id: 123456789, photo: "https://example.com/photo.jpg" },
      "private"
    );

    expect(result.valid).toBe(false);
    expect(result.issues.some(item => item.path === "payload.photo")).toBe(true);
  });

  it("warns when private chat type was not supplied", () => {
    const result = validateBusinessApiRequest(
      "sendMessage",
      { chat_id: 123456789, text: "Notification" }
    );

    expect(result.valid).toBe(true);
    expect(result.issues.some(item => item.severity === "warning")).toBe(true);
  });
});
