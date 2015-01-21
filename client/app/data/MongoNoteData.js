

var MongoNoteData = function () {
 
 
    this.baseUrl = 'https://jsimageannotater-gnthackray1978.c9.io';

};


MongoNoteData.prototype = {
    
    init:function(){
        
    },
    
    Type:function(){
        return 'AJAX';
    },
    
    GetImageData: function(callback){
        //dummy values not intended to be used
        var imageData = {
            title:'unpopulated',
            urlId :0,
            url: 'unpopulated',
            width :0,
            height:0
        };
           
            
        callback(imageData);
    },
    
    GetNoteData: function (urlId, callback) {
        
         $.ajax({
             type: "GET",
             async: false,
             url: this.baseUrl  + '/notes/'+urlId,
             contentType: "application/json",
             dataType: "JSON",
             success: function(ajaxResult) {
                console.log('loaded');
                callback(ajaxResult);
             },
             error: function() {
                alert('Error loading data');
             }
         });
    },
    
    WriteNoteData: function (note) {
        
        var stringy = JSON.stringify(note);
    
        $.ajax({
                type: "POST",
                async: true,
                url: this.baseUrl  + '/notes/annotation/',
                data: stringy,
                contentType: "application/json",
                dataType: "JSON"
            });
    },

    GetOptions: function (urlId,callback) {
 
        var url = this.baseUrl  + '/notes/option/'+urlId;

        var that = this;
        
        $.ajax({
    
             type: "GET",
             async: false,
             url: url,
             contentType: "application/json",
             dataType: "JSON",
             success: function(jsonData) {
                callback(jsonData);
             },
             error: function(e) {
                alert('Error loading data' + e);
             }
         });
 
    },
    
    SaveOptions: function (options) {
        
        var stringy = JSON.stringify(options);
    
        $.ajax({
                type: "POST",
                async: false,
                url: this.baseUrl  + '/notes/option/',
                data: stringy,
                contentType: "application/json",
                dataType: "JSON",
                success: function(jsonData) {
                    console.log(jsonData);
                }
        });
    }
    
    
};