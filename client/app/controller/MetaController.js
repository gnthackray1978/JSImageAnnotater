var MetaController = function (model,channel, nodeManager) {
    
    this._nodeManager = nodeManager;
    this._channel = channel;
    this.selectedNode;
    this.metaObject = model;
    
    this.init();

    var that = this;
    
    this._channel.subscribe("nodecreation", function(data, envelope) {
        that._channel.publish( "SetEnabledState", { value: true } );
    });
    
    this._channel.subscribe("multiselectingend", function(data, envelope) {
        that.selectionChanged(function(){});
    });
    
    this._channel.subscribe("nodeselected", function(data, envelope) {
        that.selectionChanged(function(){});
    });
    
    this._channel.subscribe("nodedeselected", function(data, envelope) {
        that.selectionChanged(function(){});
    });
  
    this._channel.subscribe("nullselection", function(data, envelope) {
        that.selectionChanged(function(){}); 
    });
    
    
    this._channel.subscribe("MetaAddButtonState", function(data, envelope) {
        
       that.metaObject.SetAddButtonState(data.value, function(selectedMetaData){
           that._channel.publish( "SetSelectedMetaData", { value: selectedMetaData } );
       });
    });
    
    this._channel.subscribe("MetaSaveButtonState", function(data, envelope) {
        that.metaObject.Save(function(metaData){
            that.selectedNode.MetaData = metaData;
            
            that._nodeManager.AddNodes(true,that.selectedNode, function(){
                that._shout('MetaSaveButtonState','AddNodes finished');
            });
            that._channel.publish( "MetaDataRefreshed", { value: that.selectedNode.MetaData } );
        });
        
        
    });
  
    this._channel.subscribe("MetaDeleteButtonState", function(data, envelope) {
        that.metaObject.SetDeleteButtonState(data.value, function(selectedMetaData){
            that._channel.publish( "SetSelectedMetaData", { value: selectedMetaData } );
        });
    });
    
    this._channel.subscribe("TemplateState", function(data, envelope) {
        that.metaObject.SetCurrentTemplate(data.value);
    });
    
    this._channel.subscribe("MetaState", function(data, envelope) {
        that.metaObject.SetCurrentMetaId(data.value, function(metaDataTypes){
             that._channel.publish( "SetTemplates", { value: metaDataTypes } );
        });
    });
};

            
            
MetaController.prototype = {
    init:function(){
        
        var that =this;
    
        if (that.metaObject !== null) {
            that.metaObject.GetData(function(metaData, metaDataTypes){
                that._channel.publish( "SetMetaData", { value: metaData } );
                that._channel.publish( "SetTemplates", { value: metaDataTypes } );
            });
        }
    },
 
    selectionChanged : function(callback){
        var that = this;
        
        this._nodeManager.GetSelectedNodes(function(selection){
            if(selection.length > 0){
                that.selectedNode = selection[0]; 
                var tpMeta = that.selectedNode.MetaData;
                
                that.metaObject.Load(tpMeta);
                
                if(tpMeta && tpMeta.length)
                    that._channel.publish( "SetSelectedMetaData", { value: tpMeta } );
                
                that._channel.publish( "SetEnabledState", { value: true } );
                    
                callback();
            }
            else
            {
                that._channel.publish( "SetEnabledState", { value: false } );
            }
        });
    },

    _shout : function(method, message){
        this._channel.publish( "DebugMessage", {name : 'MCT' , description : method + '.'+ message } );
    }
};