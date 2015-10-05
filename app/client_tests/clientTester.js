

(function(exports){
    
    var mockView = require('./mockView.js');
    var mockDataManager = require('./mockDataManager.js');
    var cropper            = require('../../client/app/model/Crop.js');
    var croppingController = require('../../client/app/controller/CroppingController.js');

    var CropTests = function () {
        this.view;
        this.mockDataManager;
        this.crop;
        this.cropController;
    };

    CropTests.prototype = {
        init:function(){
            this.view = new mockView.MockView();
            this.mockDataManager = new mockDataManager.MockDataManager();
            this.crop = new cropper.Crop(this.mockDataManager);
            this.cropController = new croppingController.CroppingController(this.view,this.crop);
        },
        
        CropAreaCreated:function(){
            
            var mouseEvt  = {
                layerX :0,
                layerY :0
            };
            
            this.cropController.qryCropACModeButton();
            
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
        },
        
        AddMode:function(){
            var failed =false;
            
            this.cropController._setAddMode();
            
            if(this.cropController.model == undefined)
            {
                console.log('model not defined');
                failed =true;   
            }
            if(this.cropController.model.addMode)
            {
                console.log('addmode flag not reset to false');
                failed =true;     
            }
            if(this.view.mouseMove != ''){
                console.log('mouseMove lock not empty');
                failed =true; 
            } 
            if(this.view.mouseUp != 'CROP' ){
                console.log('mouseUp lock not crop');
                failed =true; 
            } 
            if(this.view.mouseDown != 'CROP' ){
                console.log('mouseDown lock not crop');
                failed =true; 
            } 
            if(this.view.addButtonCancel != 1 ){
                console.log('addButtonCancel not called');
                failed =true; 
            } 
            if(this.view.addButtonAdd != 0 ){
                console.log('addButtonAdd called');
                failed =true; 
            } 
            if(this.view.cropSaveEnabled != 0 ){
                console.log('cropSaveEnabled called');
                failed =true; 
            } 
            if(this.view.cropSaveDisabled != 0)
            {   console.log('cropSaveDisabled called');
                failed =true;            
            }
            
            
            if(!failed)
                console.log('TEST CROP TOOL - AddMode PASSED');
            else
                console.log('TEST CROP TOOL - AddMode FAILED');
        },
        
        CancelMode:function(){
            var failed =false;
           
            this.cropController._setCancelMode();
           
            if(this.view.mouseMove != ''){
                console.log('mouseMove lock not empty');
                failed =true; 
            } 
            if(this.view.mouseUp != '' ){
                console.log('mouseUp lock not empty');
                failed =true; 
            } 
            if(this.view.mouseDown != '' ){
                console.log('mouseDown lock not empty');
                failed =true; 
            } 
            
            
            if(this.view.addButtonCancel != 0 ){
                console.log('addButtonCancel called');
                failed =true; 
            } 
            if(this.view.addButtonAdd != 1 ){
                console.log('addButtonAdd not called');
                failed =true; 
            } 
            if(this.view.cropSaveEnabled != 0 ){
                console.log('cropSaveEnabled called');
                failed =true; 
            } 
            if(this.view.cropSaveDisabled != 1)
            {   console.log('cropSaveDisabled not called');
                failed =true;            
            }
            
            
            if(!failed)
                console.log('TEST CROP TOOL - CancelMode PASSED');
            else
                console.log('TEST CROP TOOL - CancelMode FAILED');
        },
        
        Delete :function(){
            var failed =false;
           
            this.cropController.qryCropDeleteButton();
            
        
            if(this.mockDataManager.writeNote != 1){
                console.log('writeNote not called');
                failed =true; 
            } 
            
            if(this.mockDataManager.getCroppingNote != 1){
                console.log('getCroppingNote not called');
                failed =true; 
            } 
         
         
            if(this.view.addButtonCancel != 0){
                console.log('addButtonCancel called');
                failed =true; 
            } 
            if(this.view.addButtonAdd != 0){
                console.log('addButtonAdd not called');
                failed =true; 
            } 
            if(this.view.cropSaveEnabled != 0){
                console.log('cropSaveEnabled called');
                failed =true; 
            } 
            if(this.view.cropSaveDisabled != 1)
            {   console.log('cropSaveDisabled not called');
                failed =true;            
            }
            
            if(!failed)
                console.log('TEST CROP TOOL - Delete PASSED');
            else
                console.log('TEST CROP TOOL - Delete FAILED');
        },
    
        Save :function(){
            var failed =false;
            
            this.cropController._setAddMode();
           
            this.crop.cropnode.X = 10;//moved a bit
			this.crop.cropnode.Y = 10;
            this.crop.cropnode.Width = 10;
			this.crop.cropnode.Height = 10;
			
            this.cropController.qryCropSaveButton();
            
        
            if(this.mockDataManager.writeNote != 1){
                console.log('writeNote not called');
                failed =true; 
            } 
            
            if(this.crop.cropnode.LayerId != -4) {
                console.log('cropnode Incorrect layer Id expected -4');
                failed =true; 
            }
	        if(this.crop.cropnode.X == 0){
	            console.log('cropnode X should not be zero');
                failed =true; 
	        }
	        if(this.crop.cropnode.Y == 0){
	            console.log('cropnode Y should not be zero');
                failed =true; 
	        }
	        if(!this.crop.cropnode.Visible){
	           console.log('cropnode not visible');
               failed =true;   
	        }
	        
            // if(this.view.addButtonCancel != 0){
            //     console.log('addButtonCancel called');
            //     failed =true; 
            // } 
            if(this.view.addButtonAdd != 1){
                console.log('addButtonAdd not called');
                failed =true; 
            } 
            // if(this.view.cropSaveEnabled != 0){
            //     console.log('cropSaveEnabled called');
            //     failed =true; 
            // } 
            if(this.view.cropSaveDisabled != 1)
            {   console.log('cropSaveDisabled not called');
                failed =true;            
            }
            
            if(!failed)
                console.log('TEST CROP TOOL - Save PASSED');
            else
                console.log('TEST CROP TOOL - Save FAILED');
        }
        
    };
    
    exports.CropTests = CropTests;
})(typeof exports === 'undefined'? this: exports);













