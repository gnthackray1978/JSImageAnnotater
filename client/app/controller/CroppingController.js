var CroppingController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryCropAddButton($.proxy(this.qryCropAddButton, this));
    
    this._view.QryCropSaveButton($.proxy(this.qryCropSaveButton, this));
    
    this._view.QryCropDeleteButton($.proxy(this.qryCropDeleteButton, this));
    
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
    
    qryCropAddButton:function(data){
        this.model.Add();  
    },
    
    qryCropDeleteButton:function(data){
        this.model.Delete(); 
    },
    qryCropSaveButton:function(data){
        this.model.Save(); 
    }
};