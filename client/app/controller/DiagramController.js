var DiagramController = function (view, model) {
 
    //this._moustQueue = [];
    this._mouseDown = false;
    this._view = view;
    
 //   this.textarea = null;
    
    this.graphicsContext = model;

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
       // that.graphicsContext.CreateComponentList();
    
        that.graphicsContext.LoadBackgroundImage(function(id){
                    var canvas = document.getElementById("myCanvas");
              
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
        
                    that.graphicsContext.nodestore.GetGenerations(id, function(){
                        
                        that.graphicsContext.nodestore.RefreshMatches();
                        
                        console.log('got data starting app');
                        
                        setTimeout($.proxy(that.GameLoop,that), 1000 / 50);
         
                        //that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);
                        
                        that.graphicsContext.SetDrawingQueueReset();
                        
                    
                        that.graphicsContext.SetInitialValues(100, 0.0, 0.0, screen.width, screen.height);
                        that.graphicsContext.UpdateGenerationState();
                        that.graphicsContext.ScaleToScreen();
                       
                    });
            });

    },
    
    init:function(){
    
         if (this.graphicsContext !== null) {
           // this.graphicsContext.CreateComponentList();
            this.graphicsContext.EnableRun(false);
          //  this.graphicsContext.GetUrls();
            
         };
    },
        
    startFromAjax: function (id) {
    
        var that = this;
        //set image 
      
        var canvas = document.getElementById("myCanvas");
  
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        that.graphicsContext.nodestore.GetGenerations(id, function(){
            
            console.log('got data starting app');
            
            setTimeout($.proxy(that.GameLoop,that), 1000 / 50);

            //that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);
            that.graphicsContext.SetDrawingQueueReset();


            that.graphicsContext.SetInitialValues(100, 0.0, 0.0, screen.width, screen.height);
            that.graphicsContext.UpdateGenerationState();
            that.graphicsContext.ScaleToScreen();
           
        });
     
    },
     
    boxButtonUp:function(milliseconds){
        clearInterval(milliseconds);
    
    },
    boxButtonDown:function(dir){
        
        if (this.graphicsContext !== null) {
            
            var that = this;
            return setInterval(function () {
                that.graphicsContext.MoveTree(dir); 
                
            }, 100);
        }
    },
    
    canvasMouseMove:function(_point){
     
        if (this.graphicsContext !== null) {
            this.graphicsContext.SetMouse(_point[0], _point[1]);
           
            if (this._mouseDown) {
                this.graphicsContext.SetDrawingQueueValue(_point);
               // this._moustQueue.push(_point);
            }
        }
    },
    
    canvasMouseUp:function(){
        
      //console.log('canvas mouse up');
      if (this.graphicsContext !== null) {
            this._mouseDown = false;

           // var _point = new Array(1000000, 1000000);
           // this._moustQueue[this._moustQueue.length] = _point;
            this.graphicsContext.SetDrawingQueueReset();
        }
    },
    
    canvasMouseDown:function(){
        
        //console.log('canvas mouse down');
        if (this.graphicsContext !== null) {
      
            this._mouseDown = true;
        }
    },
    
    canvasClick:function(x,y){
        
        //console.log('canvas mouse click');
         if (this.graphicsContext !== null) {

            this.graphicsContext.PerformClick(x, y);
        
            //this._moustQueue[this._moustQueue.length] = new Array(1000000, 1000000);
            this.graphicsContext.SetDrawingQueueReset();
        }
    },
    
    CleanUp: function () {



        this.graphicsContext.generations = null;
      //  this.graphicsContext.familiesPerGeneration = null;
        this.graphicsContext.familySpanLines = null;
        this.graphicsContext.childlessMarriages = null;
    },
 
    addButtonClicked:function(){
        this.graphicsContext.EnableAdd();
    },
   
   
    cancelButtonClicked:function(){
        this.graphicsContext.CancelAdd();
    },
    
    deleteNote:function(action){
        this.graphicsContext.DeleteNoteMode();
        
    },
    
    saveNote:function(saveData){
        
        if (this.graphicsContext !== null) {

            this.graphicsContext.SaveNoteClicked(saveData);
        }
    },

    redraw: function(){
        this.graphicsContext.DrawTree();
    },
 
    GameLoop: function () {

        // while (this._moustQueue.length > 0) {
        //     var _point = this._moustQueue.shift();


        //     this.graphicsContext.SetCentrePoint(_point[0], _point[1]);
        //     this.graphicsContext.DrawTree();
        // }
        
        this.graphicsContext.SetDrawQueueEntries();
        
        setTimeout($.proxy(this.GameLoop, this));
    }

};












