


var CopyPasteView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;
    
    this._channel.subscribe("CutDisabled", function(data, envelope) {
        that.DisableCut();
    });
    this._channel.subscribe("CopyDisabled", function(data, envelope) {
        that.DisableCopy();
    });
    this._channel.subscribe("PasteDisabled", function(data, envelope) {
        that.DisablePaste();
    });
    this._channel.subscribe("CutEnabled", function(data, envelope) {
        that.EnableCut();
    });
    this._channel.subscribe("CopyEnabled", function(data, envelope) {
        that.EnableCopy();
    });
    this._channel.subscribe("PasteEnabled", function(data, envelope) {
        that.EnablePaste();
    });
};

CopyPasteView.prototype.DisableCut = function (state){
    $("#cutbtn").prop('disabled',true);
};
CopyPasteView.prototype.DisableCopy = function (state){
    $("#copybtn").prop('disabled',true);
};
CopyPasteView.prototype.DisablePaste = function (state){
    $("#pastebtn").prop('disabled',true);
};
CopyPasteView.prototype.EnableCut = function (state){
    $("#cutbtn").prop('disabled',false);
};
CopyPasteView.prototype.EnableCopy = function (state){
    $("#copybtn").prop('disabled',false);
};
CopyPasteView.prototype.EnablePaste = function (state){
    $("#pastebtn").prop('disabled',false);
};

CopyPasteView.prototype.PublishCut = function (state){
    var that = this;
    
    $("#cutbtn").click(function (evt) {
        that._channel.publish( "CutClick", { value: evt } );
    });
};
CopyPasteView.prototype.PublishCopy = function (state){
    var that = this;
    
    $("#copybtn").click(function (evt) {
        that._channel.publish( "CopyClick", { value: evt } );
    });
};
CopyPasteView.prototype.PublishPaste = function (state){
    var that = this;
    
    $("#pastebtn").click(function (evt) {
        that._channel.publish( "PasteClick", { value: evt } );
    });
};


