"use strict";

var runner = require('../inc/browserRunner');
var url1 = "https://accounts.google.com/ServiceLogin?sacu=1&passive=1209600&acui=1#Email=ronald%401stdibs.com";
var url2 = "https://docs.google.com/a/1stdibs.com/forms/d/1nZrshYFmX71G0zq70k2EDM5DzK5jyKMjOtAyq0KeksQ/viewform";


var func1 = function (page, done) {

    page.open(url1, function (status) {

        if (status !== 'success') {
            return console.log('failed opening ' + url1);
        }

        console.log('this is the status', status);
        // wait a full second for the page to load :
        setTimeout(function () {
            page.evaluate(function() {
                var pswd = 'ENTER THE PW HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
                document.querySelectorAll('#Passwd')[0].value = pswd;
                document.querySelectorAll('input[type="submit"]')[0].click();
                //return document.body.innerHTML;
                return document.querySelectorAll('#Passwd')[0].value;

            }, function (result) {
                console.log('entered PW was : ', result);
                done();
            });
        }.bind(this), 5000);
    });
};

var func2 = function (page, done) {

    page.open(url2, function (status) {

        if (status !== 'success') {
            return console.log('failed opening ' + url2);
        }

        setTimeout(function () {
            page.evaluate(function() {
                document.querySelectorAll('input[type=radio]')[0].click();
                document.querySelectorAll('input[type=submit]')[0].click();
                return document.querySelectorAll('input[type=submit]')[0].innerHTML;

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
