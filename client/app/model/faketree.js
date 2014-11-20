

var FakeData = function (loader) {

    if (loader !== undefined)
        this.loader = loader;

 
    this.generations = [];
    
    

//this.loader = new FakeData();
};


FakeData.prototype = {

    GetGenerations: function (personId,newGeneration) {

        this.generations.push([]);
        this.generations[0] = [];

        this.AddData(0,0,0,900,0,900);

        this.generations[1] = [];

        this.AddData(1,1, 150, 300, 150, 170, 'first some test data');
        this.AddData(1,2, 200, 350, 180, 200, 'second some test data');
        this.AddData(1,3, 250, 350, 220, 250, 'third some test data');

        var payload = {Generations : this.generations};
         
        newGeneration(payload);

    },
    
    
    NewId : function(){
          
        var idx =0;
        var topNumber =0;
        while(idx < this.generations[1].length){
            if(Number(this.generations[1][idx].PersonId) > Number(topNumber)){
                topNumber = this.generations[1][idx].PersonId;
            }
            
            idx++;
        }
        
        return topNumber + 1;
    },
    
    AddData: function(genidx,personId,x1,x2,y1,y2,label){
           
        var node = {
            note: label,
            GenerationIdx: 0,
            Index: personId,
            PersonId: personId,
            X1:Number(x1),
            X2:Number(x2),
            Y1:Number(y1),
            Y2:Number(y2),
            zoom: 0
        };

        if(genidx === 0){
            this.generations[0].push(node);
            return;
        }

        var idx =0;
        var isPresent =false;
        while(idx < this.generations[1].length){
            
            console.log(this.generations[1][idx].PersonId + ' ' + personId);
            if(Number(this.generations[1][idx].PersonId) === Number(personId)){
                isPresent = true;
                this.generations[1][idx] =node;
                return;
            }
            
            idx++;
        }
        
        if(!isPresent){
            this.generations[1].push(node);
        }
        
        
        
    }
    
     
    
};