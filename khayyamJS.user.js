/*
Copyright (c) 2015 Ali Mousavi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
KhayyamJS changes the UI of the presented course list in the student portal
of Khayyam university of Mashhad. It might also work in some other universities
that might use the same portal.

Author: Ali Mousavi (ali.mousavi@gmail.com)
Github: https://github.com/tuxitop/khayyamJS
*/

// ==UserScript==
// @name        khayyamJS
// @namespace   http://alimsvi.ir/
// @description changes the UI of the presented course list in the student portal of Khayyam university of Mashhad.
// @include     http://stu.khayyam.ac.ir/strcss/ShowPresentedCourses.php
// @version     0.2
// @author      Ali Mousavi
// @require     https://code.jquery.com/jquery-1.10.2.js
// @require     https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js
// @grant       none
// ==/UserScript==


// define a course class.
var Course = function(index, courseColArray) {
    /* the first element is the row index in html class and
    the second element is the array made by looping in Jquery selector $("tr")
    and finding $("td") elements.
    the third element is the popup that is shown when clicking on course id.
    */
    this.index = index;
    this.id = "course-" + this.index;
    this.stGroupID = courseColArray[2];
    this.title = courseColArray[3];
    this.weight = courseColArray[4];
    this.stSigned = courseColArray[5];
    this.stCapacity = courseColArray[6];
    this.stVacancy = this.stCapacity - this.stSigned;
    this.stVacancyPercent = (this.stVacancy / this.stCapacity) * 100;
    this.faculty = courseColArray[7];
    this.teacherID = courseColArray[8];
    this.teacher = courseColArray[9];

    // courseColArray 1 consists of specs that should be extracted differently.
    // the regular expressions to extract different parts of specs.
    var re_specs = /<body>(.+)<\/body>/g;
    var re_courseID = /(\d+)<\/a>/g;
    var re_field = /رشته&nbsp;(مهندسی )?(.*?) دوره/;
    var re_degree = /<b>مقطع:<\/b> (.*?)<br>/g;
	var re_bldg = /,ساختمان ?(\d)\)/g;
    var re_exam = /امتحان روز:<\/b> ?(.*?) ?ساعت ?(\d+)/g;

    this.specs = re_specs.exec(courseColArray[1])[1];
    this.courseID = re_courseID.exec(courseColArray[1])[1];
    this.field = re_field.exec(courseColArray[1])[2];
    this.degree = re_degree.exec(courseColArray[1])[1];
    this.examDay = "-";
    this.examHour = "-";
    if ( (examMatch = re_exam.exec(courseColArray[1])) !== null) {
        this.examDay = examMatch[1];
        this.examHour = examMatch[2];
    }

    var bldgMatch = re_bldg.exec(courseColArray[1]);
    this.bldg = "-";
	if (bldgMatch !== null) {
		this.bldg = bldgMatch[1];
	}

    this.fieldID = this.courseID.substr(0, 4);
    this.sessionsArray = this.getSessionsArray();
    this.reqsArray = this.getReqsArray();
};

Course.prototype.addToPage = function () {
    // make the list.
    $(".course-list").append('<div class="course-item panel panel-default" id="' + this.id + '">' +
    '<div class="course-header panel-heading"></div>' +
    '<div class="course-specs panel-body"></div>' +
    '</div>');

    // Add Course Headings:
    $("#" + this.id + " > .course-header").append(
        '<div class="row">' +
            '<div class="col-xs-3 col-sm-1 course-index">' +
                '<i class="fa fa-chevron-left"></i>  ' + this.index +
            '</div>' +
            '<div class="col-sm-2 col-xs-9 course-title">' +
                '<i class="fa fa-book"></i> ' + this.title +
            '</div>' +
            '<div class="col-sm-2 col-xs-5 course-teacher">' +
                '<i class="fa fa-user"></i> ' + this.teacher +
            '</div>' +
            '<div class="col-sm-3 col-xs-5 course-field">' +
                '<i class="fa fa-graduation-cap"></i> ' + this.degree + " " + this.field +
            '</div>' +
            '<div class="col-sm-2 col-xs-4 course-vacancy">' +
                '<i class="fa fa-user-plus"></i> ' + this.stSigned + " از " + this.stCapacity +
            '</div>' +
            '<div class="col-sm-1 col-xs-4 course-gender">' +
                this.getGender()[1] +
            '</div>' +
            '<div class="col-sm-1 col-xs-4 course-bldg">' +
                '<i class="fa fa-building-o"></i> ' + this.bldg +
            '</div>' +
        '</div>'
    );

    // Add Course Specs
    $("#" + this.id + " > .course-specs").append(
        '<div class="container-fluid"><div class="row">' +
            '<div class="col-sm-7 col-xs-12 col-md-6 course-specs-left">' +
                '<div class="row">' +
                    '<div class="col-xs-2 course-specs-heading">جلسه‌ها: </div>' +
                    '<div class="col-xs-10 course-sessions"></div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-2 course-specs-heading">ظرفیت:</div>' +
                    '<div class="col-xs-10 course-capacity">' +
                        this.stCapacity + ' نفر (فضای باقی‌مانده: ' + this.stVacancy + ' نفر)' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-2 course-specs-heading">جنسیت:</div>' +
                    '<div class="col-xs-4 course-gender">' + this.getGender()[2] + '</div>' +
                    '<div class="col-xs-2 course-specs-heading">ساختمان:</div>' +
                    '<div class="col-xs-4 course-bldg">' + this.bldg + '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-2 course-specs-heading">امتحان:</div>' +
                    '<div class="col-xs-4 course-exam">' + this.examDay + " ساعت " + this.examHour + '</div>' +
                    '<div class="col-xs-2 course-specs-heading">وزن:</div>' +
                    '<div class="col-xs-4 course-weight">' + this.weight[0] + ' واحد</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-2 course-specs-heading">گروه:</div>' +
                    '<div class="col-xs-10 course-group">' +
                        this.stGroupID + ' (این کد را برای انتخاب واحد یادداشت کنید.)' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-2 course-specs-heading">کد درس:</div>' +
                    '<div class="col-xs-4 course-id">' + this.courseID + '</div>' +
                    '<div class="col-xs-2 course-specs-heading">کد استاد:</div>' +
                    '<div class="col-xs-4 course-teacherID">' + this.teacherID + '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-2 course-specs-heading">وابستگی‌ها:</div>' +
                    '<div class="col-xs-10 course-reqs"></div>' +
                '</div>' +
            '</div>' +
            '<div class="col-sm-5 col-md-3 col-xs-12 course-table">' +
                this.getTable() +
            '</div>' +
        '</div></div>'
    );

    // Change style if courses are getting full.
    if (this.stVacancyPercent <= 14) {
        if (this.stVacancy === 0) {
            $("#" + this.id).addClass("no-vacancy");
        }
        else {
            $("#" + this.id).addClass("low-vacancy");
        }
    }

    // change style of session table for each session, and add sessions to specs.
    for (var i = 0; i < this.sessionsArray.length; i++) {
        var session = this.sessionsArray[i];
        if (session.repeatCode === 1) {
            $("#" + this.id + " #table-item-" + session.tableID).addClass("session-eow");
            $("#" + this.id + " #table-item-" + session.tableID).html(session.startWeek[0]);
            // add session html
            $("#" + this.id + " .course-sessions").append(
                '<div class="row">' +
                    '<div class="col-sm-12 session-time">' +
                        session.day + ' ساعت ' + session.hour +
                        ' (' + session.repeat + ' - هفته‌های ' + session.startWeek + ')' +
                    '</div>' +
                '</div>'
            );
        }
        else {
            $("#" + this.id + " #table-item-" + session.tableID).addClass("session-ew");
            // add session html
            $("#" + this.id + " .course-sessions").append(
                '<div class="row">' +
                    '<div class="col-sm-12 session-time">' +
                        session.day + ' ساعت ' + session.hour +
                    '</div>' +
                '</div>'
            );
        }
    }

    // Add Requirements to the specs.
    if (!this.reqsArray.length) {
        $("#" + this.id + " .course-reqs").text('-');
    }
    else {
        for (var i = 0; i < this.reqsArray.length; i++) {
            req = this.reqsArray[i];
            $("#" + this.id + " .course-reqs").append(
                '<div class="row">' +
                    '<div class="col-sm-12 text-danger">' +
                        req.title + ' (' + req.type + ')' +
                    '</div>' +
                '</div>'
            );
        }
    }
};
Course.prototype.getTable = function() {
    var rowsHTML = "";
    var days = ["", "ش", "۱ش", "۲ش", "۳ش", "۴ش", "۵ش"];
    var hours = ["", "۸", "۱۰", "۱۲", "۱۴", "۱۶"];

    // make header
    rowsHTML += '<div class="row table-header">';
    hours.forEach(function(CurrentHour) {
        rowsHTML += '<div class="col-xs-2 table-item table-header-item">' + CurrentHour +'</div>';
    });
    rowsHTML += '</div>';

    // make the rest
    for (var i = 1; i < days.length; i++) {
        rowsHTML += '<div class="row">';
        rowsHTML += '<div class="col-xs-2 table-item table-header-day">' + days[i] + '</div>';
        for (var j = 1; j < hours.length; j++) {
            rowsHTML += '<div class="col-xs-2 table-item" id="table-item-' + (i-1).toString() + (j-1).toString() + '"></div>';
        }
        rowsHTML += '</div>';
    }
    return rowsHTML;
};
Course.prototype.getSessionsArray = function() {
    // returns an array of Session objecs.
    var sessionsArray = [];
    var re_session = /جلسه? (.+?)? روز:<\/b> ?(.+?) ?ساعت ?(\d+) ?\( ?(هر ?هفته|هفته در ?میان) به مدت ?(\d+) ?دقیقه.+?شروع (فرد|زوج)<br>/g;
    var reMatch;
    var hoursArray = ["8", "10", "12", "14", "16", "18"];
    var daysArray = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه"];

    while ((reMatch = re_session.exec(this.specs)) !== null ) {
        var Session = {};
        Session.day = reMatch[2];
        Session.hour = reMatch[3];
        Session.repeat = reMatch[4];
        Session.duration = reMatch[5];
        Session.startWeek = reMatch[6];
        Session.hourCode = hoursArray.indexOf(Session.hour);
        Session.dayCode = daysArray.indexOf(Session.day);
        Session.repeatCode = ["هر هفته", "هفته در میان"].indexOf(Session.repeat);
        Session.tableID = Session.dayCode.toString() + Session.hourCode.toString();
        sessionsArray.push(Session);
    }
    return sessionsArray;
};
Course.prototype.getReqsArray = function() {
    reqsArray = [];
    var re_reqs = /کد درس ?: ?(\d+?) نام درس: (.*?) تعداد واحد: ?(\d) ?\( ?(پیشنیاز|همنیاز)\) ?کد ?معادل ?: ?(-?\d+?)<\/li>/g;
    var reMatch;
    while ((reMatch = re_reqs.exec(this.specs)) !== null ) {
        var Req = {};
        Req.id = reMatch[1];
        Req.title = reMatch[2];
        Req.weight = reMatch[3];
        Req.type = reMatch[4];
        Req.altId = reMatch[5];
        reqsArray.push(Req);
    }
    return reqsArray;
};
Course.prototype.getGender = function() {
    /*
	returns array of [genderCode, genderIcon, genderName]
    code is 0 for male, 1 for female, 2 for both.
    */
    var re_gender = /قابل انتخاب برای دانشجویان:<\/b> ((مرد)?( و )?(زن)?)&nbsp/g;
    var reMatch = re_gender.exec(this.specs);
    var code, icon;
	if (reMatch[2]) {
		if (reMatch[4]){
			code = 2;
            icon = '<i class="fa fa-male"></i>|<i class="fa fa-female"></i>';
		}
		else {
			code = 0;
            icon = '<i class="fa fa-male"></i>';
		}
	}
	else {
		code = 1;
        icon = '<i class="fa fa-female"></i>';
	}
    return [code, icon, reMatch[1]];
};
Course.prototype.bldgHTML = function() {
	// returns HTML code if there is building or "" if there isn't
	return '<div class="col-sm-1 course-bldg">' +
			'<i class="fa fa-building-o"></i> ' +
    	    this.bldg + '</div>';
};


var mkCourseArray = function() {
    /* creates and returns a courses array function. should only be called once
    at the beggining */
    var coursesArray = [];
    // loop through each table row.
    $("tr").each(function(i, row) {
        // find each column in the row and add it to courseColArray.
        var courseColArray = [];
        var columns = $(this).find("td");
        columns.each(function() {
            courseColArray.push($(this).html());
        });
        // this if is because the header line doesn't have any "td"s
        if (courseColArray.length) {
            coursesArray.push(new Course(i, courseColArray));
        }
    });
    return coursesArray;
};


var createBody = function() {
    // makes the page ready and creates the body of the page.
    $("center").prevAll("script").remove();
    $("center, style, link").remove();

    // add necessary styleseets.
    $('head').append(
        '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">' +
        '<link rel="stylesheet" href="http://cdn.rawgit.com/morteza/bootstrap-rtl/master/dist/css/bootstrap-rtl.min.css">' +
        '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">' +
        '<link rel="stylesheet" href="https://cdn.rawgit.com/tuxitop/khayyamJS/v0.2/style.css">'
    );

    //navbar
    $("body").append(
        '<nav class="navbar navbar-fixed-top">' +
            '<div class="navbar-default">' +
                '<div class="container">' +
                    '<div class="navbar-header">' +
                        '<a class="navbar-brand" href="#">khayyam<i>JS</i></a>' +
                    '</div>' +
                    '<ul class="nav navbar-nav navbar-left">' +
                        '<li id="about-link"><a href="#">درباره</a></li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
            '<div class="about" id="about-container" style="display: none">' +
                '<div class="container">' +
                    '<div class="row">' +
                        '<div class="col-md-6 col-sm-12">' +
                            '<h3>هدف پروژه</h3>' +
                            '<p>' +
                                'خیام‌جی‌اس یک اسکریپت به زبان جاوااسکریپت است که ظاهر صفحه‌ی «درس‌های ارایه شده» ' +
                                'در پرتال دانشجویی را تغییر داده و به شکلی کامل‌تر، زیباتر و با امکاناتی ' +
                                'بیشتر تبدیل می‌کند؛ چرا که این صفحه یکی از مهم‌ترین صفحه‌هاییست که هر دانشجو ' +
                                'پیش از انتخاب واحد به اطلاعات آن نیاز داشته و می‌بایست با دقت بررسی کند. این ' +
                                'در حالی است که ظاهر پیش‌فرض صفحه کمکی به این موضوع نکرده و بیشتر باعث سردرگمی دانشجو خواهد شد.' +
                            '</p>' +
                        '</div>' +
                        '<div class="col-md-6 col-sm-12">' +
                            '<h3>راه‌های کمک به پروژه</h3>' +
                            '<p>' +
                                'پیشرفت این پروژه به شما بستگی دارد. من این پروژه را در وقت آزاد خود توسعه می‌دهم ' +
                                'و بازخوردی که از شما دریافت می‌کنم مرا به ادامه‌ی پروژه‌ی ترغیب خواهد کرد. ' +
                                'هر یک از کارهای زیر کمکی بزرگ محسوب شده و به ادامه‌ی روند توسعه‌ی این کد کمک خواهد کرد: ' +
                                '<ol>' +
                                    '<li>کمک‌های مالی</li>' +
                                    '<li>گزارش مشکلات از طریق <a href="https://github.com/tuxitop/khayyamJS/issues">صفحه‌ی مشکلات پروژه در گیت‌هاب</a> و یا ارسال ای‌میل به آدرس ali.mousavi@gmail.com.</li>' +
                                    '<li>پیشنهاد امکانات جدید از طریق <a href="https://github.com/tuxitop/khayyamJS/issues">صفحه‌ی پروژه در گیت‌هاب</a> و یا ارسال ای‌میل.</li>' +
                                    '<li>کمک در توسعه‌ی اسکریپت.</li>' +
                                '</ol>' +
                            '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-md-6 col-sm-12">' +
                            '<h3>دسترسی و مجوز</h3>' +
                            '<p>' +
                            'خیام‌جی‌اس توسط <a href="http://alimsvi.ir">علی موسوی</a> نوشته شده و در گیت‌هاب میزبانی می‌شود. ' +
                            'این پروژه تحت مجوز MIT منتشر شده است (متن مجوز در صفحه‌ی گیت‌هاب پروژه و در فایل LICENSE موجود می‌باشد). ' +
                            'استفاده از کدهای این پروژه در پروژه‌های دیگر با رعایت شرایط مجوز MIT آزاد می‌باشد.' +
                            '</p>' +
                            '<p>صفحه‌ی پروژه در گیت‌هاب: <a href="https://github.com/tuxitop/khayyamJS">https://github.com/tuxitop/khayyamJS</a></p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</nav>'
    );
    $(".navbar-nav").data("size", "big");
    $(window).scroll(function(event) {
      if ( $(document).scrollTop() ) {
        if ( $(".navbar-nav").data("size") === "big" ) {
          $(".navbar-nav li a, .navbar-brand").animate({"padding": "3px 15px 0 15px", "height": "30px"});
          $(".navbar-nav").data("size", "small");
        }
      }
      else if ( $(".navbar-nav").data("size") === "small" ) {
        $(".navbar-nav li a, .navbar-brand").animate({"padding": "15px 15px 10px 15px", "height": "50px"});
        $(".navbar-nav").data("size", "big");
       }
    });
    $('#about-link').click(function(event) {
        event.preventDefault();
        $('#about-container').slideToggle();
        $('#about-link').toggleClass('clicked');
    });

    // the jumbotron
    $("body").append(
    '<div class="container">' +
        '<div class="jumbotron">' +
            '<h1 class="page-header text-center">فهرست درس‌های ارایه شده</h1>' +
        '</div>' +
    '</div>');

    // Filter Part
    $("body").append(
        '<div class="container">' +
            '<div class="panel panel-default query-panel">' +
                '<div class="panel-body">' +
                    '<h3 class="query-header">فیلتر درس‌ها:</h3>' +
                    '<div class="row">' +
                        '<div class="query-title col-xs-1">رشته: </div>' +
                        '<select class="col-xs-11 col-sm-3 form-control query-select">' +
                            '<option>همه رشته‌ها</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );

    // coures list
    $("body").append('<div class="container"><div class="course-list"></div></div>');

    // footer
    $("body").append('<div class="footer"><a href="https://github.com/tuxitop/khayyamJS">khayyam<i>JS</i></a> is created by <a href="http://alimsvi.ir">Ali Mousavi</a></div>');
};


$(document).ready(function(){
    var coursesArray = mkCourseArray();
    createBody();
    coursesArray.forEach(function(current_course) {
        current_course.addToPage();
    });
    $('.course-header').click(function() {
        $(this).next().slideToggle();
        $(this).find(".fa-chevron-left").toggleClass("fa-rotate-270");
    });
});
