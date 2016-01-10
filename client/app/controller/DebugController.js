var DebugController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryRunScaleToScreen($.proxy(this.qryRunScaleToScreen, this));
    
    this._view.QryRunMoveNode($.proxy(this.qryRunMoveNode, this));
};

DebugController.prototype = {
    init:function(){
        
    },
    qryRunScaleToScreen:function(text){
        if (this.model !== null) {
            this.model.RunScaleToScreen(text);
        }
    },
    qryRunMoveNode:function(text){
        if (this.model !== null) {
            this.model.RunMoveNode(text);
        }
    }
    
};