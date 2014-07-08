include( "js/app/com/dadc/lithium/util/SHA1.js" );
include( "js/app/com/dadc/lithium/util/DateFormat.js" );

/**
 * Authentication class. Used to talk in a secured way with Crackle servers.
 * 
 * We can make a request to an URL `url` using the following syntax:
 * 
 * var httpClientObj = engine.createHttpClient();
 * var httpRequestObj =  httpClientObj.createRequest( "GET", url, {headers: AuthenticationInstance.getAuthorizationHeader( url )} );
 *
 *
 */
var Authentication = function( ){
    
    // Given by Crackle
    var PARTNER_KEYWORD = 'HTADOJZIIDMPQKBR';
    var PARTNER_ID = 40;
//    var PARTNER_KEYWORD = 'WTVVTQITDTWCKKPV';
//    var PARTNER_ID = 14;
    
    this.getAuthorizationHeader = function( url ){
        var date            = new Date();
        var timestamp       = date.format('yyyyMMddHHmm');
        var encrypt_url     = url + "|" + timestamp;
        var hmac            = Crypto.HMAC( Crypto.SHA1, encrypt_url, PARTNER_KEYWORD );
        
        var authorization   = hmac + "|" + timestamp + "|" + PARTNER_ID + "|1";
        var resp            = {'Authorization': authorization.toUpperCase() };

        Logger.log( "********" );
        Logger.log( "Authorization: " + authorization.toUpperCase() );

//        Logger.log( '*** BEGIN OF ' + url );
//        Logger.log( encrypt_url );
//        Logger.logObj( resp );
//        Logger.log( '*** END OF ' + url );
        
        return resp;
    }
}

var AuthenticationInstance = new Authentication();