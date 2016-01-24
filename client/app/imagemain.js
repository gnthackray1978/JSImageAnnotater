 /*global 
 CanvasTools postal  Meta MyDrive
 AnnotaterView MetaController Options
 OptionsController NodeManager
 Visualizer
 Matches MatchesController
 NodeManagerController
 VisualizerController
 Crop CroppingController
 
 
 */

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
    var optionsView = new OptionsView(appView,channel);
    var selectionView = new SelectionView(appView,channel);
    var layerView = new LayerView(appView,channel);
    var cropperView = new CropperView(appView,channel);
    var debugView = new DebugView(appView,channel);
    
    
    data.init(function(){
        
        
        
        var metadata = new Meta(data,appView);
        var metaController = new MetaController(appView,metadata);
        
        var nodeManager = new NodeManager(data);

        var visualizer = new Visualizer(data, nodeManager,  new CanvasTools());
        
        var matches = new Matches(data,nodeManager);
        var matchesController = new MatchesController(appView,matches,visualizer);
        
        
        var nodeController = new NodeManagerController(appView, nodeManager, metadata,options,channel);
        
        var visualizerController =  new VisualizerController(appView, visualizer, channel);
        
        var options = new Options(data,nodeManager,channel);
        
        //var optionsController = new OptionsController(appView,options);

        var cropper = new Crop(nodeManager,data);
        var crapperController = new CroppingController(channel, cropper);

        var urls= new Urls(new UrlWriter(),appView,visualizer.setImageObject);
        var urlController = new UrlController(appView,urls,nodeManager.Type());
        
        
        var layer = new Layer(data,channel, visualizer);
        var layerController = new LayerController(channel,layer);

        var selector = new Selection(nodeManager,options);
        var selectorController = new SelectionController(channel,selector,nodeManager);

        var nodePositioning = new NodePositioning(nodeManager,channel);
        var nodePositioningController = new NodePositioningController(nodeManager,channel, appView,nodePositioning);
        
        var debug = new Debuger(data,nodeManager, appView,visualizer,nodePositioningController);
        var debugController = new DebugController(appView,debug,visualizer);
        
        
        appView.InitPanelVisibility();
        //layerView.Init();

        visualizerController.startFromDrive();

    });
}