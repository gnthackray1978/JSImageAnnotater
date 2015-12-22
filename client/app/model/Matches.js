/*global Node*/

/*
purpose :
creates list of annotations for other images in the parent folder.
compares list with annotations in current document. 
comparison criteria is that 4 words in a sentence must match.
adds matches into the generations array as layer 5 nodes.

TODO
move ui stuff into controller
create some kind of tests
create proper ui for this, or make run when note is added

*/

var Matches = function (dataDll, nodestore) {
   
    this.dataDll = dataDll;
    this.nodestore = nodestore;
 
};

Matches.prototype.SetMatches = function(callback){
    var that =this;
    console.log('SetMatches');
    
    var matchingDataReturned = function(matchingData){
        that.AddMatchNodes(matchingData,function(){
            callback();
        });
    };
    
    this.dataDll.BuildSearchCache(function(){
        console.log('SetMatches: loaded cache');
        that.IterateNotes(matchingDataReturned);
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

Matches.prototype.IterateNotes = function(callback){
    var that =this;
    var vidx = 1;
    var matchingData = [];
    
    
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
            console.log('IterateNotes: find search string on: '+that.nodestore.generations[vidx][hidx].Annotation+ ' total ' + annotationSearchTotal);
            
            
            
            var searchComplete = function(node,matches){
                //yuck yuck what a hack need a better way of working at when this is finished.
                annotationSearchTotal--;
                console.log('IterateNotes: search complete: ' + node.annotation + ' matches ' + matches.length + ' total ' + annotationSearchTotal);
                 
                if(matches.length > 0)
                    
                    matchingData.push({
                        node : node,
                        data : matches
                    });
                
                    if(annotationSearchTotal==0){
                        console.log('IterateNotes: finished updating notes');  
                        callback(matchingData);
                    } 

            };
                
            // this doesnt always bring anything back remember
            // thats why this isnt working!
            that.FindSearchStrings(4,that.nodestore.generations[vidx][hidx].Annotation, function(result){
                    var testCaseIdx =0;
                    var matches = [];
                    var retCount=0;
                    
                    
                    if(result.length ==0) searchComplete(that.nodestore.generations[vidx][hidx],matches); 
                    
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
                                searchComplete(that.nodestore.generations[vidx][hidx],matches);
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

Matches.prototype.AddMatchNodes = function(matchingData,callback){
   
    var that = this;
    
    var makeNodeList = function(matchingData){
        var idx =0;
        var pureNodes =[];
        while(idx < matchingData.length){
            pureNodes.push(matchingData[idx].node);
            idx++;
        }
        return pureNodes;
    };
    
    var nodeList = makeNodeList(matchingData);
    
    var nodeFactory = new Node(this.nodestore.generations);
    nodeFactory.CloneNodes(nodeList, function(newNodes){
        var idx =0;
        
        while(idx < newNodes.length){
            newNodes[idx].LayerId =5;
            newNodes[idx].Match = matchingData[idx].data; // NOT SAVED BACK TO FILE!!!!
            idx++;
        }
        
        that.nodestore.AddNodes(true,newNodes, function(e){
            console.log('AddNode: match node added');
            callback();
        });
    });
    
    
    


    
};