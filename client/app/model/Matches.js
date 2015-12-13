var Matches = function (dataDll, nodestore) {
    this.dataDll = dataDll;
    this.nodestore = nodestore;
 
};

Matches.prototype.SetMatches = function(text){
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

Matches.prototype.IterateNotes = function(){
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
        var originalLength = that.nodestore.generations[vidx].length;
        
        while (hidx < originalLength) {
            
            //
            //return all 
            //testable strings from the node
            //check each one in the searchcache
            if(that.nodestore.generations[vidx][hidx].Annotation && that.nodestore.generations[vidx][hidx].LayerId !=5)  
            {
                console.log('find search string on: '+that.nodestore.generations[vidx][hidx].Annotation);
                
                var searchComplete = function(vidx,hidx,matches){
                    if(matches.length > 0)
                        that.AddMatch(vidx,hidx,matches);
                };
                
                that.FindSearchStrings(4,that.nodestore.generations[vidx][hidx].Annotation, function(result){
                    var testCaseIdx =0;
                    var matches = [];
                    var retCount=0;
                    while(testCaseIdx < result.length){
                        // test each of the search strings
                        that.dataDll.QrySearchCache(result[testCaseIdx], function(data){
                            retCount++;
                            // this should return all matches 
                            if(data.length >0){
                                var midx =0;
                                while(midx < data.length){
                                    matches.push(result[testCaseIdx]);
                                    midx++;
                                }
                                //console.log('Found matches for: ' +result[testCaseIdx] +' - '+ data.length);
                            }
                             
                            if(retCount==result.length) {
                                searchComplete(vidx,hidx,matches);
                            }
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

Matches.prototype.FindSearchStrings = function(charCount, text, callback){
    
    
    var textComponents = text.split(' ');
    
    for(var i = textComponents.length-1; i--;){
	    if (textComponents[i].trim() === "") textComponents.splice(i, 1);
    }
    
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

Matches.prototype.AddMatch = function(vidx, hidx, matchText){
   
    var matchNode = this.nodestore.generations[vidx][hidx];
    
    //matchNode.level = 5;
    
    matchNode = JSON.parse(JSON.stringify(matchNode));
    matchNode.Index = 0;
    matchNode.LayerId =5;
    matchNode.Match = matchText; // NOT SAVED BACK TO FILE!!!!
    //var originalNote = matchNode.Annotation;
    
    //var startLocation = matchNode.Annotation.IndexOf(matchText);
    
    this.nodestore.AddData(1,true,matchNode, function(e){
        console.log('match node added');
    });
    
};