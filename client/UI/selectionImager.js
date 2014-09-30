/** @constructor */
function SelectorImager(gedPreLoader) {       
    this.gedPreLoader = gedPreLoader;
    this.loader = this.gedPreLoader.loader;
   

    this.showGed = true;
    this.showMapControls = true;
    this.showDebug = true;
    this.showDataControls = true;
    this.dataLoader = true;
}


SelectorImager.prototype.showGedContent = function () {
        $("#ged-content").removeClass("hidePanel").addClass("displayPanel");
    };
SelectorImager.prototype.newFileLoaded = function (treedate) {

        treedate();
    };

 
SelectorImager.prototype.SetMouseDoubleClick = function (action) {

        $('#myCanvas').dblclick(function (e) {

            action(e);

            e.preventDefault();
        });

    };   
SelectorImager.prototype.SetMouseDown = function (action) {

        $('#myCanvas').mousedown(function (e) {

            action(e);

            e.preventDefault();
        });
        
    };   
SelectorImager.prototype.SetMouseUp = function (action) {

        $('#myCanvas').mouseup(function (e) {

            action(e);

            e.preventDefault();
        });

    };    
SelectorImager.prototype.SetMouseMove = function (action) {

        $('#myCanvas').mousemove(function (e) {

            action(e);

            e.preventDefault();
        });

    };    
SelectorImager.prototype.SetButtonDown = function (action) {

        $(".button_box").mousedown(function (e) {

            action(e);

            e.preventDefault();
        });

    };
SelectorImager.prototype.SetButtonUp = function (action) {

        $(".button_box").mouseup(function (e) {

            action(e);

            e.preventDefault();
        });

    };    
SelectorImager.prototype.RunDiagClicked = function (personId, action) {
    $('#btnRunImage').click(function (e) {

            action(personId);

            e.preventDefault();
        });
    };
SelectorImager.prototype.GetDiagramType = function () {
        return $("input[name='type_sel']:checked").val();
    };
SelectorImager.prototype.InitPanelVisibility = function () {


        var that = this;
        
        var panels = new Panels();
        

        $('body').on("click", "#chooseFileLnk", $.proxy(function () { panels.masterShowTab('1'); return false; }, panels));

        $('body').on("click", "#selectPersonLnk", $.proxy(function () { panels.masterShowTab('2'); return false; }, panels));
        



        $("#minimized_options").removeClass("hidePanel").addClass("displayPanel");
      

        $('#show_controls').click(function (e) {

            if (that.showMapControls) {
              //  $("#map_control").removeClass("hidePanel").addClass("displayPanel");
                
                $("#map_control").dialog();
                
          //   $(".ui-widget-header").css("border", "none" );
                //   $(".ui-widget-header").css("background", "none");
             
                 $(".ui-widget-header").css("height", "7px");
                
                 $(".ui-dialog-title").css("position", "absolute");
                 $(".ui-dialog-title").css("top", "0px");
                 $(".ui-dialog-title").css("left", "0px");
                
                 $('*[aria-describedby="map_control"]').css("width", "120px");
                 $('*[aria-describedby="map_control"]').css("height", "100px");
                
                that.showMapControls = false;
            } else {
             //   $("#map_control").removeClass("displayPanel").addClass("hidePanel");
                $("#map_control").dialog("close");
                that.showMapControls = true;
            }
        });

        $('#show_dataLoader').click(function (e) {



            if (that.dataLoader) {

                $("#imageLoader").dialog();

                that.dataLoader = false;

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="dataLoader"]').css("width", "350px");
                $('*[aria-describedby="dataLoader"]').css("height", "600px");
                
                $("#imageLoader").css("padding", "0px");

            } else {


                $("#imageLoader").dialog("close");
                that.dataLoader = true;
            }
        });


        $('#show_debugbox').click(function (e) {

         

             if (that.showDebug) {
            
                 $("#map_message").dialog();
                 
                 that.showDebug = false;
                 
                 $(".ui-widget-header").css("height", "7px");

                 $(".ui-dialog-title").css("position", "absolute");
                 $(".ui-dialog-title").css("top", "0px");
                 $(".ui-dialog-title").css("left", "0px");

                 $('*[aria-describedby="map_message"]').css("width", "120px");
                 $('*[aria-describedby="map_message"]').css("height", "140px");

            } else {
               

                 $("#map_message").dialog("close");
              that.showDebug = true;
            }
        });

        $('#show_databox').click(function (e) {

            if (that.showDataControls) {
                $("#dataInfo").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="dataInfo"]').css("width", "250px");
             //   $('*[aria-describedby="dataInfo"]').css("height", "600px");

                $("#dataInfo").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showDataControls = false;
            } else {
              
                that.showDataControls = true;
            }
        });       
    };
SelectorImager.prototype.showPersonSelectList = function (data, ancestorFunc) {



        return 0;
    
    };

SelectorImager.prototype.Save = function (action) {

        var that = this;
        $('#saveNode').click(function (e) {

            
       
            action(that.PopulateRecordLink());
         
            e.preventDefault();
        });               
    };
    
SelectorImager.prototype.Add = function (action) {
        var that = this;
        $('#updateNode').click(function (e) {

      
            action(that.PopulateRecordLink());

            e.preventDefault();
        });
    };

SelectorImager.prototype.Delete = function (action) {
        var that = this;
        $('#deleteNode').click(function (e) {            
            action();
            e.preventDefault();
        });        
    };

SelectorImager.prototype.PopulateRecordLink = function () {


        var node = new Bio();
        
       node.PersonId = $('#hidPersonId').val();        
       node.FirstName= $('#txtCName').val();
       node.Surname= $('#txtSurname').val();
       node.BirthDate= $('#txtBirYear').val();
       node.BaptismDate= $('#txtBapDate').val();
       node.BirthLocation= $('#txtBLocation').val();
       node.DOD= $('#txtDYear').val();
       node.DeathLocation= $('#txtDLocation').val();
       node.OccupationDate= $('#txtOccupationDate').val();
       node.OccupationPlace= $('#txtOccupationPlace').val();
       node.Occupation= $('#txtOccupationDesc').val();


       return node;

    };

