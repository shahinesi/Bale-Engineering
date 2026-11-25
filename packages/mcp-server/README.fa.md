<div dir="rtl" align="right">

<p align="left"><a href="README.md">English</a> · <strong>فارسی</strong></p>
<h1>سرور MCP پروژه Bale Engineering</h1>
<p>سرور MCP دسترسی استاندارد و فقط‌خواندنی به Skillها، دانش فنی و قالب‌های همین مخزن فراهم می‌کند.</p>
<h2>پیش‌نیازها</h2>
<ul><li>Node.js نسخه ۲۰ یا بالاتر</li><li>pnpm</li><li>یک میزبان سازگار با MCP</li></ul>
<h2>نصب و اجرا</h2>
<p>از ریشه مخزن:</p>
</div>

~~~bash
pnpm install
pnpm --filter @bale-engineering/mcp-server build
node packages/mcp-server/dist/index.js
~~~

<div dir="rtl" align="right">
<p>ارتباط سرور از طریق STDIO است. خروجی استاندارد باید فقط برای پیام‌های پروتکل MCP استفاده شود؛ برای Debug از <code>console.log</code> استفاده نکنید.</p>
<h2>اتصال به Codex</h2>
</div>

~~~bash
codex mcp add bale-engineering -- node /absolute/path/Bale-Engineering/packages/mcp-server/dist/index.js
~~~

<div dir="rtl" align="right"><h2>اتصال به Claude Code</h2></div>

~~~bash
claude mcp add bale-engineering -- node /absolute/path/Bale-Engineering/packages/mcp-server/dist/index.js
~~~

<div dir="rtl" align="right">
<h2>اتصال به Cursor</h2>
<p>این تنظیم را در فایل پیکربندی MCP نسخه Cursor خود قرار دهید و مسیر را به مسیر واقعی پروژه تغییر دهید:</p>
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
<p>فرمت تنظیمات Agentها ممکن است تغییر کند؛ اگر دستور پذیرفته نشد، مستندات نسخه نصب‌شده را بررسی کنید.</p>
<h2>Promptها</h2>
<ul>
<li><code>bale-engineering</code>: شروع یک کار مهندسی با انتخاب پلتفرم، امنیت، مدیریت خطا و برنامه اعتبارسنجی.</li>
<li><code>bale-engineering-review</code>: بازبینی پیاده‌سازی بله با چک‌لیست کیفیت و امنیت.</li>
</ul>
<h2>ابزارها</h2>
</div>

<table dir="rtl">
<thead><tr><th>ابزار</th><th>کاربرد</th></tr></thead>
<tbody>
<tr><td><code>bale_list_skills</code></td><td>فهرست Skillها با امکان فیلتر</td></tr>
<tr><td><code>bale_get_skill</code></td><td>دریافت متن کامل یک Skill</td></tr>
<tr><td><code>bale_get_reference</code></td><td>دریافت یک مرجع فنی</td></tr>
<tr><td><code>bale_search_knowledge</code></td><td>جست‌وجوی کلیدواژه‌ای در دانش</td></tr>
<tr><td><code>bale_route_task</code></td><td>پیشنهاد Skill با قواعد کلیدواژه‌ای</td></tr>
<tr><td><code>bale_validate_inline_keyboard</code></td><td>اعتبارسنجی Inline Keyboard</td></tr>
<tr><td><code>bale_validate_safir_payload</code></td><td>اعتبارسنجی Payload سفیر</td></tr>
<tr><td><code>bale_validate_business_api_request</code></td><td>اعتبارسنجی ساختار درخواست Business API</td></tr>
</tbody>
</table>

<div dir="rtl" align="right">
<h2>Resourceها</h2>
<ul>
<li><code>bale://catalog</code></li>
<li><code>bale://skills/{id}</code></li>
<li><code>bale://knowledge/{id}</code></li>
<li><code>bale://sources</code></li>
</ul>
<h2>مرز امنیتی</h2>
<p>این سرور API بله یا سفیر را فراخوانی نمی‌کند، پیام نمی‌فرستد، عملیات واقعی انجام نمی‌دهد، توکن Bot یا کلید Safir نمی‌گیرد و فقط فایل‌های تعریف‌شده در کاتالوگ مجاز را می‌خواند.</p>
<p>Validator دکمه، مجوزدهی برنامه را بررسی نمی‌کند. Validator مربوط به Business API نمی‌تواند نوع واقعی چت را بدون متادیتای معتبر اثبات کند. Validator سفیر نیز پذیرش درخواست توسط سرویس واقعی را تضمین نمی‌کند. مسیریابی کلیدواژه‌ای، استدلال معنایی نیست.</p>
</div>
