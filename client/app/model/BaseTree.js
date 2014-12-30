


var TreeBase = function () {

    this.qryString = '';
    
    this.screenHeight = 0.0;
    this.screenWidth = 0.0;

 
  
    this.nodestore = new FakeData();

    this.centrePoint = 400.0;
    this.centreVerticalPoint = 0.0;
    this.zoomLevel = 0.0;
    this.centrePointXOffset = 0.0;
    this.centrePointYOffset = 0.0;

    this.zoomPercentage = 0.0;


    this.mouse_x = 0; //int
    this.mouse_y = 0; //int

    this.drawingX1 = 0.0;
    this.drawingX2 = 0.0;
    this.drawingY1 = 0.0;
    this.drawingY2 = 0.0;

    this.drawingCentre = 0.0;
    this.drawingWidth = 0.0;
    this.drawingHeight = 0.0;

    this.mouseXPercLocat = 0.0;
    this.mouseYPercLocat = 0.0;

    this.zoomAmount = 8; //int


    this.selectedNoteId = '';
 
    this.treeUI;

    this.lastClickedPosX = 0;
    this.lastClickedPosY = 0;
    
    this.currentNode= {
        x:0,
        y:0
    };

};

TreeBase.prototype = {

    SetInitialValues: function (zoomPerc, box_wid, box_hig,  screen_width, screen_height  ) {

        this.centrePoint = 0.0;
        this.centreVerticalPoint = 0.0;


        this.screenHeight = screen_height;
        this.screenWidth = screen_width;

        this.zoomPercentage = zoomPerc;

        this.currentNode = {
            x:0,
            y:0
        };


    },
    GetTreePerson: function (personId) {

        var _genidx = 0;
        var _index = 0;

        while (_genidx < this.nodestore.generations.length) {
            _index = 0;

            while (_index < this.nodestore.generations[_genidx].length) {

                if (this.nodestore.generations[_genidx][_index].Index == personId) {
                    return this.nodestore.generations[_genidx][_index];
                }
                _index++;
            }
            _genidx++;
        }

        return null;
    },
    MoveTree: function (direction) {
        // console.log('move tree' + direction);

        if (direction == 'SOUTH') this.centreVerticalPoint -= 1;
        if (direction == 'NORTH') this.centreVerticalPoint += 1;
        if (direction == 'EAST') this.centrePoint += 1;
        if (direction == 'WEST') this.centrePoint -= 1;


        if (direction == 'UP' || direction == 'DOWN') {

            var x = this.screenWidth / 2;
            var y = this.screenHeight / 2;

            if (this.lastClickedPosY != 0 && this.lastClickedPosX != 0) {
      
                this.SetMouse(this.lastClickedPosX, this.lastClickedPosY);
            } else {
                this.SetMouse(x, y);
            }
            


            this.SetZoomStart();

            this.SetCentrePoint(1000000, 1000000);


            if (direction == 'UP') {
                this.ZoomIn();
            }
            else {
                this.ZoomOut();
            }


        }
        else {
            this.DrawTree();
        }

    },
    SetZoom: function (percentage) {


        if (percentage !== 0.0) {
            var _workingtp = 0.0;
      
            //zoom drawing components 
            this.zoomPercentage += percentage;
            this.zoomLevel += percentage;
          
            this.ComputeLocations();

            // have some sort of override here for when we dont want to be zooming from mouse poisitons
            // or when we init the diagram
            this.GetPercDistances();
         
            this.centreVerticalPoint += (this.drawingHeight / 100) * (this.percY1 - this.mouseYPercLocat);

            
            
            //mouseXPercLocat is the position of the mouse x in the drawing as a percentage 
            //when the zoom was started
            
            // by subtracting the 2 positions we can work out how much to move the diagream 
            // to keep it in the same place
            
            var debugCentrePoint = this.centrePoint ;
            
            console.log('SetZoom init values: ip: ' + this.mouseXPercLocat + ' px1: ' + this.percX1 + ' dw: ' + this.drawingWidth + ' centre point: '+ this.centrePoint);
            
            this.centrePoint += (this.drawingWidth / 100) * (this.percX1 - this.mouseXPercLocat);

            console.log('SetZoom centrepoint moved: ' + (this.percX1 - this.mouseXPercLocat) + '% from ' +debugCentrePoint + ' to ' +  this.centrePoint);

            this.ComputeLocations();
            
            console.log('SetZoom drawing width: ' + this.drawingWidth);
        }  

       // console.log('zoom percentage ' + this.zoomPercentage);

        this.DrawTree();

    },
    SetZoomStart: function () {
        this.GetPercDistances();
        this.mouseXPercLocat = this.percX1;
        this.mouseYPercLocat = this.percY1;
    },
    
    ScaleToScreen: function(){
      
      
      // call this so that drawingwidth is set
     this.ComputeLocations();
      
      var screenWidth =   screen.width;
     var currentDrawingWidth = this.drawingWidth;
     
     console.log('ScaleToScreen: initial widths drawing ' + currentDrawingWidth + ' screen ' + screenWidth);
     
     
     
      var sizeDifference = (screenWidth - currentDrawingWidth);
      
      var avgSize = (currentDrawingWidth + screenWidth) / 2;
     
      console.log('ScaleToScreen: sizediff ' + sizeDifference +' avgsize '+ avgSize);
     
      var percentageDiff = 0;
      
      if((sizeDifference / currentDrawingWidth) !=0)
        percentageDiff = (sizeDifference / currentDrawingWidth) * 100;
      
      
      console.log('ScaleToScreen: set zoom ' + percentageDiff + '%');
      
      
      this.mouseXPercLocat = 0;
      this.mouseYPercLocat = 0;
   
      // make sure we dont get the mouses position 
      // when we clicked the draw button.
      this.mouse_x = 0;
      this.mouse_y = 0;
      
      
      this.SetZoom(percentageDiff);
      
      
      
    },
    
    GetPercDistances: function () {

        // percX1 = the position of mouse x,  expressed as a percentage of the drawing.
        
        
        var _distanceFromX1 = 0.0;
        var _distanceFromY1 = 0.0;
        var _onePercentDistance = 0.0;

        this.percX1 = 0.0;
        this.percY1 = 0.0;


        this.drawingWidth = this.drawingX2 - this.drawingX1;
        this.drawingHeight = this.drawingY2 - this.drawingY1;

        if (this.drawingWidth !== 0 && this.drawingHeight !== 0) {
            if (this.drawingX1 > 0) {
                _distanceFromX1 = this.mouse_x - this.drawingX1; //;
            }
            else {
                _distanceFromX1 = Math.abs(this.drawingX1) + this.mouse_x;
            }

            _onePercentDistance = this.drawingWidth / 100;
            
            console.log('GetPercDistances: dfx1 ' + _distanceFromX1 + ' 1px ' + _onePercentDistance);
            
            if(_distanceFromX1 !=0)
                this.percX1 = _distanceFromX1 / _onePercentDistance;
            
                


            if (this.drawingY1 > 0) {
                _distanceFromY1 = this.mouse_y - this.drawingY1; // ;                
            }
            else {
                _distanceFromY1 = Math.abs(this.drawingY1) + this.mouse_y;
            }

            _onePercentDistance = this.drawingHeight / 100;
            this.percY1 = _distanceFromY1 / _onePercentDistance;

        }

    },
   
    SetMouse: function (x, y) {
 
        this.mouse_x = x;
        this.mouse_y = y;

    },
    
    SetCentrePoint: function (param_x, param_y) {

        if(this.addNode) return;

        if (param_x == 1000000 && param_y == 1000000) {
            this.centrePointXOffset = 0;
            this.centrePointYOffset = 0;
        }
        else {

            if (this.centrePointXOffset === 0) {

                this.centrePointXOffset = this.centrePoint - param_x;
            }
            else {
          //      console.log('SetCentrePoint: cp ' + this.centrePoint + ' param_x ' + param_x + ' cpxoffset '  +this.centrePointXOffset );
                this.centrePoint = param_x + this.centrePointXOffset;
            }


            if (this.centrePointYOffset === 0) {
                this.centrePointYOffset = this.centreVerticalPoint - param_y;
            }
            else {

                this.centreVerticalPoint = param_y + this.centrePointYOffset;
            }

        }

        // console.log('setcentrepoint: '+ this.centrePointXOffset + ' ' + this.centrePoint);
    }, //end set centre point
    ZoomIn: function () {
        this.zoomAmount++;
        this.SetZoom(this.zoomAmount);
    },
    ZoomOut: function () {
        if (this.zoomAmount > 7)
            this.zoomAmount--;

        this.SetZoom(this.zoomAmount - (this.zoomAmount * 2));
        //  SetZoom(zoomAmount - (zoomAmount * 2));
    },
   
    RelocateToSelectedNode: function () {

        //if we dont have anyone selected dont do anything!
        if (this.selectedNoteId == 0) {
            console.log('RelocateToSelectedPerson no person selected');
            this.DrawTree();
        }

        var nodeId = this.selectedNoteId;

        this.ComputeLocations();


        var distanceToMove = 0.0;
        var currentPersonLocation = 0;
        var _temp = this.GetTreePerson(nodeId);

        var x = 0.0;
        var y = 0.0;

        if (_temp !== null) {
            if (_xpos === 0.0) {
                currentPersonLocation = (this.nodestore.generations[0][0].X1 + this.nodestore.generations[0][0].X2) / 2;
                var requiredLocation = this.screenWidth / 2;
                distanceToMove = requiredLocation - currentPersonLocation;
                console.log('RelocateToSelectedPerson : this.centrePoint += distanceToMove' + this.centrePoint + ' ' +distanceToMove );
                this.centrePoint += distanceToMove;
            }
            else {
                currentPersonLocation = _temp.X1;

                if (currentPersonLocation < 0.0) {
                    distanceToMove = _xpos - currentPersonLocation;
                }

                if (currentPersonLocation > this.screenWidth) {
                    distanceToMove = 0.0 - ((this.screenWidth - _xpos) + (_xpos - this.screenWidth));
                }

                if (currentPersonLocation >= 0 && currentPersonLocation <= this.screenWidth) {   //100 - 750
                    distanceToMove = _xpos - currentPersonLocation;
                    // 800 - 100
                }
                
                console.log('RelocateToSelectedPerson : this.centrePoint += distanceToMove' + this.centrePoint + ' ' +distanceToMove );
                this.centrePoint += distanceToMove;
            }

            if (_ypos === 0.0) {
                var _currentPersonLocation = (this.nodestore.generations[0][0].Y1 + this.nodestore.generations[0][0].Y2) / 2;
                var _requiredLocation = this.boxHeight;
                var _distanceToMove = _requiredLocation - _currentPersonLocation;
                this.centreVerticalPoint -= _distanceToMove;
            }
            else {

                if (_temp === null) {
                    currentPersonLocation = 0.0;
                }
                else {
                    currentPersonLocation = _temp.Y1;

                    if (currentPersonLocation > this.screenHeight) {
                        distanceToMove = currentPersonLocation - _ypos;
                    }
                    if (currentPersonLocation >= 0 && currentPersonLocation <= this.screenHeight) {
                        distanceToMove = currentPersonLocation - _ypos;
                    }
                    if (currentPersonLocation < 0) {
                        distanceToMove = _ypos - currentPersonLocation;
                    }
                }

                this.centreVerticalPoint -= distanceToMove;
            }

            this.ComputeLocations();

            if (_ypos === 0) {
                y = 0 - this.screenHeight / 2;
            }
            else {
                y = (_temp.Y2 + _temp.Y1) / 2;
            }

            if (_xpos === 0) {
                x = this.screenWidth / 2;
            }
            else {
                x = (_temp.X2 + _temp.X1) / 2;
            }

            this.SetMouse(x, y);
            this.SetZoomStart();
            this.SetCentrePoint(1000000, 1000000);


            this.DrawTree();
        }
    },
    Debug: function () {
 
    }



};

