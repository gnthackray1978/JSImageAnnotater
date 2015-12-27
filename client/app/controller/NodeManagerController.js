var NodeManagerController = function (view, nodeDataManager, graphicsContext,metadata,options) {
 
 
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
    
    1. edit mode
    2. delete mode
    
    3. nodes selected
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
                this._view.DisplayUpdateNoteAdd(false);
                this._view.ClearActiveTextArea();
                this._view.DisplayUpdateDelete(false);
                this._graphicsContext.DrawTree();
                this._graphicsContext.UpdateInfo();

                break;
            case 1: //ADD MODE
                this.options.SetState(this.addNode,undefined,true);
                this._graphicsContext.SetLocked(true);
                this._view.DisplayUpdateNoteAdd(true);
                this._view.DisplayUpdateDelete(false);
                break;
            case 2: //DELETE MODE
                this._view.DisplayUpdateDelete(true);
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
    
    canvasClick:function(x,y){
        var that = this;
      //  console.log('clicked');
      
        // this.PerformClick(x, y, function(x,y,width,height,angle,annotation,options){
        //     that._view.DisplayNodeSelection(x,y,width,height,angle,annotation,options);
        // });
        
        if(this.options.GetState().pickMode) return;
        
        this.nodeManager.PointToNode(x,y, function(node){
            
            that.selectedNote = node;
       
            if(that.state == 1)
                that.options.SetState(true, that.selectedNote);
            else
                that.options.SetState(false, that.selectedNote);
        
            // add/edit node
            if(that.state == 1)
            {
                if(that.selectedNote != undefined)
                {
                    if(that.selectedNote.options == undefined){
                        that.selectedNote.options = that.options.GetState().defaultOptions;
                    }
                   
                    that.deletedNodeCache = JSON.parse(JSON.stringify(that.selectedNote));
                    
                    that.selectedNote.Visible =false;
                    
                    that.nodeManager.WriteToDB(that.selectedNote, function(){
                        console.log('node deleted');
                    });
                   
                    that._view.DisplayNodeSelection(that.selectedNote.X, 
                            that.selectedNote.Y,that.selectedNote.Width, 
                            that.selectedNote.Height,that.selectedNote.D,
                            that.selectedNote.Annotation,that.selectedNote.options);
                        
                    that.meta.Load(that.selectedNote.MetaData);
                    that.options.SetDefaultOptionState(false);
                }
                else
                {
                    that._view.DisplayNodeSelection(x, y,70,25,0,'',that.options.GetState().tempOptions);
                    
                    that.meta.Load([]);
                    that.options.SetDefaultOptionState(true);
                }
                
                that.options.SetState(true,that.selectedNote,true);
            }
    
            
            if(that.state == 2  && that.selectedNote != undefined){
                that.selectedNote.Visible =false;
                that.WriteToDB(that.selectedNote, function(){
                    console.log('node deleted');
                });
                that.options.SetState(false);
            }
            
            
            
        });
        
        
        if(this.state == 0)
            that._view.ClearActiveTextArea();
        
    },

    addButtonClicked:function(){
        //var that = this;
        this.state =1;
        this.updateState();
        
    //    this.addNode = true;
        
    

    },
   
   
    cancelButtonClicked:function(){
       // var that = this;
        
//        this.options.SetDefaultOptionState(false);
       // this.addNode = false;
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
        // var that = this;
        // that.DeleteNoteMode(function(deleteNode){
        //     that._view.DisplayUpdateDelete(deleteNode);
        // });
        
        console.log('delete note'); 
        
        if(this.state == 2) 
            this.state = 0;
        else
            this.state = 2;
        
        this.updateState();
        
        // if(this.deleteNode)
        //     this.deleteNode =false;
        // else
        //     this.deleteNode =true;
            
        // this._view.DisplayUpdateDelete(this.deleteNode);    
    },
    
    saveNote:function(saveData){
        var that = this;
        
        if (this.nodeManager == null) return;
        
        var saveCallback = function(savednode){
            that.selectedNote = savednode;
            //that.addNode = false;
            that.state =0;
            
            that.updateState();
            
            // that.options.SetState(false);
            
            // that._graphicsContext.SetLocked(false);
            // that._graphicsContext.DrawTree();
            // that._graphicsContext.UpdateInfo();
            // that._view.DisplayUpdateNoteAdd(false);
            // that._view.ClearActiveTextArea();
            
            // that.meta.Unload();
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












