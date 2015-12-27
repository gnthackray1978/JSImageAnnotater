var NodeManagerController = function (view, nodeDataManager, graphicsContext,metadata,options) {
 
    this.x=0;
    this.y=0;
    
    
    this.addNode =false;
    this.deleteNode =false;
    this.deletedNodeCache;
    this.editNode =false;
    this.selectedNote; 
 
 
    this._view = view;
    this._graphicsContext = graphicsContext;

    this.nodeManager = nodeDataManager;
    this.meta = metadata;
    this.options = options;
    
    
    this._view.CanvasClick($.proxy(this.canvasClick, this));
   
    //note operations
    this._view.Add($.proxy(this.addButtonClicked, this));
    
    this._view.Cancel($.proxy(this.cancelButtonClicked, this));
    
    this._view.SaveNote($.proxy(this.saveNote, this));
   
    this._view.Delete($.proxy(this.deleteNote, this));
    
    this._view.NodeEditorOpen($.proxy(this.start, this));
    
    this._view.NodeEditorClosed($.proxy(this.exit, this));
    
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
    
};

NodeManagerController.prototype = {
    
    updateState :function(){
        
        switch(this.state){
            case 0: //UI MODE ACTIVE
                this.options.SetDefaultOptionState(false);
                this.options.SetState(false);
                this.meta.Unload();
                this._graphicsContext.SetLocked(false);
                this._view.DisplayNeutralState();
                this._view.ClearActiveTextArea();
           
                this._graphicsContext.DrawTree();
                this._graphicsContext.UpdateInfo();
                
                
                break;
            case 1: //FREE TO WRITE TO MODE
                this.options.SetState(true,undefined,true);
                this._graphicsContext.SetLocked(true);
                this._view.DisplayEditState();
              
                break;
                
            case 2: //FREE TO DELETE MODE
                this._view.DisplayDeleteState();
                break;
            case 3: //VALID TO SAVE
                this._view.DisplaySaveState();
                break;
                
            case 4: //EDITTING
                this.editNode();
                break;
                
            case 5: //ADDING
                this.addNode();
                break;
                
            case 6: //DELETING
                this.deleteNode();
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
                    
        if(that.selectedNote.options == undefined){
            that.selectedNote.options = that.options.GetState().defaultOptions;
        }
       
        that.deletedNodeCache = JSON.parse(JSON.stringify(that.selectedNote));
        
        that.selectedNote.Visible =false;
        
        // I believe this is to save the options if they weren't already set
        that.nodeManager.WriteToDB(that.selectedNote, function(){
            console.log('node saved');
        });
       
        that._view.DisplayNodeSelection(that.selectedNote.X, 
                that.selectedNote.Y,that.selectedNote.Width, 
                that.selectedNote.Height,that.selectedNote.D,
                that.selectedNote.Annotation,that.selectedNote.options, $.proxy(that.nodeTextChanged, that));
            
        that.meta.Load(that.selectedNote.MetaData);
        that.options.SetDefaultOptionState(false);
        that.options.SetState(true,that.selectedNote,true);
    },
    
    
    addNode:function(){
        var that =this;
        
        that._view.DisplayNodeSelection(70,25,0,'',that.options.GetState().tempOptions,$.proxy(that.nodeTextChanged, that));
                    
        that.meta.Load([]);
        that.options.SetDefaultOptionState(true);
        that.options.SetState(true,that.selectedNote,true);
    },
    
    
    deleteNode: function(){
        var that = this;
        
        that.selectedNote.Visible =false;
        that.WriteToDB(that.selectedNote, function(){
            console.log('node deleted');
        });
        that.options.SetState(false);
    },
    
    canvasClick:function(x,y){
        var that = this;
     
        if(this.options.GetState().pickMode) return;
        
        this.nodeManager.PointToNode(x,y, function(node){
            
            that.selectedNote = node;
       
            // if(that.state == 1)
            //     that.options.SetState(true, that.selectedNote);
            // else
            //     that.options.SetState(false, that.selectedNote);
        
            // add/edit node
            if(that.state == 1 && that.selectedNote != undefined) that.state =4;
            if(that.state == 1 && that.selectedNote == undefined) that.state =5;
            if(that.state == 2 && that.selectedNote != undefined) that.state =6;
            
            
            // {
            //     that.selectedNote.Visible =false;
            //     that.WriteToDB(that.selectedNote, function(){
            //         console.log('node deleted');
            //     });
            //     that.options.SetState(false);
            // }
            
            
            this.updateState();
        });
        
        this.updateState();
        
        //if(this.state == 0)
        //    that._view.ClearActiveTextArea();
        
    },

    addButtonClicked:function(){
        this.state =1;
        this.updateState();
    },
   
   
    cancelButtonClicked:function(){
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
    
    deleteNote:function(action){
        console.log('delete note'); 
        
        if(this.state == 2) 
            this.state = 0;
        else
            this.state = 2;
        
        this.updateState();
        
    },
    
    saveNote:function(saveData){
        var that = this;
        
        var saveCallback = function(savednode){
            that.selectedNote = savednode;
            that.state =0;
            that.updateState();
        };
        
        this.nodeManager.GetActiveLayer(function(layerId){
            that.meta.QryNodeMetaData(function(data){
                    that.options.QrySaveData(function(options){
                        saveData.options = options;
    
                        that.nodeManager.WriteNote(that.selectedNote,saveData.x,
                            saveData.y, saveData.width,saveData.height,saveData.d,
                            saveData.text,saveData.options,layerId, data, false,true, saveCallback);
                    });
            }); 
        });
        
    }

};












