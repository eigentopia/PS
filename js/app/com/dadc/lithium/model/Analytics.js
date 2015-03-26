include( "js/app/com/dadc/lithium/parsers/XMLParser.js" );
include( "js/app/com/dadc/lithium/config/OmnitureConfig.js" );

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var AnalyticsRequest = function( AnalyticsModelObj, callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/recent/movies/all/us/30?format=json
//    var url = "http://localhost/crackle/crackle.php";
    var url = "http://omn.crackle.com/b/ss//6";
    if(LoggerConfig.CONFIG.SECURE){
        url = "https://omn.crackle.com/b/ss//6";
    }

    Logger.log( "URL - AnalyticsRequest: " + url );

    var httpRequestObj;
    var This = this;
    var http_retries;
    var m_analytics_obj = AnalyticsModelObj;

    var extra_headers =
          {
//            'Keep-Alive': 'timeout=15',
              'Connection': 'Close',
              'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19',
              //'X-Forwarded-For': StorageManagerInstance.get( 'IPADDRESS' )
              'X-Forwarded-For': StorageManagerInstance.get( StorageManager.STORAGE_KEYS.IPADDRESS )
          };

    this.startRequest = function(){
        http_retries = 0;
        initHttpRequest();
        httpRequestObj.start();
    }

    this.onRequestComplete = function( data, status ){
        if ( status != 200 && http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            http_retries++;
            initHttpRequest();
            httpRequestObj.start();
        } else{
            Logger.log( 'onRequestComplete AnalyticsRequest' );
            Logger.log( data );

            //send the Audience Manager
            sendAM(m_analytics_obj);

            var json = XMLParser_DAC.XMLToJSON( data );
            if ( json ){
                Logger.logObj( json );
                return callback( new AnalyticsResponse( json ) );
            }else{
                return callback( null );
            }
        }
    }
    this.onResponse = function( httpResponse ){
        //Logger.logObj( httpResponse.headers );
        //Logger.logObj( httpResponse );
    }

    function initHttpRequest(){
        ModelConfig.httpClientObj.disableCertValidation( true );
        ModelConfig.httpClientObj.disablePipelining();

        // TL 1.3.3 UPDATE
        httpRequestObj = ModelConfig.httpClientObj.createRequest( "POST", url );
        httpRequestObj.onComplete = This.onRequestComplete;
        httpRequestObj.onResponse = This.onResponse;
        httpRequestObj.sendBody( m_analytics_obj.getXml(), 'Application/xml'  );
    }

    function sendAM(analObj){
        var headers =
        {
            //'Connection': 'Close',
            //'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19',
            //'X-Forwarded-For': StorageManagerInstance.get( 'IPADDRESS' )
            //'X-Forwarded-For': StorageManagerInstance.get( StorageManager.STORAGE_KEYS.IPADDRESS),
            'Content-Type': 'application/x-www-form-urlencoded'
        };

//         There are some params that need to be in a certain order.  Please have the
// dpid/dpuuid directly after the event?.

// Also, the end of the call should have the platform keys:
// d_stuff=1&d_dst=1&d_rtbd=json&d_cts=1&d_cb=pt_callback

// In between these would be all of the key-values for data collection.

//Could you try URL encoding and see if that solves our problem?
        var AM_ID = "13381"
        //This looks this way because the params must be in a certain order?
        var _url = 'http://crackle.demdex.net/event?'

        var qs = 'd_dpid='+AM_ID+"&d_dpuuid=TEST"//+ApplicationController.crackleUser.id
        qs+= analObj.getQS()
        qs+= "&d_stuff=1&d_dst=1&d_rtbd=json&d_cts=1&d_cb=pt_callback"

        //_url+=encodeURIComponent(qs)
        _url+=qs
        console.log(_url)

        Http.request(_url, "POST", null, headers, function(data, status){
            console.log("AM responded with "+ status)
        })

    }

    function PT_callback(data){
        console.log(JSON.stringify(data))
    }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var Analytics = function( key_values ){
    var m_key_values = key_values;
    var omniConfig = OmnitureConfig.getConfig()
    var platform = ApplicationController.PLATFORM.toUpperCase()
    var m_general_kvs = {
        'scXmlVer': '1.0',
        'reportSuiteID': omniConfig,
        //'reportSuiteID': 'crackleTest',
        'visitorID': 'Trilithium' + AnalyticsManagerInstance.getUniqueID(),
//        'ipaddress': StorageManagerInstance.get( 'IPADDRESS' ),
        'evar38': platform+' Trilithium App',
        'prop38': platform+' Trilithium App',
        'evar39': platform+' Trilithium App',
        'prop39': platform+' Trilithium App',
        'evar11': platform+' Trilithium App',
        'evar44': '2.0',
        'evar9': 'Devices',
        'pagename': platform+' Trilithium App: Home'
    };
    this.setKeyValues = function( key_values ) {m_key_values = key_values;}
    this.getXml = function(){
        var all_kvs = m_general_kvs;

        for( var i in m_key_values ){
            all_kvs[ i ] = m_key_values[ i ];
        }

        var xml = "<?xml version=1.0 encoding=UTF-8?>\n";
            xml += "<request>\n";

        for( var i in all_kvs ){
            var kv = all_kvs[ i ];
    	    if( kv )	// DAN: added this validation, we were getting null and created a full-crash
    	    {
        		kv = kv.replace( '&', '&amp;' );
        		kv = kv.replace( '<', '&lt;' );
        		kv = kv.replace( '>', '&gt;' );
        		xml += '<' + i + '>' + kv + '</' + i + ">\n";
    	    }
        }

        xml += "</request>";

        return xml;
    }
    this.getQS = function(){
        var all_kvs = m_general_kvs;
        var qs=""
        for( var i in m_key_values ){
            all_kvs[ i ] = m_key_values[ i ];
        }

        for( var i in all_kvs ){
            var kv = all_kvs[ i ];
            if( kv )    // DAN: added this validation, we were getting null and created a full-crash
            {

                kv  = kv.replace(':', '')
                kv = kv.split(' ').join('_')

                qs += '&c_'+i+'='+kv
            }
        }

        return qs;
    }
}

var AnalyticsResponse = function( data ){
    this.getStatus = function(){return getTextFromNode(data);}
}
