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
        var that = this;
        
        if (this.model !== null) {
            this.model.GetData(function(data){
                that._channel.publish( "SetLayers", { value: data } );
            });
        }
    },
    
    qryLayerButtonState:function(data){
        var that = this;
        
        this._shout('qryLayerButtonState','qryLayerButtonState: '+data);
        
        switch(data.type){
            case 'current':
                this.model.SetCurrent(data.id, data.value, function(){
                    that._channel.publish( "SetLayers", { value: that.model.layerData } );
                    that._channel.publish( "drawtree", { value: that.model } );
                });
                break;
            case 'visible':
                this.model.SetVisible(data.id, data.value, function(){
                    that._channel.publish( "SetLayers", { value: that.model.layerData } );
                    that._channel.publish( "drawtree", { value: that.model } ); 
                });
                break;
            case 'delete':
                this.model.SetDeleted(data.id, function(){
                    that._channel.publish( "SetLayers", { value: that.model.layerData } );
                    that._channel.publish( "drawtree", { value: that.model } );   
                });
                break;
        }
         
    },
    
    qryInputState:function(data){
        this._shout('qryInputState','qryInputState:' +data);
        
        var that = this;
        
        switch(data.type){
            case 'order':
                this.model.SetOrder(data.id, data.value, function(){
                    that._channel.publish( "SetLayers", { value: that.model.layerData } );
                    that._channel.publish( "drawtree", { value: that.model } );
                });
                break;
            case 'name':
                this.model.SetName(data.id, data.value, function(){
                    that._channel.publish( "SetLayers", { value: that.model.layerData } );
                });
                break;
        }
         
    },
    
    qryNewState:function(){
        
        var that = this;
        
        if (this.model !== null) {
            this.model.SetNewLayer(function(){
                that._channel.publish( "SetLayers", { value: that.model.layerData } );
            });
        }
    },
    
    qrySaveState:function(){
        var that = this;
        
        if (this.model !== null) {
            this.model.Save(function(){
                that._channel.publish( "SetLayers", { value: that.model.layerData } );
            });
        }
    },
    
    _shout : function(method, message){
        this._channel.publish( "DebugMessage", {name : 'LCT' , description : method + '.'+ message } );
    }
};