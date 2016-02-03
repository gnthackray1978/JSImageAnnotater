var Debuger = function (channel, dataDll,nodestore,visualizer,nodePositioning) {
    var that = this;
    this._channel = channel;
    this.dataDll = dataDll;
    this.nodestore = nodestore;
    this.visualizer = visualizer;
    this._nodePositioning  = nodePositioning;
    
    this._channel.subscribe("ClearDeleted", function(data, envelope) {
        that.ClearDeleted(data.value);   
    });
    
    this._channel.subscribe("RunScaleToScreen", function(data, envelope) {
        that.RunScaleToScreen(data.value);  
    });
    
    this._channel.subscribe("RunMoveNode", function(data, envelope) {
        that.RunMoveNode(data.value);  
    });
    
    
   
    
    
};

Debuger.prototype.ClearDeleted = function(text){
    this.dataDll.ClearDeleted(function(){
        console.log('deleted entries cleared');
    });
};

Debuger.prototype.RunScaleToScreen = function(text){

    this.visualizer.ScaleToScreen(text);
    
};

Debuger.prototype.RunMoveNode = function(text){
    var coords = text.split(','); 
    var x = 0;
    var y = 0;
    if(coords.length > 1){
        x = coords[0];
        y = coords[1];
    }
   
    var idx =0;
    while(idx < this.nodestore.generations[1].length){
        if(Number(this.nodestore.generations[1][idx].Index) === 172)
        {
            this.nodestore.generations[1][idx].X += Number(x);
            this.nodestore.generations[1][idx].Y += Number(y);
           
            this.nodestore.UpdateNode(this.nodestore.generations[1][idx], function(){
                console.log('finished');
            });
            
            
        }
        idx++;
    }
   
   
};
