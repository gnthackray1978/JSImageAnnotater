var DebugController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryRunScaleToScreen($.proxy(this.qrySearchButton, this));
    
    this._view.QryClearDeleted($.proxy(this.qryClearButton, this));
};

DebugController.prototype = {
    init:function(){
        
    },
    qryRunScaleToScreen:function(text){
        if (this.model !== null) {
            this.model.RunScaleToScreen(text);
        }
    },
    qryClearButton:function(){
        if (this.model !== null) {
            this.model.ClearDeleted();
        }
    }
};