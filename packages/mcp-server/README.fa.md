<div dir="rtl" align="right">

<p align="left"><a href="README.md">English</a> · <strong>فارسی</strong></p>

<h1>راهنمای کامل Bale Engineering MCP Server</h1>

<p>
<a href="https://www.npmjs.com/package/@bale-engineering/mcp-server"><img src="https://img.shields.io/npm/v/%40bale-engineering%2Fmcp-server" alt="npm version"></a>
<a href="https://github.com/shahinesi/Bale-Engineering/actions/workflows/ci.yml"><img src="https://github.com/shahinesi/Bale-Engineering/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
<a href="../../LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
</p>

<p>یک سرور محلی و فقط‌خواندنی بر پایه <a href="https://modelcontextprotocol.io/">Model Context Protocol (MCP)</a> برای دسترسی Agentهای هوش مصنوعی به دانش مهندسی بله است. این سرور Skillها، مراجع فنی مبتنی بر مستندات، قالب‌ها، Validatorها و Promptهای مهندسی را در اختیار Agent قرار می‌دهد.</p>

<p><strong>نام پکیج:</strong> <code>@bale-engineering/mcp-server</code><br>
<strong>نسخه منتشرشده npm:</strong> <code>0.1.0</code><br>
<strong>کاندید بعدی در سورس:</strong> <code>0.1.1</code><br>
<strong>صفحه npm:</strong> <a href="https://www.npmjs.com/package/@bale-engineering/mcp-server">مشاهده پکیج</a></p>

<h2>۱. این MCP چه کاری انجام می‌دهد؟</h2>
<ul>
<li>به Agent کمک می‌کند بین Bot API، Business API، Mini App، Safir و پرداخت کیف پول انتخاب درستی انجام دهد.</li>
<li>Skillها و مراجع فنی اصلی مخزن را در اختیار Agent قرار می‌دهد.</li>
<li>در دانش بسته‌بندی‌شده پروژه جست‌وجوی کلیدواژه‌ای انجام می‌دهد.</li>
<li>ساختار Inline Keyboard، Payload سفیر و درخواست Business API را اعتبارسنجی می‌کند.</li>
<li>Promptهای آماده برای طراحی و بازبینی مهندسی ارائه می‌دهد.</li>
<li>به‌صورت محلی و از طریق <strong>STDIO</strong> اجرا می‌شود و پورت HTTP باز نمی‌کند.</li>
</ul>

<p>این پکیج فقط‌خواندنی است. پیام ارسال نمی‌کند، تنظیمات ربات را تغییر نمی‌دهد، API بله یا سفیر را فراخوانی نمی‌کند و به سیستم Production شما دسترسی ندارد.</p>

<h2>۲. پیش‌نیازها</h2>
<ul>
<li>Node.js نسخه ۲۰ یا بالاتر</li>
<li>npm که همراه Node.js نصب می‌شود و دستور <code>npx</code> را فراهم می‌کند</li>
<li>یک MCP Client مانند Codex، Claude Code یا Cursor</li>
<li>دسترسی شبکه به npm Registry برای دریافت اولیه پکیج</li>
</ul>

<p>برای نصب و استفاده نیازی به حساب npm، توکن ربات بله، کلید API سفیر یا اطلاعات محرمانه Production ندارید.</p>

<h2>۳. نصب سریع و اتصال به Agent</h2>
<p>روش اتصال به Agent بستگی دارد: در Codex Desktop تنظیمات را در فایل <code>config.toml</code> ثبت می‌کنید؛ در بعضی Clientهای دیگر ممکن است از دستور نصب استفاده شود. خود Agent هنگام نیاز فرایند MCP را اجرا می‌کند. <strong>فرایند STDIO را به‌عنوان سرویس دائمی یا پردازش پس‌زمینه اجرا نکنید.</strong></p>

<h3>۳.۱. اتصال به Codex Desktop</h3>
<p>برای نسخه دسکتاپ Codex در مک‌بوک، نیازی به نصب Codex CLI یا اجرای دستور <code>codex</code> ندارید:</p>
<ol>
<li>Codex را باز کنید.</li>
<li>به مسیر <strong>Settings → Configuration → Open config.toml</strong> بروید.</li>
<li>این بخش را به فایل موجود اضافه کنید؛ تنظیمات قبلی را پاک نکنید:</li>
</ol>
</div>

~~~toml
[mcp_servers.bale_engineering]
command = "npx"
args = ["-y", "@bale-engineering/mcp-server@0.1.0"]
~~~

<div dir="rtl" align="right">
<ol start="4">
<li>فایل را ذخیره و Codex را Restart کنید.</li>
</ol>
<p>فایل تنظیمات پیش‌فرض در macOS برابر <code>~/.codex/config.toml</code> است. دستور <code>npx</code> فقط پکیج MCP را اجرا می‌کند و به معنی نیاز به Codex CLI نیست.</p>
</div>

<h3>۳.۲. اتصال به Claude Code</h3>
</div>

~~~bash
claude mcp add bale-engineering -- npx -y @bale-engineering/mcp-server@0.1.0
~~~

<div dir="rtl" align="right">
<p>برای بررسی ثبت شدن سرور:</p>
</div>

~~~bash
claude mcp list
~~~

<div dir="rtl" align="right">
<h3>۳.۳. اتصال به Cursor</h3>
<p>این تنظیم را در تنظیمات MCP در Cursor یا فایل <code>.cursor/mcp.json</code> پروژه قرار دهید:</p>
</div>

~~~json
{
  "mcpServers": {
    "bale-engineering": {
      "command": "npx",
      "args": ["-y", "@bale-engineering/mcp-server@0.1.0"]
    }
  }
}
~~~

<div dir="rtl" align="right">
<h3>۳.۴. سایر MCP Clientها</h3>
<p>در تنظیمات MCP ابزار موردنظر، همین Command و Arguments را وارد کنید:</p>
<ul>
<li><strong>Command:</strong> <code>npx</code></li>
<li><strong>Arguments:</strong> <code>-y</code> و <code>@bale-engineering/mcp-server@0.1.0</code></li>
<li><strong>Transport:</strong> <code>stdio</code></li>
</ul>
<p>پس از تغییر تنظیمات، Agent را Restart یا Reload کنید. محل دقیق تنظیمات به نسخه Client بستگی دارد.</p>

<h3>۳.۵. نصب روی نسخه مشخص</h3>
<p>برای محیط تیمی و قابل‌بازتولید، به‌جای <code>@latest</code> نسخه تست‌شده را Pin کنید؛ مثلاً:</p>
</div>

~~~text
@bale-engineering/mcp-server@0.1.0
~~~

<div dir="rtl" align="right">
<p>استفاده از <code>@latest</code> باعث می‌شود npx هنگام اجرای بعدی، جدیدترین نسخه منتشرشده را دریافت کند.</p>

<h2>۴. بررسی نصب</h2>
<p>برای بررسی نسخه منتشرشده در npm:</p>
</div>

~~~bash
npm view @bale-engineering/mcp-server version
~~~

<div dir="rtl" align="right">
<p>سپس وضعیت MCP را در Agent بررسی کنید:</p>
<ul>
<li>Codex Desktop: پس از Restart، در محیط Codex از Agent بخواهید ابزارهای MCP سرور <code>bale_engineering</code> را فهرست کند.</li>
<li>Claude Code: دستور <code>claude mcp list</code></li>
<li>Cursor: بخش MCP Settings و وضعیت اتصال <code>bale-engineering</code></li>
</ul>
<p>پس از اتصال، از Agent بخواهید ابزارهای Bale Engineering را فهرست کند یا یکی از مثال‌های بخش بعد را انجام دهد.</p>

<h2>۵. چطور از MCP استفاده کنم؟</h2>
<p>در حالت عادی لازم نیست سرور را از ترمینال فراخوانی کنید. کافی است در گفت‌وگو با Agent از او بخواهید برای انجام کار از ابزارهای MCP متصل‌شده استفاده کند.</p>

<h3>نمونه درخواست‌ها</h3>
<ul>
<li>«با استفاده از Bale Engineering تصمیم بگیر این فرایند باید با Bot API پیاده‌سازی شود یا Business API یا Mini App؛ دلیل و محدودیت هر گزینه را بگو.»</li>
<li>«مرجع احراز هویت Mini App را پیدا کن و توضیح بده Backend چطور باید initData را اعتبارسنجی کند.»</li>
<li>«این Inline Keyboard را با Validator بله بررسی کن؛ خطاها را اصلاح کن و فرض نکن دکمه غیرفعال مجوز دسترسی را کنترل می‌کند.»</li>
<li>«ساختار این Payload سفیر را بررسی کن و تمام Warningها را توضیح بده.»</li>
<li>«این پیاده‌سازی را با Prompt بازبینی مهندسی بررسی کن و ماتریس تست اولویت‌بندی‌شده بساز.»</li>
</ul>
<p>برای طراحی یا پیاده‌سازی قابلیت جدید از Prompt <code>bale-engineering</code> استفاده کنید. برای بازبینی کد یا Pull Request از <code>bale-engineering-review</code> استفاده کنید.</p>

<h2>۶. ابزارهای MCP</h2>
<p>سرور هشت Tool در اختیار Agent قرار می‌دهد:</p>
</div>

| ابزار | ورودی | کاربرد |
|---|---|---|
| <code>bale_list_skills</code> | <code>area?</code> | فهرست Skillها؛ امکان فیلتر مانند <code>bot-api</code> و <code>miniapp</code> |
| <code>bale_get_skill</code> | <code>skill_id</code> | دریافت متن کامل Skill |
| <code>bale_get_reference</code> | <code>reference_id</code> | دریافت مرجع فنی کامل |
| <code>bale_search_knowledge</code> | <code>query</code>، <code>limit?</code> | جست‌وجوی کلیدواژه‌ای در Skillها، مراجع و Templateها؛ پیش‌فرض ۵ و حداکثر ۲۰ |
| <code>bale_route_task</code> | <code>task</code> | پیشنهاد Skill تخصصی با قواعد کلیدواژه‌ای |
| <code>bale_validate_inline_keyboard</code> | <code>reply_markup</code> | بررسی ساختار Inline Keyboard |
| <code>bale_validate_safir_payload</code> | <code>payload</code> | بررسی ساختار Payload سفیر |
| <code>bale_validate_business_api_request</code> | <code>method</code>، <code>payload</code>، <code>chat_type?</code> | بررسی متد و Payload مربوط به Business API |

<div dir="rtl" align="right">
<h3>مثال: جست‌وجو در دانش پروژه</h3>
<p>ورودی Tool به نام <code>bale_search_knowledge</code>:</p>
</div>

~~~json
{
  "query": "Mini App initData authentication",
  "limit": 5
}
~~~

<div dir="rtl" align="right">
<h3>مثال: مسیریابی یک کار</h3>
<p>ورودی Tool به نام <code>bale_route_task</code>:</p>
</div>

~~~json
{
  "task": "Build a Mini App with a secure user profile and order history"
}
~~~

<div dir="rtl" align="right">
<p>مسیریاب فقط از قواعد صریح کلیدواژه‌ای استفاده می‌کند و موتور استدلال هوش مصنوعی نیست. خروجی آن پیشنهاد اولیه است؛ تصمیم نهایی باید با Skill اصلی مهندسی انجام شود.</p>

<h3>مثال: اعتبارسنجی Inline Keyboard</h3>
<p>ورودی Tool به نام <code>bale_validate_inline_keyboard</code>:</p>
</div>

~~~json
{
  "reply_markup": {
    "inline_keyboard": [
      [
        { "text": "تأیید", "callback_data": "confirm", "style": "success" },
        { "text": "لغو", "callback_data": "cancel", "style": "danger" }
      ],
      [
        { "text": "ظرفیت تکمیل است", "disabled": {} }
      ]
    ]
  }
}
~~~

<div dir="rtl" align="right">
<p>Validator ساختار Keyboard، مقدارهای مجاز Style یعنی <code>primary</code>، <code>success</code> و <code>danger</code>، فیلدهای Action و محدودیت ۱ تا ۶۴ <strong>بایت UTF-8</strong> برای <code>callback_data</code> را بررسی می‌کند. دکمه Disabled فقط وضعیت ظاهری UI است و Backend همچنان باید مجوز عملیات را کنترل کند.</p>

<h3>مثال: اعتبارسنجی Payload سفیر</h3>
<p>ورودی Tool به نام <code>bale_validate_safir_payload</code>:</p>
</div>

~~~json
{
  "payload": {
    "bot_id": 123456,
    "phone_number": "+989121234567",
    "request_id": "order-1001-otp",
    "message_data": {
      "otp_message": {
        "otp": "123456"
      }
    }
  }
}
~~~

<div dir="rtl" align="right">
<p>مقادیر بالا صرفاً نمونه و ساختگی هستند؛ نه اطلاعات احراز هویت واقعی‌اند و نه درخواستی به سفیر ارسال می‌کنند. Validator فقط شکل Payload را بررسی می‌کند و ممکن است برای ابهام‌های مستندات رسمی یا توصیه‌های تکمیلی Warning بدهد.</p>

<h3>مثال: اعتبارسنجی درخواست Business API</h3>
<p>ورودی Tool به نام <code>bale_validate_business_api_request</code>:</p>
</div>

~~~json
{
  "method": "sendMessage",
  "chat_type": "private",
  "payload": {
    "chat_id": 123456789,
    "text": "سفارش شما آماده است."
  }
}
~~~

<div dir="rtl" align="right">
<p>Validator فهرست متدهای مستندشده، شناسه گیرنده و فیلدهای مختص هر متد را بررسی می‌کند؛ اما هیچ پیامی ارسال نمی‌کند.</p>

<h2>۷. منابع MCP (Resources)</h2>
</div>

| URI | محتوا |
|---|---|
| <code>bale://catalog</code> | کاتالوگ JSON شامل شناسه Skillها، Referenceها و Templateها |
| <code>bale://skills/{id}</code> | متن کامل Markdown یک Skill |
| <code>bale://knowledge/{id}</code> | متن کامل Markdown یک مرجع فنی |
| <code>bale://sources</code> | فهرست منابع رسمی بله و مراجع مهندسی |

<div dir="rtl" align="right">
<p>شناسه‌های اصلی Skill:</p>
</div>

~~~text
bale-engineering
bale-bot-api
bale-business-api
bale-miniapp
bale-safir
bale-wallet-payments
bale-message-formatting
bale-links
bale-engineering-review
~~~

<div dir="rtl" align="right">
<p>برای مشاهده شناسه‌های معتبر از <code>bale_list_skills</code> یا Resource به نام <code>bale://catalog</code> استفاده کنید؛ شناسه‌ها را حدس نزنید.</p>

<h2>۸. Promptهای MCP</h2>
</div>

| Prompt | ورودی‌ها | کاربرد |
|---|---|---|
| <code>bale-engineering</code> | <code>task</code> اجباری، <code>mode?</code>، <code>stack?</code> | طراحی و حل مسئله مهندسی بله |
| <code>bale-engineering-review</code> | <code>target</code> و <code>change_summary</code> اجباری، <code>evidence?</code> | بازبینی صحت، امنیت، پایداری و آمادگی عملیاتی |

<div dir="rtl" align="right">
<p>Prompt مهندسی سه حالت دارد:</p>
<ul>
<li><code>lite</code>: کوچک‌ترین پیشنهاد کامل به همراه یک مثال اجرایی</li>
<li><code>full</code>: حالت پیش‌فرض؛ مسیر کاربر، انتخاب پلتفرم، معماری، امنیت، خطاها و تست‌ها</li>
<li><code>ultra</code>: به چالش کشیدن نیازهای غیرضروری، مقایسه گزینه‌ها و بررسی ریسک‌های بین‌سیستمی</li>
</ul>

<h2>۹. معماری و نحوه ارتباط</h2>
</div>

~~~mermaid
flowchart LR
    A["Codex / Claude Code / Cursor"] <-->|"MCP JSON-RPC روی STDIO"| B["Bale Engineering MCP محلی"]
    B --> C["Skillها و مراجع بسته‌بندی‌شده"]
    B --> D["جست‌وجوی کلیدواژه‌ای و Validator"]
    B -.-> E["بدون API بله / سفیر یا دسترسی Production"]
~~~

<div dir="rtl" align="right">
<ul>
<li><strong>STDIO:</strong> پیام‌های MCP بین Client و فرایند محلی جابه‌جا می‌شوند.</li>
<li>هیچ پورت TCP، Endpoint عمومی، Reverse Proxy یا سرویس میزبانی‌شده‌ای ایجاد نمی‌شود.</li>
<li>پکیج npm شامل Runtime و فایل‌های دانش موردنیاز است.</li>
<li>سرور دانش را از فایل‌های همراه پکیج می‌خواند و هنگام اجرا مستندات بله را از اینترنت دریافت نمی‌کند.</li>
</ul>

<h2>۱۰. محدودیت‌ها و مرزهای امنیتی</h2>
<ul>
<li><strong>فقط‌خواندنی:</strong> هیچ پیام یا عملیات واقعی در بله انجام نمی‌شود.</li>
<li><strong>بدون اطلاعات محرمانه:</strong> سرور توکن ربات، کلید سفیر، OTP یا Secretهای Production دریافت یا ذخیره نمی‌کند.</li>
<li><strong>جست‌وجوی کلیدواژه‌ای:</strong> <code>bale_search_knowledge</code> جست‌وجوی قطعی کلیدواژه‌ای است؛ Semantic Search یا Web Search نیست.</li>
<li><strong>مسیریابی کلیدواژه‌ای:</strong> <code>bale_route_task</code> فقط پیشنهاد اولیه می‌دهد و تصمیم مهندسی نهایی نیست.</li>
<li><strong>اعتبارسنجی محلی:</strong> Validatorها ساختار Payload را با قواعد پیاده‌سازی‌شده در این نسخه بررسی می‌کنند؛ پذیرش درخواست توسط بله یا سفیر را تضمین نمی‌کنند.</li>
<li><strong>مجوزدهی در Backend شماست:</strong> Callback، دکمه Disabled یا اعتبارسنجی موفق جایگزین احراز هویت و مجوزدهی سمت سرور نیست.</li>
<li><strong>بدون Remote Transport:</strong> این نسخه Streamable HTTP یا Endpoint راه‌دور ارائه نمی‌کند.</li>
</ul>

<h2>۱۱. رفع اشکال</h2>

<h3>Agent دستور npx را پیدا نمی‌کند</h3>
<p>نسخه Node.js، npm و npx را بررسی کنید:</p>
</div>

~~~bash
node --version
npm --version
npx --version
~~~

<div dir="rtl" align="right">
<p>نسخه Node.js باید ۲۰ یا بالاتر باشد. بعد از نصب Node.js یا تغییر PATH، Agent را Restart کنید.</p>

<h3>سرور نمایش داده نمی‌شود یا Toolها در دسترس نیستند</h3>
<ol>
<li>ساختار تنظیمات MCP را بررسی کنید.</li>
<li>در Codex Desktop برنامه را Restart کنید و از Agent بخواهید ابزارهای <code>bale_engineering</code> را فهرست کند؛ در Claude Code دستور <code>claude mcp list</code> را اجرا کنید.</li>
<li>مطمئن شوید Command برابر <code>npx</code> و Arguments شامل <code>-y</code> و <code>@bale-engineering/mcp-server@0.1.0</code> است.</li>
<li>Agent را Restart یا Reload کنید.</li>
<li>لاگ‌های MCP Client را برای خطای اجرای فرایند بررسی کنید.</li>
</ol>
<p>اولین اجرای npx به دسترسی npm Registry نیاز دارد. در شبکه‌های محدود یا دارای Proxy، دسترسی به <code>registry.npmjs.org</code> را مجاز کنید.</p>

<h3>شناسه Skill یا Reference ناشناخته است</h3>
<p>از <code>bale_list_skills</code> یا Resource <code>bale://catalog</code> برای پیدا کردن شناسه معتبر استفاده کنید.</p>

<h2>۱۲. Build و تست از روی سورس</h2>
</div>

~~~bash
git clone https://github.com/shahinesi/Bale-Engineering.git
cd Bale-Engineering/packages/mcp-server
npm install
npm run typecheck
npm test
npm run build
npm run test:package
~~~

<div dir="rtl" align="right">
<p>دستور <code>test:package</code> فایل npm را می‌سازد، آن را در یک محیط موقت نصب می‌کند، سرور نصب‌شده را با MCP Client رسمی از طریق STDIO اجرا می‌کند و شناسایی Toolها، فراخوانی Tool، مرجع فارسی، Resource و Prompt را بررسی می‌کند.</p>

<p>برای اجرای نسخه سورس از طریق MCP Client، ابتدا Build کنید و به‌جای دستور npm از این تنظیم استفاده کنید:</p>
</div>

~~~json
{
  "mcpServers": {
    "bale-engineering-local": {
      "command": "node",
      "args": ["/absolute/path/to/Bale-Engineering/packages/mcp-server/dist/index.js"]
    }
  }
}
~~~

<div dir="rtl" align="right">
<h2>۱۳. نسخه‌ها و انتشار</h2>
<ul>
<li><strong>نسخه منتشرشده npm:</strong> <code>0.1.0</code>؛ انتشار دستی توسط Maintainer انجام شده است.</li>
<li><strong>کاندید بعدی در سورس:</strong> <code>0.1.1</code>؛ برای انتشار مرحله‌ای با GitHub OIDC آماده شده است.</li>
<li>نسخه‌ای که MCP در پاسخ Initialize اعلام می‌کند مستقیماً از <code>package.json</code> خوانده می‌شود؛ بنابراین نسخه پکیج و سرور از هم جدا نمی‌شوند.</li>
<li><code>0.0.0-stage</code> فقط Placeholder مربوط به Staging در npm است، نه نسخه واقعی Bale Engineering؛ آن را نصب نکنید.</li>
<li>تا زمان Stage، بررسی و تأیید نسخه <code>0.1.1</code>، برای نصب از نسخه منتشرشده <code>@bale-engineering/mcp-server@0.1.0</code> استفاده کنید.</li>
<li>دستور <code>npm view @bale-engineering/mcp-server version</code> مقدار Dist-tag به نام <code>latest</code> را نشان می‌دهد. برای بررسی نسخه مشخص از <code>npm view @bale-engineering/mcp-server@0.1.0 version</code> استفاده کنید.</li>
</ul>
<ul>
<li><a href="https://www.npmjs.com/package/@bale-engineering/mcp-server">مشاهده پکیج در npm</a></li>
<li><a href="https://github.com/shahinesi/Bale-Engineering/actions">مشاهده GitHub Actions</a></li>
<li><a href="../../docs/releasing.fa.md">راهنمای انتشار نسخه‌های بعدی</a></li>
</ul>
</div>

<h2>مستندات مرتبط</h2>
<ul>
<li><a href="../../README.fa.md">صفحه اصلی فارسی مخزن</a></li>
<li><a href="../../README.md">Main README in English</a></li>
<li><a href="../../docs/architecture.fa.md">معماری فارسی</a></li>
<li><a href="../../docs/architecture.md">Architecture guide</a></li>
<li><a href="../../adapters/README.fa.md">راهنمای اتصال به Agentها</a></li>
<li><a href="https://docs.bale.ai/">مستندات رسمی بله</a></li>
<li><a href="https://modelcontextprotocol.io/">مستندات MCP</a></li>
<li><a href="https://www.npmjs.com/package/@bale-engineering/mcp-server">پکیج npm</a></li>
</ul>

</div>
