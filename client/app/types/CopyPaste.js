

var CopyPaste = function (channel) {
    this.selectedNodes=[];
    this.copiedNodes=[];
};

CopyPaste.prototype.CopyNodes = function(){
    this.copiedNodes = this.selectedNodes;
    
};