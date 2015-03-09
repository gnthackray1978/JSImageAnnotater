var Debuger = function (nodestore,view) {
    this.nodestore = nodestore;
    this.view = view;
 
};

Debuger.prototype.SearchString = function(text){
    console.log(text);
    
    this.nodestore.BuildSearchCache(text, function(data){
        console.log('data:' + data.length)
    });
    
    
};

