Array.prototype.LinkContainingPoint = function (mx,my) {

    for (var i = 0; i < this.length; i++) {

        if ((this[i].x1 <= mx && this[i].x2 >= mx) 
        && (this[i].y1 <= my && this[i].y2 >= my))                      
        {
            return this[i];
        }
    }
    return null;
};

