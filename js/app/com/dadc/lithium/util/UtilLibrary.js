var UtilLibrary = function(){

    this.removeNonPrintableCharacters = function( str ){
        str = str.replace( /(\r\n|\n|\r)/gm, "" )
        Logger.log( str );
        return str;
    }

    this.getTextOrNA = function( str ){
	try{
        Logger.log( 'getTextOrNA() ' + str );
        return ( str && str != "" ? str : "N/A" );
	} catch(e){ return "N/A"; }
    }
    this.garbageCollect = function(){
        Logger.log( '*** GC CALLED' );
        engine.garbageCollect();
        engine.garbageCollect();
        engine.garbageCollect();
    }
}

UtilLibraryInstance = new UtilLibrary();

/**
 * No matter what typeof text node an XML element was parsed into JSON as, this will
 * attempt to access every type possible, if we weren't able to parse the string null
 * will be returned to the caller instead
 * @param {JSON} jsonParsedNode the XML element which was parsed to JSON
 * @returns {String} or null
 */
function getTextFromNode( jsonParsedNode )
{
    // is our argument valid?
    if( typeof jsonParsedNode === "undefined" || jsonParsedNode === null )
    return null;
    
    // is it already what we want?
    var output = jsonParsedNode;
    if( typeof output === "string" )
    return output;
    
    // is it node type 'Text'? (type 3)
    if( typeof jsonParsedNode["#text"] !== "undefined" )
    {
    output = jsonParsedNode["#text"];
    if( typeof output === "string" )
        return output; 
    }
    
    // is it node type 'CDATA'? (type 4)
    if( typeof jsonParsedNode["#cdata-section"] !== "undefined" )
    {
    output = jsonParsedNode["#cdata-section"];
    if( typeof output === "string" )
        return output;
    }
    
    // couldn't get a string - hopefully the caller will know what to do with it
    return jsonParsedNode;
}

/**
 * Determine if an object is an array or not
 * @param {object} obj
 * @returns {boolean}
 */
function isArray(obj){
    
    if( typeof obj === "undefined" ) return false;
    return Object.prototype.toString.call(obj) === "[object Array]";
}

/**
 * Util function to quickly determine if an object is null or undefined
 * @param {object} obj
 * @returns {Boolean}
 */
function isValid( obj )
{
    if( typeof obj === "undefined" ) return false;
    if( obj === null ) return false;
    return true;
}

/**
 * determine if the given string is... null or empty, or undefined too I suppose
 * @param {String} str
 * @returns {Boolean}
 */
function isNullOrEmpty( str )
{
    if( typeof str === "string" )
    {
    if( str === "" )
        return true;
    else return false;
    }
    else return true;
    return false;
}