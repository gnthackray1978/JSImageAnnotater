 /*global 
 CanvasTools postal  Meta MyDrive
 AnnotaterView MetaController Options
 OptionsController NodeManager
 Visualizer
 Matches MatchesController
 NodeManagerController
 VisualizerController
 Crop CroppingController
 GDLoader
 Layer LayerController
 Selection SelectionController
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

    if(postal)
        channel = postal.channel();


    var driveLib = new MyDrive(channel);

    if(drive) {
        data = new GDLoader(channel,driveLib);
    }
    else {
        data = new MongoNoteData();
    }

    var appView = new AnnotaterView(channel);
    var optionsView = new OptionsView(appView,channel);
    var selectionView = new SelectionView(appView,channel);
    var layerView = new LayerView(appView,channel);
    var cropperView = new CropperView(appView,channel);
    var debugView = new DebugView(appView,channel);
    
    
    data.init(function(){
        
        driveLib.SetToken(
            data.FILENAME,
            data.IMAGEURL,
            data.FILEID,
            data.IMAGEWIDTH,
            data.IMAGEHEIGHT,
            data.CONFIGFILEID,
            data.CONFIGFOLDERID,
            data.CONFIGFILENAME,
            data.options,
            data.layers,
            data.generations
        );
        
        var metadata = new Meta(driveLib,appView);
        var metaController = new MetaController(appView,metadata);
        
        var nodeManager = new NodeManager(driveLib);

        var visualizer = new Visualizer(driveLib, nodeManager,  new CanvasTools());
        
        var matches = new Matches(driveLib,nodeManager);
        var matchesController = new MatchesController(appView,matches,visualizer);
        
        
        var nodeController = new NodeManagerController(appView, nodeManager, metadata,options,channel);
        
        var visualizerController =  new VisualizerController(appView, visualizer, channel);
        
        var options = new Options(driveLib,nodeManager,channel);
        
        //var optionsController = new OptionsController(appView,options);

        var cropper = new Crop(nodeManager,driveLib);
        var crapperController = new CroppingController(channel, cropper);

        var urls= new Urls(new UrlWriter(),appView,visualizer.setImageObject);
        var urlController = new UrlController(appView,urls,nodeManager.Type());
        
        
        var layer = new Layer(driveLib,channel, visualizer);
        var layerController = new LayerController(channel,layer);

        var selector = new Selection(nodeManager,options);
        var selectorController = new SelectionController(channel,selector,nodeManager);

        var nodePositioning = new NodePositioning(nodeManager,channel);
        var nodePositioningController = new NodePositioningController(nodeManager,channel, appView,nodePositioning);
        
        
        
        var debug = new Debuger(channel, driveLib,nodeManager,visualizer,nodePositioningController);
   
        
        appView.InitPanelVisibility();
      

        visualizerController.startFromDrive();

    });
}