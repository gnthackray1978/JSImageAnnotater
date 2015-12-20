/*global Node*/

var Matches = function (dataDll, nodestore, visualizer) {
    this.visualizer = visualizer;
    this.dataDll = dataDll;
    this.nodestore = nodestore;
 
};

Matches.prototype.SetMatches = function(text){
    var that =this;
    console.log('SetMatches: '+text);
    
    this.dataDll.BuildSearchCache(function(){
        console.log('SetMatches: loaded cache');
        
        that.IterateNotes();
        // that.dataDll.QrySearchCache(text, function(data){
        //     console.log('found: ' + data.length);
        // });
    });
    
    
};

Matches.prototype.MergeWithPreceding = function(preceding, current){
   // var preceding= 'the big brown rat ran accross the room';
   // var current= 'accross the room very quickly';
    var precedingA = preceding.split(' ');
    var currentA = current.split(' ');
    
    console.log(preceding + ' ' + current);
    
    var makeString = function(strArr,length){
        var idx =0;
        var result = '';
        while(idx < strArr.length && idx < length){
            result += ' ' + strArr[idx];
            idx++;
        }
        return result.trim();
    };

    var idx =currentA.length;

    var stringToTest = makeString(precedingA,precedingA.length);
    
    var part = '';
                                    
    while(idx >=0){
        part = makeString(currentA,idx);
        var loc= stringToTest.indexOf(part);
        if(loc != -1) break;
        idx--;
    }
                                    
    current = current.replace(part,'');
    
    return current.trim();
                      
},

Matches.prototype.IterateNotes = function(){
    var that =this;
    var vidx = 1;
    // take a node from current map
    // look through all the notes from other images
    var hidx=0;
    var originalLength = that.nodestore.generations[vidx].length;
    
    var annotationSearchTotal =0;
    
    while (hidx < originalLength) {
        if(that.nodestore.generations[vidx][hidx].Annotation 
            && that.nodestore.generations[vidx][hidx].LayerId !=5)  {
                annotationSearchTotal++;
            }
        hidx++;
    }
    
    
    hidx=0;
    
    while (hidx < originalLength) {
        //return all 
        //testable strings from the node
        //check each one in the searchcache
        if(that.nodestore.generations[vidx][hidx].Annotation && that.nodestore.generations[vidx][hidx].LayerId !=5)  
        {
            console.log('IterateNotes: find search string on: '+that.nodestore.generations[vidx][hidx].Annotation+ ' - ' + annotationSearchTotal);
            
            
            
            var searchComplete = function(vidx,hidx,matches){
                //yuck yuck what a hack need a better way of working at when this is finished.
                annotationSearchTotal--;
                console.log('search complete');
                 
                if(matches.length > 0)
                    that.AddMatch(vidx,hidx,matches, function(){
                        console.log('IterateNotes: Added Match'); 
                        if(annotationSearchTotal==0){
                            console.log('finished updating notes');  
                            that.visualizer.ClearCache();
                        } 
                        
                    });
            };
                
            // this doesnt always bring anything back remember
            // thats why this isnt working!
            that.FindSearchStrings(4,that.nodestore.generations[vidx][hidx].Annotation, function(result){
                    var testCaseIdx =0;
                    var matches = [];
                    var retCount=0;
                    
                    
                    if(result.length ==0) searchComplete(vidx,hidx,matches);; 
                    
                    while(testCaseIdx < result.length){
                        // test each of the search strings
                        that.dataDll.QrySearchCache(result[testCaseIdx], function(matchedNodesArray){
                            
                            retCount++;
                            // this should return all matches 
                            if(matchedNodesArray.length >0){
                                var midx =0;
                                while(midx < matchedNodesArray.length){
                                    // was any of the current match present in the previous match?
                                    // if so delete the overlap
                                    // a potential problem could be if things were processed in the wrong order
                                    
                                    var newVal = result[testCaseIdx];
                                    
                                    if(matches.length >0){
                                        
                                        newVal = that.MergeWithPreceding(matches[matches.length-1], newVal);
                                    }
                                     
                                    matches.push(newVal);
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

Matches.prototype.AddMatch = function(vidx, hidx, matchText,callback){
   
    var that = this;
    var nodeFactory = new Node(this.nodestore.generations);
 
    var matchNode = nodeFactory.CloneNode(this.nodestore.generations[vidx][hidx]);
  
    matchNode.LayerId =5;
    matchNode.Match = matchText; // NOT SAVED BACK TO FILE!!!!
  
    this.nodestore.AddData(1,true,matchNode, function(e){
        console.log('AddData: match node added');
        callback();
    });
    
};