// MILAN: CREATED THIS FILE

include( "js/app/com/dadc/lithium/parsers/XMLParser.js" );
include( "js/app/com/dadc/lithium/parsers/M4TParser.js" );
include( "js/app/com/dadc/lithium/parsers/TTMLSubtitle.js" );

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var TTMLSubtitleModelRequest = function( subtitle_url, callback ){
    //SAMPLE URL
//    var url = http://images-us-az.crackle.com/1/m/el/ds6wb_en-US_120820143853.xml
    //M4T SAMPLE URL
 //   var url = "http://hollywood.cs.connect.com/hlspoc/Discovery_SMPTE_TT_Complete_Testsubtitle_Track 5.m4t";
//    var url = "http://hollywood.cs.connect.com/hlspoc/Discovery_SMPTE_TT_Complete_Testsubtitle_Track 5.m4t";
    //M4T WITHOUT BINARY DATA
//    var url = "I:\\Test.m4t";
    var url = subtitle_url; //ModelConfig.getServerURLRoot() + "browse/" + BrowseFiltersRequest_CHANNEL_NAME + "/filters?format=json";
    var format = url.substr(url.lastIndexOf('.') + 1);
    Logger.log( url );
    var httpRequestObj;
    var http_retries;
    var This = this;

    this.startRequest = function( ){
        console.log("CALLING START")
         Http.request(subtitle_url, "GET", null, null, function(idata, istatus){
            if(idata != null && istatus == 200){
                if(callback){
                    Logger.log("FILE::: " + idata);
                    //Logger.logObj(data);
                    var subtitle_data = new TTMLSubtitleModel( idata, format );
                    callback( subtitle_data, istatus );
                }
            }
            else{
                if(callback){
                    callback(null, istatus)
                }
            }
        }, false)
        // http_retries = 0;
        // initHttpRequest();
        // httpRequestObj.start();

        /*try{
            var httpClient = engine.createHttpClient();
            var request = httpClient.createRequest("GET", url);
            request.onComplete = function(data, status) {
                console.log(" !!!!!!!!!!!!!!!!!!!! request complete !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log("status: " + status);
                if(status >= 200 && status < 400) {
                    console.log("data in hex:" + data.toString("hex"));
                }
            };
            request.start();

        } catch (e){
            console.log(" !!!!!!!!!!!!!!!!!!!! request failed !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            Logger.logObj( e );
        }*/
    }

    function initHttpRequest(){
        if( ModelConfig.CONFIG.DISABLE_CERT_VALIDATION )
            ModelConfig.httpClientObj.disableCertValidation( true );
        else if( ModelConfig.CONFIG.CERT_VALIDATION )
            ModelConfig.httpClientObj.setCertificateAuthority( ModelConfig.CONFIG.CERT_VALIDATION );

        // TL 1.3.3 UPDATE - unneeded? (following Ben's CrackleUS update)
        httpRequestObj = ModelConfig.httpClientObj.createRequest( "GET", url );
        httpRequestObj.onComplete = This.onRequestComplete;

        // MILAN: ADDED TEST FOR M4T FILES
        /*engine.loadData(url, function(data){
            Logger.log("EXT::: "+ format);
            Logger.log("FILE::: " + data);
            Logger.logObj(data);
            var subtitle_data = new TTMLSubtitleModel( data, format );
           // Logger.log("FILE::: "+ subtitle_data);
            callback( subtitle_data, 200 );
        });*/
    }

    this.onRequestComplete = function( data, status ){
        if ( status != 200 && http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            Logger.log("FAILED LOADING SUBTITLE - STATUS: " + status);
            http_retries++;
            initHttpRequest();
            httpRequestObj.start();
        } else if ( status != 200 && http_retries >= ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            callback( null, status );
        }else {
            try{
               Logger.log("FILE::: " + data);
                               Logger.logObj(data);
                var subtitle_data = new TTMLSubtitleModel( data, format );
                callback( subtitle_data, status );
            }catch( e ){
                Logger.log( '!!! EXCEPTION onRequestComplete TTMLSubtitleModel.js !!!' );
                Logger.logObj( e );
                callback( null, ModelConfig.API_ERROR );
            }
        }
    }
}

var TTMLSubtitleModel = function( data, format){
    console.log("SUBMODEL GETS")
    console.dir(data)
    this.m_data = data;
    this.m_format = format;
    var parsed_subtitle_obj = null;

    this.getParsedSubtitleObj = parsed_subtitle_obj;

    switch (this.m_format) {
        case TTMLSubtitleModel.FORMATS.M4T:
            var parser = new M4TParser();
            var xmlDocArr = parser.parseString(this.m_data);
            parsed_subtitle_obj = TTMLSubtitle.createSubtitlesM4T( xmlDocArr );
            break;
        case TTMLSubtitleModel.FORMATS.XML:
            var parser = new XMLParser();
            var xmlDoc = parser.parseString( this.m_data );
            parsed_subtitle_obj = TTMLSubtitle.createSubtitles( xmlDoc );
            break;
    }
    //console.dir(parsed_subtitle_obj)
}

TTMLSubtitleModel.FORMATS = {
    XML: 'xml',
    M4T: 'm4t'
};