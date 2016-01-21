var LayerController = function (channel, model) {
    var that = this;
    
 
    this._channel = channel;

    this.model = model;
    
    this.init();

    this._channel.subscribe("btnSaveLayers", function(data, envelope) {
        that.qrySaveState(data.value);
    });
    
    this._channel.subscribe("btnNewLayer", function(data, envelope) {
        that.qryNewState(data.value);
    });
    
    this._channel.subscribe("LayerInputState", function(data, envelope) {
        that.qryInputState(data.value);
    });
    
    this._channel.subscribe("LayerButtonState", function(data, envelope) {
        that.qryLayerButtonState(data.value);
    });
    
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