 /*global CanvasTools*/

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
    var data;

    if(drive) {
        data = new MyDrive();
    }
    else {
        data = new MongoNoteData();
    }
    var appView = new AnnotaterView();
    
    
    
    
    data.init(function(){
        var debug = new Debuger(data,appView);
        var debugController = new DebugController(appView,debug);
        
        var metadata = new Meta(data,appView);
        var metaController = new MetaController(appView,metadata);

        var options = new Options(data,appView);
        var optionsController = new OptionsController(appView,options);


        
        
        
        var nodeManager = new NodeManager(data,metadata,options);
        var visualizer = new Visualizer(noteDataManager,  new CanvasTools(), options);
        
        var nodeController = new NodeManagerController(appView, nodeManager);
        var visualizerController =  new VisualizerController(appView, visualizer);


        var cropper = new Crop(nodeManager);
        var crapperController = new CroppingController(appView,cropper);

        var urls= new Urls(new UrlWriter(),appView,visualizer.setImageObject);
        var urlController = new UrlController(appView,urls,nodeManager.Type());
        
        var layer = new Layer(data,appView, visualizer);
        var layerController = new LayerController(appView,layer);

        

    });
}