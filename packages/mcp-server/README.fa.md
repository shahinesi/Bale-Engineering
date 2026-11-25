<div dir="rtl" align="right">

<p align="left"><a href="README.md">English</a> · <strong>فارسی</strong></p>

<h1>سرور MCP پروژه Bale Engineering</h1>
<p>یک MCP Server فقط‌خواندنی که Skillها، مراجع مبتنی بر مستندات، قالب‌ها و نمودارهای مهندسی بله را در اختیار Agentهای برنامه‌نویسی قرار می‌دهد.</p>

<h2>پیش‌نیازها</h2>
<ul><li>Node.js نسخه ۲۰ یا بالاتر</li><li>یک میزبان سازگار با MCP</li></ul>

<h2>اجرا از npm</h2>
<p>پس از انتشار عمومی نسخه اول:</p>
</div>

~~~bash
npx -y @bale-engineering/mcp-server
~~~

<div dir="rtl" align="right">
<p>این دستور MCP Server را به‌صورت محلی و با ارتباط <strong>STDIO</strong> اجرا می‌کند. پورت شبکه باز نمی‌کند و API بله یا سفیر را فراخوانی نمی‌کند.</p>

<h3>اتصال به Codex</h3>
</div>

~~~bash
codex mcp add bale-engineering -- npx -y @bale-engineering/mcp-server
~~~

<div dir="rtl" align="right"><h3>اتصال به Claude Code</h3></div>

~~~bash
claude mcp add bale-engineering -- npx -y @bale-engineering/mcp-server
~~~

<div dir="rtl" align="right">
<h3>اتصال به Cursor</h3>
<p>این تنظیم را در فایل پیکربندی MCP نسخه Cursor خود قرار دهید:</p>
</div>

~~~json
{
  "mcpServers": {
    "bale-engineering": {
      "command": "npx",
      "args": ["-y", "@bale-engineering/mcp-server"]
    }
  }
}
~~~

<div dir="rtl" align="right">
<h2>Build و اجرای نسخه سورس</h2>
<p>از ریشه مخزن:</p>
</div>

~~~bash
cd packages/mcp-server
npm install
npm run typecheck
npm test
npm run build
node dist/index.js
~~~

<div dir="rtl" align="right">
<h2>تست پکیج npm قبل از انتشار</h2>
</div>

~~~bash
npm run test:package
~~~

<div dir="rtl" align="right">
<p>این دستور فایل npm را می‌سازد، آن را در یک پروژه موقت نصب می‌کند، سرور نصب‌شده را با Client رسمی MCP از طریق STDIO اجرا می‌کند و ابزارها، یک مرجع فارسی، یک Resource و یک Prompt را آزمایش می‌کند.</p>

<h2>ابزارهای MCP</h2>
</div>

| ابزار | کاربرد |
|---|---|
| <code>bale_list_skills</code> | فهرست Skillها |
| <code>bale_get_skill</code> | دریافت Skill |
| <code>bale_get_reference</code> | دریافت مرجع فنی |
| <code>bale_search_knowledge</code> | جست‌وجوی دانش |
| <code>bale_route_task</code> | مسیریابی اولیه کار |
| <code>bale_validate_inline_keyboard</code> | اعتبارسنجی Keyboard |
| <code>bale_validate_safir_payload</code> | اعتبارسنجی Payload سفیر |
| <code>bale_validate_business_api_request</code> | اعتبارسنجی Business API |

<div dir="rtl" align="right">
<h2>مرز امنیتی</h2>
<ul>
<li>سرور فقط‌خواندنی است؛ پیام ارسال نمی‌کند و تنظیمات ربات را تغییر نمی‌دهد.</li>
<li>هیچ API عملیاتی بله یا سفیر را فراخوانی نمی‌کند.</li>
<li>توکن ربات، کلید سفیر یا OTP دریافت نمی‌کند.</li>
<li>محتوا فقط از فایل‌های بسته npm یا ساختار مخزن خوانده می‌شود.</li>
<li>خروجی STDIO فقط برای پیام‌های پروتکل MCP استفاده می‌شود.</li>
</ul>
<p>Validatorها ساختار Payload را بررسی می‌کنند؛ پذیرش درخواست توسط سرویس واقعی یا مجوزدهی Backend برنامه را تضمین نمی‌کنند.</p>

<h2>انتشار</h2>
<p>پکیج برای انتشار با نام <code>@bale-engineering/mcp-server</code> آماده شده است. Workflow انتشار GitHub قبل از Publish، Typecheck، تست‌های واحد، Build و تست واقعی بسته نصب‌شده از طریق STDIO را اجرا می‌کند. مالکیت Scope در npm و احراز هویت اولیه باید توسط مالک پکیج تنظیم شود.</p>
<p><a href="../../docs/releasing.fa.md">راهنمای انتشار به فارسی</a></p>
</div>
