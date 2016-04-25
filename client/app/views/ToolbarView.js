
/*CRUD related
  add edit delete nodes
*/

/** @constructor */
function ToolbarView(channel) {       
   

    this._channel = channel;

    this.showGed = true;
    this.showMapControls = true;
    this.showDebug = true;
    this.showDataControls = true;
    this.showImageUI = true;
    this.showLayers = true;
    this.showmeta = true;
    this.showoptions = true;
    this.showCropper = true;
    this.showEdges =true;
    this.showMatches = true;
    this.showTextCreator =true;
    this.showToolBar =true;

} 



ToolbarView.prototype.InitPanelVisibility = function () {


    var that = this;

    $("#minimized_options").removeClass("hidePanel").addClass("displayPanel");
      
    var createDialog = function(buttonId,dialogUI, displaySwitch, className, closeButton){
            
            $(buttonId).click(function (e) {
                if (displaySwitch) {
              
                    $(dialogUI).dialog();
                    $(dialogUI).closest('.ui-dialog').addClass(className);
                    
                    displaySwitch = false;
                } else {
              
                    $(dialogUI).dialog("close");
                    displaySwitch = true;
                }
            });
            
            $(buttonId).live("dialogclose", function(){
                displaySwitch = true;
            });
            
            if(closeButton){
                $(closeButton).click(function (e) {
                    $(dialogUI).dialog("close");
                        displaySwitch = true;
                });
            }
        };
        
    createDialog('#show_controls',"#map_control",that.showMapControls,'controldialog');

    createDialog('#show_debugbox',"#map_message",that.showDebug,'debugdialog');

    createDialog('#show_imageUI',"#map_imageUI",that.showImageUI,'uidialog');
    
    createDialog('#show_layers',"#map_layers",that.showLayers,'layersdialog');

    createDialog('#show_meta',"#map_metadata",that.showmeta,'metadialog','#btnCancelMetaInfo');

    createDialog('#show_options',"#map_options",that.showoptions,'optionsdialog','#btnCancelOptions');

    createDialog('#show_cropper',"#map_crop",that.showCropper,'cropdialog','#btnCancelCropper');

    createDialog('#show_edges',"#map_edge_add",that.showEdges,'edgesdialog','#btnCancelEdge');

    createDialog('#show_matcher',"#map_matches",that.showMatches,'matchesdialog','#btnCancelMatches');

    createDialog('#show_textCreator',"#map_textFiles",that.showTextCreator,'textdialog','#btnCancelTextFile');

    createDialog('#show_tools',"#map_toolbar",that.showToolBar,'toolbardialog','#btnCancelToolBar');

};

ToolbarView.prototype.hideLoader = function (action) {

    $("#imageLoader").dialog("close");         
};


//DEBUG STUFF
 
ToolbarView.prototype._shout = function(method, message){
    this._channel.publish( "DebugMessage", {name : 'SLC' , description : method + '.'+ message } );
};