var CroppingController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryLayerButtonState($.proxy(this.qryLayerButtonState, this));
    
    
};

CroppingController.prototype = {
    init:function(){
        
    },
    qryLayerButtonState:function(data){
        
    }
};