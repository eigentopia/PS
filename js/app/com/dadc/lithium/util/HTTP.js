include( "js/app/com/dadc/lithium/util/SHA1.js" );
include( "js/app/com/dadc/lithium/util/DateFormat.js" );
//Because- come on. One request method to rule them all.
var Http = function(){
    var staging = false
    var httpRequestObj = null;
    var api_retries = 0;
    var http_retries = 0;
    var callback
    var self = this
    var queue = [];
    var currentRequest;
    var s = 'https://' + StorageManagerInstance.get( 'api_hostname' ) + '/Service.svc/';
    var stagingURL = "https://staging-api-us.crackle.com/Service.svc/"
    var httpClientObj = engine.createHttpClient();
    httpClientObj.timeout = 15 * 1000;

    var PARTNER_KEYWORD
    var PARTNER_ID

    var platform = engine.stats.device.platform;
    if(platform === 'ps4'){
        PARTNER_KEYWORD = 'ANEPQFNKNFPOCJAJ';
        PARTNER_ID = 59;
    }
    else{
        PARTNER_KEYWORD = 'HTADOJZIIDMPQKBR';
        PARTNER_ID = 40;
    }

    var Config = {
        NETWORK_ERROR_RETRY: 3,
        API_ERROR_RETRY: 3,
        DISABLE_CERT_VALIDATION: 0,
        APP_CONFIG: 555,
        // If you find yourself challenged to change the certificate put new cert_name.crt+root.pem file 
        // to SSL folder: On how to create .pem file out of crt files 
        // see http://www.digicert.com/ssl-support/pem-ssl-creation.htm
        CERT_VALIDATION: "all.pem",
        API_ERROR: -100,
        CONNECTION_ERROR: -200
    }

    this.cancelRequest = function(){
        if(httpRequestObj && httpRequestObj.cancel){
            httpRequestObj.cancel();
        }
    }
    this.request = function(url, method, sendbody, headers, callback){
        var me = {};
        me.config = {};
        me.url = url;
        //var d = new Date();
        //me.url = url +"&ord=" + (d.getTime() + Math.floor((Math.random()*100)+1)).toString();
        console.log(me.url)
        me.method = method;
        me.callback = callback;
        if(sendbody){
            me.sendbody = sendbody
        }
        if(headers){
            me.config.headers = headers.headers;
        }
        queue.push(me)
        if(queue.length === 1){
            startRequest();
        }
    }

    function authorizationHeader (url) {

        var date            = new Date();
        var timestamp       = date.format('yyyyMMddHHmm');
        var encrypt_url     = url + "|" + timestamp;
        var hmac            = Crypto.HMAC( Crypto.SHA1, encrypt_url, PARTNER_KEYWORD );
        
        var authorization   = hmac + "|" + timestamp + "|" + PARTNER_ID + "|1";
        var resp            = {'Authorization': authorization.toUpperCase() };

        Logger.log( "HTTP ********" );
        Logger.log( "Authorization: " + authorization.toUpperCase() );

        Logger.log( '*** BEGIN OF ' + url );
        Logger.log( encrypt_url );
        Logger.logObj( resp );
        Logger.log( '*** END OF ' + url );
        
        return resp;
    }

    function startRequest(){
        if(queue.length > 0 ){
            http_retries = 0;
            api_retries = 0;
            currentRequest = queue.shift(); 
            initHttpRequest();
            httpRequestObj.start();
        }
    }

    function initHttpRequest(){
        if( Config.DISABLE_CERT_VALIDATION ){
            httpClientObj.disableCertValidation( true );
        }
        else if( Config.CERT_VALIDATION ){
            httpClientObj.setCertificateAuthority( Config.CERT_VALIDATION );
        }

        if(!currentRequest.config.headers){
            currentRequest.config ={ headers: authorizationHeader( currentRequest.url ) }
        }

        httpRequestObj = httpClientObj.createRequest( currentRequest.method, currentRequest.url, currentRequest.config, null );
        if(currentRequest.sendbody){
            httpRequestObj.sendBody(currentRequest.sendbody.data, currentRequest.sendbody.dataType);
        
        }
        httpRequestObj.onComplete = onRequestComplete;
    }

    function onRequestComplete ( data, status ){
        // console.log("REQUST COMPLETE " + self.url)
        // console.dir( data );
        // console.log(status);
        //HTTP errors
        if ( status != 200 && http_retries < Config.NETWORK_ERROR_RETRY ){
            http_retries++;
            initHttpRequest();
            httpRequestObj.start();
        } 
        else if ( status != 200 && http_retries >= Config.NETWORK_ERROR_RETRY ){
            if(status>-1){
                currentRequest.callback( null, status );
            }
            else{//these are fundamental errors like timeout
                //show
                Logger.log( '!!! EXCEPTION !!!' );
                //Logger.logObj( e );
                if(currentRequest){
                    currentRequest.callback( null, Config.CONNECTION_ERROR );
                }      
            }
            currentRequest = null;
        }
        //API Errors
        else {
            
            try{
                //var data = JSON.parse(data);
                if ( ( (data.messageCode && data.messageCode != 0) //because inexpicably, status messages aren't always in the same place
                    || (data.status && data.status.messageCode != 0))
                    && api_retries < Config.API_ERROR_RETRY ){
                    api_retries++;
                    initHttpRequest();
                    httpRequestObj.start();
                }
                else if ( ( (data.messageCode && data.messageCode != 0)
                    ||  (data.status && data.status.messageCode != 0) )
                    && api_retries >= Config.API_ERROR_RETRY ){
                    currentRequest.callback( null, Config.API_ERROR );
                }
                else{
                    currentRequest.callback( data, status );
                }
            }
            catch( e ){
                Logger.log( '!!! EXCEPTION !!!' );
                Logger.logObj( e );
                currentRequest.callback( null, Config.API_ERROR );
            }
        }
    }


    return {
        request:request,
        cancelRequest:cancelRequest
    }

}()


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