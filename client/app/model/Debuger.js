var Debuger = function (dataDll, nodestore) {
    this.dataDll = dataDll;
    this.nodestore = nodestore;
 
};



Debuger.prototype.SearchString = function(text){
    var that =this;
    console.log(text);
    
    this.dataDll.BuildSearchCache(function(){
        console.log('loaded cache');
        
        that.IterateNotes();
        // that.dataDll.QrySearchCache(text, function(data){
        //     console.log('found: ' + data.length);
        // });
    });
    
    
};


Debuger.prototype.IterateNotes = function(){
    var that =this;
    
    //loop through all the notes
    // that.nodestore.generations[vidx][hidx].X,
    // that.nodestore.generations[vidx][hidx].Y,
    // that.nodestore.generations[vidx][hidx].Width,
    // that.nodestore.generations[vidx][hidx].Height,
    // that.nodestore.generations[vidx][hidx].D,
    // that.nodestore.generations[vidx][hidx].Annotation, 
    var vidx = 1;
    
    // take a node from current map
    // look through all the notes from other images
    while (vidx < that.nodestore.generations.length) {
        var hidx=0;
        while (hidx < that.nodestore.generations[vidx].length) {
            
            //console.log('annotation: '+that.nodestore.generations[vidx][hidx].Annotation);
            //return all 
            //testable strings from the node
            //check each one in the searchcache
            if(that.nodestore.generations[vidx][hidx].Annotation)  
            {
                that.FindSearchStrings(4,that.nodestore.generations[vidx][hidx].Annotation, function(result){
                    var testCaseIdx =0;
                    while(testCaseIdx < result.length){
                        
                        that.dataDll.QrySearchCache(result[testCaseIdx], function(data){
                             console.log('Found matches for: ' +result[testCaseIdx] +' - '+ data.length);
                        });
                        
                        testCaseIdx ++;
                    }
                });
            }
            
            hidx++;
        }
        vidx++;
    }
    
},

Debuger.prototype.FindSearchStrings = function(charCount, text, callback){
    
    
    var textComponents = text.split(' ');
    
    var results = [];
    
   
    var makeString = function(idx, results){
        var initialOffset =idx;
        
        if((idx + charCount) <=  textComponents.length){
            
            var comparisonString = '';
            
            while(idx < (charCount+initialOffset) && idx < textComponents.length){
                comparisonString += textComponents[idx] + ' ';
                idx++;
                
                
            }
            
            comparisonString = comparisonString.trim();
            
            results.push(comparisonString);
        }
    }
    
    makeString(0,results);
    
    makeString(1,results);
    
    
    callback(results);
    
}

