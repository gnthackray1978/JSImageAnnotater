var CropperView = function (view, channel) {
    
    var that = this;
    
    this._baseView = view;
    this._channel = channel;
    
    this._channel.subscribe("setaddbuttonadd", function(data, envelope) {
        that.SetAddButtonAdd();
    });
    
    this._channel.subscribe("setcropsavedisabled", function(data, envelope) {
        that.SetCropSaveDisabled();
    });
    
    this._channel.subscribe("setaddbuttoncancel", function(data, envelope) {
        that.SetAddButtonCancel();
    });
    
    this._channel.subscribe("setcropsaveenabled", function(data, envelope) {
        that.SetCropSaveEnabled();
    });
        
        
    
    this.PublishCropSaveButton();
    this.PublishCropACModeButton();
    this.PublishCropDeleteButton();
  
};

CropperView.prototype.SetAddButtonCancel = function(){
    $("#btnAddCropping").prop('value', 'Cancel'); 
};

CropperView.prototype.SetAddButtonAdd = function(){
    $("#btnAddCropping").prop('value', 'Add'); 
};

CropperView.prototype.SetCropSaveEnabled = function(){
    $("#btnSaveCrop").show(); 
};

CropperView.prototype.SetCropSaveDisabled = function(){
    $("#btnSaveCrop").hide(); 
};



CropperView.prototype.PublishCropSaveButton = function(action){
    
    var that = this;
   
    $('#btnSaveCrop').click(function (e) {            
        e.preventDefault();
        that._channel.publish( "CropSaveButton", { value: e } );
    });   
};

CropperView.prototype.PublishCropACModeButton = function(action){
    var that = this;
    
    $('#btnAddCropping').click(function (e) {            
        e.preventDefault();
        that._channel.publish( "CropACModeButton", { value: e } );
    });   
};

CropperView.prototype.PublishCropDeleteButton = function(action){
    var that = this;
    
    $('#btnDeleteCropping').click(function (e) {            
        e.preventDefault();
        that._channel.publish( "CropDeleteButton", { value: e } );
    });   
};

// CropperView.prototype.PublishCropSaveButton = function(action){
//     var that = this;

//     $('#btnSaveCrop').click(function (e) {            
//         e.preventDefault();
//         that._channel.publish( "CropDeleteButton", { value: e } );
//     });   
// };
