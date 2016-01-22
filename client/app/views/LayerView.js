var LayerView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;
    
    this.eventsLoaded = false;
    
    this.PublishNewState();
    this.PublishSaveState();

    
    this.Init();
};

LayerView.prototype.Init= function (){
    var that = this;
    
    this._channel.subscribe("SetLayers", function(data, envelope) {
        that.SetLayers(data.value);
    });
};

LayerView.prototype.SetLayers= function (layers){
    
        
    var idx =0;
    
    var constructRow = function(id, name, visible, current,order){
        
        var html = '<div class = "row">';
        
       
        if(current)
            html +=  '<div class = "col letter"><input type="submit" data-id = "'+ id +'" data-prop = "current"  value = "S" style="color:green "></div>';
        else
            html +=  '<div class = "col letter"><input type="submit" data-id = "'+ id +'" data-prop = "current"  value = "s" style="color: red"></div>';
            
        if(visible)
            html +=  '<div class = "col letter"><input type="submit" data-id = "'+ id +'" data-prop = "visible" value = "V" style="color: green"></div>';
        else
            html +=  '<div class = "col letter"><input type="submit" data-id = "'+ id +'" data-prop = "visible"  value = "v" style="color: red"></div>';

        html +=  '<div class = "col name"><input type="text" data-id = "'+ id +'" data-prop = "name"  value = "'+ name +'"/></div>';
        html +=  '<div class = "col order"><input  type="text" data-id = "'+ id +'" data-prop = "order"  value = "'+ order +'"/></div>';
        
      
        html +=  '<div class = "col letter"><input  type="submit" data-id = "'+ id +'"  data-prop = "delete" value = "X"/></div>';
        
        html += '</div>';
        html += '<br/>';
        
        return html;
    };
    
    var content ='';
    while(idx < layers.length){
        content += constructRow(layers[idx].id, layers[idx].name, layers[idx].visible, layers[idx].current,layers[idx].order);
        idx++;
    }
    
    $('#layerslist').html(content);

    if(!this.eventsLoaded){
        this.PublishInputState();
        this.PublishLayerButtonState();
        this.eventsLoaded = true;
    }
};


LayerView.prototype.PublishNewState = function () {
    var that = this;
    
    $('#btnNewLayer').click(function (e) {
        //callback();
        that._channel.publish( "btnNewLayer", { value: e } );
    });
};

LayerView.prototype.PublishSaveState = function () {
    var that = this;
   
    $('#btnSaveLayers').click(function (e) {
        //callback();
        that._channel.publish( "btnSaveLayers", { value: e } );
    });
};

LayerView.prototype.PublishInputState = function () {
   
    var that = this;
   
    $( "#layerslist input[type='text']" ).change(function(e) {
        var d;
 
        if($(e.target).data().prop == 'name'){
            d = {
                id: $(e.target).data().id,
                value: $(e.target).val(),
                type : 'name'
            };
            //callback(d);
            that._channel.publish( "LayerInputState", { value: d } );
        }
        
        if($(e.target).data().prop == 'order'){
           
            d = {
                id: $(e.target).data().id,
                value: $(e.target).val(),
                type : 'order'
            };
            
            //callback(d);
            that._channel.publish( "LayerInputState", { value: d } );
        }
    });

   
};

LayerView.prototype.PublishLayerButtonState = function () {
    var that = this;

    $('#layerslist input').click(function (e) {
        console.log(e);
        //which button was pressed 
        //rowid
        //property being changed
        //new value
        var n,d;
 
        
        if($(e.target).data().prop == 'current'){
            if($(e.target).val() =='S')
                n= false;
            else
                n =true;
                
            d = {
                id: $(e.target).data().id,
                value: n,
                type : 'current'
            };
            //callback(d);
            that._channel.publish( "LayerButtonState", { value: d } );
        }
        
        if($(e.target).data().prop == 'visible'){
            if($(e.target).val() =='V')
                n= false;
            else
                n =true;
        
            d = {
                id: $(e.target).data().id,
                value: n,
                type : 'visible'
            };
            
            //callback(d);
            that._channel.publish( "LayerButtonState", { value: d } );
        }
        
        if($(e.target).data().prop == 'delete'){
            d = {
                id: $(e.target).data().id,
                value: '',
                type : 'delete'
            };
            
            //callback(d);
            that._channel.publish( "LayerButtonState", { value: d } );
        }
        
    }); 
};
