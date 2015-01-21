var LayerController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryLayerButtonState($.proxy(this.qryLayerButtonState, this));
    
    this._view.QryInputState($.proxy(this.qryInputState, this));
    
    this._view.QryNewState($.proxy(this.qryNewState, this));
    
    this._view.QrySaveState($.proxy(this.qrySaveState, this));
}

LayerController.prototype = {
    init:function(){
    
         if (this.model !== null) {
            this.model.GetData();
         }
    },
    
    qryLayerButtonState:function(data){
        console.log('qryLayerButtonState: '+data);
        switch(data.type){
            case 'current':
                this.model.SetCurrent(data.id, data.value);
                break;
            case 'visible':
                this.model.SetVisible(data.id, data.value);
                break;
            case 'delete':
                this.model.SetDeleted(data.id);
                break;
        }
         
    },
    
    qryInputState:function(data){
        console.log('qryInputState:' +data);
        switch(data.type){
            case 'order':
                this.model.SetOrder(data.id, data.value);
                break;
            case 'name':
                this.model.SetName(data.id, data.value);
                break;
        }
         
    },
    
    qryNewState:function(){
        
        if (this.model !== null) {
            this.model.SetNewLayer();
        }
    },
    
    qrySaveState:function(){
        
        if (this.model !== null) {
            this.model.Save();
        }
    }
};