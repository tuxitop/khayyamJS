# khayyamJS
A user script written with javascript for changing the UI of the student portal of Khayyam university of Mashhad. It Currently only works on the "Presented course list"  page, which in my opinion is one of the most important pages, and the students usually spend a lot of their time in it.

The default UI of the page is a disaster. It includes a simple table where clicking on each courseID opens a new popup in a new tab. This script completely rewrites the default view, and uses modern design elements for displaying the page.

This is the default view **without using khayyamJS**:
![Screenshot whithout using khayyamJS](screenshots/screenshot-NOTkhayyamJS.png?raw=true)
# Screenshot
This is what khayyamJS does:
![Screenshot using khayyamJS](screenshots/screenshot-khayyamJS.png?raw=true)

# Features
* Responsive design using bootstrap and JQuery.
* Modern view of the page, using no \<table\> elements.
* Shows each session in a very nice table.
* Uses no popups. (with the power of JQuery)

# How to install
## Firefox:
1. Install [Greasmonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/).
2. Navigate to khayyamJS.user.script on github and click on the "Raw" botton and Install the script. Alternetively use this [link](khayyamJS.user.js?raw=true) and click install.

## Chrome:
1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Navigate to khayyamJS.user.script on github and click on the "Raw" botton and Install the script. Alternetively use this [link](khayyamJS.user.js?raw=true) and click install.

# To do
* Add support for course requirements.
* Querying the courses.
* Filtering the courses.
* Selecting the courses and previewing the time sheet.

# How to help
This is something I'm doing on my free time. Continuing to do so is mostly related to the amount of feedback I get from this project.
* Report Issues.
* Suggest improvements.
* Contribute to the code.

----
# خیام‌جی‌اس
خیام‌جی‌اس یک اسکریپت به زبان جاوااسکریپت است که ظاهر صفحه‌ی «درس‌های ارایه شده» در پرتال دانشجویی را تغییر داده و به شکلی کامل‌تر، زیباتر و با امکاناتی بیشتر تبدیل می‌کند؛ چرا که این صفحه یکی از مهم‌ترین صفحه‌هاییست که هر دانشجو پیش از انتخاب واحد به اطلاعات آن نیاز داشته و می‌بایست با دقت بررسی کند.

این در حالی است که ظاهر پیش‌فرض صفحه فاجعه است. یک جدول ساده که کلیک بر روی کد درس‌ها شما را به یک تب دیگر برای مشاهده‌ی اطلاعات هدایت می‌کند. خیام‌جی‌اس این ظاهر صفحه را کاملا تغییر داده و به یک صفحه‌ی مدرن و زیبا تبدیل می‌کند.

# امکانات
* طراحی کاملا واکنش‌گرا (با استفاده از بوت‌استرپ و جی‌کوئری)
* طراحی مدرن صفحه بدون استفاده از المان \<table\>
* نمایش ساعت کلاس در یک جدول زیبا
* بدون نمایش پاپ‌آپ و نمایش تمام اطلاعات در یک صفحه.

# نحوه‌ی نصب
## فایرفاکس
1. نصب افزونه‌‌ی [گریزمانکی](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/).
2. نمایش فایل khayyamJS.user.js در گیت‌هاب و کلیک بر روی دکمه‌ی Raw و نصب اسکریپت. همچنین می‌توانید از [این لینک](khayyamJS.user.js?raw=true) استفاده کنید.

# گوگل کروم
1. نصب افزونه‌ی [تمپرمانکی](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. نمایش فایل khayyamJS.user.js در گیت‌هاب و کلیک بر روی دکمه‌ی Raw و نصب اسکریپت. همچنین می‌توانید از [این لینک](khayyamJS.user.js?raw=true) استفاده کنید.

# امکانات آینده
* اضافه کردن امکان نمایش پیش‌نیاز/هم‌نیاز
* جستجو در دروس
* فیلتر کردن دروس
* انتخاب دورس و پیش‌نمایش جدول زمانی درس‌های انتخاب شده.

# راه‌های کمک به پروژه:
پیشرفت این پروژه به شما بستگی دارد. من این پروژه را در وقت آزاد خود توسعه می‌دهم و بازخوردی که از شما دریافت می‌کنم مرا به ادامه‌ی پروژه‌ی ترغیب خواهد کرد.
هر یک از کارهای زیر کمکی بزرگ محسوب شده و به ادامه‌ی روند توسعه‌ی این کد کمک خواهد کرد:

1. کمک‌های مالی.
2. گزارش مشکلات.
3. پیشنهاد امکانات جدید.
4. کمک در توسعه‌ی اسکریپت.
