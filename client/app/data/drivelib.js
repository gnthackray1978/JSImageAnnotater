/*global gapi*/

var MyDrive = function (channel) {

    this.IMAGEURL = '';
    this.IMAGEWIDTH = 0;
    this.IMAGEHEIGHT =0;
    this.CONFIGFILEID = null;
    this.CONFIGFOLDERID =-1;
    this.CONFIGFILENAME = 'info.config';
    this.FILENAME = '';
    this.FILEID = null;
  
    this.generations =null;
    this.options =null;
    this.layers =null;
    
    this.searchCache = [];
    this._channel = channel;
};

MyDrive.prototype.SetToken = function(FILENAME,IMAGEURL,FILEID,IMAGEWIDTH,IMAGEHEIGHT,
                                    CONFIGFILEID,CONFIGFOLDERID,CONFIGFILENAME,options,layers,generations){
    this.FILENAME = FILENAME;
    this.IMAGEURL = IMAGEURL;
    this.FILEID = FILEID;
    this.IMAGEWIDTH = IMAGEWIDTH;
    this.IMAGEHEIGHT = IMAGEHEIGHT;
    this.CONFIGFILEID = CONFIGFILEID;
    this.CONFIGFOLDERID = CONFIGFOLDERID;
    this.CONFIGFILENAME = CONFIGFILENAME;
    
    this.options = options;
    this.layers = layers;
    this.generations = generations;
};

MyDrive.prototype.ReadConfigFile = function(configId, callback){
    var that = this;        
    var request = gapi.client.drive.files.get({
      'fileId': configId
    });
    
    request.execute(function(resp) {
      if (resp.id) {
        var token = gapi.auth.getToken();
        
        $.ajax(resp.downloadUrl, {
          headers: {Authorization: 'Bearer ' + token.access_token},
          success: function(data) {
            var d = JSON.parse(data);
            callback(d);
          }
        });
      }
    });
};


MyDrive.prototype.QrySearchCache = function(text, callback){
    var nidx =0;
    var result = [];
    
    while(nidx < this.searchCache.length){
        if(((typeof this.searchCache[nidx].Annotation) == "string") 
            && this.searchCache[nidx].Annotation.indexOf(text) > -1){
                result.push(this.searchCache[nidx]);
        }
        nidx++;   
    }
    
    callback(result);
    
};

MyDrive.prototype.BuildSearchCache = function(callback){
    var that = this;
    this.searchCache =[];
    var fileCount =0;
    
    var searchForId = function(fileList){
        var idx =0;
          
        while(idx < fileList.length){
           
            var title = fileList[idx].title;
            if(that.CONFIGFILEID != fileList[idx].id){
            
                console.log('reading file: ' + fileList[idx].id);
                that.ReadConfigFile(fileList[idx].id,function(d){
                    var nidx =0;
                    
                    while(nidx < d.generations.length){
                        d.generations[nidx].title = title;
                
                        that.searchCache.push(d.generations[nidx]);
                        nidx++;    
                    }
                    
                    fileCount++;
                    
                    // //erm hopefully this should everything has got populated 
                    if((fileList.length -1) == fileCount){
                        callback();
                    }
                });
            }
            idx++;
        }    
    };
    
    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
           
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } 
            else {
                searchForId(result);
            }
        });
    };
    
    var pstr= '\'' + this.CONFIGFOLDERID+ '\'' + ' in parents';
  
    var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
    
    retrievePageOfFiles(initialRequest, []);
  
};



MyDrive.prototype._saveFile = function(parentId, fileName, fileId, content,callback){
    
    console.log('attempting to savefile: ' + parentId + ' filename ' + fileName + ' file id ' + fileId);
 
    var metadata = {
      title: fileName,
      mimeType: 'application/json',
      parents: [{id: parentId}]
    };
    
    var state = content;
    var data = new FormData();
    data.append("metadata", new Blob([ JSON.stringify(metadata) ], { type: "application/json" }));
    data.append("file", new Blob([ JSON.stringify(state) ], { type: "application/json" }));

    var token = gapi.auth.getToken();
    
    if(token == null || token == undefined || token.access_token == null){
        console.log('TOKEN UNAVAILABLE file not written');
        
        if(callback)
            callback();
    }
    else
    {
        var up = fileId != null ? '/' + fileId : '';
        
        $.ajax("https://www.googleapis.com/upload/drive/v2/files" + up + "?uploadType=multipart", {
          data: data,
          headers: {Authorization: 'Bearer ' + token.access_token},
          contentType: false,
          processData: false,
          type: fileId != null ? 'PUT' : 'POST',
          success: function(data) {           
              console.log('File written');
              if(callback)
                callback(data.id);
          }
        });
    }   
};

MyDrive.prototype.GetNoteData = function(urlId, callback){
   
    
    callback(this.generations);
};
    
MyDrive.prototype.GetAccessToken = function(){
    return gapi.auth.getToken().access_token;
};

MyDrive.prototype.WriteNoteData = function(data,callback){
    // add note into array
    // then update file contents to reflect that
    
    var idx =0;
    
    while(idx < this.generations.length){
        if(this.generations[idx].Index == data.Index){
            this.generations[idx] = data;
            idx=-1;
            break;        
        }
        idx++;
    }
    
    if(idx!=-1)
        this.generations.push(data);
    
    
    var c = {
        urlId : this.FILEID,
        generations: this.generations,
        options : this.options,
        layers : this.layers 
        
    };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        callback(data);
    });
};

MyDrive.prototype.WriteNotesData = function(datas,callback){
    // add note into array
    // then update file contents to reflect that
    
    
    var didx = 0;
    
    while(didx < datas.length){
    
        var idx =0;
        while(idx < this.generations.length){
            if(this.generations[idx].Index == datas[didx].Index){
                this.generations[idx] = datas[didx];
                idx=-1;
                break;        
            }
            idx++;
        }
        
        if(idx!=-1)
            this.generations.push(datas[didx]);
        
        didx++;
    } 
    
    var c = {
        urlId : this.FILEID,
        generations: this.generations,
        options : this.options,
        layers : this.layers 
        
    };
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        callback(true);
    });
};




MyDrive.prototype.GetOptions= function (callback){
    
    callback(this.options);
};

MyDrive.prototype.PopulatedDummyLaterData = function () {
    this.layers =  [
            {id:1 , order:1 , name : 'image', visible: true, current: false},
            {id:2 , order:2 , name : 'notes', visible: true, current: true},
            {id:3 , order:3 , name : 'metadata', visible: true, current: false},
            {id:4 , order:4 , name : 'cropdata', visible: true, current: false},
            {id:5 , order:5 , name : 'matches', visible: true, current: false}
        ];
};

MyDrive.prototype.GetLayers = function (callback) {
    
    if(this.layers == 1 || this.layers == undefined){
        this.PopulatedDummyLaterData();
    }
    
    callback(this.layers);
};

MyDrive.prototype.GetActiveLayer = function (callback) {
    
    if(this.layers == undefined){
        this.PopulatedDummyLaterData();
    }
    
    var idx =0;
    var layerId=0;
    
    while(idx < this.layers.length){
        
        if(this.layers[idx].current){
            layerId = this.layers[idx].id;
        }
        idx++;
    }
    
    callback(layerId);
};

MyDrive.prototype.GetVisibleLayer = function (callback) {
    
    if(this.layers == undefined){
        this.PopulatedDummyLaterData();
    }
    var idx =0;
    var layerIds = [];
    while(idx < this.layers.length){
        
        if(this.layers[idx].visible){
            layerIds.push(this.layers[idx].id);
        }
        idx++;
    }
    
    callback(layerIds);
};

MyDrive.prototype.GetMetaData=function(callback){
    var metaData =  [
            {id:1 , dts :'6', name : 'image tag'},
            {id:2 , dts :'1,2,3', name : 'witness'},
            {id:3 , dts :'1,2,3', name : 'father'},
            {id:4 , dts :'1,2,3', name : 'mother'},
            {id:5 , dts :'1,2,3', name : 'son'},
            {id:6 , dts :'1,2,3', name : 'daughter'},
            {id:7 , dts :'1,2,3', name : 'cousin'},
            {id:8 , dts :'1,2,3', name : 'undescribed person'},
            {id:9 , dts :'6', name : 'source'},
            {id:10 , dts :'6', name : 'testator'}
        ];
        
    callback(metaData);
};
    
MyDrive.prototype.GetMetaDataTypes=function(types, callback){
    var dataTypes =  [
        {id:1 , name : 'name name surname', short : 'nns'},
        {id:2 , name : 'name surname', short : 'ns'},
        {id:3 , name : 'surname', short : 's'},
        {id:4 , name : 'place', short : 'p'},
        {id:5 , name : 'year', short : 'y'},
        {id:6 , name : 'general', short : 'g'} 
    ];
    
    var contains = function(array, id){
        
        var cdx=0;
        
        if(array.length){
            while(array.length > cdx){
                if(array[cdx] == id){
                    return true;
                }
                cdx++;
            }
        }
        else
        {
            if(array && id == array){
                return true;
            }
            else
            {
                return false;
            }
        }
        
        return false;
    };
    
    if(types){
        var tp = [];
        var idx =0;
        
        while(dataTypes.length > idx){
             
            if(contains(types, dataTypes[idx].id))
                tp.push(dataTypes[idx]);
            idx++;
        }
        
         callback(tp);
    }
    else
    {
        callback(dataTypes);
    }
    
   
};
    
    

MyDrive.prototype.SaveLayers= function (layers, cacheOnly){
    this.layers = layers;
    // when using drive only want to write to disk
    // when save button is pressed
    // however we do want to update the cached layer variable
    // because then we get real time changes when its accessed by 
    // the image model
    
    if(cacheOnly) return;
     
    var c = {
        urlId : this.FILEID,
        generations: this.generations,
        options : this.options,
        layers : this.layers 
    };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        
    });
    
};


MyDrive.prototype.SaveOptions= function (options, callback){
    this.options[0] = options;
    
     var c = {
            urlId : this.FILEID,
            generations: this.generations,
            options : this.options,
            layers : this.layers 
        };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        callback();
    });
};

MyDrive.prototype.GetImageData= function(callback){
        
        //dummy values not intended to be used
        var imageData = {
            title:this.FILENAME,
            url: this.IMAGEURL,
            urlId :this.FILEID,
            width :this.IMAGEWIDTH,
            height:this.IMAGEHEIGHT
        };
        
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', this.IMAGEURL);
        xhr2.responseType = "blob";
        
        xhr2.setRequestHeader('Authorization', 'Bearer ' + this.GetAccessToken());
        
        xhr2.onload = function () {
            
            imageData.url = window.URL.createObjectURL(xhr2.response);
         
            callback(imageData);
        };
        
        xhr2.send();

    };

MyDrive.prototype.Type = function(){
    return 'GDRIVE';
};

MyDrive.prototype.GetCroppingNode = function (callback) {
    var idx =0;
    while(idx < this.generations.length){
        if(this.generations[idx].CropArea){
            callback(this.generations[idx]);
            return;
        }
        idx++;
    }
    callback();
};

MyDrive.prototype.CleanGenerations = function () {
    
    //always layer 4 and only ever 1
    //generations
   
    
    var idx =0;
    var layerId=4;
    
    var cleanArray = [];
    
    while(idx < this.generations.length){
        //111111111
        if(this.generations[idx].LayerId !=4
        && this.generations[idx].LayerId !=-4
        && this.generations[idx].Annotation != ''
   
        ){
            cleanArray.push(this.generations[idx]);
        }
        
        idx++;
    }
    
    this.generations = cleanArray;
    
    var c = {
        urlId : this.FILEID,
        generations: this.generations,
        options : this.options,
        layers : this.layers 
    };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        
    });
 
};

MyDrive.prototype.ClearDeleted = function (callback) {
    
    //always layer 4 and only ever 1
    //generations
   
    
    var idx =0;
    
    var cleanArray = [];
    
    var customDelete = '';
    
    while(idx < this.generations.length){
         
        if(this.generations[idx].Visible 
        && this.generations[idx].LayerId != 5 
        && this.generations[idx].Annotation != customDelete){
            cleanArray.push(this.generations[idx]);
        }
        
        idx++;
    }
    
    this.generations = cleanArray;
    
    var c = {
        urlId : this.FILEID,
        generations: this.generations,
        options : this.options,
        layers : this.layers 
    };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        callback();
    });
 
};
 
 