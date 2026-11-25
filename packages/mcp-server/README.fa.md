<div dir="rtl" align="right">

<p align="left"><a href="README.md">English</a> · <strong>فارسی</strong></p>

# سرور MCP پروژه Bale Engineering

سرور MCP دسترسی استاندارد و فقط‌خواندنی به Skillها، دانش فنی و قالب‌های همین مخزن فراهم می‌کند.

## پیش‌نیازها

- Node.js نسخه ۲۰ یا بالاتر
- pnpm
- یک میزبان سازگار با MCP

## نصب و اجرا

از ریشه مخزن:

</div>

~~~bash
pnpm install
pnpm --filter @bale-engineering/mcp-server build
node packages/mcp-server/dist/index.js
~~~

<div dir="rtl" align="right">

ارتباط سرور از طریق STDIO است. خروجی استاندارد باید فقط برای پیام‌های پروتکل MCP استفاده شود؛ برای Debug از <code>console.log</code> استفاده نکنید.

## اتصال به Codex

</div>

~~~bash
codex mcp add bale-engineering -- node /absolute/path/Bale-Engineering/packages/mcp-server/dist/index.js
~~~

<div dir="rtl" align="right">

## اتصال به Claude Code

</div>

~~~bash
claude mcp add bale-engineering -- node /absolute/path/Bale-Engineering/packages/mcp-server/dist/index.js
~~~

<div dir="rtl" align="right">

## اتصال به Cursor

این تنظیم را در فایل پیکربندی MCP نسخه Cursor خود قرار دهید و مسیر را به مسیر واقعی پروژه تغییر دهید:

</div>

~~~json
{
  "mcpServers": {
    "bale-engineering": {
      "command": "node",
      "args": [
        "/absolute/path/Bale-Engineering/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
~~~

<div dir="rtl" align="right">

فرمت تنظیمات Agentها ممکن است تغییر کند؛ اگر دستور پذیرفته نشد، مستندات نسخه نصب‌شده را بررسی کنید.

## Promptها

- <code>bale-engineering</code>: شروع یک کار مهندسی با انتخاب پلتفرم، امنیت، مدیریت خطا و برنامه اعتبارسنجی.
- <code>bale-engineering-review</code>: بازبینی پیاده‌سازی بله با چک‌لیست کیفیت و امنیت.

## ابزارها

| ابزار | کاربرد |
|---|---|
| <code>bale_list_skills</code> | فهرست Skillها با امکان فیلتر |
| <code>bale_get_skill</code> | دریافت متن کامل یک Skill |
| <code>bale_get_reference</code> | دریافت یک مرجع فنی |
| <code>bale_search_knowledge</code> | جست‌وجوی کلیدواژه‌ای در دانش |
| <code>bale_route_task</code> | پیشنهاد Skill با قواعد کلیدواژه‌ای |
| <code>bale_validate_inline_keyboard</code> | اعتبارسنجی Inline Keyboard |
| <code>bale_validate_safir_payload</code> | اعتبارسنجی Payload سفیر |
| <code>bale_validate_business_api_request</code> | اعتبارسنجی ساختار درخواست Business API |

## Resourceها

- <code>bale://catalog</code>
- <code>bale://skills/{id}</code>
- <code>bale://knowledge/{id}</code>
- <code>bale://sources</code>

## مرز امنیتی

این سرور:
- API بله یا سفیر را فراخوانی نمی‌کند.
- پیام ارسال نمی‌کند و عملیات واقعی انجام نمی‌دهد.
- توکن Bot یا کلید Safir دریافت نمی‌کند.
- فقط فایل‌های تعریف‌شده در کاتالوگ مجاز را می‌خواند.
- جست‌وجوی کلیدواژه‌ای و اعتبارسنجی محلی انجام می‌دهد.

Validator دکمه، مجوزدهی برنامه را بررسی نمی‌کند. Validator مربوط به Business API نمی‌تواند نوع واقعی چت را بدون متادیتای معتبر اثبات کند. Validator سفیر نیز پذیرش درخواست توسط سرویس واقعی را تضمین نمی‌کند. مسیریابی کلیدواژه‌ای، استدلال معنایی نیست.

</div>
