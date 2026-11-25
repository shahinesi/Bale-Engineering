<div dir="rtl" align="right">

<p align="left"><a href="releasing.md">English</a> · <strong>فارسی</strong></p>

<h1>راهنمای انتشار پکیج npm</h1>
<p>نام پکیج: <code>@bale-engineering/mcp-server</code></p>
<p>مخزن: <a href="https://github.com/shahinesi/Bale-Engineering">Bale-Engineering</a></p>

<h2>چه چیزهایی آماده شده‌اند؟</h2>
<ul>
<li>پکیج MCP دیگر <code>private</code> نیست.</li>
<li>اطلاعات پکیج، CLI اجرایی و تنظیمات انتشار عمومی اضافه شده‌اند.</li>
<li>هنگام ساخت پکیج، Skillها، Knowledge، Templateها، مستندات، تصاویر و <code>sources.json</code> داخل بسته قرار می‌گیرند.</li>
<li>در حالت توسعه، فایل‌ها از ریشه مخزن خوانده می‌شوند؛ در نصب npm، از داده‌های همراه پکیج.</li>
<li>CI شامل Typecheck، تست واحد، Build و تست واقعی پکیج نصب‌شده با MCP STDIO است.</li>
<li>Workflow انتشار از Trusted Publishing و OIDC پشتیبانی می‌کند.</li>
</ul>

<h2>نکته مهم: مالکیت Scope در npm</h2>
<p>نام پکیج از Scope با نام <code>@bale-engineering</code> استفاده می‌کند. حساب منتشرکننده باید مالک این Organization/Scope باشد یا مجوز انتشار در آن را داشته باشد. نام مخزن GitHub به‌تنهایی مالکیت Scope در npm را ایجاد نمی‌کند.</p>
<p>اگر این Scope متعلق به تو نیست، قبل از انتشار باید نام پکیج را به Scope متعلق به خودت یا یک نام آزاد بدون Scope تغییر دهیم. تحت نام سازمان دیگری منتشر نکن.</p>

<h2>انتشار اولیه</h2>
<p>دو روش وجود دارد:</p>

<h3>روش اول: انتشار از سیستم خودت</h3>
<p>ابتدا وارد حساب npm شو:</p>
</div>

~~~bash
npm login
~~~

<div dir="rtl" align="right"><p>سپس از ریشه مخزن:</p></div>

~~~bash
cd packages/mcp-server
npm install
npm run typecheck
npm test
npm run build
npm run test:package
npm publish --access public
~~~

<div dir="rtl" align="right">
<p>بعد از انتشار، صفحه پکیج و نسخه نصب‌شده را در npm بررسی کن.</p>

<h3>روش دوم: انتشار از GitHub Actions</h3>
<ol>
<li>یک Granular Access Token در npm بساز که مجوز انتشار این Scope را داشته باشد.</li>
<li>در تنظیمات مخزن GitHub، آن را با نام <code>NPM_TOKEN</code> در Actions Secrets قرار بده.</li>
<li>به بخش Actions برو و Workflow با نام <strong>Publish MCP package</strong> را انتخاب کن.</li>
<li>گزینه <code>confirm_publish</code> را روی <code>true</code> بگذار و اجرا کن.</li>
<li>Workflow قبل از انتشار، Typecheck، تست‌ها، Build و تست نصب واقعی پکیج را دوباره اجرا می‌کند.</li>
</ol>
<p>توکن npm را در چت، کد یا فایل Commit‌شده قرار نده.</p>

<h2>فعال‌سازی Trusted Publishing بعد از انتشار اولیه</h2>
<p>پس از اینکه پکیج برای اولین بار در npm ایجاد شد، در npmjs.com وارد تنظیمات همان پکیج شو و یک Trusted Publisher از نوع GitHub Actions اضافه کن:</p>
</div>

| فیلد | مقدار |
|---|---|
| Provider | GitHub Actions |
| Organization or user | <code>shahinesi</code> |
| Repository | <code>Bale-Engineering</code> |
| Workflow filename | <code>publish.yml</code> |
| Allowed action | <code>npm publish</code> |

<div dir="rtl" align="right">
<p>Workflow مجوز <code>id-token: write</code> دارد و با Node.js 24 اجرا می‌شود. پس از موفقیت اولین انتشار با OIDC، اگر توکن بلندمدت فقط برای انتشار اولیه ساخته شده بود، Secret مربوط به <code>NPM_TOKEN</code> را حذف کن.</p>

<h2>انتشار نسخه‌های بعدی</h2>
<ol>
<li>نسخه <code>packages/mcp-server/package.json</code> را با رعایت Semantic Versioning افزایش بده.</li>
<li>تغییر را Commit و Push کن.</li>
<li>یک Tag مطابق نسخه بساز؛ مثلاً:</li>
</ol>
</div>

~~~bash
git tag v0.1.1
git push origin v0.1.1
~~~

<div dir="rtl" align="right">
<p>GitHub Actions بسته را اعتبارسنجی و سپس منتشر می‌کند.</p>
<p>انتشار با Push معمولی انجام نمی‌شود؛ باید نسخه Tag شود یا Workflow دستی با تأیید صریح اجرا شود.</p>

<h2>تست محلی پکیج</h2>
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
<p>تست پکیج یک فایل npm می‌سازد، آن را در یک پروژه موقت نصب می‌کند، سرور نصب‌شده را با MCP Client رسمی از طریق STDIO اجرا می‌کند و ابزارها، یک مرجع فارسی، یک Resource و یک Prompt را بررسی می‌کند.</p>

<h2>وضعیت فعلی انتشار</h2>
<p>تنظیمات انتشار در مخزن آماده شده‌اند؛ اما این به معنی انتشار پکیج در npm نیست. انتشار اول همچنان به حساب npm دارای مجوز Scope <code>@bale-engineering</code> و احراز هویت اولیه نیاز دارد.</p>

</div>
