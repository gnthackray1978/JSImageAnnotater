var UrlController = function (view, model) {
    this._view = view;

    this.model = model;
    
    
    if(model.nodestore.Type() == 'AJAX'){
        
        this.init();
        
        //URL operations
        this._view.URLFilterList($.proxy(this.URLFilterList, this));
        
        this._view.URLNew($.proxy(this.URLNew, this));
        
        this._view.URLSave($.proxy(this.URLSave, this), $.proxy(this.URLFilterList, this) );
        
        this._view.URLDelete($.proxy(this.URLDelete, this));
        
        this._view.URLChanged($.proxy(this.URLChanged, this));
     
    }

};

UrlController.prototype = {

    init:function(){
    
         if (this.model !== null) {
            this.model.GetUrls();
            
         }
    },
    
    URLNew:function(){
        
        if (this.model !== null) {

            
            return this.model.urlId=-1;
        }
    },
    
    URLSave:function(urlName, url, urlGroup,urlDefault, successMethod){
        
        if (this.ancTree !== null) {

            return this.model.URLSave(urlName, url, urlGroup,urlDefault, successMethod);
        }
    },
    URLDelete:function(urlId){
        
        if (this.model !== null) {

            this.model.URLDelete(urlId);
        }
    },
    URLChanged:function(urlId, response){
        
        if (this.model !== null) {

            return this.model.URLChanged(urlId,response);
        }
    },
   
    URLFilterList:function(filter){
        
        if (this.model !== null) {

            return this.model.GetUrls(filter);
        }
    }
  
};