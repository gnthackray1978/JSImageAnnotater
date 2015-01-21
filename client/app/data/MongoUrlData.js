var UrlWriter = function () {
 
 
    this.baseUrl = 'https://jsimageannotater-gnthackray1978.c9.io';
 
};

UrlWriter.prototype = {

    
    Save: function( urlName, url, urlGroup,urlDefault, successMethod){
    
        console.log('save url ' +this.urlId + ' ' + urlName + ' ' +  url + ' ' + urlGroup);
        var that = this;
        
        var result = {
            "urlId" : this.urlId,
            "url" : url,
            "urlName" : urlName,
            "urlGroup" : urlGroup,
            "urlDefault" :urlDefault
        };
    
        var stringy = JSON.stringify(result);
    
        $.ajax({
                type: "POST",
                async: false,
                url: this.baseUrl  + '/notes/urls/',
                data: stringy,
                contentType: "application/json",
                dataType: "JSON",
                success: function(jsonData) {
                    successMethod(jsonData.urlId);
                }
            });
     
    
    },
    
    Delete: function (urlId) {
        console.log('delete url ' +urlId);
    },
    
    UrlChanged: function (urlId, response) {
        // get url data here 
         $.ajax({
    
             type: "GET",
             async: false,
             url: this.baseUrl  + '/notes/urls/urlid/'+ this.urlId,
             contentType: "application/json",
             dataType: "JSON",
             success: function(ajaxResult) {
                console.log('image loaded');
                //href.substr(href.lastIndexOf('/') + 1)
                
                ajaxResult.title = ajaxResult.url.substr(ajaxResult.url.lastIndexOf('/') + 1);
                
                response(ajaxResult);
             },
             error: function() {
                alert('Error loading data');
             }
         });
    
    },
    
    GetUrls: function (filter, callback){
        var url = this.baseUrl  + '/notes/urls/';
        
        if(filter)
            url += filter;
        
        var that = this;
        
         $.ajax({
    
             type: "GET",
             async: false,
             url: url,
             contentType: "application/json",
             dataType: "JSON",
             success: function(jsonData) {
                //that.updateUrlList(jsonData);
                callback(jsonData);
             },
             error: function(e) {
                alert('Error loading data' + e);
             }
         });
 
    }
    
}
   