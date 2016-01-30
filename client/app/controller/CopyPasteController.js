
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
    this._state =0;
    
    var that =this;
    
    this._channel.subscribe("multiselectingend", function(data, envelope) {
        that.selectionChanged(function(){});
    });
    
    this._channel.subscribe("nodeselected", function(data, envelope) {
        that.selectionChanged(function(){});
    });
    
    this._channel.subscribe("nodedeselected", function(data, envelope) {
        that.selectionChanged(function(){});
    });
    
    this._channel.subscribe("CutClick", function(data, envelope) {
        
    });
    
    this._channel.subscribe("CopyClick", function(data, envelope) {
        that._model.CopyNodes();
        that.UpdateState();
    });
    
    this._channel.subscribe("PasteClick", function(data, envelope) {
        // var copyNodes = JSON.parse(JSON.stringify(that._model.selectedNodes));
        
        // var idx =0;
        
        // while(idx < copyNodes.length){
        //     copyNodes[idx].X += 50;
            
        //     idx++;
        // }
        
        //that._nodeManager
        
        var nodeFactory = new Node(that._nodeManager.generations);
        
        nodeFactory.CloneNodes(that._model.selectedNodes, function(newNodes){
            var idx =0;
            
            while(idx < newNodes.length){
            
                newNodes[idx].X += 50;
                newNodes[idx].SelectNode =true;
                idx++;
            }
            
            that._nodeManager.DeSelectNodes(function(count){
                that._nodeManager.AddNodes(true,newNodes, function(e){
                    that._shout('PasteClick event','Add Nodes');
                    that._channel.publish( "drawtree", { value: e } );
                });    
            });
            
        });
        
    });
    
    this.selectionChanged(function(){
        
    });
}

CopyPasteController.prototype.selectionChanged = function(callback){
    var that = this;
    
    
    this._nodeManager.GetSelectedNodes(function(selection){
        that._model.selectedNodes = selection;
        that.UpdateState();
        callback();
        
    });
};



CopyPasteController.prototype.UpdateState = function(){
    
    var that = this;
    
    if(that._model.selectedNodes.length > 0 && that._model.copiedNodes.length > 0)
        that._state = 2;
            
    if(that._model.selectedNodes.length > 0 && that._model.copiedNodes.length == 0)
        that._state = 1;
        
    if(that._model.selectedNodes.length == 0 && that._model.copiedNodes.length > 0)
        that._state = 3;    
    
    if(that._model.selectedNodes.length == 0 && that._model.copiedNodes.length == 0)
        that._state = 0;    
    
    
    
    switch (this._state) {
        case 0: // nothing selected , nothing in the clipboard
            that._channel.publish( "CutDisabled", { value: false } );
            that._channel.publish( "CopyDisabled", { value: false } );
            that._channel.publish( "PasteDisabled", { value: false } );
            break;
        case 1: //something is selected but nothing in clipboard
            that._channel.publish( "CutEnabled", { value: false } );
            that._channel.publish( "CopyEnabled", { value: false } );
            that._channel.publish( "PasteDisabled", { value: false } );
            break;
        case 2: //something is selected and something in clipboard
            that._channel.publish( "CutEnabled", { value: false } );
            that._channel.publish( "CopyEnabled", { value: false } );
            that._channel.publish( "PasteEnabled", { value: false } );
            break;
        case 3: // something in clipboard but nothing selected
            that._channel.publish( "CutDisabled", { value: false } );
            that._channel.publish( "CopyDisabled", { value: false } );
            that._channel.publish( "PasteEnabled", { value: false } );
            break;
    }
};

CopyPasteController.prototype._shout = function(method, message){
    this._channel.publish( "DebugMessage", {name : 'CCP' , description : method + '.'+ message } );
};
