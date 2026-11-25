<div dir="rtl" align="right">

<p align="left"><a href="architecture.md">English</a> · <strong>فارسی</strong></p>
<h1>معماری Bale Engineering</h1>
<p>این صفحه معماری مفهومی سامانه دانش Bale Engineering را توضیح می‌دهد؛ نمودارها، معماری زیرساخت بله یا استقرار Production نیستند.</p>

</div>

![نمای مفهومی معماری Bale Engineering](images/architecture-overview-fa.svg)

<div dir="rtl" align="right">
<h2>۱. دو مسیر مستقل</h2>
<p>Bale Engineering دو مسیر جدا دارد:</p>
<ol>
<li><strong>مسیر مهندسی محصول:</strong> توسعه‌دهنده از Skillها و مراجع فنی استفاده می‌کند تا نرم‌افزاری متصل به بله بسازد.</li>
<li><strong>مسیر دانش Agent:</strong> یک Agent سازگار با MCP، همان دانش را از طریق سرور محلی و فقط‌خواندنی دریافت می‌کند.</li>
</ol>
<p>سرور MCP به API بله، سفیر، سرویس عملیاتی، دیتابیس مشتریان یا Backend برنامه متصل نمی‌شود.</p>
<h2>۲. انتخاب سطح ارتباط با بله</h2>
</div>

~~~mermaid
flowchart TD
    U["نیاز کاربر"] --> D{"نوع تعامل"}
    D -->|"گفت‌وگو و Callback"| BOT["Bot API"]
    D -->|"فرم و داشبورد"| MINI["Mini App"]
    D -->|"اعلان به چت خصوصی موجود"| BIZ["Business API"]
    D -->|"شماره تلفن و OTP"| SAFIR["Safir"]
    D -->|"پرداخت کیف پول"| PAY["Invoice در Bot API یا Mini App"]
    BOT --> CORE["Backend تحت مالکیت برنامه"]
    MINI --> CORE
    BIZ --> CORE
    SAFIR --> CORE
    PAY --> CORE
    CORE --> STATE[("وضعیت و Audit برنامه")]
~~~

<div dir="rtl" align="right">
<p>Backend باید مالک منطق کسب‌وکار، مجوزدهی، وضعیت پایدار و Idempotency باشد. کانال‌های بله Adapter هستند، نه مرجع نهایی تکمیل عملیات.</p>
<h2>۳. چرخه پردازش Update ربات</h2>
</div>

~~~mermaid
sequenceDiagram
    participant B as بله
    participant I as Webhook یا Poller
    participant Q as صف پایدار
    participant H as پردازشگر Update
    participant D as سرویس دامنه
    participant DB as دیتابیس برنامه

    B->>I: ارسال Update
    I->>H: اعتبارسنجی و Deduplicate
    H->>Q: ثبت کار
    Q->>H: تحویل کار
    H->>D: اجرای Use Case مجاز
    D->>DB: ثبت وضعیت و Audit
    DB-->>H: نتیجه Commit
    H-->>B: پاسخ Callback در صورت نیاز
~~~

<div dir="rtl" align="right">
<p>در Polling، نتیجه پردازش را قبل از جلو بردن Offset ذخیره کنید. در Webhook، دریافت تکراری باید بی‌خطر باشد. فرض نکنید هر Update یک پیام متنی عادی است.</p>
<h2>۴. مرز احراز هویت Mini App</h2>
</div>

~~~mermaid
sequenceDiagram
    participant U as کاربر
    participant C as کلاینت بله
    participant W as Mini App
    participant A as Backend برنامه

    U->>C: باز کردن Mini App
    C->>W: ارسال raw initData
    W->>A: ارسال initData روی HTTPS
    A->>A: بررسی HMAC و auth_date
    alt داده معتبر و تازه است
        A-->>W: ایجاد Session معتبر
        W->>A: درخواست مجاز
    else داده نامعتبر یا منقضی است
        A-->>W: رد احراز هویت
    end
~~~

<div dir="rtl" align="right">
<p>به <code>initDataUnsafe</code>، شناسه کاربر ارسالی از مرورگر یا رویداد ظاهری اشتراک‌گذاری مخاطب به‌عنوان مدرک هویت اعتماد نکنید. raw <code>initData</code> باید طبق روش مستندشده بله در Backend اعتبارسنجی شود.</p>
<h2>۵. چرخه پرداخت کیف پول</h2>
</div>

~~~mermaid
stateDiagram-v2
    [*] --> PendingOrder
    PendingOrder --> InvoiceCreated: ساخت فاکتور
    InvoiceCreated --> PreCheckout: شروع پرداخت
    PreCheckout --> Rejected: سفارش یا مبلغ نامعتبر
    PreCheckout --> AwaitingPayment: تأیید PreCheckout
    AwaitingPayment --> Paid: اعتبارسنجی SuccessfulPayment
    AwaitingPayment --> Expired: انقضا یا وضعیت نامشخص
    Paid --> Fulfilled: تکمیل Idempotent
    Rejected --> [*]
    Expired --> [*]
    Fulfilled --> [*]
~~~

<div dir="rtl" align="right">
<p>رویداد PreCheckout اثبات پرداخت نیست. قبل از تکمیل سفارش باید رویداد پرداخت موفق و شناسه پرداخت با روش Idempotent اعتبارسنجی شوند.</p>
<h2>۶. مسیر دانش MCP</h2>
</div>

~~~mermaid
flowchart LR
    AGENT["Codex / Claude Code / Cursor"] <-->|"MCP روی STDIO"| SERVER["MCP Server محلی"]
    SERVER --> CATALOG["کاتالوگ مجاز"]
    CATALOG --> SKILLS["Skillها"]
    CATALOG --> KNOWLEDGE["مراجع فنی"]
    CATALOG --> TEMPLATES["قالب‌های مهندسی"]
    SERVER -.->|"بدون دسترسی Production"| DENY["بدون API بله / دیتابیس / ارسال پیام"]
~~~

<div dir="rtl" align="right">
<p>کاتالوگ به‌صورت صریح و محلی تعریف شده است. جست‌وجوی کلیدواژه‌ای و Validatorها قطعی و محدود هستند؛ آن‌ها استدلال معنایی انجام نمی‌دهند و پذیرش درخواست توسط سرویس واقعی را تضمین نمی‌کنند.</p>
<h2>۷. مسئولیت پوشه‌ها</h2>
</div>

<table dir="rtl">
<thead><tr><th>لایه</th><th>مسئولیت</th></tr></thead>
<tbody>
<tr><td><code>skills/</code></td><td>گردش‌کار Agent، تصمیم‌ها و Guardrailها</td></tr>
<tr><td><code>knowledge/</code></td><td>اطلاعات فنی مستند و راهنمای پیاده‌سازی</td></tr>
<tr><td><code>packages/mcp-server/</code></td><td>ابزارها، Promptها و Resourceهای MCP</td></tr>
<tr><td><code>templates/</code></td><td>قالب‌های مهندسی تکرارپذیر</td></tr>
<tr><td><code>docs/diagrams/</code></td><td>سورس قابل‌ویرایش Mermaid</td></tr>
<tr><td><code>docs/images/</code></td><td>تصاویر SVG معماری</td></tr>
<tr><td><code>assets/brand/</code></td><td>هویت بصری و تصویر معرفی</td></tr>
</tbody>
</table>

<div dir="rtl" align="right">
<h2>۸. قواعد طراحی</h2>
<ul>
<li>منطق دامنه در Backend برنامه باقی بماند.</li>
<li>وضعیت ارسال پیام از تکمیل عملیات کسب‌وکار جدا باشد.</li>
<li>هویت و مجوزها در سمت سرور بررسی شوند.</li>
<li>عملیات خارجی قابل Retry باید Idempotent باشند.</li>
<li>Timeout سرویس‌دهنده را تا زمان تطبیق، نتیجه نامشخص در نظر بگیرید.</li>
<li>رفتار مستندشده سرویس‌دهنده را از توصیه مهندسی جدا کنید.</li>
<li>مستندات فارسی و انگلیسی را هم‌زمان به‌روزرسانی کنید.</li>
<li>سورس نمودارها متنی بماند؛ SVG فقط خروجی نمایشی است و نباید تنها مرجع معماری شود.</li>
</ul>
<h2>۹. فایل‌های قابل‌ویرایش نمودارها</h2>
<ul>
<li><a href="diagrams/platform-selection.fa.mmd">انتخاب API مناسب</a></li>
<li><a href="diagrams/bot-update-lifecycle.fa.mmd">چرخه Update ربات</a></li>
<li><a href="diagrams/miniapp-authentication.fa.mmd">احراز هویت Mini App</a></li>
<li><a href="diagrams/wallet-payment-lifecycle.fa.mmd">چرخه پرداخت کیف پول</a></li>
<li><a href="diagrams/mcp-architecture.fa.mmd">معماری MCP</a></li>
</ul>
<p>برای نسخه انگلیسی، فایل‌های بدون پسوند <code>.fa</code> را ببینید.</p>
<h2>۱۰. منابع رسمی</h2>
<ul>
<li><a href="https://docs.bale.ai/">مستندات بله</a></li>
<li><a href="https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams">راهنمای Mermaid در GitHub</a></li>
<li><a href="https://mermaid.js.org/intro/syntax-reference">مرجع Syntax در Mermaid</a></li>
<li><a href="https://mermaid.js.org/syntax/sequenceDiagram">Sequence Diagram</a></li>
<li><a href="https://mermaid.js.org/syntax/stateDiagram">State Diagram</a></li>
</ul>
</div>
