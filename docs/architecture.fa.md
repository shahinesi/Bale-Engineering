<div dir="rtl" align="right">

<p align="left"><a href="architecture.md">English</a> · <strong>فارسی</strong></p>

# معماری Bale Engineering

این صفحه معماری مفهومی سامانه دانش Bale Engineering را توضیح می‌دهد؛ نمودارها، معماری زیرساخت بله یا استقرار Production نیستند.

</div>

![نمای مفهومی معماری Bale Engineering](images/architecture-overview-fa.svg)

<div dir="rtl" align="right">

## ۱. دو مسیر مستقل

Bale Engineering دو مسیر جدا دارد:

۱. **مسیر مهندسی محصول:** توسعه‌دهنده از Skillها و مراجع فنی استفاده می‌کند تا نرم‌افزاری متصل به بله بسازد.

۲. **مسیر دانش Agent:** یک Agent سازگار با MCP، همان دانش را از طریق سرور محلی و فقط‌خواندنی دریافت می‌کند.

سرور MCP به API بله، سفیر، سرویس عملیاتی، دیتابیس مشتریان یا Backend برنامه متصل نمی‌شود.

## ۲. انتخاب سطح ارتباط با بله

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

Backend باید مالک منطق کسب‌وکار، مجوزدهی، وضعیت پایدار و Idempotency باشد. کانال‌های بله Adapter هستند، نه مرجع نهایی تکمیل عملیات.

## ۳. چرخه پردازش Update ربات

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

در Polling، نتیجه پردازش را قبل از جلو بردن Offset ذخیره کنید. در Webhook، دریافت تکراری باید بی‌خطر باشد. فرض نکنید هر Update یک پیام متنی عادی است.

## ۴. مرز احراز هویت Mini App

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

به <code>initDataUnsafe</code>، شناسه کاربر ارسالی از مرورگر یا رویداد ظاهری اشتراک‌گذاری مخاطب به‌عنوان مدرک هویت اعتماد نکنید. raw <code>initData</code> باید طبق روش مستندشده بله در Backend اعتبارسنجی شود.

## ۵. چرخه پرداخت کیف پول

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

رویداد PreCheckout اثبات پرداخت نیست. قبل از تکمیل سفارش باید رویداد پرداخت موفق و شناسه پرداخت با روش Idempotent اعتبارسنجی شوند.

## ۶. مسیر دانش MCP

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

کاتالوگ به‌صورت صریح و محلی تعریف شده است. جست‌وجوی کلیدواژه‌ای و Validatorها قطعی و محدود هستند؛ آن‌ها استدلال معنایی انجام نمی‌دهند و پذیرش درخواست توسط سرویس واقعی را تضمین نمی‌کنند.

## ۷. مسئولیت پوشه‌ها

| لایه | مسئولیت |
|---|---|
| <code>skills/</code> | گردش‌کار Agent، تصمیم‌ها و Guardrailها |
| <code>knowledge/</code> | اطلاعات فنی مستند و راهنمای پیاده‌سازی |
| <code>packages/mcp-server/</code> | ابزارها، Promptها و Resourceهای MCP |
| <code>templates/</code> | قالب‌های مهندسی تکرارپذیر |
| <code>docs/diagrams/</code> | سورس قابل‌ویرایش Mermaid |
| <code>docs/images/</code> | تصاویر SVG معماری |
| <code>assets/brand/</code> | هویت بصری و تصویر معرفی |

## ۸. قواعد طراحی

- منطق دامنه در Backend برنامه باقی بماند.
- وضعیت ارسال پیام از تکمیل عملیات کسب‌وکار جدا باشد.
- هویت و مجوزها در سمت سرور بررسی شوند.
- عملیات خارجی قابل Retry باید Idempotent باشند.
- Timeout سرویس‌دهنده را تا زمان تطبیق، نتیجه نامشخص در نظر بگیرید.
- رفتار مستندشده سرویس‌دهنده را از توصیه مهندسی جدا کنید.
- مستندات فارسی و انگلیسی را هم‌زمان به‌روزرسانی کنید.
- سورس نمودارها متنی بماند؛ SVG فقط خروجی نمایشی است و نباید تنها مرجع معماری شود.

## ۹. فایل‌های قابل‌ویرایش نمودارها

- [انتخاب API مناسب](diagrams/platform-selection.fa.mmd)
- [چرخه Update ربات](diagrams/bot-update-lifecycle.fa.mmd)
- [احراز هویت Mini App](diagrams/miniapp-authentication.fa.mmd)
- [چرخه پرداخت کیف پول](diagrams/wallet-payment-lifecycle.fa.mmd)
- [معماری MCP](diagrams/mcp-architecture.fa.mmd)

برای نسخه انگلیسی، فایل‌های بدون پسوند <code>.fa</code> را ببینید.

## ۱۰. منابع رسمی

- <a href="https://docs.bale.ai/">مستندات بله</a>
- <a href="https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams">راهنمای Mermaid در GitHub</a>
- <a href="https://mermaid.js.org/intro/syntax-reference">مرجع Syntax در Mermaid</a>
- <a href="https://mermaid.js.org/syntax/sequenceDiagram">Sequence Diagram</a>
- <a href="https://mermaid.js.org/syntax/stateDiagram">State Diagram</a>

</div>
