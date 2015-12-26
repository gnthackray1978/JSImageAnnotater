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
    
    
    ACTIONS
    1. start system s1
    2. s1 node clicked s2
    3. s3 edit node s3
    3. s4 cancel edit node s2
    4. s2 s3 delete node(s) s1
    5. add node s1
    6. selection tool activated 
    
    STATES
    1. nodes selectable
    2. node selectable
    3. nodes selected
    4. node selected
    5. node editting
    
     
    */
};

NodeManagerController.prototype = {
    
   
    canvasClick:function(x,y){
        var that = this;
      //  console.log('clicked');
        if (this.nodeManager !== null) {
            this.PerformClick(x, y, function(x,y,width,height,angle,annotation,options){
                that._view.DisplayNodeSelection(x,y,width,height,angle,annotation,options);
            });
            
            if(!this.addNode)
                that._view.ClearActiveTextArea();
        }
    },

    addButtonClicked:function(){
        //var that = this;
        
        this.addNode = true;
        this.options.SetState(this.addNode,undefined,true);
        this._graphicsContext.SetLocked(true);
        this._view.DisplayUpdateNoteAdd(true);
        
    },
   
   
    cancelButtonClicked:function(){
        var that = this;
        
        this.options.SetDefaultOptionState(false);
        this.addNode = false;
        
        // chance monti carlo method?
        // programming bugs
        
        if(this.deletedNodeCache != undefined){
            console.log('cancelButtonClicked:  delete node restored');
            
            this.nodeManager.AddNode(1, true, this.deletedNodeCache, function(){
                that.deletedNodeCache = undefined;
                console.log('saved');
            });   
            
        }
            
            
        this.options.SetState(this.addNode);
        this.meta.Unload();
        
        that._graphicsContext.SetLocked(this.addNode);
        that._view.DisplayUpdateNoteAdd(this.addNode);
        that._view.ClearActiveTextArea();
    },
    
    deleteNote:function(action){
        // var that = this;
        // that.DeleteNoteMode(function(deleteNode){
        //     that._view.DisplayUpdateDelete(deleteNode);
        // });
        
        console.log('delete note'); 
        
        if(this.deleteNode)
            this.deleteNode =false;
        else
            this.deleteNode =true;
            
        this._view.DisplayUpdateDelete(this.deleteNode);    
    },
    
    saveNote:function(saveData){
        var that = this;
        
        if (this.nodeManager == null) return;
        
        var saveCallback = function(savednode){
            that.selectedNote = savednode;
            that.addNode = false;
            that.options.SetState(that.addNode);
            //saveComplete(that.addNode);
            
            that._graphicsContext.SetLocked(false);
            that._graphicsContext.DrawTree();
            that._graphicsContext.UpdateInfo();
            that._view.DisplayUpdateNoteAdd(that.addNode);
            that._view.ClearActiveTextArea();
            
            that.meta.Unload();
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
        
    },
    
    PerformClick: function (x, y, newNodeSelected) {
        console.log("NodeManagerController: PerformClick");
         
        var that = this;
        
        // dont select anything
        if(this.options.GetState().pickMode) return;
        
        this.nodeManager.PointToNode(x,y, function(node){
            
            that.selectedNote = node;
       
            that.options.SetState(that.addNode, that.selectedNote);
        
            // add/edit node
            if(that.addNode)
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
                   
                    newNodeSelected(that.selectedNote.X, 
                            that.selectedNote.Y,that.selectedNote.Width, 
                            that.selectedNote.Height,that.selectedNote.D,
                            that.selectedNote.Annotation,that.selectedNote.options);
                        
                    that.meta.Load(that.selectedNote.MetaData);
                    that.options.SetDefaultOptionState(false);
                }
                else
                {
                    newNodeSelected(x, y,70,25,0,'',that.options.GetState().tempOptions);
                    
                    that.meta.Load([]);
                    that.options.SetDefaultOptionState(true);
                }
                
                that.options.SetState(that.addNode,that.selectedNote,true);
            }
    
            if(that.deleteNode && that.selectedNote != undefined){
                that.selectedNote.Visible =false;
                that.WriteToDB(that.selectedNote, function(){
                    console.log('node deleted');
                });
                that.options.SetState(that.addNode);
            }
            
            if(that.editNode && !that.addNode && !that.deleteNode){
                
            }
        });
     }

};












