export type ValidationIssue = {
  severity: "error" | "warning";
  path: string;
  message: string;
};

type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

const styles = new Set(["primary", "success", "danger"]);
const inlineActions = ["url", "callback_data", "web_app", "copy_text"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function issue(
  issues: ValidationIssue[],
  severity: ValidationIssue["severity"],
  path: string,
  message: string
) {
  issues.push({ severity, path, message });
}

export function validateInlineKeyboard(markup: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!isRecord(markup) || !Array.isArray(markup.inline_keyboard)) {
    return {
      valid: false,
      issues: [{ severity: "error", path: "inline_keyboard", message: "Expected an object with an inline_keyboard array." }]
    };
  }

  if (markup.inline_keyboard.length === 0) {
    issue(issues, "error", "inline_keyboard", "At least one row is required.");
  }

  markup.inline_keyboard.forEach((row, rowIndex) => {
    const rowPath = "inline_keyboard[" + rowIndex + "]";
    if (!Array.isArray(row) || row.length === 0) {
      issue(issues, "error", rowPath, "Each keyboard row must be a non-empty array.");
      return;
    }

    row.forEach((button, buttonIndex) => {
      const path = rowPath + "[" + buttonIndex + "]";
      if (!isRecord(button)) {
        issue(issues, "error", path, "Each inline button must be an object.");
        return;
      }

      if (typeof button.text !== "string" || button.text.trim().length === 0) {
        issue(issues, "error", path + ".text", "Button text must be a non-empty string.");
      }

      const actions = inlineActions.filter(key => button[key] !== undefined && button[key] !== null);
      const disabled = button.disabled !== undefined;

      if (button.style !== undefined && (typeof button.style !== "string" || !styles.has(button.style))) {
        issue(issues, "error", path + ".style", "style must be primary, success or danger.");
      }

      if (disabled) {
        if (!isRecord(button.disabled) || Object.keys(button.disabled).length !== 0) {
          issue(issues, "error", path + ".disabled", "disabled must be an empty object.");
        }
        if (actions.length > 0) {
          issue(issues, "error", path, "A disabled button must not define an active action.");
        }
        issue(issues, "warning", path, "disabled is a UI state, not a server-side authorization rule.");
        return;
      }

      if (actions.length !== 1) {
        issue(issues, "error", path, "Exactly one of url, callback_data, web_app or copy_text must be supplied.");
      }

      if (button.callback_data !== undefined) {
        if (typeof button.callback_data !== "string") {
          issue(issues, "error", path + ".callback_data", "callback_data must be a string.");
        } else {
          const bytes = Buffer.byteLength(button.callback_data, "utf8");
          if (bytes < 1 || bytes > 64) {
            issue(issues, "error", path + ".callback_data", "callback_data must contain 1–64 UTF-8 bytes; received " + bytes + ".");
          }
        }
      }

      if (button.copy_text !== undefined) {
        if (!isRecord(button.copy_text) || typeof button.copy_text.text !== "string") {
          issue(issues, "error", path + ".copy_text", "copy_text must be an object with a text string.");
        } else {
          const length = Array.from(button.copy_text.text).length;
          if (length < 1 || length > 256) {
            issue(issues, "error", path + ".copy_text.text", "copy_text.text must contain 1–256 characters.");
          }
        }
      }

      for (const key of ["url", "web_app"] as const) {
        const candidate = button[key];
        if (candidate === undefined) continue;
        const value = key === "web_app" && isRecord(candidate) ? candidate.url : candidate;
        if (typeof value !== "string") {
          issue(issues, "error", path + "." + key, "Expected a URL string" + (key === "web_app" ? " at web_app.url." : "."));
          continue;
        }
        try {
          const parsed = new URL(value);
          if (key === "web_app" && parsed.protocol !== "https:") {
            issue(issues, "error", path + ".web_app.url", "Bale documents WebAppInfo.url as HTTPS.");
          } else if (key === "url" && parsed.protocol !== "https:" && parsed.protocol !== "http:") {
            issue(issues, "error", path + ".url", "Only HTTP(S) URLs are accepted by this validator.");
          } else if (key === "url" && parsed.protocol !== "https:") {
            issue(issues, "warning", path + ".url", "HTTPS is recommended for user-facing links.");
          }
        } catch {
          issue(issues, "error", path + "." + key, "Expected an absolute URL.");
        }
      }
    });
  });

  return { valid: !issues.some(item => item.severity === "error"), issues };
}

export function validateSafirPayload(payload: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!isRecord(payload)) {
    return {
      valid: false,
      issues: [{ severity: "error", path: "$", message: "Expected a JSON object." }]
    };
  }

  if (payload.request_id === undefined || payload.request_id === null || (typeof payload.request_id === "string" && payload.request_id.trim() === "")) {
    issue(issues, "warning", "request_id", "Safir documents request_id as optional, but recommends it to prevent duplicate delivery.");
  } else if (typeof payload.request_id !== "string") {
    issue(issues, "error", "request_id", "request_id must be a string.");
  }

  if (!Number.isInteger(payload.bot_id) || Number(payload.bot_id) <= 0) {
    issue(issues, "error", "bot_id", "bot_id must be a positive integer.");
  }

  if (typeof payload.phone_number !== "string" || !/^98[0-9]+$/.test(payload.phone_number)) {
    issue(issues, "error", "phone_number", "phone_number must start with 98 and contain digits only, without extra characters.");
  }

  if (!isRecord(payload.message_data)) {
    issue(issues, "error", "message_data", "message_data must be an object.");
    return { valid: false, issues };
  }

  const messageData = payload.message_data;
  const payloadKinds = ["message", "otp_message", "template_message"].filter(key => messageData[key] !== undefined);

  if (payloadKinds.length === 0) {
    issue(issues, "error", "message_data", "Provide a message, otp_message or template_message payload.");
  }
  if (payloadKinds.length > 1) {
    issue(issues, "warning", "message_data", "Multiple message payload types were supplied; confirm the intended Safir contract.");
  }

  if (messageData.is_secure !== undefined && typeof messageData.is_secure !== "boolean") {
    issue(issues, "error", "message_data.is_secure", "is_secure must be a boolean.");
  }

  if (messageData.otp_message !== undefined) {
    if (!isRecord(messageData.otp_message) || typeof messageData.otp_message.otp !== "string" || !/^[0-9]+$/.test(messageData.otp_message.otp)) {
      issue(issues, "error", "message_data.otp_message.otp", "The documented OTP payload requires a numeric string.");
    }
  }

  if (messageData.message !== undefined) {
    if (!isRecord(messageData.message)) {
      issue(issues, "error", "message_data.message", "message must be an object.");
    } else {
      const message = messageData.message;
      if (!["text", "file_id", "copy_text", "reply_markup"].some(key => message[key] !== undefined)) {
        issue(issues, "error", "message_data.message", "Provide at least one documented message field.");
      }
      if (message.reply_markup !== undefined) {
        if (!isRecord(message.reply_markup) || !Array.isArray(message.reply_markup.inline_keyboard)) {
          issue(issues, "error", "message_data.message.reply_markup", "Safir reply_markup must contain an inline_keyboard array.");
        } else {
          message.reply_markup.inline_keyboard.forEach((row, rowIndex) => {
            if (!Array.isArray(row)) {
              issue(issues, "error", "message_data.message.reply_markup.inline_keyboard[" + rowIndex + "]", "Each row must be an array.");
              return;
            }
            row.forEach((button, buttonIndex) => {
              const path = "message_data.message.reply_markup.inline_keyboard[" + rowIndex + "][" + buttonIndex + "]";
              if (!isRecord(button) || typeof button.text !== "string" || button.text.trim() === "") {
                issue(issues, "error", path + ".text", "Safir inline buttons require non-empty text.");
                return;
              }
              const actions = ["url", "web_app", "copy_text"].filter(key => button[key] !== undefined);
              if (actions.length === 0) {
                issue(issues, "error", path, "Safir documents at least one of url, web_app or copy_text.");
              }
              if (button.callback_data !== undefined || button.style !== undefined || button.disabled !== undefined) {
                issue(issues, "warning", path, "callback_data, style and disabled are not listed in Safir's InlineKeyboardButton schema; do not assume Bot API parity.");
              }
            });
          });
        }
      }
    }
  }

  if (messageData.template_message !== undefined) {
    issue(issues, "warning", "message_data.template_message", "The official page shows template_message examples but omits it from the MessageData summary table; verify current provider behavior.");
    if (!isRecord(messageData.template_message) || typeof messageData.template_message.template_id !== "string") {
      issue(issues, "error", "message_data.template_message", "Expected template_id as shown in the official example.");
    }
  }

  return { valid: !issues.some(item => item.severity === "error"), issues };
}
