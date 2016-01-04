var NodeManagerController = function (view, nodeDataManager, metadata,options,channel) {
 
    this.deletedNodeCache;
    this.selectedNote; 
 
    this._channel = channel;
    this._view = view;
    this._mouseClickLocked =false;

    this.nodeManager = nodeDataManager;
    this.meta = metadata;
    this.options = options;
    
    this.stateCache =0;
    
    this._view.SelectNodeButton($.proxy(this.selectNodeAction, this));
    this._view.DeleteNodeButton($.proxy(this.deleteNodeAction, this));
    
    this._view.DeleteSingleNodeButton($.proxy(this.deleteSingleNodeAction, this));
    this._view.AddNodeButton($.proxy(this.addToolbarNode, this));
    this._view.CancelNodeButton($.proxy(this.cancelNodeButton, this));
    
    this._view.MultiSelectNodeButton($.proxy(this.multiSelectNode, this));
    
    this._view.SaveNote($.proxy(this.saveAction, this));
    
    
    
  //  this._view.CanvasClick($.proxy(this.clickAction, this));
   
  //  this._view.CanvasDoubleClick($.proxy(this.doubleClickAction, this));
   
    //note operations
    this._view.Add($.proxy(this.addButtonClicked, this));
    
    this._view.Cancel($.proxy(this.cancelButtonClicked, this));
    
    
   
    this._view.Delete($.proxy(this.deleteNote, this));
    
    this._view.NodeEditorOpen($.proxy(this.start, this));
    
    this._view.NodeEditorClosed($.proxy(this.exit, this));
    
    var that = this;
    
    
    this._channel.subscribe("mouseClickLock", function(data, envelope) {
        that._mouseClickLocked =data.value;
    });
    
    this._channel.subscribe("multiselectingstart", function(data, envelope) {
        that.stateCache = that.state;
        that.state = 9;
        
        that.updateState();
    });
    
    this._channel.subscribe("multiselectingend", function(data, envelope) {
        
     //   that.state = 10;
        
      //  that.updateState();
    });
    
    this._channel.subscribe("singleselectchange", function(data, envelope) {
        
    });
    
    this._channel.subscribe("singleClick", function(data, envelope) {
        that.clickAction(data.value.x, data.value.y);
    });
    
    this._channel.subscribe("doubleClick", function(data, envelope) {
        that.doubleClickAction(data.value.x, data.value.y);
    });
    
    /*
    
    so what about when we need to update other models from this controller.
    
    PROPOSED
    
    ACTIONS
    1. activateAction s1
    2. s1 node clicked s2
    3. s3 edit node s3
    3. s4 cancel edit node s2
    4. s2 s3 delete node(s) s1
    5. add node s1
    6. selection tool activated 
    
    STATES
    0. inactive
    1. node selectable
    2. nodes selectable
    
    3. nodes selected
    4. node selected
    5. node editting
    
     
    */
    
    /*
    
    CURRENT 
    0. inactive
    
    1. free to edit mode
    2. delete mode
    
    3. valid save state
    
    
    4. node selected
    5. node editting
    */
    
    
    this.state = 0;
    
    this.updateState();
};

NodeManagerController.prototype = {
    
    updateState :function(){
        var that = this;
        
        switch(this.state){
            case 0: //UI MODE ACTIVE
                this._channel.publish( "nodeinit", { value: false } );
                
                this.meta.Unload();
                this._channel.publish( "lock", { value: false } );
                
                this._view.DisplayNeutralState();
                this._view.ClearActiveTextArea();
                this.nodeManager.DeSelectNodes(function(){
                    that._channel.publish( "drawtree", null);
                });
                
                
                break;
            case 1: //FREE TO WRITE MODE
                this._channel.publish( "lock", { value: true } );
                this._view.DisplayAddState();
              
                break;
                
            case 2: //FREE TO DELETE MODE
            
                this._view.DisplayDeleteState();
                break;
            case 3: //VALID TO SAVE
                this._view.DisplaySaveState();
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
                that.selectedNote.Visible =false;
                that.nodeManager.WriteToDB(that.selectedNote, function(){
                    console.log('node deleted');
                });
                that.selectedNote = undefined;
                break;
                
                
            case 7: //SELECTING
                console.log('updateState: selecting');
                this.selectNote();
                break;
                
            case 8: //FREE TO SELECT
                console.log('updateState: free to select');
                this._view.DisplaySelectionState();
                break;      
            case 9: //multi selecting
                console.log('updateState: multi selecting');
                break;
            case 10://items selected
                console.log('updateState: items selected');
                break;
        }
        
    },
    
    activateAction : function(){
        this.state = 1;
        this.updateState();
    },
    
    activateAction : function(){
        this.state = 0;
        this.updateState();
    },
    
    nodeTextChanged: function(e){
        //console.log('text changed: ' + e);
        this.state =3;
        this.updateState();
    },
    
    
    editNode:function(){
        var that =this;
        
        that._channel.publish( "lock", { value: true } );
                            
        if(that.selectedNote.options == undefined){
            that.selectedNote.options = that.options.GetState().defaultOptions;
        }
       
        that.deletedNodeCache = JSON.parse(JSON.stringify(that.selectedNote));
        
        that.selectedNote.Editting = true;
        
        // I believe this is to save the options if they weren't already set
        that.nodeManager.WriteToDB(that.selectedNote, function(){
            console.log('node saved');
        });
       
        that._channel.publish( "nodeedit", { value: undefined } );
       
        that._view.EditDisplayNodeSelection(that.selectedNote.X, 
                that.selectedNote.Y,that.selectedNote.Width, 
                that.selectedNote.Height,that.selectedNote.D,
                that.selectedNote.Annotation,that.selectedNote.options, $.proxy(that.nodeTextChanged, that));
            
        that.meta.Load(that.selectedNote.MetaData);
        
    },
    
    
    addNode:function(){
        var that =this;
        
        that._channel.publish( "nodecreation", { value: that.selectedNote } );
        
        that._view.AddDisplayNodeSelection(70,25,0,'',that.options.GetState().tempOptions,$.proxy(that.nodeTextChanged, that));
        
        that.meta.Load([]);
    },
    
    deleteNodeAction: function(){
        var that = this;
        
        this.nodeManager.DeleteSelection(function(){
            that._channel.publish( "drawtree", null);
        });
    },
    
    selectNodeAction: function(){
        
        if(this.state == 8 ) 
            this.state =0;
        else
            this.state =8;
        
        this.updateState();
    },
    
    selectNote: function(){
        this.state = 8;
        
        if(this.selectedNote){
            
            if(this.selectedNote.Selected == undefined) {    
                this.selectedNote.Selected = true;
            }
            else
            {
                this.selectedNote.Selected = !this.selectedNote.Selected;
            }
        }
        else
            console.log('selected note undefined');
            
            
        this.updateState();
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
    addButtonClicked:function(){
        this.state =1;
        this.updateState();
    },
    
    
    multiSelectNode : function(){
        this.state = 1;
        this.updateState();
    },
    
    
    clickAction:function(x,y){
        var that = this;
     
        if(this._mouseClickLocked) return;
        
        this.nodeManager.PointToNode(x,y, function(node){
            that.selectedNote = node;
            
            if(that.selectedNote != node && that.selectedNote.Index != node.Index ){
               that._channel.publish( "selectednodechanged", { value: that.selectedNote } ); 
            }
       
            // add/edit node
            if(that.state == 8 && that.selectedNote != undefined) that.state =7;
            if(that.state == 1 && that.selectedNote == undefined) that.state =5;
            
            if(that.state == 2 && that.selectedNote != undefined) that.state =6;
          
            if(that.state == 4 && that.selectedNote == undefined) 
            {
                that.restoreCachedNode();
                that.state =0;
                
            }
            
            if(that.state == 10 && that.selectedNote == undefined) 
            {
                that.state =0;
            }
            
            if(that.state == 9) 
            {
                that.state = 10;
            }
            
            
            that.updateState();
        });
       
    },

    
    doubleClickAction:function(x,y){
        var that = this;
     
        if(this._mouseClickLocked) return;
        
        this.nodeManager.PointToNode(x,y, function(node){
            that.selectedNote = node;
            
            if(that.selectedNote != node && that.selectedNote.Index != node.Index ){
               that._channel.publish( "selectednodechanged", { value: that.selectedNote } ); 
            }
       
            // add/edit node
            if(that.state == 0 && that.selectedNote != undefined) that.state =4;
            
            that.updateState();
        });
       
    },

    
   
   
    cancelNodeButton:function(){
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
            that.meta.QryNodeMetaData(function(data){
                    that.options.QrySaveData(function(options){
                        saveData.options = options;
    
                        var index = (that.selectedNote) ? that.selectedNote.Index : undefined;
    
                        that.nodeManager.WriteNote(index,saveData.x,
                            saveData.y, saveData.width,saveData.height,saveData.d,
                            saveData.text,saveData.options,layerId, data, false,true, saveCallback);
                    });
            }); 
        });
        
    }

};












