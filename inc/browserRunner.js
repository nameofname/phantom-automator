"use strict";

var phantom = require('phantom');
var fs = require('fs');
var imagePath = fs.realpathSync(__dirname + '/../imgs');
var capFileName = 'screenCap.jpeg';
//page.set('viewportSize', {width:1280,height:900}, function(){ // TODO !!! set browser dimensions!


/**
 * Gets a new file name for screen capture file.
 * @returns {string}
 * @private
 */
function _getNewFileName () {
    var imgArr = fs.readdirSync(imagePath);
    var name = capFileName;
    var n = 0;

    while (imgArr.indexOf(name) !== -1) {
        name = capFileName.split('.').join(n + '.');
        n++;
    }

    return imagePath + '/' + name;
};


module.exports = {

    /**
     * Creates an instance of phantomJS page object ad applies to each callback in the array.
     * For each callback that is applied a screen capture will be taken when the done method is called.
     * Each callback is applied with the params :
     *      - page <object> an instance of phantomJS page
     *      - done <function> a method to indicate when your code is complete. Invoking this will run the next callback
     *      in the callback array
     * @param callbackArr <array> - an array of functions. Each function in the callback array will be called in order
     * whenever the "done" method is invoked.
     */
    run : function (callbackArr) {
        console.log('BEGIN RUNNING NODE-PHANTOM SCRIPTS');

        phantom.create("--ignore-ssl-errors=yes", "--ssl-protocol=any", function (ph) {
            ph.createPage(function (page) {

                // run the first callback passing "done" method
                // when done method is invoked, run the next callback in the array until they are all finished.
                var idx = -1;

                var doNext = function () {

                    // Internal helper function moves us on to the next callback in the chain :
                    var _increment = function () {
                        // increment the callback number :
                        idx++;

                        // Inoke the callback passing page and done methods. If this is the last callback in the chain
                        // then exit.
                        if (callbackArr[idx]) {
                            callbackArr[idx](page, doNext);
                        } else {
                            console.log('PROCESS COMPLETE, EXITING.');
                            ph.exit();
                        }
                    };

                    // for completed callbacks, take a screen cap then move on :
                    if (idx > -1) {
                        var fileName = _getNewFileName();
                        page.render(fileName, function (finished) {
                            console.log('taking screen capture (' + fileName + ')', idx);
                            _increment();
                        });

                        // If this is the first call (not completed) then we move on right away :
                    } else {
                        _increment();
                    }
                };

                // kick off the callback chain :
                doNext();
            });
        });
    }
};
