<div dir="rtl" align="right">

<p align="left"><a href="releasing.md">English</a> · <strong>فارسی</strong></p>

<h1>راهنمای انتشار پکیج npm</h1>
<p><strong>نام پکیج:</strong> <code>@bale-engineering/mcp-server</code></p>
<p><strong>مخزن:</strong> <a href="https://github.com/shahinesi/Bale-Engineering">Bale-Engineering</a></p>

<h2>وضعیت فعلی نسخه‌ها</h2>
<ul>
<li><strong>نسخه منتشرشده:</strong> <code>0.1.0</code>؛ دستور <code>npm publish</code> روی سیستم Maintainer با موفقیت تمام شده است.</li>
<li><strong>کاندید بعدی در سورس:</strong> <code>0.1.1</code>؛ این نسخه در مخزن برای اولین انتشار مرحله‌ای با OIDC آماده شده است.</li>
<li><strong>Placeholder مربوط به Staging:</strong> <code>0.0.0-stage</code>؛ این نسخه رزرو/Placeholder npm است و نسخه واقعی برنامه Bale Engineering محسوب نمی‌شود.</li>
<li><strong>نسخه‌های Stageشده:</strong> دستور <code>npm stage list</code> توسط Maintainer اجرا شده و در آن زمان هیچ نسخه Stageشده‌ای برنگردانده است.</li>
</ul>
<p>دستور <code>npm view @bale-engineering/mcp-server version</code> نسخه متصل به Dist-tag با نام <code>latest</code> را نشان می‌دهد؛ این دستور فهرست همه نسخه‌های منتشرشده نیست. برای بررسی نسخه مشخص، آن را مستقیماً Query کنید:</p>
</div>

~~~bash
npm view @bale-engineering/mcp-server@0.1.0 version
npm view @bale-engineering/mcp-server versions --json
npm view @bale-engineering/mcp-server dist-tags
~~~

<div dir="rtl" align="right">
<p>بررسی اولیه <code>npm view ... version</code> بلافاصله بعد از انتشار اجرا شده بود؛ در همان خروجی npm اعلام کرده بود که پردازش انتشار هنوز ادامه دارد. اجازه دهید اطلاعات Registry همگام شود، سپس نسخه دقیق و Dist-tagها را بررسی کنید؛ صرفاً از روی مقدار <code>latest</code> نتیجه نگیرید که نسخه منتشر نشده است.</p>

<h2>محتوای پکیج</h2>
<ul>
<li>فایل اجرایی سرور MCP محلی</li>
<li>Skillهای اصلی و مراجع فنی مبتنی بر منابع</li>
<li>Templateها، مستندات معماری، نمودارهای Mermaid و تصاویر برند</li>
<li>README کامل فارسی و انگلیسی</li>
<li>Toolها، Resourceها و Promptهای MCP به‌صورت فقط‌خواندنی</li>
</ul>
<p>پکیج از طریق STDIO اجرا می‌شود؛ Endpoint مبتنی بر HTTP ایجاد نمی‌کند و API عملیاتی بله یا سفیر را فراخوانی نمی‌کند.</p>

<h2>تنظیم Trusted Publisher در npm</h2>
<p>Trusted Publisher پکیج با این مشخصات تنظیم شده است:</p>
</div>

| فیلد | مقدار |
|---|---|
| Provider | GitHub Actions |
| Organization or user | <code>shahinesi</code> |
| Repository | <code>Bale-Engineering</code> |
| Workflow filename | <code>publish.yml</code> |
| Environment | خالی |

<div dir="rtl" align="right">
<p>Workflow از GitHub OIDC و Permission با نام <code>id-token: write</code> استفاده می‌کند و به <code>NPM_TOKEN</code> یا <code>NODE_AUTH_TOKEN</code> وابسته نیست.</p>
<p>برای رعایت حداقل سطح دسترسی، فقط <strong>npm stage publish</strong> را مجاز کنید و دسترسی مستقیم <strong>npm publish</strong> را برای این Trusted Publisher غیرفعال کنید. در این روش CI فقط نسخه کاندید را ارسال می‌کند؛ Maintainer باید همان نسخه را بررسی و با 2FA تأیید کند تا به انتشار عادی تبدیل شود.</p>
<p>Trusted Publisher تازه‌ساخته‌شده باید اولین انتشار موفق OIDC خود را در مهلتی که npm نمایش می‌دهد انجام دهد. Workflow فعلی برای همین اعتبارسنجی اولیه از <code>npm stage publish</code> استفاده می‌کند.</p>

<h2>آماده‌سازی نسخه بعدی</h2>
<p>کاندید فعلی سورس <code>0.1.1</code> است.</p>
<ol>
<li>فایل <code>packages/mcp-server/package.json</code> مرجع اصلی نسخه پکیج است.</li>
<li>سرور MCP نسخه اعلام‌شده در Initialize را هنگام اجرا از همین Manifest می‌خواند؛ در <code>src/index.ts</code> نسخه دوم را Hardcode نکنید.</li>
<li>پیش از Stage، Registry بررسی می‌شود. Workflow تطابق نسخه ورودی با <code>package.json</code> و منتشرنشدن آن نسخه را کنترل می‌کند.</li>
<li>در صورت تغییر روش نصب، رفتار یا محتوای پکیج، هر دو README و Release Notes را به‌روزرسانی کنید.</li>
<li>گزارش آسیب‌پذیری وابستگی‌ها را بررسی کنید. بدون بررسی تغییرات ناسازگار و اجرای مجدد تست‌ها از <code>npm audit fix --force</code> استفاده نکنید.</li>
</ol>

<h2>ارسال نسخه برای بررسی از GitHub Actions</h2>
<p>Workflow در فایل <code>.github/workflows/publish.yml</code> قرار دارد و فقط به‌صورت دستی اجرا می‌شود؛ Push معمولی یا ساخت Tag باعث انتشار یا Stage نخواهد شد.</p>
<p>Workflow این مراحل را انجام می‌دهد:</p>
<ol>
<li>ورودی صریح <code>release_version</code> می‌خواهد که باید با نسخه <code>packages/mcp-server/package.json</code> یکسان باشد.</li>
<li>ورودی <code>confirm_stage = true</code> را اجباری می‌کند؛ در غیر این صورت Job اجرا نمی‌شود.</li>
<li>Node.js 24 و npm CLI نسخه ۱۱.۱۵.۰ را نصب می‌کند.</li>
<li>نسخه درخواستی را با فهرست نسخه‌های عمومی npm مقایسه می‌کند.</li>
<li>Typecheck، تست‌های واحد، Build و تست واقعی MCP از طریق STDIO را اجرا می‌کند.</li>
<li>با GitHub OIDC دستور <code>npm stage publish --access public</code> را اجرا می‌کند.</li>
</ol>

<h3>اجرای Workflow</h3>
<ol>
<li>وارد <a href="https://github.com/shahinesi/Bale-Engineering/actions/workflows/publish.yml">GitHub Actions — Stage MCP package</a> شوید.</li>
<li>روی Branch <code>main</code> گزینه <strong>Run workflow</strong> را انتخاب کنید.</li>
<li>در ورودی <code>release_version</code> مقدار <code>0.1.1</code> را وارد کنید.</li>
<li>ورودی <code>confirm_stage</code> را روی <code>true</code> بگذارید.</li>
<li>Workflow را اجرا و تمام Stepها را بررسی کنید.</li>
</ol>
<p>نسخه ورودی را فقط زمانی تغییر دهید که <code>package.json</code> نیز به همان نسخه تغییر کرده و آزاد بودن نسخه بررسی شده باشد.</p>

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
<li>نام پکیج، نسخه، محتوای هر دو README، ناشر و Provenance را بررسی کنید.</li>
<li>نسخه دقیق را با 2FA از سایت npm یا دستور زیر تأیید کنید:</li>
</ol>
</div>

~~~bash
npm stage approve <stage-id>
~~~

<div dir="rtl" align="right">
<p>تنها پس از Approval، نسخه Stageشده به انتشار عادی npm تبدیل و قابل نصب می‌شود.</p>

<h2>بررسی انتشار و Dist-tag</h2>
<p>پس از تأیید نسخه:</p>
</div>

~~~bash
npm view @bale-engineering/mcp-server@0.1.1 version
npm view @bale-engineering/mcp-server versions --json
npm view @bale-engineering/mcp-server dist-tags
~~~

<div dir="rtl" align="right">
<p>Dist-tag به نام <code>latest</code> تعیین می‌کند نصب بدون Pin مانند <code>npx @bale-engineering/mcp-server</code> کدام نسخه را دریافت کند. اگر <code>latest</code> هنوز به <code>0.0.0-stage</code> اشاره می‌کند، از <code>@latest</code> استفاده نکنید و نسخه تأییدشده را صریح Pin کنید. Maintainer می‌تواند پس از بررسی انتشار واقعی، Dist-tag را اصلاح کند.</p>
<p>برای نصب قابل‌بازتولید، نسخه دقیق را مشخص کنید:</p>
</div>

~~~bash
npx -y @bale-engineering/mcp-server@0.1.1
~~~

<div dir="rtl" align="right">
<h2>اعتبارسنجی پکیج در CI</h2>
<p>تست پکیج این موارد را بررسی می‌کند:</p>
<ul>
<li>نسخه Tarball با <code>package.json</code> یکسان باشد.</li>
<li>هر دو README کامل فارسی و انگلیسی داخل npm package باشند.</li>
<li>تنظیم Codex Desktop از طریق TOML در هر دو README وجود داشته باشد.</li>
<li>Tarball در یک Consumer موقت و تمیز نصب شود.</li>
<li>MCP Initialize، کشف Toolها، اجرای یک Tool، دریافت مرجع فارسی، خواندن Resource و اجرای Prompt از طریق STDIO کار کند.</li>
</ul>
<p>Workflow عادی CI نیز با Push و Pull Request به Branch <code>main</code>، Typecheck، تست واحد، Build و تست پکیج را اجرا می‌کند.</p>

<h2>نکات امنیتی</h2>
<ul>
<li>برای این Workflow، Secret با نام <code>NPM_TOKEN</code> در GitHub Actions نسازید.</li>
<li>متغیر <code>NODE_AUTH_TOKEN</code> را به مرحله Stage برنگردانید.</li>
<li>Trusted Publisher را فقط به همین Repository و Workflow دقیق <code>publish.yml</code> محدود نگه دارید.</li>
<li>مجوز Stage-only را ترجیح دهید. دسترسی مستقیم OIDC به <code>npm publish</code> را فقط در صورت نیاز آگاهانه فعال کنید.</li>
<li>هیچ نسخه‌ای را که قبلاً منتشر یا Stage شده است دوباره Stage یا Publish نکنید.</li>
</ul>

<h2>راهنماهای مرتبط</h2>
<ul>
<li><a href="../packages/mcp-server/README.fa.md">راهنمای کامل نصب و استفاده MCP به فارسی</a></li>
<li><a href="../packages/mcp-server/README.md">Complete MCP installation and usage guide</a></li>
<li><a href="../README.fa.md">صفحه اصلی فارسی مخزن</a></li>
</ul>

</div>
