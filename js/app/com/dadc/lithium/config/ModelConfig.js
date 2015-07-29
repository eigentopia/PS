// TESTING
var ModelConfig = function(){ }

ModelConfig.getServerURLRoot = function(){

    // DYNAMIC PRODUCTION
    return 'https://' + StorageManagerInstance.get( 'api_hostname' ) + '/Service.svc/';

    // STAGING
    //return  "https://staging-api-us.crackle.com/Service.svc/";
    //return  "https://staging-v1-api-us.crackle.com/Service.svc/";
    
    // STATIC PRODUCTION
//    return "https://api.crackle.com/Service.svc/";

}

ModelConfig.CONFIG = {
    NETWORK_ERROR_RETRY: 3,
    API_ERROR_RETRY: 3,
    DISABLE_CERT_VALIDATION: 0,
    APP_CONFIG: 555,
    //CERT_VALIDATION: "staging-api-us.crackle.com.crt+root.pem"    // OLD CERT
    //CERT_VALIDATION: "api.crackle.com.crt+root.pem"       // If you find yourself challenged to change the certificate put new cert_name.crt+root.pem file to SSL folder: On how to create .pem file out of crt files see http://www.digicert.com/ssl-support/pem-ssl-creation.htm
    CERT_VALIDATION: "all.pem"
}

ModelConfig.API_ERROR = -100;
ModelConfig.CONNECTION_ERROR = -200;
ModelConfig.httpClientObj = engine.createHttpClient();
ModelConfig.httpClientObj.timeout = 15 * 1000;

ModelConfig.createRequest = function( method, url, headers, params ){
    var httpRequestObj = undefined;

    var config = {};
    if( headers ) config['headers'] = headers;
    if( params ) config['queryParams'] = params;            
    httpRequestObj = ModelConfig.httpClientObj.createRequest( "GET", url, config );

    return httpRequestObj;
}

//http://content.uplynk.com/ext/e8773f7770a44dbd886eee4fca16a66b/2493775.m3u8?euid=&ad.metr=7&extsid=1&ad.preroll=1&ad.bumper=&ad.locationDesc=crackle_apple_tv_us_shows&ad=crackle_live
