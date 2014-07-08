
var RGBLibrary = function(){
 
     this.getRED = function( uniform_float_alpha ){
         return [ 255/255, 0/255, 0/255, uniform_float_alpha ];
     }

     this.getGREEN = function( uniform_float_alpha ){
         return [ 0/255, 255/255, 0/255, uniform_float_alpha ];
     }

     this.getBLUE = function( uniform_float_alpha ){
         return [ 0/255, 0/255, 255/255, uniform_float_alpha ];
     }
     this.getLIGHTBLUE = function( uniform_float_alpha ){
         return [ 135/255, 206/255, 250/255, uniform_float_alpha ];
     }
     this.getDARKBLUE = function( uniform_float_alpha ){
         return [ 0/255, 34/255, 102/255, uniform_float_alpha ];
     }

     this.getBLACK = function( uniform_float_alpha ){
         return [ 0, 0, 0, uniform_float_alpha ];
     }

     this.getDARKGRAY = function( uniform_float_alpha ){
         return [ 63/255, 63/255, 63/255, uniform_float_alpha ];
     }
     
     this.getLIGHTGRAY = function( uniform_float_alpha ){
         return [ 191/255, 191/255, 191/255, uniform_float_alpha ];
     }
     this.getORANGE = function( uniform_float_alpha ){
         return [ 255/255, 120/255, 0/255, uniform_float_alpha ];
     }

     this.getMEDIUMGRAY = function( uniform_float_alpha ){
         return [ 48/255, 48/255, 48/255, uniform_float_alpha ];
     }

     this.getGRAY = function( uniform_float_alpha ){
         return [ 127/255, 127/255, 127/255, uniform_float_alpha ];
     }

    this.getGRAY4 = function( uniform_float_alpha ){
         return [ 108/255, 123/255, 139/255, uniform_float_alpha ];
     }

    this.getTEST = function( uniform_float_alpha ){
         return [ 11/255, 11/255, 11/255, uniform_float_alpha ];
     }
     
     this.getWHITE = function( uniform_float_alpha ){
         return [ 255/255, 255/255, 255/255, uniform_float_alpha ];
     }     
     
     this.getGRAY5 = function( uniform_float_alpha ){
         return [ 139/255, 205/255, 193/255, uniform_float_alpha ];
     }     
     
     this.getPROMOTIONALCOLOR = function( uniform_float_alpha ){
         return [ 12/255, 12/255, 12/255, uniform_float_alpha ];
     }          

}
var RGBLibraryInstance = new RGBLibrary();