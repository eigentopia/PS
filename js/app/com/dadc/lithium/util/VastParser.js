

var VastParser = function( ADHeaderObj, wrapper_url )
{
    var This = this;
    var MAX_VAST_RECURSION = 5;
    var m_impression_urls = [];
    var m_tracking_url_objs = [];
    var m_video_url = null;
    var m_duration = null;
    var m_innovidData = null;
    var m_apiFramework = null;

    this.startParser = function()
    {
        m_tracking_url_objs = [];
        m_impression_urls = [];
        m_video_url = null;
        m_duration = null;
        Logger.log("ADTRACKER: VastParser startParser");
        processVastUrl( wrapper_url, 0 );
    };

    this.getImpressionUrls = function(){return m_impression_urls;};
    
    this.getTrackingUrlObjs = function(){return m_tracking_url_objs;};
    
    this.getApiFramework = function() { return m_apiFramework; }

    this.getDuration = function(){return m_duration;};
    
    this.getVideoUrl = function(){return m_video_url;};

    this.getInnovidData = function() { return m_innovidData; }

    /**
     * If it's a wrapper, we should proceed with parsing the vast url. This
     * might be a series of vast requests recursively.
     * @param {string} wrapper_url
     * @param {number} recursive_counter
     */
    function processVastUrl( wrapper_url, recursive_counter )
    {
        Logger.log("ADTRACKER: VastParser processVastUrl. Counter: "+ recursive_counter);
    
        if ( recursive_counter > MAX_VAST_RECURSION ) return;
        if( typeof wrapper_url !== "string" ) return;

        var vast_request = new VastModel.VastRequest( wrapper_url, vast_callback );
        vast_request.startRequest();
    }

    function vast_callback( vastObj, status )
    {
        Logger.log("ADTRACKER: VastParser vast_callback");

        //Logger.logObj( vastObj );
        if ( status === 200 )
        {
            process( vastObj, 0 );
        }
        else
        {
            ADHeaderObj.notifyAdParserError( This );
        }
    }

    /**
     * Get tracking events, impressions, and wrapper logic
     * @param {Vastmodel} vastObj
     * @param {Number} recursive_counter
     */
    function process( vastObj, recursive_counter )
    {
        if( isValid( vastObj ) === false )
        {
            Logger.log("VastParser.process() - vastModel is invalid");
        }
    
        var ad_list = vastObj.getAdList();
        var is_wrapper = false;
        var isInnovid = false;
    
        if( ad_list === null )
        {
            Logger.critical("VastParser.process() - AdList returned invalid");
            ADHeaderObj.notifyAdParserError();
            return;
        }
    
        for( var i = 0; i < ad_list.getTotalAds(); i++ )
        {
            var ad = ad_list.getAd( i );
            var impression = null;
            var creatives = null;

            // Do we have a wrapper ad? Again?
            if ( isValid( ad.getWrapper() ) === true )
            {
                is_wrapper = true;
            }

            if ( is_wrapper === true )
            {
                impression = ad.getWrapper().getImpression();
                creatives = ad.getWrapper().getCreativeList();
            }
            else
            {
                if ( ad.getInLine() )
                {
                    impression = ad.getInLine().getImpression();
                    creatives = ad.getInLine().getCreativeList();
                }
                else Logger.warn("VastParser.process() - no wrapper and inline did not validate");
            }

            if ( isValid( impression ) === true )
            {
                if( isArray( impression ) === true )
                {
                    for( var ii = 0; ii < impression.length; ii++ )
                    {
                        m_impression_urls.push( getTextFromNode( impression[ ii ] ) );
                    }
                }
                else
                {
                    m_impression_urls.push( getTextFromNode( impression ) );
                }
        
                Logger.shout("VastParser.process() - " + m_impression_urls.length + " impressions found");
            }
            else Logger.warn("VastParser.process() - impressions from model were not valid");

            if ( isValid( creatives ) === true )
            {
                Logger.log( "VastParser.process() - " + creatives.getTotalCreatives() + ' CREATIVES FOUND' );
                for( var ii = 0; ii < creatives.getTotalCreatives(); ii++ )
                {
                    var creative = creatives.getCreative( ii );
                    var linear = creative.getLinear();
            
                    if( isValid( linear ) === true )
                    {
                        // Tracking events
                        if ( linear.getTrackingEvents() )
                        {
                            var tracking_url_objs = processTrackingURLObjs( linear );
                            for( var x in tracking_url_objs )
                            {
                                m_tracking_url_objs.push( tracking_url_objs[ x ] );
                            }
                            Logger.log("VastParser.process() - m_tracking_url_objs.length: " + m_tracking_url_objs.length);
                        }
            
                        // Media File list
                        if ( linear.getMediaFilesList() )
                        {
                            var media_files = linear.getMediaFilesList();
                            var highest_bitrate_media_file = null;

                            if( media_files.getTotalMediaFiles() === 1 )
                            {
                                highest_bitrate_media_file = media_files.getMediaFile( 0 );
                            }
                            else
                            {
                                for( var x = 0; x < media_files.getTotalMediaFiles(); x++ )
                                {
                                    var media_file = media_files.getMediaFile( x );

                                    if ( !highest_bitrate_media_file ||
                                    ( highest_bitrate_media_file && media_file.getBitrate() > highest_bitrate_media_file.getBitrate() ) )
                                    {
                                        highest_bitrate_media_file = media_file;
                                    }
                                }
                            }

                            if ( isValid( highest_bitrate_media_file ) === true )
                            {
                                m_video_url = highest_bitrate_media_file.getUrl();
                                m_apiFramework = highest_bitrate_media_file.getApiFramework(); // INNOVID INTEGRATION
                                if( m_apiFramework === "INNOVID" || m_apiFramework === "innovid" )
                                {
                                    Logger.log("VastParser.process() - INNOVID URL: " + m_video_url );
                                    var request = new InteractiveAdModel( m_video_url, onInnovidComplete );
                                    request.startRequest();
                                    isInnovid = true;
                                }
                            }
                            else Logger.critical("VastParser.process() - highest_bitrate_media_file is invalid");
                        }
            
                        // video duration
                        if ( linear.getDuration() )
                        {
                            var str = linear.getDuration().split(':');
                            if ( str.length === 3 )
                            {
                                m_duration = str[2];
                            }
                        }
                        else Logger.warn("VastParser.process() - duration is not available");
                    }
                    else Logger.warn("VastParser.process() - linear is not valid");
                }
            } // if creatives

            if ( is_wrapper === true ){
                Logger.shout("I FOUND A WRAPPER")
                processVastUrl( vastObj, recursive_counter + 1 );

            }
        }

        if ( recursive_counter === 0 )
        {
            if( isInnovid === false )
                ADHeaderObj.notifyAdParserDone( This );
        }
    }
    
    // INNOVID INTEGRATION
    function onInnovidComplete( innovidConfigObj )
    {
        if( innovidConfigObj )
        {
            m_innovidData = innovidConfigObj;
            ADHeaderObj.notifyInnovidAdParserDone( This );
        }
        else
        {
            ADHeaderObj.notifyAdParserError();
        }
    }
    
    /**
     * create the tracking event objects
     * @param {Linear} linear
     * @returns {Array}
     */
    function processTrackingURLObjs( linear )
    {
        var tracking_url_objs = [];
        
        var trackingEvents = linear.getTrackingEvents();
        Logger.log( trackingEvents.Tracking.length + ' TRACKING EVENTS FOUND' );
    
        for( var x = 0; x < trackingEvents.Tracking.length; x++ )
        {
            var tracking_event = trackingEvents.Tracking[ x ];
        
            var event = getTextFromNode( tracking_event.attributes[ 'event' ] );
            var url = getTextFromNode( tracking_event );
        
            var eventType = null;
            Logger.log( "ADDING VAST TRACKING | event: " + event + ", url: " + url);
            
            switch( event )
            {
                case "start":
                    eventType = VastTrackingUrl.EVENT.START;
                    break;
                case 'firstQuartile':
                    eventType = VastTrackingUrl.EVENT.FIRSTQUARTILE;
                    break;
                case 'midPoint': // these seem to differ
                    eventType = VastTrackingUrl.EVENT.MIDPOINT;
                    break;
                case 'midpoint': // these seem to differ
                    eventType = VastTrackingUrl.EVENT.MIDPOINT;
                    break;
                case 'thirdQuartile':
                    eventType = VastTrackingUrl.EVENT.THIRDQUARTILE;
                    break;
                case 'complete':
                    eventType = VastTrackingUrl.EVENT.COMPLETE;
                    break;
                default:
                    Logger.log("VastParser.processTrackingURLObjs() - unhandled event type");
                    break;
            }
        
            if( isValid( eventType ) === true )
                tracking_url_objs.push( new VastTrackingUrl( url, eventType ) );
            else Logger.log("VastParser.processTrackingURLObjs() - event: " + event + " UNHANDLED");
        }
        
        return tracking_url_objs;
    }
};

var VastTrackingUrl = function( url, VastTrackingUrl_EVENT )
{
    this.url = url;
    this.getUrl = function() { return url; };
    this.getEvent = function() {return VastTrackingUrl_EVENT; };
};

VastTrackingUrl.EVENT = 
{
    START: 0,
    FIRSTQUARTILE: 1,
    MIDPOINT: 2,
    THIRDQUARTILE: 3,
    COMPLETE: 4,
    FREEWHEEL_GENERIC: 5
};
