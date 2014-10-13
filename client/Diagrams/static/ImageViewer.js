var TreeBase, TreeUI;



var ImageViewer = function () {

   // $.extend(this, new TreeBase());

    this.adjustedDistances = [];
    this.adjustedBoxWidths = [];
    this.adjustedBoxHeights = [];

    this.moveList = [];

    this.newX1 = 0.0;
    this.newX2 = 0.0;

    this.workingX1 = 0.0;
    this.workingX2 = 0.0;

    this.currentZoomPercentage = 100;

    this.canvas = document.getElementById("myCanvas");
    //var context = canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.displayNodeInfo=1;//delegate
    this.updateAddButtonUI = 1;
    this.updateSaveButtonUI = 1;
    this.updateDeleteButtonUI = 1;
    this.clearTextArea = 1;
    
    this.addNode =false;
    
};

ImageViewer.prototype = new TreeBase();

// do we need 3 modes?
// add mode = when a mouse is clicked on the image editor box is generated, if mouse is click inside existing box gen editor box at that location
// edit mode = after we have the editor box on the screen then we should be in editor mode
// delete mode= self explanatory
 
// so when some one clicks add note we need to set a flag changing the mode to note editor
// if they click it again the flag is removed

// when they click delete we have to find any high lighted node and remove it from the gens array

// if clicking save

ImageViewer.prototype.CancelAdd= function () {
    this.addNode = false;
    
    this.updateAddButtonUI(this.addNode);
    this.clearTextArea();
};


ImageViewer.prototype.EnableAdd= function () {
    this.addNode = true;
    
    this.updateAddButtonUI(this.addNode);
};

ImageViewer.prototype.PerformClick= function (x, y) {
        
        
    this.lastClickedPosY = y;
    this.lastClickedPosX = x;

    var vidx =1;
    var hidx =0;
    // loop throught generations and find out if we have the mouse in anything of them
    this.currentNode.x = -1; 
    this.currentNode.y = -1; 
   
    while(vidx < this.generations.length){
        
        hidx=0;
        while(hidx < this.generations[vidx].length){
            if (this.generations[vidx][hidx].X1 <= x && this.generations[vidx][hidx].X2 >= x) 
            {
                 console.log('matched x');
                 
                 if (this.generations[vidx][hidx].Y1 <= y && this.generations[vidx][hidx].Y2 >= y)                      
                 {
                    this.currentNode.x = vidx; 
                    this.currentNode.y = hidx;  
                 } 
            }
            hidx++;
        }
        
        vidx++;
    }
    
    //this.ancTree.displayNodeInfo
    
    if(this.addNode)
    {
        if( this.currentNode.x != -1 && this.currentNode.y != -1)
        {
            var currentNode = this.generations[this.currentNode.x][this.currentNode.y];
            var height = currentNode.Y2 - currentNode.Y1;
            var width = currentNode.X2 - currentNode.X1;
            var note = currentNode.RecordLink.note;
            
            this.displayNodeInfo(currentNode.X1, currentNode.Y1,width,height,note);
        }
        else
        {
            this.displayNodeInfo(x, y,25,10,'');
        }
    
    }
    else
    {
        this.clearTextArea();
    }
};

ImageViewer.prototype.DrawTree= function () {

    


     try
     {
         this.ComputeLocations();
     }
     catch(err)
     {
         console.log('error computing locations');
         console.log(err);
     }

    if (this.generations.length == 0) {
        return;
    }

    try {

      //  this.treeUI.ClearCanvas(0, 0, this.canvas.width, this.canvas.height);

        var that = this;

       this.treeUI.DrawImage(this.generations[0][0], '/Images/testimage2.jpg', function () {

           var vidx = 1;

           while (vidx < that.generations.length) {
                var hidx=0;
                while (hidx < that.generations[vidx].length) {
                    that.treeUI.DrawLabel(that.generations[vidx][hidx].X1,
                        that.generations[vidx][hidx].Y1,
                        that.generations[vidx][hidx].X2 - that.generations[vidx][hidx].X1,
                        that.generations[vidx][hidx].Y2 - that.generations[vidx][hidx].Y1, that.generations[vidx][hidx].RecordLink.note, 'white');
                    hidx++;
                }
                vidx++;
            }

        });
        
        // we need to check if the selected node has changed if so then update ui
        // also handle when the nodes are clicked on.
        // if something is clicked we have to remove the node
        // trigger the display of the text area which is html
        // does of any of that need to be done in here?
        

    }
    catch (err) {
        console.log('Error Drawing Persons');
        console.log(err);
    }





};

ImageViewer.prototype.ComputeLocations=function () {

    var width = (this.generations[0][0].X2 - this.generations[0][0].X1);

    var height = (this.generations[0][0].Y2 - this.generations[0][0].Y1);

    

    // assuming that the centre point has been changed by the zoom function if needed

    if (this.currentZoomPercentage != this.zoomPercentage) {
        var percentageDiff = this.zoomPercentage - this.currentZoomPercentage;
        width += (width / 100) * percentageDiff;
        height += (height / 100) * percentageDiff;
        this.currentZoomPercentage = this.zoomPercentage;
    }

    //this.canvas.width = window.innerWidth;
    //this.canvas.height = window.innerHeight;

    var halfCanvasWidth = (this.canvas.width / 2);

    // adjust centrepoint before we start?
    // no because centre point is the same for all boxs

    // we have to change the 'halfcanvaswidth' get the value as a percentage of the initial image


    this.generations[0][0].X2 = (this.centrePoint + width) - halfCanvasWidth;
    this.generations[0][0].X1 = this.centrePoint - halfCanvasWidth;
    
    this.generations[0][0].Y2 = this.centreVerticalPoint + height;
    this.generations[0][0].Y1 = this.centreVerticalPoint;
  
    //this.ancTree.initialGenerations


  
   


    // drawing boundaries will always be based on first image because thats the background
    this.drawingX1 = this.generations[0][0].X1;
    this.drawingX2 = this.generations[0][0].X2;

    this.drawingY1 = this.generations[0][0].Y1;
    this.drawingY2 = this.generations[0][0].Y2;

    this.drawingHeight = this.generations[0][0].Y2 - this.generations[0][0].Y1;

    this.drawingCentre = (this.drawingX2 - this.drawingX1) / 2;
    this.drawingWidth = this.drawingX2 - this.drawingX1;


     
    var initWidth = (this.initialGenerations[0][0].X2 - this.initialGenerations[0][0].X1);
    var initHeight = (this.initialGenerations[0][0].Y2 - this.initialGenerations[0][0].Y1);


    var idx = 0;

    while (idx < this.initialGenerations[1].length) {
        var px1 = (this.initialGenerations[1][idx].X1 / initWidth) * 100;
        var px2 = (this.initialGenerations[1][idx].X2 / initWidth) * 100;
        var py1 = (this.initialGenerations[1][idx].Y1 / initHeight) * 100;
        var py2 = (this.initialGenerations[1][idx].Y2 / initHeight) * 100;


        this.generations[1][idx].X1 = this.drawingX1 + (this.drawingWidth / 100) * px1;
        this.generations[1][idx].Y1 = this.drawingY1 + (this.drawingHeight / 100) * py1;

        this.generations[1][idx].X2 = this.drawingX1 + (this.drawingWidth / 100) * px2;
        this.generations[1][idx].Y2 = this.drawingY1 + (this.drawingHeight / 100) * py2;

        idx++;
    }


};       //end compute locations

//run when generation is loaded
//run when visibility changed
ImageViewer.prototype.UpdateGenerationState= function () { };

ImageViewer.prototype.CreateConnectionLines=function () {  }; //this.CreateConnectionLines

ImageViewer.prototype.CreateChildPositionFromParent= function (movePerson) { };

ImageViewer.prototype.GetNewX= function (genidx, percentageLess, personIdx) {  };

ImageViewer.prototype.getMoveList= function (person, startGen) {  };






ImageViewer.prototype.addNote=function(){
    
 
};

ImageViewer.prototype.deleteNote=function(){
    
};

ImageViewer.prototype.saveNote=function(){
    
};