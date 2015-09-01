// that.nodestore.GetCroppingNode(function(data, initnode){
// 	        console.log('got cropping node: ' + data.Index);
// 	        that.nodestore.GetOptions(0, function(options){


(function(exports){
    
    var mockDataManager = function(){
        
    };
    
    mockDataManager.prototype.GetCroppingNode = function(func){
        
        var option = {
            LayerId:0,
            UrlId:1,
            DefaultFont: "xxx",
            DefaultNoteColour:"#9B9E8F",
            DefaultEditorFontColour:"#FFFFFF",
            DefaultEditorBorderColour:"#FFFFFF",
            DefaultNoteFontColour:"#272D45",
            IsTransparent:true,
            Visible:true,
            FontSize:11
        };
        var options =[];
        
        options.push(option);
        
        var node = {
                Annotation: '',
                Index: 4,
                UrlId: "0B6CWM0vw7fVNY0g4SFpKSEVXQVk",
                Layer:0,
                X:Number(1),
                Y:Number(1),
                Width:Number(0),
                Height:Number(0),
                D:Number(0),
                Visible: true,
                Options: options,
                LayerId : 4
            };
            
            
        func(node,node);
    };


    mockDataManager.prototype.GetOptions= function(param1, func){
        
        var option = {
            LayerId:0,
            UrlId:1,
            DefaultFont: "xxx",
            DefaultNoteColour:"#9B9E8F",
            DefaultEditorFontColour:"#FFFFFF",
            DefaultEditorBorderColour:"#FFFFFF",
            DefaultNoteFontColour:"#272D45",
            IsTransparent:true,
            Visible:true,
            FontSize:11
        };
        var options =[];
        
        options.push(option);
        
        func(options);
    };


    exports.MockDataManager = mockDataManager;
})(typeof exports === 'undefined'? this: exports);