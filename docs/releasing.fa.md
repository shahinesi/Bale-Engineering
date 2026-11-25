<div dir="rtl" align="right">

<p align="left"><a href="releasing.md">English</a> · <strong>فارسی</strong></p>

<h1>راهنمای انتشار پکیج npm</h1>
<p><strong>نام پکیج:</strong> <code>@bale-engineering/mcp-server</code></p>
<p><strong>مخزن:</strong> <a href="https://github.com/shahinesi/Bale-Engineering">Bale-Engineering</a></p>

<h2>نسخه منتشرشده</h2>
<p>اولین نسخه عمومی یعنی <code>0.1.0</code> در تاریخ ۲۵ نوامبر ۲۰۲۶ با موفقیت در npm منتشر شده است.</p>
<ul>
<li><a href="https://www.npmjs.com/package/@bale-engineering/mcp-server">صفحه پکیج در npm</a></li>
<li><a href="https://github.com/shahinesi/Bale-Engineering">مخزن GitHub</a></li>
</ul>
<p>برای بررسی نسخه ثبت‌شده در Registry:</p>
</div>

~~~bash
npm view @bale-engineering/mcp-server version
~~~

<div dir="rtl" align="right">
<p>نسخه <code>0.1.0</code> را دوباره منتشر نکنید. نسخه‌های npm تغییرناپذیر هستند؛ برای هر انتشار باید شماره نسخه جدیدی انتخاب شود.</p>

<h2>محتوای پکیج</h2>
<ul>
<li>فایل اجرایی سرور MCP محلی</li>
<li>Skillهای اصلی و مراجع فنی مبتنی بر منابع</li>
<li>Templateها، مستندات معماری، نمودارهای Mermaid و تصاویر برند</li>
<li>README فارسی و انگلیسی</li>
<li>Toolها، Resourceها و Promptهای MCP به‌صورت فقط‌خواندنی</li>
</ul>
<p>پکیج از طریق STDIO اجرا می‌شود؛ Endpoint مبتنی بر HTTP ایجاد نمی‌کند و API عملیاتی بله یا سفیر را فراخوانی نمی‌کند.</p>

<h2>پیش از آماده‌سازی نسخه بعدی</h2>
<ol>
<li>شماره نسخه را در <code>packages/mcp-server/package.json</code> با رعایت Semantic Versioning افزایش دهید.</li>
<li>Release Notes و READMEهای فارسی و انگلیسی را در صورت تغییر رفتار یا روش نصب به‌روزرسانی کنید.</li>
<li>تمام بررسی‌های محلی را اجرا کنید:</li>
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
<ol start="4">
<li>گزارش آسیب‌پذیری وابستگی‌ها را بررسی کنید. بدون بررسی تغییرات Major و اجرای مجدد تست‌ها از <code>npm audit fix --force</code> استفاده نکنید.</li>
<li>تغییرات تأییدشده را در Branch اصلی Merge کنید.</li>
</ol>

<h2>انتشار از GitHub Actions</h2>
<p>Workflow انتشار در فایل <code>.github/workflows/publish.yml</code> قرار دارد. پیش از Publish، Typecheck، تست واحد، Build و تست واقعی بسته نصب‌شده از طریق MCP STDIO اجرا می‌شوند.</p>

<h3>احراز هویت GitHub Actions</h3>
<p>Workflow فعلی Secret با نام <code>NPM_TOKEN</code> را به‌عنوان <code>NODE_AUTH_TOKEN</code> به npm می‌دهد. اگر از همین Workflow بدون تغییر استفاده می‌کنید:</p>
<ol>
<li>یک Granular Access Token در npm بسازید که مجوز انتشار این پکیج را داشته باشد.</li>
<li>در مسیر <strong>GitHub repository → Settings → Secrets and variables → Actions</strong> آن را با نام <code>NPM_TOKEN</code> ثبت کنید.</li>
<li>توکن را در سورس کد، Issue، چت یا فایل Commit‌شده قرار ندهید.</li>
<li>تا زمانی که Workflow برای Trusted Publishing بدون توکن تغییر نکرده و مسیر OIDC با موفقیت تست نشده است، Secret را حذف نکنید.</li>
</ol>
<p>Workflow مجوز <code>id-token: write</code> نیز دارد؛ اما وجود این Permission به‌تنهایی به معنی فعال بودن انتشار بدون توکن از طریق Trusted Publishing نیست.</p>

<h3>تنظیم npm Trusted Publishing</h3>
<p>پس از ایجاد پکیج، در تنظیمات همان پکیج در npm یک Trusted Publisher از نوع GitHub Actions تعریف کنید:</p>
</div>

| فیلد | مقدار |
|---|---|
| Provider | GitHub Actions |
| Organization or user | <code>shahinesi</code> |
| Repository | <code>Bale-Engineering</code> |
| Workflow filename | <code>publish.yml</code> |
| Environment | خالی؛ مگر اینکه Workflow صراحتاً از آن استفاده کند |

<div dir="rtl" align="right">
<p>برای انتشار واقعی مبتنی بر OIDC و بدون توکن، Workflow باید <code>npm publish</code> را بدون وابستگی به Secret بلندمدت <code>NPM_TOKEN</code> اجرا کند. قبل از حذف Secret، این تغییر را اعمال و با یک انتشار آزمایشی معتبر کنید.</p>

<h2>انتشار با Version Tag</h2>
<p>Workflow انتشار Tagهایی با الگوی <code>v*</code> را می‌پذیرد و بررسی می‌کند نسخه Tag با نسخه داخل پکیج یکسان باشد.</p>
<p>برای مثال، پس از تغییر نسخه به <code>0.1.1</code> و Merge شدن تغییرات:</p>
</div>

~~~bash
git tag v0.1.1
git push origin v0.1.1
~~~

<div dir="rtl" align="right">
<p>در صورت تنظیم بودن احراز هویت npm، GitHub Actions نسخه را بررسی و منتشر می‌کند.</p>
<p>Push معمولی باعث انتشار پکیج نمی‌شود. همچنین می‌توان Workflow را از مسیر <strong>Actions → Publish MCP package</strong> به‌صورت دستی اجرا کرد؛ در این حالت ورودی <code>confirm_publish</code> باید صراحتاً <code>true</code> باشد.</p>

<h2>انتشار اولیه (سوابق)</h2>
<p>نسخه اولیه <code>0.1.0</code> از یک سیستم توسعه‌دهنده که به npm احراز هویت شده بود، به‌صورت دستی منتشر شد:</p>
</div>

~~~bash
npm login
npm whoami
npm publish --access public
~~~

<div dir="rtl" align="right">
<p>این دستورها صرفاً برای ثبت روش انتشار اولیه هستند. بدون افزایش شماره نسخه، دستور Publish را دوباره اجرا نکنید.</p>

<h2>بررسی نسخه منتشرشده</h2>
<p>بعد از هر انتشار، نسخه و Tagهای ثبت‌شده در npm را بررسی کنید:</p>
</div>

~~~bash
npm view @bale-engineering/mcp-server version
npm view @bale-engineering/mcp-server dist-tags
~~~

<div dir="rtl" align="right">
<p>سپس پکیج را در یک تنظیم MCP تمیز نصب کنید و شناسایی Tool، اجرای یک Tool، خواندن یک Resource و اجرای یک Prompt را بررسی کنید. تست <code>npm run test:package</code> همین رفتارهای سطح پکیج را پیش از انتشار بررسی می‌کند.</p>

<h2>راهنماهای مرتبط</h2>
<ul>
<li><a href="../packages/mcp-server/README.fa.md">راهنمای کامل نصب و استفاده MCP به فارسی</a></li>
<li><a href="../packages/mcp-server/README.md">Complete MCP guide in English</a></li>
<li><a href="../README.fa.md">صفحه اصلی فارسی مخزن</a></li>
</ul>

</div>
