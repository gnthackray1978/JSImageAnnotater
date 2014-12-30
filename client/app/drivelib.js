var MyDrive = function () {

    this.CLIENT_ID = '67881158341-i31rcec2rf6bi26elnf8njnrb7v9ij8q.apps.googleusercontent.com';
    this.SCOPES = 'https://www.googleapis.com/auth/drive';
    this.data = null;
    
    
    this.IMAGEURL = '';
    this.CONFIGFILEID = null;
    this.CONFIGFILEFOLDER = '.meta';
    this.CONFIGFILEEXT = '.info';
    this.CONFIGFOLDERID =-1;
    this.CONFIGFILENAME = 'info.config';
    this.FILENAME = '';
    
    this.PARENTFOLDERID=0;
    this.FILEID = null;
    
    this.authResult = null;
    
    this.generations =null;
    this.options =null;
};


MyDrive.prototype.init = function(loaded){
    // by the time all this is finished 
    
    // we should end up with the file id of the config file
    // we should authenticated - or tell users we're not
    // image url should also be set
    
    var qryString = window.location.search.replace('?','');

     qryString = decodeURI(qryString).replace('state=','');

     console.log(qryString);    

     data = JSON.parse(qryString);

     console.log(data);

    
     var that = this;
     
     writeStatement(qryString);
     
     var loadFileInfo = function(fileId, callback) {
         
          that.FILEID = fileId;
          
          var request = gapi.client.drive.files.get({
            'fileId': fileId
          });
            
          request.execute(function(resp) {
        
                writeStatement(resp.title);
                writeStatement(resp.description);
                writeStatement(resp.mimeType);
                writeStatement(resp.downloadUrl);
                writeStatement(resp.parents[0].id);
           
                writeStatement(resp.webContentLink);
                
                that.CONFIGFILENAME = resp.title;
                that.FILENAME = resp.title;
                that.IMAGEURL = resp.webContentLink;
                 
                callback(resp);
          });
    };

    var getConfigFileId = function(folderId, name, ocallback) {
        
       var searchForId = function(fileList){
            writeStatement('retrieved list of files');
            var idx =0;
            
            // if(fileList[idx].title == that.CONFIGFILEFOLDER){
            //     writeStatement('folder id: '+ fileList[idx].id);
            // }
                
            while(idx < fileList.length){
                writeStatement(fileList[idx].title);
                
                if(fileList[idx].title == name){
                    //FILEID=resp[idx].id;
                    ocallback(fileList[idx].id);
                    writeStatement('found id: '+ fileList[idx].id);
                    return;
                }
                
                idx++;
            }    
            
            ocallback(-1);
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
        
        var pstr= '\'' + folderId+ '\'' + ' in parents';
        
        writeStatement('searching for: '+ pstr);   
        
        var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
        retrievePageOfFiles(initialRequest, []);
    };

    var createConfigFile = function(parentId, fileName, fileId, content,callback){
        
        
        that._saveFile(parentId, fileName, fileId, content,callback);
    };

    var readConfigFile = function(callback){
        
        var request = gapi.client.drive.files.get({
          'fileId': that.CONFIGFILEID
        });
        
        request.execute(function(resp) {
          if (resp.id) {
            var token = gapi.auth.getToken();
            
            $.ajax(resp.downloadUrl, {
              headers: {Authorization: 'Bearer ' + token.access_token},
              success: function(data) {
                
                var d = JSON.parse(data);
                that.generations = d.generations;
                that.options = d.options;
                
                callback();
              }
            });
          }
        });
        
        
    }; 
     
    var createDummyFile = function(){
        var addNode = function(id,fileId,note,x,y,w,h) {
            var node = {
                    Annotation: note,
                    Index: id,
                    UrlId: fileId,
                    Layer:0,
                    X:Number(x),
                    Y:Number(y),
                    Width:Number(w),
                    Height:Number(h),
                    D:Number(0),
                    Visible: true
                };
                
                return node;
        };
        
        var tgs =[];
       
       // tgs[0] =[];
        
       // tgs[0].push(addNode(1,1,'test'));
        
        //tgs[1] =[];
        
        tgs.push(addNode(1,1,'some test string',100,100,200,65));
        tgs.push(addNode(2,1,'another value',150,200,200,65));
        tgs.push(addNode(3,1,'hello monkey',200,400,200,65));
        
        var o = {
            LayerId: 0,
            UrlId: 1,
            DefaultFont: "\'Times New Roman\'\, Times\, serif" ,
            DefaultNoteColour: '#9B9E8F' ,
            DefaultEditorFontColour: '#FFFFFF' ,
            DefaultEditorBorderColour: '#FFFFFF' ,
            DefaultNoteFontColour: '#272D45' ,
            IsTransparent: true,
            Visible: true
        };
        
        var oarray = [];
        
        oarray.push(o);
        
        var c = {
            urlId : 1,
            generations: tgs,
            options : oarray
        };
        
        return c;
    }; 

    var fileLoadResponse = function(resp){
         var stripped =  resp.title.substr(0, resp.title.lastIndexOf('.')) || resp.title;
         that.CONFIGFILENAME = stripped + that.CONFIGFILEEXT;
         //find config folder
         getConfigFileId(resp.parents[0].id,that.CONFIGFILEFOLDER,function(folderId){
           
            var getConfigFolderContents = function(id){
                that.CONFIGFOLDERID =id;
                var readCreateConfigFile = function(configId){
                    
                    //SET CONFIG ID IF WE HAVE IT
                    that.CONFIGFILEID =configId;
                    that.PARENTFOLDERID=resp.parents[0].id;
                        
                    if(configId == -1){
                    
                        var c = createDummyFile();
                        
                        createConfigFile(id, that.CONFIGFILENAME,null,JSON.stringify(c), function(creaetedfileId){
                        
                            that.CONFIGFILEID =creaetedfileId;
                        
                            readConfigFile(function(){
                                loaded();  
                            });
                        });
                        
                    }
                    else {
                        readConfigFile(function(){
                            loaded();  
                        });
                    }
                };
             
                getConfigFileId(id,that.CONFIGFILENAME,readCreateConfigFile);
         
            };
            
            if(folderId == -1){
                that._makeFolder(resp.parents[0].id,that.CONFIGFILEFOLDER,getConfigFolderContents);
            }
            else{
                getConfigFolderContents(folderId);
            }
            
         });
               
               
                     
    };
                         



    var checkAuth = function() {
        //1. autheniticated
        //2. load drive api
        //
    
        gapi.auth.authorize({'client_id': this.CLIENT_ID, 'scope': this.SCOPES, 'immediate': true},
            function(authResult){
                if (authResult && !authResult.error) {
                    writeStatement('Authenticated');
                    
                    //SET AUTH RESULT
                    that.authResult = authResult;
                    
                    
                    //load the drive api api
                     gapi.client.load('drive', 'v2', function(r){
                         loadFileInfo(data.ids[0], fileLoadResponse);
                     });
                    
                    
                }
                else {
                    writeStatement('Couldnt authenticate!');
                }
                
                
            }
            
        );
        
    };

    window.setTimeout($.proxy(checkAuth, this), 1);
     
     
     
};

MyDrive.prototype._makeFolder = function(parentId, folderName, callback){
    
    writeStatement('attempting to make folder');
    
    var metadata = {
        title: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [{id: parentId}]
    };
    
    var data = new FormData();
    data.append("metadata", new Blob([ JSON.stringify(metadata) ], { type: "application/json" }));
    
    var token = gapi.auth.getToken();
    
    $.ajax("https://www.googleapis.com/upload/drive/v2/files", {
        data: data,
        headers: {Authorization: 'Bearer ' + token.access_token},
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data) {           
            if(callback)
                callback(data.id);    
            writeStatement('Folder created' + data.id);
        }
    });
        
};

MyDrive.prototype._saveFile = function(parentId, fileName, fileId, content,callback){
    
     writeStatement('attempting to savefile: ' + parentId + ' filename ' + fileName + ' file id ' + fileId);
     
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
        
        var up = fileId != null ? '/' + fileId : '';
        
        $.ajax("https://www.googleapis.com/upload/drive/v2/files" + up + "?uploadType=multipart", {
          data: data,
          headers: {Authorization: 'Bearer ' + token.access_token},
          contentType: false,
          processData: false,
          type: fileId != null ? 'PUT' : 'POST',
          success: function(data) {           
              writeStatement('File written');
              if(callback)
                callback(data.id);
          }
        });
        
};

//GetNoteData: function (urlId, callback)
MyDrive.prototype.GetNoteData = function(urlId, callback){
   
    
    callback(this.generations);
};
    
//WriteNoteData: function (note)    
MyDrive.prototype.WriteNoteData = function(data){
    // add note into array
    // then update file contents to reflect that
    this.generations.push(data);
    
      var c = {
            urlId : this.FILEID,
            generations: this.generations,
            options : this.options
        };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        
    });
};

MyDrive.prototype.GetOptions= function (urlId,callback){
    
    callback(this.options);
};

MyDrive.prototype.SaveOptions= function (options){
    this.options[0] = options;
    
     var c = {
            urlId : this.FILEID,
            generations: this.generations,
            options : this.options
        };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        
    });
};


MyDrive.prototype.deleteConfig = function(){
    
      var request = gapi.client.drive.files.delete({
        'fileId': fileId
      });
      
      request.execute(function(resp) { });
    
};

MyDrive.prototype.GetImageData= function(callback){
        //dummy values not intended to be used
        var imageData = {
            title:this.FILENAME,
            url: this.IMAGEURL,
            urlId :this.FILEID
        };
        
        callback(imageData);
    };

function writeStatement(statement){
   console.log(statement);
    // var d = new Date();
    // var n = d.toLocaleTimeString();
    
    // var output = $('#output').html();

    // output += '<br/>'+n+ ' ' + statement;
    
    // $('#output').html(output);
}
