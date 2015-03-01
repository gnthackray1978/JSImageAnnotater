var DebugController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QrySearchButton($.proxy(this.qrySearchButton, this));
    
    
};

DebugController.prototype = {
    init:function(){
        
    },
    qrySearchButton:function(text){
        if (this.model !== null) {
            this.model.SearchString(text);
        }
    },
   
};