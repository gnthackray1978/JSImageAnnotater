var NodeManagerController = function (view, nodeDataManager, graphicsContext,metadata,options) {
 
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
    
     
};

NodeManagerController.prototype = {
    
    start:function(){
        if (this.nodeManager !== null) {
            
        };
    },
    
    exit:function(){
        if (this.nodeManager !== null) {
             
        };
    },

    init:function(){
        if (this.nodeManager !== null) {
            this.nodeManager.EnableRun(false);
        };
    },

    canvasClick:function(x,y){
        var that = this;
      //  console.log('clicked');
        if (this.nodeManager !== null) {
            this.PerformClick(x, y, function(x,y,width,height,angle,annotation,options){
                that._view.DisplayNodeSelection(x,y,width,height,angle,annotation,options);
            });
            
            if(!this.nodeManager.addNode)
                that._view.ClearActiveTextArea();
        }
    },

    addButtonClicked:function(){
        var that = this;
        
        that.EnableAdd(function(addNode){
            that._graphicsContext.SetLocked(true);
            that._view.DisplayUpdateNoteAdd(addNode);
        });
    },
   
   
    cancelButtonClicked:function(){
        var that = this;
        this.CancelAdd(function(addNode){
            that._graphicsContext.SetLocked(false);
            that._view.DisplayUpdateNoteAdd(addNode);
            that._view.ClearActiveTextArea();
        });
    },
    
    deleteNote:function(action){
        var that = this;
        that.DeleteNoteMode(function(deleteNode){
            that._view.DisplayUpdateDelete(deleteNode);
        });
        
    },
    
    saveNote:function(saveData){
        var that = this;
        if (this.nodeManager !== null) {
            this.SaveNoteClicked(saveData, function(addNode){
                that._graphicsContext.SetLocked(false);
                that._graphicsContext.DrawTree();
                that._graphicsContext.UpdateInfo();
                that._view.DisplayUpdateNoteAdd(addNode);
                that._view.ClearActiveTextArea();
            });
        }
    },
    
    DeleteNoteMode:function(switchComplete){
        console.log('delete note'); 
        if(this.nodeManager.deleteNode)
            this.nodeManager.deleteNode =false;
        else
            this.nodeManager.deleteNode =true;
    
        switchComplete(this.nodeManager.deleteNode);
        
    },
    
    //options
    EnableAdd: function (switchComplete) {
        this.nodeManager.addNode = true;
        
        this.options.SetState(this.nodeManager.addNode,undefined,true);
        
        switchComplete(this.nodeManager.addNode);
    },

    CancelAdd: function (cancelComplete) {
        this.options.SetDefaultOptionState(false);
        this.nodeManager.addNode = false;
        
        // chance monti carlo method?
        // programming bugs
        
        if(this.nodeManager.deletedNodeCache != undefined){
            
            var that = this;
            console.log('CancelAdd delete node restored');
            
            this.nodeManager.AddNode(1, true, this.nodeManager.deletedNodeCache, function(){
                that.nodeManager.deletedNodeCache = undefined;
                console.log('saved');
            });   
            
        }
            
            
        this.options.SetState(this.nodeManager.addNode);
        this.meta.Unload();
        cancelComplete(this.nodeManager.addNode);
    },
    //notes 
    //options
    SaveNoteClicked:function(saveData, saveComplete){
        
        console.log('save note');
        var that = this;
    
        var saveCallback = function(savednode){
            that.nodeManager.selectedNote = savednode;
            that.nodeManager.addNode = false;
            that.options.SetState(that.nodeManager.addNode);
            saveComplete(that.nodeManager.addNode);
            that.meta.Unload();
        };
    
        this.nodeManager.GetActiveLayer(function(layerId){
            that.meta.QryNodeMetaData(function(data){
                    that.options.QrySaveData(function(options){
                        saveData.options = options;
    
                        that.nodeManager.WriteNote(that.nodeManager.selectedNote,saveData.x,
                            saveData.y, saveData.width,saveData.height,saveData.d,
                            saveData.text,saveData.options,layerId, data, false,true, saveCallback);
                    });
            }); 
        });
        
    },
    
    PerformClick: function (x, y, newNodeSelected) {
        console.log("NodeManagerController: PerformClick");
         
        var that = this;
        
        // dont select anything
        if(this.options.GetState().pickMode) return;
        
        this.nodeManager.PointToNode(x,y, function(node){
            
            that.nodeManager.selectedNote = node;
       
            that.options.SetState(that.nodeManager.addNode, that.nodeManager.selectedNote);
        
            // add/edit node
            if(that.nodeManager.addNode)
            {
                if(that.nodeManager.selectedNote != undefined)
                {
                    if(that.nodeManager.selectedNote.options == undefined){
                        that.nodeManager.selectedNote.options = that.options.GetState().defaultOptions;
                    }
                   
                    that.nodeManager.deletedNodeCache = JSON.parse(JSON.stringify(that.nodeManager.selectedNote));
                    
                    that.nodeManager.selectedNote.Visible =false;
                    
                    that.WriteToDB(that.nodeManager.selectedNote, function(){
                        console.log('node deleted');
                    });
                   
                    newNodeSelected(that.nodeManager.selectedNote.X, 
                            that.nodeManager.selectedNote.Y,that.nodeManager.selectedNote.Width, 
                            that.nodeManager.selectedNote.Height,that.nodeManager.selectedNote.D,
                            that.nodeManager.selectedNote.Annotation,that.nodeManager.selectedNote.options);
                        
                    that.meta.Load(that.nodeManager.selectedNote.MetaData);
                    that.options.SetDefaultOptionState(false);
                }
                else
                {
                    newNodeSelected(x, y,70,25,0,'',that.options.GetState().tempOptions);
                    
                    that.meta.Load([]);
                    that.options.SetDefaultOptionState(true);
                }
                
                that.options.SetState(that.nodeManager.addNode,that.nodeManager.selectedNote,true);
            }
    
            if(that.nodeManager.deleteNode && that.nodeManager.selectedNote != undefined){
                that.selectedNote.Visible =false;
                that.WriteToDB(that.selectedNote, function(){
                    console.log('node deleted');
                });
                that.options.SetState(that.addNode);
            }
            
            if(that.nodeManager.editNode && !that.nodeManager.addNode && !that.nodeManager.deleteNode){
                
            }
        });
     }

};












