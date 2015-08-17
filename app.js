var phantom = require('node-phantom');
//var page = require('webpage').create();
var phantomjs = require('phantomjs');



var url1 = "https://accounts.google.com/ServiceLogin?sacu=1&passive=1209600&acui=1#Email=ronald%401stdibs.com";
var url2 = "https://docs.google.com/a/1stdibs.com/forms/d/1nZrshYFmX71G0zq70k2EDM5DzK5jyKMjOtAyq0KeksQ/viewform";
var pswd;

phantom.create(function(err,ph) {
    return ph.createPage(function(err,page) {
        return page.open(url1, function(err,status) {
            if (status !== 'success') {
                console.log('Unable to access network');
            } else {
                var ua = page.evaluate(function() {
                    $('#Passwd').val(pswd);
                    $('input[type="submit"]').click();
                });
                console.log(ua);
            }
            phantom.exit();
        });
    });
});




//phantom.open(url1, function (status) {
//    if (status !== 'success') {
//        console.log('Unable to access network');
//    } else {
//        var ua = page.evaluate(function() {
//            $('#Passwd').val(pswd);
//            $('input[type="submit"]').click();
//        });
//        console.log(ua);
//    }
//    phantom.exit();
//});


//phantom = webpage.create();
//phantom.open(function (status) {
//    if (status !== 'success') {
//        console.log('Unable to access network');
//    } else {
//        var ua = page.evaluate(function() {
//            $('input[type=radio]').click();
//            $('input[type=submit]').click();
//        });
//        console.log(ua);
//    }
//    phantom.exit();
//});
