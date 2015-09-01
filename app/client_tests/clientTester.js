

(function(exports){
    
    var mockView = require('./mockView.js');
    var mockDataManager = require('./mockDataManager.js');
    var cropper            = require('../../client/app/model/Crop.js');
    var croppingController = require('../../client/app/controller/CroppingController.js');

    var CropTests = function () {
        this.view = new mockView.MockView();
        this.mockDataManager = new mockDataManager.MockDataManager();
        this.crop;
        this.cropController;
    };

    CropTests.prototype = {
        init:function(){
            this.crop = new cropper.Crop(this.mockDataManager);
            this.cropController = new croppingController.CroppingController(this.view,this.crop);
        },
        
        CropAreaCreated:function(){
            
            var mouseEvt  = {
                layerX :0,
                layerY :0
            };
            
            this.cropController.qryCropAddButton();
            
            this.cropController.qryCanvasMouseDown(mouseEvt); 
            
            mouseEvt.layerX +=5;
            mouseEvt.layerY +=5;
            
            this.cropController.qryCanvasMouseMove(mouseEvt); 
            mouseEvt.layerX +=5;
            mouseEvt.layerY +=5;
            
            this.cropController.qryCanvasMouseMove(mouseEvt); 
            
            this.cropController.qryCanvasMouseUp(mouseEvt); 
            
            var failed =false;
            
            if(this.crop.cropnode.X != 0){
                console.log(this.crop.cropnode.X + ' should be 0');
                failed =true;
            }
            
            if(this.crop.cropnode.Y != 0){
                console.log(this.crop.cropnode.Y + ' should be 0');
                failed =true;
            }
            
            if(this.crop.cropnode.Width != 10){
                console.log(this.crop.cropnode.Width + ' should be 10');
                failed =true;
            }
            
            if(this.crop.cropnode.Height != 10){
                console.log(this.crop.cropnode.Height + ' should be 10');
                failed =true;
            }
            
            if(!failed)
                console.log('TEST CROP TOOL - CropAreaCreated PASSED');
            else
                console.log('TEST CROP TOOL - CropAreaCreated FAILED');
        }
        
    };


    exports.CropTests = CropTests;
})(typeof exports === 'undefined'? this: exports);













