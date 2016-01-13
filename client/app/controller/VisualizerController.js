var VisualizerController = function (view, graphicsContext, channel) {
 
    this.channel = channel;
    
    this._mouseDown = false;
    this._view = view;

    this.graphicsContext = graphicsContext;

    var that = this;

    this.graphicsContext.EnableRun = function(param){
        that._view.DisplayUpdateRunButton(param);
    };

    this.graphicsContext.UpdateInfo = function(imdat){
        that._view.UpdateInfoWindow(imdat);
    };

    this.channel.subscribe("visMouseDown", function(data, envelope) {
        that.canvasMouseDown(data.value);
    });
    
    this.channel.subscribe("visMouseUp", function(data, envelope) {
        that.canvasMouseUp(data.value);
    });
    
    this.channel.subscribe("visMouseMove", function(data, envelope) {
        that.canvasMouseMove(data.value);
    });

    this._view.ButtonPressDown($.proxy(this.boxButtonDown, this));
    this._view.ButtonPressUp($.proxy(this.boxButtonUp, this));
    
    
    //note operations
   
    this._view.InitPanelVisibility();

    if(graphicsContext.nodestore.Type() != 'AJAX'){
        this.startFromDrive();
        
        if(this.channel){
            this.channel.subscribe("drawtree", function(data, envelope) {
                //console.log('rec ');
                that.graphicsContext.DrawTree();
            });
            
            this.channel.subscribe("scale", function(data, envelope) {
                that.graphicsContext.ScaleToScreen();
            });
            
            this.channel.subscribe("lock", function(data, envelope) {
                that.graphicsContext.SetLocked(data.value);
            });
            
            this.channel.subscribe("singleClick", function(data, envelope) {
                that.canvasClick(data.value.x, data.value.y);
            });
        }
    }
    else
    {
        this.init();
        
        this._view.RunButtonClicked($.proxy(this.startFromAjax, this));
    }



};

VisualizerController.prototype = {
    
    
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
                        
                     //   console.log('got data starting app');
                        
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
         if (this._view !== null) {
             this._view.DisplayUpdateRunButton(false);   
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

            this.graphicsContext.SetLastClickPos(x, y);
        
            this.graphicsContext.SetDrawingQueueReset();
        }
    },
    
    CleanUp: function () {



        this.graphicsContext.generations = null;
      //  this.graphicsContext.familiesPerGeneration = null;
        this.graphicsContext.familySpanLines = null;
        this.graphicsContext.childlessMarriages = null;
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












