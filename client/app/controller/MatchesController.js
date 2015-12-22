var MatchesController = function (view, model, graphicsContext) {
    this._view = view;
    this._graphicsContext = graphicsContext;
    this.model = model;
    
    this.init();
    
    this._view.QrySetMatches($.proxy(this.qrySetMatches, this));
    
    this._view.QryClearDeleted($.proxy(this.qryClearButton, this));
    
};

MatchesController.prototype = {
    init:function(){
        
    },
    qrySetMatches:function(text){
        var that =this;
        if (that.model !== null) {
            that.model.SetMatches(function(){
                that._graphicsContext.ClearCache();
                that._graphicsContext.DrawTree();
            });
        }
    },
    qryClearButton:function(){
        if (this.model !== null) {
            this.model.ClearDeleted();
        }
    }
};