var Urls = function (urlWriter, nodestore,view, loadImageCallback) {
    this.nodestore = nodestore;
     
    this.view = view;
    
    this.urlWriter = urlWriter;
    this.loadImageCallback = loadImageCallback;
};


Urls.prototype.URLSave=function( urlName, url, urlGroup,urlDefault, successMethod){
    this.urlWriter(urlName, url, urlGroup,urlDefault, successMethod);
};

Urls.prototype.URLDelete=function(urlId){
    this.urlWriter.Delete(urlId);
};

Urls.prototype.URLChanged=function(urlId, response){
    var that = this;
    
    this.urlId = urlId;

    this.urlWriter.UrlChanged(urlId, function(ajaxResult) {
             
        that.loadImageCallback(urlId,ajaxResult);
         
        response(ajaxResult);
    });
    
};
 

Urls.prototype.GetUrls=function(filter){
    //https://jsimageannotater-gnthackray1978.c9.io
    
    var that = this;
    
    console.log('GetUrls');

    this.urlWriter.GetUrls(filter, function(urlList){
       // that.updateUrlList(urlList);
        that.view.FillUrls(urlList);
        
    });

 
};
     
     