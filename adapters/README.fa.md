<div dir="rtl" align="right">

<p align="left"><a href="README.md">English</a> · <strong>فارسی</strong></p>
<h1>اتصال Bale Engineering به Agentها</h1>
<p>Skillهای اصلی در پوشه <code>skills/</code> نگهداری می‌شوند. می‌توانید Skill را مستقیماً نصب کنید یا سرور MCP را به Agent وصل کنید. از ساخت Forkهای جداگانه از محتوای دانش خودداری کنید.</p>
<h2>نصب با Skills CLI</h2>
</div>

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-engineering
~~~

<div dir="rtl" align="right"><p>نصب Skillهای تخصصی به‌صورت جداگانه:</p></div>

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-bot-api
npx skills add shahinesi/Bale-Engineering --skill bale-business-api
npx skills add shahinesi/Bale-Engineering --skill bale-miniapp
npx skills add shahinesi/Bale-Engineering --skill bale-safir
npx skills add shahinesi/Bale-Engineering --skill bale-wallet-payments
npx skills add shahinesi/Bale-Engineering --skill bale-engineering-review
~~~

<div dir="rtl" align="right">
<h2>Codex</h2>
<p>Skill را با Skills CLI نصب کنید یا پوشه موردنیاز را در مسیر <code>.agents/skills</code> پروژه قرار دهید. برای MCP محلی، ابتدا سرور را Build کنید و سپس دستور معرفی‌شده در <a href="../packages/mcp-server/README.fa.md">راهنمای MCP</a> را اجرا کنید.</p>
<h2>Claude Code</h2>
<p>Skill را با Skills CLI نصب کنید یا در مسیر <code>.claude/skills</code> پروژه قرار دهید. برای اتصال MCP محلی از دستور راهنمای MCP استفاده کنید.</p>
<h2>Cursor و Agentهای دیگر</h2>
<p>اگر Agent از Skills CLI پشتیبانی می‌کند، از همان روش استفاده کنید. در غیر این صورت پوشه Skill را به مسیر مستندشده برای Skills یا Rules در همان Agent منتقل کنید.</p>
<h2>نکته مهم</h2>
<p>فرمت فایل تنظیمات و مسیر Skillها ممکن است بین نسخه‌های Agent متفاوت باشد. پیش از ثبت تنظیمات در مخزن یا تیم، مستندات نسخه فعلی ابزار را بررسی کنید. محتوای Skillها باید در این مخزن مرجع اصلی باقی بماند.</p>
</div>
