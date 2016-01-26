var MetaController = function (model,channel, nodeManager) {
    
    this._nodeManager = nodeManager;
    this._channel = channel;
    this.selectedNode;
    this.model = model;
    
    this.init();

    var that = this;
    
    this._channel.subscribe("nodecreation", function(data, envelope) {
        that.model.Load([]);
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
       that.model.SetAddButtonState(data);
    });
    
    this._channel.subscribe("MetaSaveButtonState", function(data, envelope) {
        that.model.Save(function(metaData){
            that.selectedNode.MetaData = metaData;
            
            that._nodeManager.AddNodes(true,that.selectedNode, function(){
                that._shout('MetaSaveButtonState','AddNodes finished');
            });
            that._channel.publish( "MetaDataRefreshed", { value: that.selectedNode.MetaData } );
        });
        
        
    });
  
    this._channel.subscribe("MetaDeleteButtonState", function(data, envelope) {
        that.model.SetDeleteButtonState(data);
    });
    
    this._channel.subscribe("TemplateState", function(data, envelope) {
        that.model.SetCurrentTemplate(data);
    });
    
    this._channel.subscribe("MetaState", function(data, envelope) {
        that.model.SetCurrentMetaId(data);
    });
};

            
            
MetaController.prototype = {
    init:function(){
    
         if (this.model !== null) {
            this.model.GetData();
         }
    },
 
    selectionChanged : function(callback){
        var that = this;
        
        this._nodeManager.GetSelectedNodes(function(selection){
            if(selection.length > 0){
                that.selectedNode = selection[0]; 
                that.model.Load(that.selectedNode.MetaData);
                callback();
            }
            else
            {
                that.model.Unload();  
            }
        });
    },

    _shout : function(method, message){
        this._channel.publish( "DebugMessage", {name : 'MCT' , description : method + '.'+ message } );
    }
};