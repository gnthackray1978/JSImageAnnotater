var NodeManagerController = function (nodeDataManager,channel) {
 
    this.deletedNodeCache;
    this.selectedNote; 
 
    this._channel = channel;

    this._mouseClickLocked =false;
    this._mouseClickPoint ={x:0,y:0};

    this.nodeManager = nodeDataManager;
    
    this.options;
  
    this.stateCache =0;
    
    var that = this;

    this._channel.subscribe("nmSave", function(data, envelope) {
        that.saveAction(data.value);
    });
    
    this._channel.subscribe("nmNodeCancel", function(data, envelope) {
        that.cancelNodeButton(data.value);
    });
    
    this._channel.subscribe("nmAddNode", function(data, envelope) {
        that.addToolbarNode(data.value);
    });
    
    this._channel.subscribe("nmDelSng", function(data, envelope) {
        that.deleteSingleNodeAction(data.value);
    });

    this._channel.subscribe("nmDelBtn", function(data, envelope) {
        that.deleteNodeAction(data.value);
    });
    
    this._channel.subscribe("nmDelete", function(data, envelope) {
        that.deleteNote(data.value);
    });
    
    this._channel.subscribe("nmCancel", function(data, envelope) {
        that.cancelButtonClicked(data.value);
    });
    
    
    this._channel.subscribe("singleSelectionEnabled", function(data, envelope) {
        
    });
    
    this._channel.subscribe("singleSelectionDisabled", function(data, envelope) {
        that._channel.publish( "DisplaySelectionDelete", { value: true } );
    });
    
    this._channel.subscribe("mouseClickLock", function(data, envelope) {
        that._mouseClickLocked =data.value;
    });
    
    this._channel.subscribe("multiselectingstart", function(data, envelope) {
        that.stateCache = that.state;
        that.state = 9;
        
        that.updateState();
    });
    
    // delete node
    this._channel.subscribe("focusednode", function(data, envelope) {
        //node contained with clicked pointer but wasnt selected.
        //for deleting
        
        that.selectedNote = data.value;
      
        if(that.state == 2) that.state =6;
        
        that.updateState();
    });
    
    this._channel.subscribe("nullselection", function(data, envelope) {
        
        that._shout("nullselection","null selection handled");
        
        that._mouseClickPoint = data.value;
        
        if(that.state == 4) //if were editting something
        {
            that.cancelEdit();
        }
        // if we were in ok to add/edit 
        if(that.state == 1) that.state =5;
        
        that.updateState();
    });
    //edit existing node
    this._channel.subscribe("doubleClickSelectionChange", function(data, envelope) {
        
        that.selectedNote = data.value;
      
        that.state =4;
        
        that.updateState();
    });
    
    this._channel.subscribe("newOptionsLoaded", function(data, envelope) {
        that.options = data.value;
    });
    
    this._channel.subscribe("defaultOptionsLoaded", function(data, envelope) {
        that.options = data.value;
    });
    
    this._channel.subscribe("defaultOptionsSaved", function(data, envelope) {
        that.options = data.value;
    });
    
    
    this._channel.subscribe("multiOptionsLoaded", function(data, envelope) {
        that.options = data.value;
    });
    
    this._channel.subscribe("MetaDataRefreshed", function(data, envelope) {
        that._shout("MetaDataRefreshed","got meta data");
        that.metaData = data.value;
        
    });

    this.state = 0;
    
    this.updateState();
};

NodeManagerController.prototype = {

    updateState :function(){
        var that = this;
        
        switch(this.state){
            case 0: //UI MODE ACTIVE
                this._channel.publish( "nodeinit", { value: false } );
                
                
                this._channel.publish( "lock", { value: false } );
                
                this._channel.publish( "deactivateFocusedSelection", { value: true } );
                
                this._channel.publish( "DisplayNeutralState", { value: true } );
               
                this._channel.publish( "ClearActiveTextArea", { value: true } );
                
                this._channel.publish( "drawtree", { value: that.nodeManager } ); 
                break;
            case 1: //FREE TO WRITE MODE
                this._channel.publish( "lock", { value: true } );
                
                this._channel.publish( "DisplayAddState", { value: true } );
                this._channel.publish( "activateNullSelection", { value: true } );
              
                break;
                
            case 2: //FREE TO DELETE MODEyou
                this._channel.publish( "activateFocusedSelection", { value: true } );
                break;
                
            case 3: //VALID TO SAVE
                console.log('updateState: valid to save');
                
                this._channel.publish( "DisplaySaveState", { value: true } );
                break;
                
            case 4: //EDITTING
                console.log('updateState: editting');
                this.editNode();
                break;
                
            case 5: //ADDING
                console.log('updateState: adding');
                this.addNode();
                break;
                
            case 6: //DELETING
                if(that.selectedNote){
                    that.nodeManager.DeleteNode(that.selectedNote, function(){
                        that._shout('updateState','Node Deleted');
                        that._channel.publish( "drawtree", { value: that.nodeManager } ); 
                    });
                    that.selectedNote = undefined;
                }
                break;
            case 8: //FREE TO SELECT
                console.log('updateState: free to select');
                 console.log('removed DisplaySelectionState');
                
                this._channel.publish( "activateStandardSelection", { value: true } );
                break;     
                
            case 9: //multi selecting
                console.log('updateState: multi selecting');
                break;
            case 10://items selected
                console.log('updateState: items selected');
                break;
        }
        
    },

    nodeTextChanged: function(e){
        //console.log('text changed: ' + e);
        this.state =3;
        this.updateState();
    },
    
    editNode:function(){
        var that =this;
        
        that._channel.publish( "lock", { value: true } );
        
        that.options = that.selectedNote.Options;
        
        that.deletedNodeCache = JSON.parse(JSON.stringify(that.selectedNote));
        
        that.selectedNote.Editting = true;

        that._channel.publish( "nodeedit", { value: undefined } );
 
        var payload ={
            x: that.selectedNote.X, 
            y: that.selectedNote.Y,
            w: that.selectedNote.Width, 
            h: that.selectedNote.Height,
            d: that.selectedNote.D,
            a: that.selectedNote.Annotation,
            o: that.selectedNote.options, 
            fnTextChanged: $.proxy(that.nodeTextChanged, that)
        };
            
        that._channel.publish( "EditDisplayNodeSelection", { value: payload } );
    },
    
    addNode:function(){
        var that =this;
        
        that._channel.publish( "nodecreation", { value: that.selectedNote } );
        
        var payload ={
            x: that._mouseClickPoint.x, 
            y: that._mouseClickPoint.y,
            w: 70,
            h: 25,
            d: 0,
            a: '',
            o: that.options,
            fnTextChanged: $.proxy(that.nodeTextChanged, that)            
        };
        
        that._channel.publish( "AddDisplayNodeSelection", { value: payload } );
    },
    
    deleteNodeAction: function(){
        var that = this;
        
        this.nodeManager.DeleteSelection(function(){
            that._channel.publish( "drawtree", null);
        });
    },
    
    deleteSingleNodeAction : function(){
        console.log('delete note'); 
    
        switch(this.state){
            case 0:// first click we are neutral go to delete selector
                this.state = 2;
                break;
            case 2:// subsequent clicks are cancel
            case 6:
                this.state = 0;
                break;
        }
        
        this.updateState();
    },
    
    addToolbarNode : function(){
        
        if(this.state == 0)
            this.state = 1;
        else
            this.state = 0;
        
        this.updateState();
    },
    
    multiSelectNode : function(){
        this.state = 1;
        this.updateState();
    },

    cancelNodeButton:function(){
        this.cancelEdit();
    },
    
    cancelEdit:function(){
        
        this.selectedNote.Editting = false;
        this.selectedNote = undefined;
        this.state =0;
        this.updateState();
        this.restoreCachedNode();
    },
    
    restoreCachedNode: function(){
        var that = this;
        
        if(this.deletedNodeCache != undefined){
            console.log('cancelButtonClicked:  delete node restored');
            
            this.nodeManager.AddNode(1, true, this.deletedNodeCache, function(){
                that.deletedNodeCache = undefined;
                console.log('saved');
            });   
            
        }
    },
    
  
    
    saveAction:function(saveData){
        var that = this;
        
        var saveCallback = function(savednode){
            that.deletedNodeCache = undefined;
            that.selectedNote = undefined;
            that.state =0;
            that.updateState();
        };
        
        
        this.nodeManager.GetActiveLayer(function(layerId){
            saveData.options = that.options;
            var index = (that.selectedNote) ? that.selectedNote.Index : undefined;
            that.nodeManager.WriteNote(index,saveData.x,
                saveData.y, saveData.width,saveData.height,saveData.d,
                saveData.text,saveData.options,layerId, that.metaData, false,true, saveCallback);
        });
        
    },

    _shout:function(method, message){
        this._channel.publish( "DebugMessage", {name : 'NMC' , description : method + '.'+ message } );
    }
};












