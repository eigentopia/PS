// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var GeoCountryRequest = function( callback )
{
    //SAMPLE URL http://api.crackle.com/Service.svc/geo/country
    var url = "https://api.crackle.com/Service.svc/geo/country?format=json";
    Logger.log( "GeoCountryRequest url = " + url );

    var httpRequestObj = null;
    var http_retries = 0;
    var api_retries = 0;

    this.startRequest = function( )
    {
        http_retries = 0;
        api_retries = 0;
        initHttpRequest();
    }

    function initHttpRequest()
    {
	   httpRequestObj = null;

        if( ModelConfig.CONFIG.DISABLE_CERT_VALIDATION )
            ModelConfig.httpClientObj.disableCertValidation( true );
        else if( ModelConfig.CONFIG.CERT_VALIDATION )
            ModelConfig.httpClientObj.setCertificateAuthority( ModelConfig.CONFIG.CERT_VALIDATION );

        httpRequestObj = ModelConfig.httpClientObj.createRequest( "GET", url, { headers: AuthenticationInstance.getAuthorizationHeader( url ) }, null );
        httpRequestObj.onComplete = onRequestComplete;
	    httpRequestObj.start();
    }

    function onRequestComplete( data, status )
    {
        Logger.log( 'GeoCountry.onRequestComplete() - status: ' + status + ", try: " + http_retries + "/" + api_retries);

        if ( status != 200 && ++http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY )
	    {
            initHttpRequest();
        }
	    else if ( status != 200 && http_retries >= ModelConfig.CONFIG.NETWORK_ERROR_RETRY )
	    {
            Logger.log( 'GeoCountry.onRequestComplete - !!!! FAIL' );
            callback( null, status ); // Failure
        }
	    else
	    {
            try
	        {
		        var dat = JSON.parse( data );

                var configObj = new GeoCountry( dat );

                if ( configObj.getStatus().getMessageCode() != 0 &&
		              api_retries < ModelConfig.CONFIG.API_ERROR_RETRY )
		        {
		            api_retries++;
                    initHttpRequest();
                }
		        else if ( configObj.getStatus().getMessageCode() != 0 &&
		              api_retries >= ModelConfig.CONFIG.API_ERROR_RETRY )
		        {
                    callback( null, ModelConfig.API_ERROR ); // Failure
                }
		        else
		        {
                    callback( configObj, status ); // Success
                }
            }
	        catch( e )
	        {
                Logger.log( 'GeoCountry.onRequestComplete - !!!! EXCEPTION RAISED' );
                Logger.logObj( e );
                callback( null, ModelConfig.API_ERROR ); // Failure
            }
        }
    }
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//				DATA OBJECTS
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var GeoCountry = function( jsonData )
{
    var statusObj     = (jsonData.status)?new GeoCountryStatus( jsonData.status ):null;
    var id = (jsonData)?jsonData.ID:null;
    var cc = (jsonData)?jsonData.CountryCode:null;
    var cn = (jsonData)?jsonData.CountryName:null;
    var ip = (jsonData)?jsonData.IPAddress:null;
    this.getStatus      = function() { return statusObj; }
    this.getID          = function() { return id; }
    this.getCountryCode = function() { return cc; }
    this.getCountryName = function() { return cn; }
    this.getIPAddress   = function() { return ip; }
}

var GeoCountryStatus = function( jsonData )
{
    this.getMessageCode                = function() { return jsonData.messageCode; }
    this.getMessageCodeDescription     = function() { return jsonData.messageCodeDescription; }
    this.getMessage                    = function() { return jsonData.message; }
    this.getmessageSubCode             = function() { return jsonData.messageSubCode; }
    this.getMessageSubCodeDescription  = function() { return jsonData.messageSubCodeDescription; }
    this.getAdditionalInfo             = function() { return jsonData.additionalInfo; }
}