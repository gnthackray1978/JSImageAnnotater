 /*global CanvasTools postal*/

function handleClientLoad() {

    loadAll(true);
}

$(document).ready(function () {
   // loadAll (false){
   //args
   //monkey
});


 
 
function loadAll (drive){
    console.log('pointess');
    var data, channel;

    if(drive) {
        data = new MyDrive();
    }
    else {
        data = new MongoNoteData();
    }
    
    if(postal)
        channel = postal.channel();
    
    
    
    var appView = new AnnotaterView(channel);
    
    
    
    
    data.init(function(){
        
        
        
        var metadata = new Meta(data,appView);
        var metaController = new MetaController(appView,metadata);

        var options = new Options(data,appView,channel);
        var optionsController = new OptionsController(appView,options);

        var nodeManager = new NodeManager(data);

        var visualizer = new Visualizer(data, nodeManager,  new CanvasTools(), options);
        
        var matches = new Matches(data,nodeManager);
        var matchesController = new MatchesController(appView,matches,visualizer);
        
        
        var nodeController = new NodeManagerController(appView, nodeManager, metadata,options,channel);
        
        var visualizerController =  new VisualizerController(appView, visualizer, channel);


        var cropper = new Crop(nodeManager,data);
        var crapperController = new CroppingController(appView,channel, cropper);

        var urls= new Urls(new UrlWriter(),appView,visualizer.setImageObject);
        var urlController = new UrlController(appView,urls,nodeManager.Type());
        
        var layer = new Layer(data,appView, visualizer);
        var layerController = new LayerController(appView,layer);

        // var rectangleSelector = new RectangleSelect(nodeManager);
        // var rectangleSelectorController = new RectangleSelectController(appView,channel,rectangleSelector);

        var debug = new Debuger(data,nodeManager, appView,visualizer);
        var debugController = new DebugController(appView,debug,visualizer);
        
        
        

    });
}