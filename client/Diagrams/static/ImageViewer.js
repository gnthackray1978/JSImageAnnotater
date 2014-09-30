var TreeBase, TreeUI;



var ImageViewer = function () {

    $.extend(this, new TreeBase());

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
};


ImageViewer.prototype = {

    DrawTree: function () {

        


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
            

        }
        catch (err) {
            console.log('Error Drawing Persons');
            console.log(err);
        }





    },

    ComputeLocations: function () {

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


    },       //end compute locations

    //run when generation is loaded
    //run when visibility changed
    UpdateGenerationState: function () { },

    CreateConnectionLines: function () {  }, //this.CreateConnectionLines

    CreateChildPositionFromParent: function (movePerson) { },

    GetNewX: function (genidx, percentageLess, personIdx) {  },

    getMoveList: function (person, startGen) {  }
 

}