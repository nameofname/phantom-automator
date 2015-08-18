"use strict";

var runner = require('../inc/browserRunner');
var _ = require('underscore');
var url1 = "https://accounts.google.com/ServiceLogin?sacu=1&passive=1209600&acui=1#Email=ronald%401stdibs.com";
var url2 = "https://docs.google.com/a/1stdibs.com/forms/d/1nZrshYFmX71G0zq70k2EDM5DzK5jyKMjOtAyq0KeksQ/viewform";
var config = require('../inc/config');
var runArr = [];

var func1 = function (page, done) {

    page.open(url1, function (status) {

        if (status !== 'success') {
            done();
            return console.log('failed opening ' + url1);
        }
        console.log('page ' + url1 + ' opened with status :', status);

        // wait a full second for the page to load before clicking around :
        setTimeout(function () {

            // first hit the next button since the email is pre-filled via the URL :
            page.evaluate(function() {

                var nextBtn = document.querySelectorAll('#next')[0];
                nextBtn.click();
                return nextBtn;

            }, function (result) {
                console.log('here are the elements used to click the next button : ', result.outerHTML);
            });

            // wait 1 second for the sign in button to show up, then enter the PW and sign in :
            setTimeout(function () {
                page.evaluate(function(pwd) {
                    var pswd = pwd;
                    var passwdBtn = document.querySelectorAll('#Passwd')[0];
                    var signInBtn = document.querySelectorAll('#signIn')[0];
                    passwdBtn.value = pswd;
                    signInBtn.click();
                    return [passwdBtn.outerHTML, signInBtn.outerHTML];

                }, function (result) {

                    console.log('here are the elements used to enter the PW : ', result[0], result[1]);

                    // wait 5 seconds to move on to the next step so we can be sure login completed :
                    // NOTE* Close this page first.
                    setTimeout(function () {
                        console.log('moving on so step 2 : filling out the form');
                        done();
                    }, 5000);

                }, config.password); // pass in the PW to the first function
            }.bind(this), 1000);

        }.bind(this), 5000);
    });
};

var func2 = function (page, done) {

    page.open(url2, function (status) {

        if (status !== 'success') {
            done();
            return console.log('failed opening ' + url2, status);
        }
        console.log('page ' + url2 + ' opened with status :', status);

        // wait 1 second for the page to load.
        setTimeout(function () {
            page.evaluate(function() {
                document.querySelectorAll('input[type=radio]')[0].click();
                document.querySelectorAll('input[type=submit]')[0].click();
                return document.querySelectorAll('input[type=submit]')[0].outerHTML;

            }, function (result) {
                console.log("submit button HTML", result);
                // use another timeout because that's how we roll in phantomJS
                setTimeout(function () {
                    done();
                }, 1000);
            });
        }.bind(this), 1000);

    });
};


// create a run array starting with the login function, then proceeding to MANY form submissions.
runArr.push(func1);
for (var i = 0; i < 100; i++) {
    runArr.push(func2);
}

console.log('running an array of {N} functions :', runArr.length);
runner.run(runArr);

