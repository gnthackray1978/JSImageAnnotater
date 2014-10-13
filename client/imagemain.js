


$(document).ready(function () {


    var diagramRunner =  new DiagramRunner(new FakeData(), new ImageViewer());

    var fileLoaded = function (data) {
        var selectorImager = this; // this is selectorwidget context
      
        selectorImager.RunDiagClicked(0, function (id) {
            diagramRunner.run('');
            selectorImager.hideLoader();
        });
    };

    var selectorImager = new SelectorImager(diagramRunner);

    diagramRunner.SetNodeSelectionUI(selectorImager.DisplayNodeSelection);
    diagramRunner.SetAddButtonUpdate(selectorImager.DisplayUpdateNoteAdd);
    diagramRunner.SetSaveButtonUpdate(selectorImager.DisplayUpdateSave);
    diagramRunner.SetDeleteButtonUpdate(selectorImager.DisplayUpdateDelete);
    diagramRunner.SetClearTextArea(selectorImager.ClearActiveTextArea);


    selectorImager.InitPanelVisibility();

    selectorImager.newFileLoaded($.proxy(fileLoaded, selectorImager));

    selectorImager.CanvasClick($.proxy(diagramRunner.canvasClick, diagramRunner));
 
    selectorImager.CanvasMouseUp($.proxy(diagramRunner.canvasMouseUp, diagramRunner));
 
    selectorImager.CanvasMouseDown($.proxy(diagramRunner.canvasMouseDown, diagramRunner));
    
    selectorImager.CanvasMouseMove($.proxy(diagramRunner.canvasMouseMove, diagramRunner));
    
    selectorImager.ButtonPressDown($.proxy(diagramRunner.boxButtonDown, diagramRunner));
    
    selectorImager.ButtonPressUp($.proxy(diagramRunner.boxButtonUp, diagramRunner));
    
    selectorImager.Add($.proxy(diagramRunner.addButtonClicked, diagramRunner));
    
    selectorImager.Cancel($.proxy(diagramRunner.cancelButtonClicked, diagramRunner));
    
    
});


 