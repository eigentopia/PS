// MILAN: CREATED THIS FILE FOR PARSING M4T FILES

var M4TParser = function(){
    var separator = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
    
    this.parseString = function( m4t_data ){
        var xml_data_array = m4t_data.split(separator);
        
        var parser = new XMLParser();
        var xml_array = new Array();
        
        for (var i = 0; i < xml_data_array.length; i++)
            if(xml_data_array[i] != "")
                xml_array.push(parser.parseString(separator + xml_data_array[i]));
        
        return xml_array;
    }
}
