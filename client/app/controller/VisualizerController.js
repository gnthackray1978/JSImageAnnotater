var VisualizerController = function (view, graphicsContext, channel) {
 
    this.channel = channel;
    
    this.millisecondsInterval = 0;
    
    this._mouseDown = false;
    this._view = view;

    this.graphicsContext = graphicsContext;

    var that = this;

    // this.graphicsContext.UpdateInfo = function(imdat){
    //     that._view.UpdateInfoWindow(imdat);
    // };

    this.channel.subscribe("visMouseDown", function(data, envelope) {
        that.canvasMouseDown(data.value);
    });
    
    this.channel.subscribe("visMouseUp", function(data, envelope) {
        that.canvasMouseUp(data.value);
    });
    
    this.channel.subscribe("visMouseMove", function(data, envelope) {
        that.canvasMouseMove(data.value);
    });
    
    this.channel.subscribe("visSingleClick", function(data, envelope) {
        that.canvasClick(data.value.x, data.value.y);
    });
    
    this.channel.subscribe("defaultOptionsLoaded", function(data, envelope) {
        that.graphicsContext.SetDefaultOptions(data.value);
    });
    
    this.channel.subscribe("drawtree", function(data, envelope) {
        that.graphicsContext.DrawTree();
    });
    
    this.channel.subscribe("scale", function(data, envelope) {
        that.graphicsContext.ScaleToScreen();
    });
    
    this.channel.subscribe("lock", function(data, envelope) {
        that.graphicsContext.SetLocked(data.value);
    });
    
    var intervalMove = function(dir){
        that.millisecondsInterval = setInterval(function () {
            that.graphicsContext.MoveTree(dir); 
        }, 100);
    };
    
    this.channel.subscribe("visUpButton", function(data, envelope) {
        intervalMove('NORTH');
    });
    
    this.channel.subscribe("visDownButton", function(data, envelope) {
        intervalMove('SOUTH');
    });
    
    this.channel.subscribe("visLeftButton", function(data, envelope) {
        intervalMove('WEST');
    });

    this.channel.subscribe("visRightButton", function(data, envelope) {
        intervalMove('EAST');
    });


    this.channel.subscribe("visZoomInButton", function(data, envelope) {
        intervalMove('UP');
    });

    this.channel.subscribe("visZoomOutButton", function(data, envelope) {
        intervalMove('DOWN');
    });
    
    this.channel.subscribe("visButtonReleased", function(data, envelope) {
        clearInterval(that.millisecondsInterval); 
    });

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

    canvasMouseMove:function(_point){
     
        if (this.graphicsContext !== null) {
            this.graphicsContext.SetMouse(_point[0], _point[1]);
           
            if (this._mouseDown) {
                //console.log('canvasMouseMove');
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

        this.graphicsContext.SetDrawQueueEntries();
        
        setTimeout($.proxy(this.GameLoop, this));
    }

};












