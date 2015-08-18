"use strict";

var runner = require('../inc/browserRunner');
var _ = require('underscore');
var url1 = "https://accounts.google.com/ServiceLogin?sacu=1&passive=1209600&acui=1#Email=ronald%401stdibs.com";
var url2 = "https://docs.google.com/a/1stdibs.com/forms/d/1nZrshYFmX71G0zq70k2EDM5DzK5jyKMjOtAyq0KeksQ/viewform";
var config = require('../inc/config');


var func1 = function (page, done) {

    page.open(url1, function (status) {

        if (status !== 'success') {
            return console.log('failed opening ' + url1);
            done();
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
                page.evaluate(function() {
                    var pswd = config.password;
                    var passwdBtn = document.querySelectorAll('#Passwd')[0];
                    var signInBtn = document.querySelectorAll('#signIn')[0];
                    passwdBtn.value = pswd;
                    signInBtn.click();
                    return [passwdBtn.outerHTML, signInBtn.outerHTML];

                }, function (result) {

                    console.log('here are the elements used to enter the PW : ', result[0], result[1]);

                    // wait 5 seconds to move on to the next step so we can be sure login completed :
                    setTimeout(function () {
                        console.log('moving on so step 2 : filling out the form');
                        done();
                    }, 5000);

                });
            }.bind(this), 1000);

        }.bind(this), 5000);
    });
};

var func2 = function (page, done) {

    page.open(url2, function (status) {

        if (status !== 'success') {
            return console.log('failed opening ' + url2, status);
            done();
        }

        // wait 1 second for the page to load.
        setTimeout(function () {
            page.evaluate(function() {
                document.querySelectorAll('input[type=radio]')[0].click();
                document.querySelectorAll('input[type=submit]')[0].click();
                return document.querySelectorAll('input[type=submit]')[0].outerHTML;

            }, function (result) {
                console.log("submit button HTML", result);
                done();
            });
        }.bind(this), 1000);

    });
};


//runner.run([func1]);
runner.run([func1, func2]);



// STEP 1 :
//            $('#Passwd').val(pswd);
//            $('input[type="submit"]').click();

// STEP 2 :
//            $('input[type=radio]').click();
//            $('input[type=submit]').click();
