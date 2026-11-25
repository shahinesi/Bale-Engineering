<div dir="rtl" align="right">

<p align="left"><a href="releasing.md">English</a> · <strong>فارسی</strong></p>

<h1>راهنمای انتشار پکیج npm</h1>
<p><strong>نام پکیج:</strong> <code>@bale-engineering/mcp-server</code></p>
<p><strong>مخزن:</strong> <a href="https://github.com/shahinesi/Bale-Engineering">Bale-Engineering</a></p>

<h2>وضعیت فعلی انتشار</h2>
<p>نسخه سورس پکیج در <code>packages/mcp-server/package.json</code> برابر <code>0.1.0</code> است. نام پکیج در npm ثبت شده، اما نسخه قابل‌مشاهده <code>0.0.0-stage</code> فقط Placeholder مربوط به ثبت یک پکیج جدید با Staged Publishing است؛ این نسخه، انتشار عملیاتی MCP نیست. نسخه واقعی پس از بررسی و تأیید Maintainer با 2FA قابل نصب خواهد شد.</p>
<ul>
<li><a href="https://www.npmjs.com/package/@bale-engineering/mcp-server">صفحه پکیج در npm</a></li>
<li><a href="https://github.com/shahinesi/Bale-Engineering">مخزن GitHub</a></li>
</ul>

<h2>محتوای پکیج</h2>
<ul>
<li>فایل اجرایی سرور MCP محلی</li>
<li>Skillهای اصلی و مراجع فنی مبتنی بر منابع</li>
<li>Templateها، مستندات معماری، نمودارهای Mermaid و تصاویر برند</li>
<li>README فارسی و انگلیسی</li>
<li>Toolها، Resourceها و Promptهای MCP به‌صورت فقط‌خواندنی</li>
</ul>
<p>پکیج از طریق STDIO اجرا می‌شود؛ Endpoint مبتنی بر HTTP ایجاد نمی‌کند و API عملیاتی بله یا سفیر را فراخوانی نمی‌کند.</p>

<h2>پیش‌نیازهای انتشار خودکار</h2>
<ul>
<li>GitHub-hosted Actions Runner</li>
<li>Node.js نسخه ۲۲.۱۴.۰ یا بالاتر؛ Workflow از Node.js 24 استفاده می‌کند.</li>
<li>npm CLI نسخه ۱۱.۱۵.۰ یا بالاتر؛ Workflow برای Staged Publishing نسخه ۱۱.۱۵.۰ را نصب می‌کند.</li>
<li>تعریف Trusted Publisher در npm برای همین Repository و Workflow</li>
<li>فعال بودن مجوز <code>npm stage publish</code> برای Trusted Publisher</li>
</ul>
<p>Workflow از npm Access Token استفاده نمی‌کند. احراز هویت OIDC از طریق GitHub Actions و Permission به نام <code>id-token: write</code> انجام می‌شود.</p>

<h2>تنظیم Trusted Publisher در npm</h2>
<p>در تنظیمات پکیج npm و بخش Trusted Publisher این مقادیر را وارد کنید:</p>
</div>

| فیلد | مقدار |
|---|---|
| Provider | GitHub Actions |
| Organization or user | <code>shahinesi</code> |
| Repository | <code>Bale-Engineering</code> |
| Workflow filename | <code>publish.yml</code> |
| Environment | خالی |

<div dir="rtl" align="right">
<p>برای رعایت حداقل سطح دسترسی، فقط <strong>npm stage publish</strong> را مجاز کنید و دسترسی مستقیم <strong>npm publish</strong> را برای این Trusted Publisher غیرفعال کنید. در این روش CI فقط نسخه کاندید را ارسال می‌کند و انتشار قابل نصب پس از بررسی و تأیید Maintainer با 2FA انجام می‌شود.</p>
<p>Trusted Publisher تازه‌ساخته‌شده باید اولین انتشار موفق OIDC خود را ظرف دو روز انجام دهد. Workflow فعلی از <code>npm stage publish</code> استفاده می‌کند که از طریق OIDC پشتیبانی می‌شود.</p>

<h2>پیش از آماده‌سازی انتشار</h2>
<ol>
<li>نسخه فعلی را در <code>packages/mcp-server/package.json</code> بررسی کنید.</li>
<li>بررسی کنید همان نسخه قبلاً Stage یا Publish نشده باشد. نسخه‌های Stageشده و منتشرشده از نظر یکتایی شماره نسخه مشترک هستند.</li>
<li>اگر نسخه استفاده نشده است، همان را حفظ کنید؛ در غیر این صورت شماره نسخه آزاد بعدی را طبق Semantic Versioning انتخاب کنید. یک نسخه را دوبار Stage نکنید.</li>
<li>در صورت تغییر رفتار یا روش نصب، Release Notes و README فارسی و انگلیسی را به‌روزرسانی کنید.</li>
<li>تست‌های محلی را اجرا کنید:</li>
</ol>
</div>

~~~bash
cd packages/mcp-server
npm install
npm run typecheck
npm test
npm run build
npm run test:package
~~~

<div dir="rtl" align="right">
<ol start="6">
<li>گزارش آسیب‌پذیری وابستگی‌ها را بررسی کنید. بدون بررسی تغییرات ناسازگار و اجرای مجدد تست‌ها از <code>npm audit fix --force</code> استفاده نکنید.</li>
<li>تغییرات تأییدشده را در Branch اصلی Merge کنید.</li>
</ol>

<h2>ارسال نسخه برای بررسی از GitHub Actions</h2>
<p>Workflow در فایل <code>.github/workflows/publish.yml</code> قرار دارد و این مراحل را انجام می‌دهد:</p>
<ol>
<li>با Tag نسخه‌ای از نوع <code>v*</code> یا اجرای دستی همراه با تأیید صریح اجرا می‌شود.</li>
<li>npm CLI نسخه ۱۱.۱۵.۰ را نصب می‌کند؛ این نسخه برای Staged Publishing لازم است.</li>
<li>Typecheck، تست‌های واحد، Build و تست واقعی MCP از طریق STDIO را اجرا می‌کند.</li>
<li>با GitHub OIDC و بدون <code>NPM_TOKEN</code> دستور <code>npm stage publish --access public</code> را اجرا می‌کند.</li>
</ol>

<h3>روش اول: انتشار با Version Tag</h3>
<p>پس از اطمینان از آزاد بودن نسخه در <code>package.json</code>، Tag متناظر را بسازید. برای نسخه <code>0.1.0</code>:</p>
</div>

~~~bash
git tag v0.1.0
git push origin v0.1.0
~~~

<div dir="rtl" align="right">
<p>نام Tag باید دقیقاً با نسخه داخل <code>packages/mcp-server/package.json</code> یکسان باشد.</p>

<h3>روش دوم: اجرای دستی Workflow</h3>
<ol>
<li>وارد GitHub و بخش <strong>Actions → Stage MCP package</strong> شوید.</li>
<li>روی Branch <code>main</code> گزینه <strong>Run workflow</strong> را انتخاب کنید.</li>
<li>ورودی <code>confirm_stage</code> را روی <code>true</code> قرار دهید.</li>
<li>Workflow را اجرا کنید.</li>
</ol>
<p>Push معمولی باعث Stage شدن پکیج نمی‌شود.</p>

<h2>بررسی و تأیید نسخه Stageشده</h2>
<p>پس از موفقیت Workflow مبتنی بر OIDC:</p>
<ol>
<li>در npm به بخش حساب کاربری و سپس <strong>Staged Packages</strong> بروید یا دستور زیر را اجرا کنید:</li>
</ol>
</div>

~~~bash
npm stage list @bale-engineering/mcp-server
~~~

<div dir="rtl" align="right">
<ol start="2">
<li>جزئیات Stage را بررسی کنید:</li>
</ol>
</div>

~~~bash
npm stage view <stage-id>
npm stage download <stage-id>
~~~

<div dir="rtl" align="right">
<ol start="3">
<li>نام پکیج، نسخه، محتوا، ناشر و Provenance را بررسی کنید.</li>
<li>نسخه دقیق موردنظر را با 2FA از سایت npm یا دستور زیر تأیید کنید:</li>
</ol>
</div>

~~~bash
npm stage approve <stage-id>
~~~

<div dir="rtl" align="right">
<p>تنها پس از Approval، نسخه Stageشده به انتشار عادی npm تبدیل و قابل نصب می‌شود.</p>

<h2>بررسی انتشار نهایی</h2>
<p>پس از تأیید:</p>
</div>

~~~bash
npm view @bale-engineering/mcp-server version
npm view @bale-engineering/mcp-server dist-tags
~~~

<div dir="rtl" align="right">
<p>سپس پکیج را در یک تنظیم MCP تمیز نصب کنید و شناسایی Tool، اجرای یک Tool، خواندن یک Resource و اجرای یک Prompt را بررسی کنید. تست <code>npm run test:package</code> همین رفتارهای سطح پکیج را پیش از Stage بررسی می‌کند.</p>

<h2>نکات امنیتی</h2>
<ul>
<li>برای این Workflow، Secret با نام <code>NPM_TOKEN</code> در GitHub Actions نسازید.</li>
<li>متغیر <code>NODE_AUTH_TOKEN</code> را به مرحله انتشار برنگردانید.</li>
<li>Trusted Publisher را فقط به Repository و Workflow دقیق <code>publish.yml</code> محدود نگه دارید.</li>
<li>مجوز Stage-only را ترجیح دهید. دسترسی مستقیم OIDC به <code>npm publish</code> را فقط در صورت نیاز آگاهانه فعال کنید.</li>
<li>پس از تأیید OIDC، توکن‌های اتوماسیون قدیمی و غیرضروری npm را حذف کنید.</li>
</ul>

<h2>راهنماهای مرتبط</h2>
<ul>
<li><a href="../packages/mcp-server/README.fa.md">راهنمای کامل نصب و استفاده MCP به فارسی</a></li>
<li><a href="../packages/mcp-server/README.md">Complete MCP installation and usage guide</a></li>
<li><a href="../README.fa.md">صفحه اصلی فارسی مخزن</a></li>
</ul>

</div>
