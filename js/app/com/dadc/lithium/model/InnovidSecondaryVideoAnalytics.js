
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------Analytics---------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

var InnovidSecondaryVideoAnalytics = function( configObj, secondary_video_id )
{
    var m_logAnalytics = false;          // when true, outputs helpful log data
    var m_prohibitAnalytics = false;    // when true, URLs will be built, but no analytics will be sent
    var m_logUrl = false;

    // helper func, log the output url
    function logUrl( url )
    {
        if( m_logUrl == false ) return;
        if( m_logAnalytics )
            Logger.log("InnovidSecondaryVideoAnalytics:: URL= " + url);
    }

    // request callback
    function onComplete( data, status )
    {
        if( m_logAnalytics )
            Logger.log("InnovidSecondaryVideoAnalytics::onComplete() - " + status);
    }

    // request callback
    function onUpdate( status )
    {
        if( m_logAnalytics )
            Logger.log("InnovidSecondaryVideoAnalytics::onUpdate() - status: ");
    }

    // helper func, sends the given url
    function sendUrl( url )
    {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19'
        };
        
        // BENUPDATE: CONFIGURABLE SDK TYPE
        var r = ModelConfig.createRequest( "GET", url, headers, null );
//        var r = ModelConfig.httpClientObj.request( "GET", url, null, headers );
        r.onComplete = onComplete;
        r.onResponse = onUpdate;
        r.start();
        
        
        Logger.log("url sent: " + url);
        if( m_logUrl ){
            var chunks = url.split( "?" );
            var params = chunks[ 1 ].split( "&" );
            Logger.log( "...............................................");
            Logger.log( ".........." + chunks[ 0 ]);
            for( var i = 0; i < params.length; i++ ){
                Logger.log( ".........." + decodeURI( params[ i ] ) );
            }
            Logger.log( "...............................................");
        }
    }

    // OK FOR SECONDARY VIDEO! 
    // video has played
    this.firePlay = function()
    {
        if( this.firePlay.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidSecondaryVideoAnalytics::firePlay() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::firePlay()");

        var output = configObj.getDomain() +
            "action=" +                      "invply" +
            "&viewer%5Fid=" +                configObj.getViewerID() +
            "&session%5Fid=" +               configObj.getSessionID() +
            "&publisher%5Fid=" +             configObj.getPublisherID() +
            "&project%5Fhash=" +             configObj.getProjectHash() +
            "&client%5Fid=" +                configObj.getClientID() +            
            "&channel%5Fid=" +               configObj.getChannelID() +
            "&project%5Fstate=" +            configObj.getProjectState() +
            "&placement%5Ftag%5Fid=" +       configObj.getPlacementTagID() +
            "&video%5Fid=" +                 configObj.getVideoID() +
            "&website=" +                    configObj.getWebsite() +
            "&r=" +                          configObj.getRandomNumber() +
            "&event%5Fid=" +                 secondary_video_id;

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::firePlay() - sent");
        }
        this.firePlay.hasFired = true;
    }
    this.firePlay.hasFired = false;



    // OK FOR SECONDARY VIDEO! 
    // video is 25% complete
    this.fire25Percent = function(){
        if( this.fire25Percent.hasFired == true ) return;
        if (! configObj ){
            Logger.log("InnovidSecondaryVideoAnalytics::fire25Percent() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::fire25Percent()");

        var output = configObj.getDomain() +
            "action=" +                   "invpt" +
            "&viewer%5Fid=" +             configObj.getViewerID() +
            "&session%5Fid=" +            configObj.getSessionID() +
            "&publisher%5Fid=" +          configObj.getPublisherID() +
            "&project%5Fhash=" +          configObj.getProjectHash() +
            "&client%5Fid=" +             configObj.getClientID() +
            "&channel%5Fid=" +            configObj.getChannelID() +
            "&project%5Fstate=" +         configObj.getProjectState() +
            "&placement%5Ftag%5Fid=" +    configObj.getPlacementTagID() +            
            "&video%5Fid=" +              configObj.getVideoID() +
            "&website=" +                 configObj.getWebsite() +
            "&r=" +                       configObj.getRandomNumber() +            
            "&event%5Fid=" +              secondary_video_id +
            "&event%5Fvalue=" +           "25";
        logUrl( output );
        if (! m_prohibitAnalytics ){
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::fire25Percent() - sent");
        }
        this.fire25Percent.hasFired = true;
    }
    this.fire25Percent.hasFired = false;




    // OK FOR SECONDARY VIDEO! 
    // video is 50% complete
    this.fire50Percent = function()
    {
        if( this.fire50Percent.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidSecondaryVideoAnalytics::fire50Percent() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::fire50Percent()");

        var output = configObj.getDomain() +
            "action=" +                   "invpt" +
            "&viewer%5Fid=" +             configObj.getViewerID() +
            "&session%5Fid=" +            configObj.getSessionID() +
            "&publisher%5Fid=" +          configObj.getPublisherID() +
            "&project%5Fhash=" +          configObj.getProjectHash() +
            "&client%5Fid=" +             configObj.getClientID() +
            "&channel%5Fid=" +            configObj.getChannelID() +
            "&project%5Fstate=" +         configObj.getProjectState() +
            "&placement%5Ftag%5Fid=" +    configObj.getPlacementTagID() +            
            "&video%5Fid=" +              configObj.getVideoID() +
            "&website=" +                 configObj.getWebsite() +
            "&r=" +                       configObj.getRandomNumber() +            
            "&event%5Fid=" +              secondary_video_id +
            "&event%5Fvalue=" +           "50";
        logUrl( output );
        if (! m_prohibitAnalytics ){
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::fire50Percent() - sent");
        }
        this.fire50Percent.hasFired = true;
    }
    this.fire50Percent.hasFired = false;




    // video 75% complete
    this.fire75Percent = function()
    {
        if( this.fire75Percent.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidSecondaryVideoAnalytics::fire75Percent() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::fire75Percent()");

        var output = configObj.getDomain() +
            "action=" +                   "invpt" +
            "&viewer%5Fid=" +             configObj.getViewerID() +
            "&session%5Fid=" +            configObj.getSessionID() +
            "&publisher%5Fid=" +          configObj.getPublisherID() +
            "&project%5Fhash=" +          configObj.getProjectHash() +
            "&client%5Fid=" +             configObj.getClientID() +
            "&channel%5Fid=" +            configObj.getChannelID() +
            "&project%5Fstate=" +         configObj.getProjectState() +
            "&placement%5Ftag%5Fid=" +    configObj.getPlacementTagID() +            
            "&video%5Fid=" +              configObj.getVideoID() +
            "&website=" +                 configObj.getWebsite() +
            "&r=" +                       configObj.getRandomNumber() +            
            "&event%5Fid=" +              secondary_video_id +
            "&event%5Fvalue=" +           "75";

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::fire75Percent() - sent");
        }
        this.fire75Percent.hasFired = true;
    }
    this.fire75Percent.hasFired = false;




    // video is 100% complete
    this.fire100Percent = function()
    {
        if( this.fire100Percent.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidSecondaryVideoAnalytics::fire100Percent() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::fire100Percent()");

        var output = configObj.getDomain() +
            "action=" +                   "invpt" +
            "&viewer%5Fid=" +             configObj.getViewerID() +
            "&session%5Fid=" +            configObj.getSessionID() +
            "&publisher%5Fid=" +          configObj.getPublisherID() +
            "&project%5Fhash=" +          configObj.getProjectHash() +
            "&client%5Fid=" +             configObj.getClientID() +
            "&channel%5Fid=" +            configObj.getChannelID() +
            "&project%5Fstate=" +         configObj.getProjectState() +
            "&placement%5Ftag%5Fid=" +    configObj.getPlacementTagID() +            
            "&video%5Fid=" +              configObj.getVideoID() +
            "&website=" +                 configObj.getWebsite() +
            "&r=" +                       configObj.getRandomNumber() +            
            "&event%5Fid=" +              secondary_video_id +
            "&event%5Fvalue=" +           "100";

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidSecondaryVideoAnalytics::fire100Percent() - sent");
        }
        this.fire100Percent.hasFired = true;
    }
    this.fire100Percent.hasFired = false;
    
}