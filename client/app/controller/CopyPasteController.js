
// so we need to recognise when something has been selected

// initial state everything is disable
// publish disable 
// publish disable 
// publish disable 

// something selected
// publish enable cut
// publish enable copy


// something copied
// publish enable paste



var CopyPasteController = function (nodeManager, channel) {

    this._channel = channel;
    this._nodeManager = nodeManager;
    this._model = new CopyPaste();
    
    var that =this;
    
    this._channel.subscribe("multiselectingend", function(data, envelope) {
        that.selectionChanged(function(){
            
        });
    });
    
    this._channel.subscribe("nodeselected", function(data, envelope) {
        
    });
    
    this._channel.subscribe("nodedeselected", function(data, envelope) {
        
    });
    
    this._channel.subscribe("CutClick", function(data, envelope) {
        
    });
    
    this._channel.subscribe("CopyClick", function(data, envelope) {
        
    });
    
    this._channel.subscribe("PasteClick", function(data, envelope) {
        
    });
    
}

CopyPasteController.prototype.selectionChanged = function(callback){
    var that = this;
    
    this._nodeManager.GetSelectedNodes(function(selection){
        if(selection.length > 0){
            that.selectedNodes = selection; 
            callback();
        }
        else
        {
        
        }
    });
};

CopyPasteController.prototype._shout = function(method, message){
    this._channel.publish( "DebugMessage", {name : 'CCP' , description : method + '.'+ message } );
};
