var MatchesController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QrySetMatches($.proxy(this.qrySetMatches, this));
    
    this._view.QryClearDeleted($.proxy(this.qryClearButton, this));
    
};

MatchesController.prototype = {
    init:function(){
        
    },
    qrySetMatches:function(text){
        if (this.model !== null) {
            this.model.SetMatches(text);
        }
    },
    qryClearButton:function(){
        if (this.model !== null) {
            this.model.ClearDeleted();
        }
    }
};