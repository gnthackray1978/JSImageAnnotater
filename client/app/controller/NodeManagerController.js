var NodeManagerController = function (view, nodeDataManager, graphicsContext) {
 
    this._view = view;
    this._graphicsContext = graphicsContext;

    this.nodeManager = nodeDataManager;

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
        console.log('clicked');
        if (this.nodeManager !== null) {
            this.nodeManager.PerformClick(x, y, function(x,y,width,height,angle,annotation,options){
                that._view.DisplayNodeSelection(x,y,width,height,angle,annotation,options);
            });
            
            if(!this.nodeManager.addNode)
                that._view.ClearActiveTextArea();
        }
    },

    addButtonClicked:function(){
        var that = this;
        
        this.nodeManager.EnableAdd(function(addNode){
            that._graphicsContext.SetLocked(true);
            that._view.DisplayUpdateNoteAdd(addNode);
        });
    },
   
   
    cancelButtonClicked:function(){
        var that = this;
        this.nodeManager.CancelAdd(function(addNode){
            that._graphicsContext.SetLocked(false);
            that._view.DisplayUpdateNoteAdd(addNode);
            that._view.ClearActiveTextArea();
        });
    },
    
    deleteNote:function(action){
        var that = this;
        this.nodeManager.DeleteNoteMode(function(deleteNode){
            that._view.DisplayUpdateDelete(this.deleteNode);
        });
        
    },
    
    saveNote:function(saveData){
        var that = this;
        if (this.nodeManager !== null) {
            this.nodeManager.SaveNoteClicked(saveData, function(addNode){
                that._graphicsContext.SetLocked(false);
                that._graphicsContext.DrawTree();
                that._graphicsContext.UpdateInfo();
                that._view.DisplayUpdateNoteAdd(addNode);
                that._view.ClearActiveTextArea();
            });
        }
    }
   

};












