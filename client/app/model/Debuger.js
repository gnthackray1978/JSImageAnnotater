var Debuger = function (dataDll) {
    this.dataDll = dataDll;
 
 
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

