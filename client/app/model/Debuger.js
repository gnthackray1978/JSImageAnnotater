var Debuger = function (dataDll, nodestore) {
    this.dataDll = dataDll;
    this.nodestore = nodestore;
 
};

Debuger.prototype.SearchString = function(text){
    var that =this;
    console.log(text);
    
    this.dataDll.BuildSearchCache(function(){
        console.log('loaded cache');
        
        
        that.dataDll.QrySearchCache(text, function(data){
            console.log('found: ' + data.length);
        });
    });
    
    
};

Debuger.prototype.IterateNotes = function(text){
    var that =this;
    
    //loop through all the notes
    // that.nodestore.generations[vidx][hidx].X,
    // that.nodestore.generations[vidx][hidx].Y,
    // that.nodestore.generations[vidx][hidx].Width,
    // that.nodestore.generations[vidx][hidx].Height,
    // that.nodestore.generations[vidx][hidx].D,
    // that.nodestore.generations[vidx][hidx].Annotation, 
    var vidx = 1;
    
    while (vidx < that.nodestore.generations.length) {
        var hidx=0;
        while (hidx < that.nodestore.generations[vidx].length) {
            hidx++;
        }
        vidx++;
    }
    
}