
//include( "js/app/com/dadc/lithium/parsers/xmlsax.js" );

var XMLParser_DAC = function(){

}

XMLParser_DAC.XMLToJSON = function( xml_data ){
    try{
        var parser = new XMLParser();
        var xmlDoc = parser.parseString( xml_data );
    //    Logger.logObj( xmlDoc );
    //    Logger.logObj( xmlDoc.childNodes[1].childNodes[0].attributes );
        if ( !xmlDoc ) return null;
        json =  xmlToJson( xmlDoc );
        return json;
    }catch( e ){
        Logger.log( '!!! EXCEPTION !!!' );
        //Logger.logObj( e );
        return null;
    }
    
    //instantiate the W3C DOM Parser
//    var parser = new DOMImplementation();
//    //load the XML into the parser and get the DOMDocument
//    var domDoc = parser.loadXML(xml_data);
//
//    //get the root node (in this case, it is ROOTNODE)
//    var docRoot = domDoc.getDocumentElement();
//
//    return xmlToJson2( docRoot );
//    

// equally valid methods of reaching the data.
// Logger.log( jsonObj.queryResults.attributes.created );
// Logger.log( jsonObj["queryResults"]["attributes"]["created"] );
}




function xmlToJson2(xml, debug) {
    var attr,
        child,
        attrs = xml.attributes,
        children = xml.childNodes,
        key = xml.nodeType,
        obj = {},
        i = -1;
    if (key == 1 && attrs.length) {
      obj[key = 'attributes'] = {};
      while (attr = attrs.item(++i)) {
        obj[key][attr.nodeName] = attr.nodeValue;
      }
      i = -1;
    } else if (key == 3) {
      obj = xml.nodeValue;
    }
    while (child = children.item(++i)) {
      key = child.nodeName;
      if (obj.hasOwnProperty(key)) {
        if (obj.toString.call(obj[key]) != '[object Array]') {
          obj[key] = [obj[key]];
        }
        obj[key].push(xmlToJson2(child));
      }
      else {
        if (key == '#cdata-section') {
            obj[key] = child.nodeValue;
        } else {
            obj[key] = xmlToJson2(child);
        }
      }
    }
    return obj;
  }

    function xmlToJson(xml) {
  
        // Create the return object
        var obj = {};
        
//        Logger.log( 'nodeType = ' + xml.nodeType );
        if (xml.nodeType && xml.nodeType == 1) { // element
//            Logger.log( 'inside element' );
            // do attributes
            if (xml.attributes ) {
//                Logger.log( ' *** inside attributes ***' );
                obj["attributes"] = {};
                for (var attr_name in xml.attributes ) {
                    obj["attributes"][attr_name] = xml.attributes[attr_name];
                }
            }
        } else if (xml.nodeType == 3 || xml.nodeType == 4) { // text or cdata
            obj = xml.nodeValue;
        }

        // do children
        if (xml.childNodes && xml.childNodes.length > 0) {
//            Logger.log( ' *** inside children ***' );
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes[i];
                var nodeName = item.nodeName;
//                Logger.log( '### item  ###' );
//                Logger.log( 'nodeName = ' + nodeName );
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].length) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    };