
(function(exports){

    // your code goes here

    var cc = function (bannana) {
        this.monkey ='monkey';
        this.bannana = bannana;
    };

    cc.prototype = {
        init:function(){
            console.log('init hello: ' + this.monkey + ' - ' +this.bannana);
        }
    };

    exports.cc = cc;
    

})(typeof exports === 'undefined'? this: exports);