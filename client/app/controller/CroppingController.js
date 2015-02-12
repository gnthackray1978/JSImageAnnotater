var CroppingController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryCropButton($.proxy(this.qryCropButton, this));
    
    this._view.QryCropResetButton($.proxy(this.qryCropResetButton, this));
    
    this._view.QryCanvasMouseDown($.proxy(this.qryCanvasMouseDown, this));
    this._view.QryCanvasMouseUp($.proxy(this.qryCanvasMouseUp, this));
    this._view.QryCanvasMouseMove($.proxy(this.qryCanvasMouseMove, this));
    
};

CroppingController.prototype = {
    init:function(){
        
    },
    qryCanvasMouseDown:function(evt){
        if (this.model !== null) {
            this.model.CanvasMouseDown(evt);
        }
    },
    
    qryCanvasMouseUp:function(evt){
        if (this.model !== null) {
            this.model.CanvasMouseUp(evt);
        }
    },
    
    qryCanvasMouseMove:function(evt){
        if (this.model !== null) {
            this.model.CanvasMouseMove(evt);
        }
    },
    
    qryCropButton:function(data){
      this.model.Crop();  
    },
    qryCropResetButton:function(data){
        
    }
};