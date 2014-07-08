
var ArrayUtilities = function(){
    
    /** @return new array w/ item removed */
    this.removeItem = function( item, array ){
        var new_array = Array();
        for( var i = 0; i < array.length; i++ ){
            if( array[ i ] == item )
                continue;
            else
                new_array[ new_array.length ] = array[ i ];
        }
        return new_array;
    }
    
}

var ArrayUtilities = new ArrayUtilities();