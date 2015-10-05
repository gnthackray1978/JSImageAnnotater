// that.nodestore.GetCroppingNode(function(data, initnode){
// 	        console.log('got cropping node: ' + data.Index);
// 	        that.nodestore.GetOptions(0, function(options){


(function(exports){
    
    var mockDataManager = function(){
        this.writeNote =0;
        this.getCroppingNote=0;
        this.getOptions =0;
        this.noteValidation;
    };
    
    mockDataManager.prototype.GetCroppingNode = function(func){
        
        this.getCroppingNote++;
        
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
                LayerId : -4
            };
            
            
        func(node,node);
    };


    mockDataManager.prototype.GetOptions= function(param1, func){
        
        this.getOptions++;
        
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

    mockDataManager.prototype.WriteNote = function(note,x,y,width,height,degree,annotation,options,layerId, metaData, callback){

        this.noteValidation = {
            note :false,
            x :false,
            y: false,
            width:false,
            height: false,
            degree:false,
            annotation:false
        };

        if(note == undefined) this.noteValidation.note =true;
        if(x == undefined) this.noteValidation.x =true;
        if(y == undefined) this.noteValidation.y =true;
        if(width == undefined) this.noteValidation.width =true;
        if(height == undefined) this.noteValidation.height =true;
        if(degree == undefined) this.noteValidation.degree =true;
        if(annotation == undefined) this.noteValidation.annotation =true;


        this.writeNote++;
        callback();
    
    };
    
    
    exports.MockDataManager = mockDataManager;
})(typeof exports === 'undefined'? this: exports);