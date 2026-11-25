<div dir="rtl" align="right">

<p align="left"><a href="README.md">English</a> · <strong>فارسی</strong></p>

# اتصال Bale Engineering به Agentها

Skillهای اصلی در پوشه <code>skills/</code> نگهداری می‌شوند. می‌توانید Skill را مستقیماً نصب کنید یا سرور MCP را به Agent وصل کنید. از ساخت Forkهای جداگانه از محتوای دانش خودداری کنید.

## نصب با Skills CLI

</div>

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-engineering
~~~

<div dir="rtl" align="right">

نصب Skillهای تخصصی به‌صورت جداگانه:

</div>

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-bot-api
npx skills add shahinesi/Bale-Engineering --skill bale-business-api
npx skills add shahinesi/Bale-Engineering --skill bale-miniapp
npx skills add shahinesi/Bale-Engineering --skill bale-safir
npx skills add shahinesi/Bale-Engineering --skill bale-wallet-payments
npx skills add shahinesi/Bale-Engineering --skill bale-engineering-review
~~~

<div dir="rtl" align="right">

## Codex

Skill را با Skills CLI نصب کنید یا پوشه موردنیاز را در مسیر <code>.agents/skills</code> پروژه قرار دهید. برای MCP محلی، ابتدا سرور را Build کنید و سپس دستور معرفی‌شده در <a href="../packages/mcp-server/README.fa.md">راهنمای MCP</a> را اجرا کنید.

## Claude Code

Skill را با Skills CLI نصب کنید یا در مسیر <code>.claude/skills</code> پروژه قرار دهید. برای اتصال MCP محلی از دستور راهنمای MCP استفاده کنید.

## Cursor و Agentهای دیگر

اگر Agent از Skills CLI پشتیبانی می‌کند، از همان روش استفاده کنید. در غیر این صورت پوشه Skill را به مسیر مستندشده برای Skills یا Rules در همان Agent منتقل کنید.

## نکته مهم

فرمت فایل تنظیمات و مسیر Skillها ممکن است بین نسخه‌های Agent متفاوت باشد. پیش از ثبت تنظیمات در مخزن یا تیم، مستندات نسخه فعلی ابزار را بررسی کنید. محتوای Skillها باید در این مخزن مرجع اصلی باقی بماند.

</div>
