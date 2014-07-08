
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------Analytics---------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

var InnovidAnalytics = function( configObj, widget )
{
    this.getConfigObject = function() { return configObj; }

    var m_logAnalytics = false;          // when true, outputs helpful log data
    var m_prohibitAnalytics = false;    // when true, URLs will be built, but no analytics will be sent
    var m_logUrl = false;

    // helper func, log the output url
    function logUrl( url )
    {
        if( m_logUrl == false ) return;
        if( m_logAnalytics )
            Logger.log("InnovidAnalytics:: URL= " + url);
    }

    // request callback
    function onComplete( data, status )
    {
        if( m_logAnalytics )
            Logger.log("InnovidAnalytics::onComplete() - " + status);
    }

    // request callback
    function onUpdate( status )
    {
        if( m_logAnalytics )
            Logger.log("InnovidAnalytics::onUpdate() - status: ");
    }

    // helper func, sends the given url
    function sendUrl( url )
    {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19'
        };
//        var r = ModelConfig.httpClientObj.request( "GET", url, null, headers );
       
        // BENUPDATE: CONFIGURABLE SDK TYPE
        var r = ModelConfig.createRequest( "GET", url, headers, null );
        r.onComplete = onComplete;
        r.onResponse = onUpdate;
        r.start();
        Logger.log("url sent: " + url);
        if( m_logUrl ){
            var chunks = url.split( "?" );
            var params = chunks[ 1 ].split( "&" );
            Logger.log( "-----------------------------------------------");
            Logger.log( "----------" + chunks[ 0 ]);
            for( var i = 0; i < params.length; i++ ){
                Logger.log( "----------" + decodeURI( params[ i ] ) );
            }
            Logger.log( "-----------------------------------------------");
        }
    }

    // initialization complete
    this.fireInit = function()
    {
        if( this.fireInit.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::fireInit() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireInit()");

        var output = configObj.getDomain() +
            "action=" +                 "init" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&ver=" +                   widget.getConfigurationObject().getVersion().toString() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&size=" +                  widget.getVideoReference().getVideoSourceConfigFromAdHeaderObj().getWidth().toString() + "x" + widget.getVideoReference().getVideoSourceConfigFromAdHeaderObj().getHeight().toString() +
            "&website=" +               configObj.getWebsite() +
            "&fver=" +                  "null" +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            //for( var i = 0; i < 150; i++ )
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireInit() - sent");
        }
        this.fireInit.hasFired = true;
    }
    this.fireInit.hasFired = false;

    // video has played
    this.firePlay = function()
    {
        if( this.firePlay.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::firePlay() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::firePlay()");

        var output = configObj.getDomain() +
            "action=" +                      "play" +
            "&project%5Fhash=" +             configObj.getProjectHash() +
            "&channel%5Fid=" +               configObj.getChannelID() +
            "&video%5Fid=" +                 configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +       configObj.getPlacementTagID() +
            "&ver=" +                        widget.getConfigurationObject().getVersion().toString() +
            "&client%5Fid=" +                configObj.getClientID() +
            "&project%5Fstate=" +            configObj.getProjectState() +
            "&publisher%5Fid=" +             configObj.getPublisherID() +
            "&viewer%5Fid=" +                configObj.getViewerID() +
            "&session%5Fid=" +               configObj.getSessionID() +
            "&website=" +                    configObj.getWebsite() +
            "&r=" +                          configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::firePlay() - sent");
        }
        this.firePlay.hasFired = true;
    }
    this.firePlay.hasFired = false;

    // video is 25% complete
    this.fire25Percent = function()
    {
        if( this.fire25Percent.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::fire25Percent() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fire25Percent()");

        var output = configObj.getDomain() +
            "action=" +                   "vpoint" +
            "&project%5Fhash=" +          configObj.getProjectHash() +
            "&channel%5Fid=" +            configObj.getChannelID() +
            "&video%5Fid=" +              configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +    configObj.getPlacementTagID() +
            "&client%5Fid=" +             configObj.getClientID() +
            "&project%5Fstate=" +         configObj.getProjectState() +
            "&publisher%5Fid=" +          configObj.getPublisherID() +
            "&viewer%5Fid=" +             configObj.getViewerID() +
            "&session%5Fid=" +            configObj.getSessionID() +
            "&website=" +                 configObj.getWebsite() +
            "&event%5Fid=" +              "percent" +
            "&event%5Fvalue=" +           "25" +
            "&r=" +                       configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fire25Percent() - sent");
        }
        this.fire25Percent.hasFired = true;
    }
    this.fire25Percent.hasFired = false;

    // video is 50% complete
    this.fire50Percent = function()
    {
        if( this.fire50Percent.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::fire50Percent() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fire50Percent()");

        var output = configObj.getDomain() +
            "action=" +                 "vpoint" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&website=" +               configObj.getWebsite() +
            "&event%5Fid=" +            "percent" +
            "&event%5Fvalue=" +         "50" +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fire50Percent() - sent");
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
            Logger.log("InnovidAnalytics::fire75Percent() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fire75Percent()");

        var output = configObj.getDomain() +
            "action=" +                 "vpoint" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&website=" +               configObj.getWebsite() +
            "&event%5Fid=" +            "percent" +
            "&event%5Fvalue=" +         "75" +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fire75Percent() - sent");
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
            Logger.log("InnovidAnalytics::fire100Percent() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fire100Percent()");

        var output = configObj.getDomain() +
            "action=" +                 "vpoint" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&website=" +               configObj.getWebsite() +
            "&event%5Fid=" +            "percent" +
            "&event%5Fvalue=" +         "100" +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            //for( var i = 0; i < 150; i++ )
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fire100Percent() - sent");
        }
        this.fire100Percent.hasFired = true;
    }
    this.fire100Percent.hasFired = false;

    // user clicked on something
    this.fireClick = function()
    {
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::fireClick() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireClick()");

        var output = configObj.getDomain() +
            "action=" +                 "click" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&real%5Festate%5Fid=" +    configObj.getRealEstateID() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&impression%5Fid=" +       configObj.getImpressionID() +
            "&website=" +               configObj.getWebsite() +
            "&relative%5Ftime=" +       configObj.getElapsedTime() +
            "&event%5Fid=" +            "position" +
            "&event%5Fvalue=" +         "6" +
            "&ad%5Fcriteria=" +         "null" +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireClick() - sent");
        }
    }

    // user clicked in-app
    this.fireInUnitClick = function()
    {
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::fireInUnitClick() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireInUnitClick()");

        var output = configObj.getDomain() +
            "action=" +                 "clkint" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&real%5Festate%5Fid=" +    configObj.getRealEstateID() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&impression%5Fid=" +       configObj.getImpressionID() +
            "&website=" +               configObj.getWebsite() +
            "&relative%5Ftime=" +       configObj.getElapsedTime() +
            "&event%5Fid=" +            "navigate" +
            "&ad%5Fcriteria=" +         "null" +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireInUnitClick() - sent");
        }
    }

    // user did something for the first time
    this.fireEngagement = function()
    {
        if( this.fireEngagement.hasFired == true ) return;
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::fireEngagement() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireEngagement()");

        var output = configObj.getDomain() +
            "action=" +                 "engage" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&real%5Festate%5Fid=" +    configObj.getRealEstateID() +
            "&ver=" +                   widget.getConfigurationObject().getVersion().toString() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&website=" +               configObj.getWebsite() +
            "&relative%5Ftime=" +       configObj.getElapsedTime() +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            //for( var i = 0; i < 150; i++ )
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireEngagement() - sent");
        }
        this.fireEngagement.hasFired = true;
    }
    this.fireEngagement.hasFired = false;

    // gallery open
    this.fireOpenSlate = function()
    {
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::fireOpenSlate() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireOpenSlate()");

        var output = configObj.getDomain() +
            "action=" +                 "cxon" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&real%5Festate%5Fid=" +    configObj.getRealEstateID() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&impression%5Fid=" +       configObj.getImpressionID() +
            "&website=" +               configObj.getWebsite() +
            "&relative%5Ftime=" +       configObj.getElapsedTime() +
            "&event%5Fvalue=" +         "click" +
            "&event%5Fid=" +            "ImageGallery" +
            "&ad%5Fcrieria=" +          "null" +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireOpenSlate() - sent");
        }
    }

    // gallery closed
    this.fireCloseSlate = function()
    {
        if (! configObj )
        {
            Logger.log("InnovidAnalytics::fireCloseSlate() - configuration object found invalid");
            return;
        }
        if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireCloseSlate()");

        var output = configObj.getDomain() +
            "action=" +                 "cxoff" +
            "&project%5Fhash=" +        configObj.getProjectHash() +
            "&channel%5Fid=" +          configObj.getChannelID() +
            "&video%5Fid=" +            configObj.getVideoID() +
            "&placement%5Ftag%5Fid=" +  configObj.getPlacementTagID() +
            "&real%5Festate%5Fid=" +    configObj.getRealEstateID() +
            "&client%5Fid=" +           configObj.getClientID() +
            "&project%5Fstate=" +       configObj.getProjectState() +
            "&publisher%5Fid=" +        configObj.getPublisherID() +
            "&viewer%5Fid=" +           configObj.getViewerID() +
            "&session%5Fid=" +          configObj.getSessionID() +
            "&impression%5Fid=" +       configObj.getImpressionID() +
            "&website=" +               configObj.getWebsite() +
            "&relative%5Ftime=" +       configObj.getElapsedTime() +
            "&event%5Fvalue=" +         "click" +
            "&event%5Fid=" +            "ImageGallery" +
            "&ad%5Fcrieria=" +          "null" +
            "&r=" +                     configObj.getRandomNumber();

        logUrl( output );

        if (! m_prohibitAnalytics )
        {
            sendUrl( output );
            if ( m_logAnalytics ) Logger.log("InnovidAnalytics::fireCloseSlate() - sent");
        }
    }

}