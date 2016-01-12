var Debuger = function (dataDll, nodestore,view, visualizer, nodePositioning) {
    this.dataDll = dataDll;
    this.nodestore = nodestore;
    this.visualizer = visualizer;
    this._nodePositioning  = nodePositioning;
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

// Debuger.prototype.IterateNotes = function(){
//     var that =this;
    
//     //loop through all the notes
//     // that.nodestore.generations[vidx][hidx].X,
//     // that.nodestore.generations[vidx][hidx].Y,
//     // that.nodestore.generations[vidx][hidx].Width,
//     // that.nodestore.generations[vidx][hidx].Height,
//     // that.nodestore.generations[vidx][hidx].D,
//     // that.nodestore.generations[vidx][hidx].Annotation, 
//     var vidx = 1;
    
//     // take a node from current map
//     // look through all the notes from other images
//     while (vidx < that.nodestore.generations.length) {
//         var hidx=0;
//         while (hidx < that.nodestore.generations[vidx].length) {
            
//             //console.log('annotation: '+that.nodestore.generations[vidx][hidx].Annotation);
//             //return all 
//             //testable strings from the node
//             //check each one in the searchcache
//             if(that.nodestore.generations[vidx][hidx].Annotation)  
//             {
//                 that.FindSearchStrings(4,that.nodestore.generations[vidx][hidx].Annotation, function(result){
//                     var testCaseIdx =0;
//                     while(testCaseIdx < result.length){
                        
//                         that.dataDll.QrySearchCache(result[testCaseIdx], function(data){
//                              if(data.length >0)
//                                 console.log('Found matches for: ' +result[testCaseIdx] +' - '+ data.length);
//                         });
                        
//                         testCaseIdx ++;
//                     }
//                 });
//             }
            
//             hidx++;
//         }
//         vidx++;
//     }
    
// },

// Debuger.prototype.FindSearchStrings = function(charCount, text, callback){
    
    
//     var textComponents = text.split(' ');
    
//     for(var i = textComponents.length-1; i--;){
// 	    if (textComponents[i].trim() === "") textComponents.splice(i, 1);
//     }
    
//     var results = [];
    
   
//     var makeString = function(idx, results){
//         var initialOffset =idx;
        
//         if((idx + charCount) <=  textComponents.length){
            
//             var comparisonString = '';
            
//             while(idx < (charCount+initialOffset) && idx < textComponents.length){
//                 comparisonString += textComponents[idx] + ' ';
//                 idx++;
                
                
//             }
            
//             comparisonString = comparisonString.trim();
            
//             results.push(comparisonString);
//         }
//     }
    
//     makeString(0,results);
    
//     makeString(1,results);
    
    
//     callback(results);
    
// }

