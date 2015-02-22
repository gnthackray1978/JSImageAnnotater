var DiagramController = function (view, model) {
 
    //this._moustQueue = [];
    this._mouseDown = false;
    this._view = view;
    
 //   this.textarea = null;
    
    this.ancTree = model;

    this._view.CanvasClick($.proxy(this.canvasClick, this));
    this._view.CanvasMouseDown($.proxy(this.canvasMouseDown, this));
    this._view.CanvasMouseUp($.proxy(this.canvasMouseUp, this));
    this._view.CanvasMouseMove($.proxy(this.canvasMouseMove, this));
    this._view.CanvasUpdated($.proxy(this.redraw, this));
    this._view.ButtonPressDown($.proxy(this.boxButtonDown, this));
    this._view.ButtonPressUp($.proxy(this.boxButtonUp, this));
    
    
    //note operations
    this._view.Add($.proxy(this.addButtonClicked, this));
    
    this._view.Cancel($.proxy(this.cancelButtonClicked, this));
    
    this._view.SaveNote($.proxy(this.saveNote, this));
   
    this._view.Delete($.proxy(this.deleteNote, this));

    this._view.InitPanelVisibility();

    if(model.nodestore.Type() != 'AJAX'){
        this.startFromDrive();
        
    }
    else
    {
        this.init();
        
        this._view.RunButtonClicked($.proxy(this.startFromAjax, this));
    }



};

DiagramController.prototype = {
    
    
    startFromDrive: function(){

        //init drive here
        var that = this;
       // that.ancTree.CreateComponentList();
    
        that.ancTree.LoadBackgroundImage(function(id){
                    var canvas = document.getElementById("myCanvas");
              
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
        
                    that.ancTree.nodestore.GetGenerations(id, function(){
                        
                        console.log('got data starting app');
                        
                        setTimeout($.proxy(that.GameLoop,that), 1000 / 50);
         
                        //that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);
                        
                        that.ancTree.SetDrawingQueueReset();
                        
                    
                        that.ancTree.SetInitialValues(100, 0.0, 0.0, screen.width, screen.height);
                        that.ancTree.UpdateGenerationState();
                        that.ancTree.ScaleToScreen();
                       
                    });
            });

    },
    
    init:function(){
    
         if (this.ancTree !== null) {
           // this.ancTree.CreateComponentList();
            this.ancTree.EnableRun(false);
          //  this.ancTree.GetUrls();
            
         };
    },
        
    startFromAjax: function (id) {
    
        var that = this;
        //set image 
      
        var canvas = document.getElementById("myCanvas");
  
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        that.ancTree.nodestore.GetGenerations(id, function(){
            
            console.log('got data starting app');
            
            setTimeout($.proxy(that.GameLoop,that), 1000 / 50);

            //that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);
            that.ancTree.SetDrawingQueueReset();


            that.ancTree.SetInitialValues(100, 0.0, 0.0, screen.width, screen.height);
            that.ancTree.UpdateGenerationState();
            that.ancTree.ScaleToScreen();
           
        });
     
    },
     
    boxButtonUp:function(milliseconds){
        clearInterval(milliseconds);
    
    },
    boxButtonDown:function(dir){
        
        if (this.ancTree !== null) {
            
            var that = this;
            return setInterval(function () {
                that.ancTree.MoveTree(dir); 
                
            }, 100);
        }
    },
    
    canvasMouseMove:function(_point){
     
        if (this.ancTree !== null) {
            this.ancTree.SetMouse(_point[0], _point[1]);
           
            if (this._mouseDown) {
                this.ancTree.SetDrawingQueueValue(_point);
               // this._moustQueue.push(_point);
            }
        }
    },
    
    canvasMouseUp:function(){
        
      //console.log('canvas mouse up');
      if (this.ancTree !== null) {
            this._mouseDown = false;

           // var _point = new Array(1000000, 1000000);
           // this._moustQueue[this._moustQueue.length] = _point;
            this.ancTree.SetDrawingQueueReset();
        }
    },
    
    canvasMouseDown:function(){
        
        //console.log('canvas mouse down');
        if (this.ancTree !== null) {
      
            this._mouseDown = true;
        }
    },
    
    canvasClick:function(x,y){
        
        //console.log('canvas mouse click');
         if (this.ancTree !== null) {

            this.ancTree.PerformClick(x, y);
        
            //this._moustQueue[this._moustQueue.length] = new Array(1000000, 1000000);
            this.ancTree.SetDrawingQueueReset();
        }
    },
    
    CleanUp: function () {



        this.ancTree.generations = null;
      //  this.ancTree.familiesPerGeneration = null;
        this.ancTree.familySpanLines = null;
        this.ancTree.childlessMarriages = null;
    },
 
    addButtonClicked:function(){
        this.ancTree.EnableAdd();
    },
   
   
    cancelButtonClicked:function(){
        this.ancTree.CancelAdd();
    },
    
    deleteNote:function(action){
        this.ancTree.DeleteNoteMode();
        
    },
    
    saveNote:function(saveData){
        
        if (this.ancTree !== null) {

            this.ancTree.SaveNoteClicked(saveData);
        }
    },

    redraw: function(){
        this.ancTree.DrawTree();
    },
 
    GameLoop: function () {

        // while (this._moustQueue.length > 0) {
        //     var _point = this._moustQueue.shift();


        //     this.ancTree.SetCentrePoint(_point[0], _point[1]);
        //     this.ancTree.DrawTree();
        // }
        
        this.ancTree.SetDrawQueueEntries();
        
        setTimeout($.proxy(this.GameLoop, this));
    }

};












