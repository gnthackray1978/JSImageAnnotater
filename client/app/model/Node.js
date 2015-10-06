var  CanvasTools;

var NodeEditor = function (graphicsContext, nodestore,view, meta, options) {

    this.meta = meta;
    this.options = options;
    this.nodestore = nodestore;
    this.view = view;
    this.graphicsContext = graphicsContext;

    this.addNode =false;
    this.deleteNode =false;
    this.selectedNote;
};

NodeEditor.prototype.PerformClick= function (x, y) {
        
    console.log("canvas clicked");
     
    //setting options class state (giving it selected node and setting its mode)
    //setting options class mode (if we have no selected node set to use default options)
    //setting metadata class state(giving it selected node metadata)
    //setting selectednode options 
    
    //displaying selectednode
    //hide selectednode
    //delete selected node somehow
     
     
     
    var that = this;
    
    // dont select anything
    if(this.options.GetState().pickMode) return;
    
    this.nodestore.PointToNode(x,y, function(node){
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
               
                that.view.DisplayNodeSelection(that.selectedNote.X, that.selectedNote.Y,that.selectedNote.Width, that.selectedNote.Height,that.selectedNote.D,that.selectedNote.Annotation,that.selectedNote.options);
                    
                that.meta.Load(that.selectedNote.MetaData);
                that.options.SetDefaultOptionState(false);
            }
            else
            {
                that.view.DisplayNodeSelection(x, y,70,25,0,'',that.options.GetState().tempOptions);
                that.meta.Load([]);
                that.options.SetDefaultOptionState(true);
            }
            
            that.options.SetState(that.addNode,that.selectedNote,true);
        }

        if(that.deleteNode && that.selectedNote != undefined){
            that.selectedNote.Visible =false;
            that.nodestore.WriteToDB(that.selectedNote);
            that.options.SetState(that.addNode);
        }
        
        if(!that.addNode)
            that.view.ClearActiveTextArea();

    });
};

//notes 
//options
NodeEditor.prototype.SaveNoteClicked=function(saveData){
    
    console.log('save note');
    var that = this;

    var saveCallback = function(savednode){
        that.selectedNote = savednode;
        that.addNode = false;
        that.graphicsContext.SetLocked(false);
        that.options.SetState(that.addNode);
        that.view.DisplayUpdateNoteAdd(that.addNode);
        that.view.ClearActiveTextArea();
        //refresh the drawing
       
        that.graphicsContext.DrawTree();
        that.graphicsContext.UpdateInfo();
        that.meta.Unload();
    };

    this.nodestore.GetActiveLayer(function(layerId){
        that.meta.QryNodeMetaData(function(data){
                that.options.QrySaveData(function(options){
                    saveData.options = options;

                    that.nodestore.WriteNote(that.selectedNote,saveData.x,
                        saveData.y, saveData.width,saveData.height,saveData.d,
                        saveData.text,saveData.options,layerId, data, false,true, saveCallback);
                });
        }); 
    });
    
};
//options
NodeEditor.prototype.CancelAdd= function () {
    this.options.SetDefaultOptionState(false);
    this.addNode = false;
    this.graphicsContext.SetLocked(true);
    this.options.SetState(this.addNode);
    this.meta.Unload();
    this.view.DisplayUpdateNoteAdd(this.addNode);
    this.view.ClearActiveTextArea();
};
//options
NodeEditor.prototype.EnableAdd= function () {
    this.addNode = true;
    this.graphicsContext.SetLocked(true);
    this.options.SetState(this.addNode,undefined,true);
    this.view.DisplayUpdateNoteAdd(this.addNode);
    
};

NodeEditor.prototype.DeleteNoteMode=function(){
    console.log('delete note'); 
    if(this.deleteNode)
        this.deleteNode =false;
    else
        this.deleteNode =true;
        //DisplayUpdateDelete
    //this.updateDeleteButtonUI(this.deleteNode);
    this.view.DisplayUpdateDelete(this.deleteNode);
};
 

   