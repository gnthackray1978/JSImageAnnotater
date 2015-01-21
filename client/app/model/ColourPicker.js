var ColourPicker = function (view) {
    //this.updateComponentList = 1;
    this._view = view;
    this._enabled =false;
};


ColourPicker.prototype = {

    init: function (clickResult) {
            
            var that = this;
            
            // http://www.javascripter.net/faq/rgbtohex.htm
            function rgbToHex(R,G,B) {
                
                return toHex(R)+toHex(G)+toHex(B)
                
            }
            
            function toHex(n) {
                n = parseInt(n,10);
                if (isNaN(n)) return "00";
                n = Math.max(0,Math.min(n,255));
                return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
            }
            
            
            $('#myCanvas').click(function(event){
                // getting user coordinates
                if(that._pickEnabled)
                {
                    var canvas = document.getElementById('myCanvas').getContext('2d');
                    
                    var x = event.pageX - this.offsetLeft;
                    var y = event.pageY - this.offsetTop;
                    
                    // getting image data and RGB values
                    var img_data = canvas.getImageData(x, y, 1, 1).data;
                  
                    var R = img_data[0];
                    var G = img_data[1];
                    var B = img_data[2];  
                    var rgb = R + ',' + G + ',' + B;
                    
                    // convert RGB to HEX
                    var hex = rgbToHex(R,G,B);
                    // making the color the value of the input
                   
                    $("#txtChosenColour").val("#"+hex);
                    $("#txtChosenColour").css("background-color", "#"+hex);
                   
                    if(clickResult)
                        clickResult(rgb,hex);
                    
                    that._enabled = false;                        
                }
            });
            
            
            $('#btnPickColour').click(function (e) {
                that._pickEnabled =true;
            }); 
        
        
    },
    
    CreateComponentList:function(){
        
        var component = [];
        
        component.push({id: 1, name: 'Background'});
        component.push({id: 2, name: 'Editor Font'});
        component.push({id: 3, name: 'Editor Border'});
        component.push({id: 4, name: 'Note Font'});
        
       // this.updateComponentList(component);
        this._view.UpdateColourPickerComponents(component);
    }
    
}