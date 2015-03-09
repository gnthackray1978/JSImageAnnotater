var Debuger = function (nodestore,view) {
    this.nodestore = nodestore;
    this.view = view;
 
};

Debuger.prototype.SearchString = function(text){
    console.log(text);
    
    this.nodestore.BuildSearchCache(function(){
        console.log('loaded cache');
        
        
        this.nodestore.QrySearchCache(text, function(data){
            console.log('found: ' + data.length);
        });
    });
    
    
};

