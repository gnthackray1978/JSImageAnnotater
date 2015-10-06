var NodeController = function (view, nodeEditor) {
 
    this._view = view;

    this.nodeEditor = nodeEditor;

    this._view.CanvasClick($.proxy(this.canvasClick, this));
   
    //note operations
    this._view.Add($.proxy(this.addButtonClicked, this));
    
    this._view.Cancel($.proxy(this.cancelButtonClicked, this));
    
    this._view.SaveNote($.proxy(this.saveNote, this));
   
    this._view.Delete($.proxy(this.deleteNote, this));

};

NodeController.prototype = {
    

    init:function(){
        if (this.nodeEditor !== null) {
            this.nodeEditor.EnableRun(false);
        };
    },

    canvasClick:function(x,y){
        if (this.nodeEditor !== null) {
            this.nodeEditor.PerformClick(x, y);
        }
    },

    addButtonClicked:function(){
        this.nodeEditor.EnableAdd();
    },
   
   
    cancelButtonClicked:function(){
        this.nodeEditor.CancelAdd();
    },
    
    deleteNote:function(action){
        this.nodeEditor.DeleteNoteMode();
        
    },
    
    saveNote:function(saveData){
        if (this.nodeEditor !== null) {
            this.nodeEditor.SaveNoteClicked(saveData);
        }
    }
   

};












