
var JSMaster, AncUtils, QryStrUtils, AncTree, Tree;




var TreeRunner = function () {
    this.ancTree = null;
    this.ancUtils = new AncUtils();
    this.treeUI = null;
    this._moustQueue = [];
    this._mouseDown = false;
    
    this.textarea = null;
};

TreeRunner.prototype = {
    run: function (id,gedPreLoader, treeModel) {
     
            var type = $("input[name='type_sel']:checked").val();


            var modelFormattingCode = (type == 'anc' || type == 'editor') ? 1 : 0;

            this.treeUI = new TreeUI(modelFormattingCode, $.proxy(function (treeUI) {

            
            
            var int;
       
            var that = this;
            this.ancTree = treeModel;
            
            this.loader = gedPreLoader;
        
            this.ancTree.selectedPersonId = id;
            this.ancTree.selectedPersonX = 0;
            this.ancTree.selectedPersonY = 0;


            var getData = function (context,personId,x,y) {
                

                switch(type) {
                    case 'anc':
                        context.ancTree = new AncTree();
                        context.ancTree.treeUI = treeUI;
                        context.loader.SetForAncLoader();
                        break;
                    case 'editor':
                        context.ancTree = new ImageViewer();
                        context.ancTree.treeUI = treeUI;
                        context.loader.SetForAncLoader();
                        break;
                    default:
                        context.ancTree = new DescTree();
                        context.ancTree.treeUI = treeUI;
                        context.loader.SetForDescLoader();
                        break;
                }
                

                 

                context.ancTree.selectedPersonY = y;
                context.ancTree.selectedPersonX = x;
                context.ancTree.selectedPersonId = personId;

                context.loader.GetGenerations(personId, $.proxy(context.processData, context));

            };


            var mouseDownOnTextarea = function (e) {
                var x = that.textarea.offsetLeft - e.clientX,
                    y = that.textarea.offsetTop - e.clientY;
                function drag(e) {
                    that.textarea.style.left = e.clientX + x + 'px';
                    that.textarea.style.top = e.clientY + y + 'px';
                }
                function stopDrag() {
                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', stopDrag);
                }

                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', stopDrag);
            };


            $(".button_box").mousedown(function (evt) {
                var _dir = '';

                if (evt.target.id == "up") _dir = 'UP';
                if (evt.target.id == "dn") _dir = 'DOWN';
                if (evt.target.id == "we") _dir = 'WEST';
                if (evt.target.id == "no") _dir = 'NORTH';
                if (evt.target.id == "es") _dir = 'EAST';
                if (evt.target.id == "so") _dir = 'SOUTH';
                if (evt.target.id == "de") _dir = 'DEBUG';

                if (that.ancTree !== null) {

                    int = setInterval(function () { that.ancTree.MoveTree(_dir); }, 100);

                 
                }

            }).mouseup(function () {
                clearInterval(int);
            });

           
            setTimeout($.proxy(this.GameLoop, this), 1000 / 50);

            var canvas = document.getElementById("myCanvas");
            var context = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;



            $("#myCanvas").mousedown(function (evt) {
                evt.preventDefault();
                if (that.ancTree !== null) {
                    evt.originalEvent.preventDefault();
                    that._mouseDown = true;
                }
            });



            $("#myCanvas").mouseup(function (evt) {
                evt.preventDefault();
                if (that.ancTree !== null) {
                    that._mouseDown = false;

                    var _point = new Array(1000000, 1000000);
                    that._moustQueue[that._moustQueue.length] = _point;

                }
            });

            $("#myCanvas").click(function (evt) {
                if (that.ancTree !== null) {
                
                    if (!that.textarea) {
                        that.textarea = document.createElement('textarea');
                        that.textarea.className = 'info';
                        that.textarea.addEventListener('mousedown', mouseDownOnTextarea);
                        document.body.appendChild(that.textarea);
                    }
                    var x = evt.clientX - canvas.offsetLeft,
                        y = evt.clientY - canvas.offsetTop;
                    that.textarea.value = "x: " + x + " y: " + y;
                    that.textarea.style.top = evt.clientY + 'px';
                    that.textarea.style.left = evt.clientX + 'px';
                    that.textarea.style.height = '3px';

                    // handle textarea load here like with perform click

                    var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
 
                    that.ancTree.PerformClick(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
                
                    that.ancTree.UpdateGenerationState();

                    if (that.ancTree.refreshData) {                    
                        getData(that, that.ancTree.selectedPersonId, that.ancTree.selectedPersonX, that.ancTree.selectedPersonY);                    
                    }
            

                    that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);
                }
            });
            $("#myCanvas").mousemove(function (evt) {
                if (that.ancTree !== null) {
                
                    var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();

                    var _point = new Array(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
                
                    that.ancTree.SetMouse(_point[0], _point[1]);
                    if (that._mouseDown) {
                        that._moustQueue.push(_point);
                    }
                }
            });

            $("#ml .message").html('<span>Downloading Descendant Tree</span>');

            getData(this, this.ancTree.selectedPersonId, 0, 0);
        
        }, this));


    },
    processData: function (data) {


       
        var _zoomLevel = 100;//this.qryStrUtils.getParameterByName('zoom', '');



        this.ancTree.SetInitialValues(Number(_zoomLevel), 30.0, 170.0, 70.0, 70.0, 100.0, 20.0, 40.0, 20.0, screen.width, screen.height);

        //    var _personId = '913501a6-1216-4764-be8c-ae11fd3a0a8b';
        //    var _zoomLevel = 100;
        //    var _xpos = 750.0;
        //    var _ypos = 100.0;

        this.ancTree.initialGenerations = JSON.parse(JSON.stringify(data.Generations));


        this.ancTree.generations = data.Generations;

        
        
        this.ancTree.UpdateGenerationState();

        this.ancTree.RelocateToSelectedPerson();
         
        this.ancTree.refreshData = false;
    },

    CleanUp: function () {

        $("#myCanvas").unbind();
        $(".button_box").unbind();

        this.ancTree.generations = null;
      //  this.ancTree.familiesPerGeneration = null;
        this.ancTree.familySpanLines = null;
        this.ancTree.childlessMarriages = null;
    },

    GameLoop: function () {

        while (this._moustQueue.length > 0) {
            var _point = this._moustQueue.shift();


            this.ancTree.SetCentrePoint(_point[0], _point[1]);
            this.ancTree.DrawTree();
        }

        setTimeout($.proxy(this.GameLoop, this));
    }

};












