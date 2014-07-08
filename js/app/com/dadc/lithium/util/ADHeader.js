/**
 * ADHeader.js
 */

ADManager.AdHeader = function( adHeaderNode )
{
    var This = this;

    var m_is_resolving      = false;
    var m_is_resolved       = false;
    var m_is_vast           = false;
    var m_ad_id             = adHeaderNode.getAdId();
    var m_listeners         = [];
    var m_duration          = null;
    var m_video_url         = null;
    var m_creative_list     = adHeaderNode.getCreativeList();

    var m_impression_urls   = [];
    var m_tracking_url_objs = [];

    var m_isInnovid = false;
    
    /** determine if this adHeader is innovid */
    this.isInnovid = function() { return m_isInnovid; };

    var m_parser;

    var m_dimensions = {};
        m_dimensions.width = null;
        m_dimensions.height = null;

    // INNOVID INTEGRATION:
    /** get the innovid model object */
    this.getInnovidData = function(){ return m_parser.getInnovidData(); };

    var m_selectedInnovidVideoSourceConfig = null;
    /** get the video source model object */
    this.getInnovidVideoSourceConfig = function() { return m_selectedInnovidVideoSourceConfig; };

    /** get the id of this ad */
    this.getAdID = function(){return m_ad_id;};

    /** get the list of impressions */
    this.getImpressionUrls = function(){return m_impression_urls;};

    /** get tracking url event objects */
    this.getTrackingUrlObjs = function(){return m_tracking_url_objs;};

    /** get the dimensions of the header */
    this.getDimensions = function(){ return m_dimensions; };

    /**
     * get the video url using the argued ID values
     * @param {number} creative_id
     * @param {number} rendition_id
     */
    this.getVideoUrl = function( creative_id, rendition_id )
    {
        Logger.log("ADHeader.getVideoUrl(" + creative_id + ", " + rendition_id + ")");
    
        // do we already have the url?
        if( isValid( m_video_url ) === true ) 
            return m_video_url;
    
        // validate our arguments
        if( isValid( creative_id ) === false && isValid( rendition_id ) === false )
        {
            Logger.log("ADHeader.getVideoUrl(" + creative_id + ", " + rendition_id + ") | unable to continue");
            return null;
        }

        return getUrlFromRenditionID( creative_id, rendition_id );
    };
    
    /**
     * Search the AdReference list for a matching creative/rendition ID, once found return
     * the video URL from the "asset" element
     * @param {Number} creativeID
     * @param {Number} renditionID
     * @returns {String} url
     */
    function getUrlFromRenditionID( creativeID, renditionID )
    {
        Logger.log("ADHeader.getUrlFromRenditionID(" + creativeID + ", " + renditionID + ")");
        
        if( m_creative_list === null )
        {
            Logger.warn("AdHeader.getUrlfromRenditionID() - m_creative_list is null");
            return null;
        }
        if( isValid( creativeID ) === false || isValid( renditionID ) === false )
        {
            Logger.warn("AdHeader.getUrlfromRenditionID() - invalid arguments");
            return null;
        }
    
        var url = null;
        for( var i = 0; i < m_creative_list.getTotalCreatives(); i++ )
        {
            var creative = m_creative_list.getCreative( i );
            if( isValid( creative ) === true )
            {
                var rendition = getHighestPreferenceCreativeRendition( creative );
                if( isValid( rendition ) === true )
                {
                    var preference = parseInt( rendition.getPreference(), 10 );
                    if( preference > 0 )
                    {
                        var asset = rendition.getAsset();
                        if( isValid( asset ) === true )
                        {
                            url = asset.getUrl();
                        }
                        else Logger.warn("preference>0 - invalid asset");
                    }
                    else
                    {
                        var renditionList = creative.getCreativeRenditionList();
                        if( isValid( renditionList ) === true )
                        {
                            var found = false;
                            for( var rendIndex = 0; rendIndex < renditionList.getTotalCreativeRenditions(); rendIndex++ )
                            {
                                rendition = renditionList.getCreativeRendition( rendIndex );
                                if( isValid( rendition ) === true )
                                {
                                    if( rendition.getCreativeRenditionId() === renditionID )
                                    {
                                        asset = rendition.getAsset();
                                        if( isValid( asset ) === true )
                                        {
                                            Logger.log("Found Asset object: ");
                                            Logger.logObj( asset );
                                            asset.debugLog();
                                            url = asset.getUrl();
                                            found = true;
                                            break;
                                        }
                                        else Logger.log("ADHeader.getVideoUrl() - unable to get asset from rendition");
                                    }
                                }
                                else Logger.log("ADHeader.getVideoUrl() - rendition iteration:" + rendIndex + " unable to get creative rendition");
                            }
                            if( found === false )
                            {
                                Logger.warn("could not match renditionID");
                            }
                        }
                        else Logger.warn("ADHeader.getVideoUrl(" + creativeID + ", " + renditionID + ") | iteration: " + i + " renditionList is invalid");
                    }
                }
                else Logger.warn("ADHeader.getVideoUrl(" + creativeID + ", " + renditionID + ") | iteration: " + i + " has an invalid rendition");
            }
            else Logger.warn("ADHeader.getVideoUrl(" + creativeID + ", " + renditionID + ") | iteration: " + i + " has an invalid creative");
        }
    
        Logger.log("AdHeader.getUrlFromRenditionID() - URL output: " + url);
        
        return url;
    }

    /**
     * get the duration of this adHeader
     * @param {number} creative_id
     */
    this.getDuration = function( creative_id )
    {
        //console.log("ADHeader.getDuration() " + creative_id)
        // do we already have it?
        if( m_duration ) {
            //console.log("ADHeader.getDuration() " + m_duration)
            return m_duration;
        }
    
        // is our argument valid?
        if( isValid( creative_id ) === false )
        {
            Logger.log("ADHeader.getDuration() - argument found invalid");
            return null;
        }

        // no? alrighty then, lets find it!
        var duration = null;
        for( var i = 0; i < m_creative_list.getTotalCreatives(); i++ )
        {
            var creative = m_creative_list.getCreative( i );
            if( isValid( creative ) === true )
            {
                if( creative.getCreativeId() === creative_id )
                {
                    duration = creative.getDuration();
                }
            }
            else Logger.log("ADHeader.getDuration() - iteration: " + i + " creative found invalid");
        }

        //duration !== null ? Logger.log("ADHeader.getDuration() duration: " + duration) : Logger.log("ADHeader.getDuration() duration: NULL");
        return duration;
    };

    /** determine if this adHeader is ready or not */
    this.isReady = function()
    {
        Logger.log( 'ADHeader.isready() | id: ' + m_ad_id + ", isResolved: " + m_is_resolved );
        return m_is_resolved;
    };

    /** determine if this header is a vast ad or not */
    this.isVast = function() { return m_is_vast; };

    /** determine if this header currently resolving async */
    this.isResolvingRequired = function(){ return m_is_vast; };

    /**
     * add a new listener for when this header is resolved
     * @param {object} listener
     */
    this.addOnResolvedListener = function( listener )
    {
        Logger.log( 'ADHeader.addOnResolvedListener()' );
        if( typeof listener !== "undefined" ) 
            m_listeners.push( listener );
        else Logger.log("ADHeader.addOnResolvedListner(" + typeof listener + " invalid arg");
    };

    /**
     * remove the argued listner from the onResolved callback list
     * @param {object} listener
     */
    this.removeResolvedListener = function( listener )
    {
        while( m_listeners.indexOf( listener ) >= 0 )
        {
            m_listeners.splice( m_listeners.indexOf( listener ), 1 );
        }
    };

    /**
     * no clue here...
     */
    this.clearResolvedStatus = function()
    {
        m_is_resolved = false;
        m_video_url = null;
        m_impression_urls = [];
        m_tracking_url_objs = [];
        m_is_resolving = false;
    };

    /** let this ad header resolve */
    this.doResolve = function()
    {
        Logger.log( 'ADHeader.doResolve()' );
        if ( m_is_resolving === false )
        {
            m_is_resolving = true;

            // INNOVID INTEGRATION
            if( This.isResolvingRequired() === true )
            {
                if( isValid( m_parser ) === true )
                {
                    m_parser.startParser();
                }
                else Logger.log("ADHeader.doResolve() - m_parser found invalid");
            }
            else
            {
                Logger.log("ADHeader.doResolve() - resolving is not required");
            }
        }
    };


    // =========================================================================
    //          VAST PARSER "CALLBACKS"
    // =========================================================================
    
    /**
     * notify anyone who's listening that this failed to resolve
     */
    this.notifyAdParserError = function()
    {
        Logger.log( "AdHeader.notifyAdParserError() - " + m_ad_id );
        m_is_resolved = true;
        m_is_resolving = false;
        notifyListeners();
    };

    /**
     * notification this parser has completed
     * @param {object} parserObj
     */
    this.notifyAdParserDone = function( parserObj )
    {
        Logger.log("AdHeader.notifyAdParserDone()");
        m_is_resolved = true;
        m_is_resolving = false;
    
        if( isValid( parserObj ) === false )
        {
            Logger.log("ADManager.notifyAdParserDone(" + typeof parserObj + ") invalid arg");
            return;
        }

        m_video_url = parserObj.getVideoUrl();
        m_impression_urls = [];
        m_impression_urls = parserObj.getImpressionUrls();
        m_tracking_url_objs = [];
        m_tracking_url_objs = parserObj.getTrackingUrlObjs();

        var total = [];
        for( var i = 0; i < m_impression_urls.length; i++ )
            total.push( m_impression_urls[i] );
        for( var i = 0; i < m_tracking_url_objs.length; i++ )
            total.push( m_tracking_url_objs[i].getUrl() );
        
        if( typeof ImpressionTracker !== "undefined" )
            ImpressionTracker.receiveVastTracking( total );
    
        Logger.log("ADManager.notifyAdParserDone() =");
        Logger.log("  url = " + m_video_url);
        Logger.log("  impression urls = ");
        Logger.logObj( m_impression_urls );
        Logger.log("  tracking events = ");
        Logger.logObj( m_tracking_url_objs );

        // If vast ad has duration, use it instead of Freewheel's
        if( isValid( parserObj.getDuration() ) === true )
        {
            m_duration = parserObj.getDuration();
        }

        notifyListeners();
    };

    // INNOVID INTEGRATION
    this.notifyInnovidAdParserDone = function( parserObj )
    {
        Logger.log("AdManager.AdHeader.notifyInnovidAdParserDone()");
        m_is_resolved = true;
        m_is_resolving = false;
        m_isInnovid = true;

        m_selectedInnovidVideoSourceConfig = getInnovidVideoConfig( parserObj.getInnovidData() );
        m_impression_urls = [];
        m_impression_urls = parserObj.getImpressionUrls();
        m_tracking_url_objs = [];
        m_tracking_url_objs = parserObj.getTrackingUrlObjs();

        var total = [];
        for( var i = 0; i < m_impression_urls.length; i++ )
            total.push( m_impression_urls[i] );
        for( var i = 0; i < m_tracking_url_objs.length; i++ )
            total.push( m_tracking_url_objs[i].getUrl() );
        
        if( typeof ImpressionTracker !== "undefined" )
            ImpressionTracker.receiveVastTracking( total );

        if( m_selectedInnovidVideoSourceConfig )
        {
            m_video_url = m_selectedInnovidVideoSourceConfig.getUrl();
        }
        else
        {
            Logger.log("AdManager.AdHeader.notifyInnovidAdParserDone() - error getting innovidVideoConfigObject");
        }

        Logger.log("ADManager.notifyInnovidAdParserDone() =");
        Logger.log(" url = " + m_video_url);
        Logger.log(" impression urls = ");
        Logger.logObj( m_impression_urls );
        Logger.log(" tracking events = ");
        Logger.logObj( m_tracking_url_objs );

        notifyListeners();
    };

    // decide the innovid video configuration here
    function getInnovidVideoConfig( innovidConfigObject )
    {
        var sources = innovidConfigObject.getAdVideo().getSources();
        m_duration = innovidConfigObject.getAdVideo().getDuration();
    
        for( var i = 0; i < sources.length; i++ )
        {
            if( sources[ i ].getProfile() === "mp4-480" )
            {
                return sources[i];
            }
        }
        return null;
    };


    // =========================================================================
    //              TRACKING EVENTS
    // =========================================================================
    
    /** Fire all impression urls */
    this.postImpressionUrls = function()
    {
        Logger.shout("ADHeader.postImpressionUrls() - output has " + m_impression_urls.length + " impressions to fire - if this is 0, its possibly a direct ad");
        if( m_impression_urls.length !== 0 )
            Logger.logObj( m_impression_urls );
        
        for( var i = 0; i < m_impression_urls.length; i++ )
            ADUrlManagerInstance.fireUrl( m_impression_urls[i] );
    };
    
    /** fire all events indicating the video has started */
    this.postPlayUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_tracking_url_objs.length; i++ )
        {
            if ( m_tracking_url_objs[ i ].getEvent() === VastTrackingUrl.EVENT.START )
            {
                output.push( m_tracking_url_objs[ i ].getUrl() );
            }
        }
    
        Logger.shout("ADHeader.postPlayURLS() - " + output.length + " play/start events to fire out of " + m_tracking_url_objs.length + " total");
        
        for( var i = 0; i < output.length; i++ )
            ADUrlManagerInstance.fireUrl( output[i] );
    };
    
    /** fire all first quarter urls */
    this.postFirstQuartileTrackingUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_tracking_url_objs.length; i++ )
        {
            var tracking_url_obj = m_tracking_url_objs[ i ];
            if ( tracking_url_obj.getEvent() === VastTrackingUrl.EVENT.FIRSTQUARTILE )
            {
                output.push( tracking_url_obj.getUrl() );
            }
        }
    
        Logger.shout("ADHeader.postFirstQuartileTrackingUrls() - output has " + output.length + " tracking events out of " + m_tracking_url_objs.length + " total");
        
        for( var i = 0; i < output.length; i++ )
            ADUrlManagerInstance.fireUrl( output[i] );
    };

    /** fire all mid-point urls */
    this.postMidPointTrackingUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_tracking_url_objs.length; i++ )
        {
            var tracking_url_obj = m_tracking_url_objs[ i ];
            if ( tracking_url_obj.getEvent() === VastTrackingUrl.EVENT.MIDPOINT )
            {
                output.push( tracking_url_obj.getUrl() );
            }
        }
    
        Logger.shout("ADHeader.postMidPointTrackingUrls() - output has " + output.length + " tracking events out of " + m_tracking_url_objs.length + " total");
        
        for( var i = 0; i < output.length; i++ )
            ADUrlManagerInstance.fireUrl( output[i] );
    };

    /** fire all third quarter urls */
    this.postThirdQuartileTrackingUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_tracking_url_objs.length; i++ )
        {
            var tracking_url_obj = m_tracking_url_objs[ i ];
            if ( tracking_url_obj.getEvent() === VastTrackingUrl.EVENT.THIRDQUARTILE )
            {
                output.push( tracking_url_obj.getUrl() );
            }
        }
    
        Logger.shout("ADHeader.postThirdQuartileTrackingUrls() - output has " + output.length + " tracking events out of " + m_tracking_url_objs.length + " total");
        
        for( var i = 0; i < output.length; i++ )
            ADUrlManagerInstance.fireUrl( output[i] );
    };

    /** fire all completion urls */
    this.postCompleteTrackingUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_tracking_url_objs.length; i++ )
        {
            var tracking_url_obj = m_tracking_url_objs[ i ];
            if ( tracking_url_obj.getEvent() === VastTrackingUrl.EVENT.COMPLETE )
            {
                output.push( tracking_url_obj.getUrl() );
            }
        }
        
        Logger.shout("ADHeader.postCompleteTrackingUrls() - output has " + output.length + " tracking events out of " + m_tracking_url_objs.length + " total");
        
        for( var i = 0; i < output.length; i++ )
            ADUrlManagerInstance.fireUrl( output[i] );
    };
    
    // =========================================================================
    //              PRIVATE API
    // =========================================================================

    function notifyListeners()
    {
        for( var i = 0; i < m_listeners.length; i++ ){
            m_listeners[ i ].notifyAdResolved( This );
        }
    }

    /** automated process call */
    function processAdHeaderNode()
    {
        if( isValid( adHeaderNode ) === false )
        {
            Logger.log("ADHeader.processAdHeaderNode() - adHeaderNode found invalid");
            return;
        }
        if( typeof adHeaderNode.getCreativeList !== "function" )
        {
            Logger.log("ADHeader.processAdHeaderNode() - adHeaderNode.getCreativeList() is not a function");
            return;
        }
        var creativeList = adHeaderNode.getCreativeList();
        if( typeof creativeList.getTotalCreatives !== "function" )
        {
            Logger.log("ADHeader.processAdHeaderNode() - creativeList.getTotalCreatives() is not a function");
            return;
        }
    
        var total_creatives = creativeList.getTotalCreatives();

        Logger.log( 'AdManager.processAdHeaderNode() total creatives: ' + total_creatives );

        // MILAN: PART 1 OF "MULTIPLE CREATIVES BUG" FIX:
        // WE ARE HANDLING JUST VAST AD CASE OTHERWISE ADS WILL BERESOLVED ON AD PLAY BECAUSE AT THIS POINT
        // WE DO NOT KNOW VIDEO URL BECAUSE IT SHOULD BE DIFFERENT FOR DIFFERENT TEMPORAL SLOTS
        if( total_creatives === 1 )
        {
            var creative = adHeaderNode.getCreativeList().getCreative( 0 );
            m_duration = creative.getDuration();

            var creativeRendition = getHighestPreferenceCreativeRendition( creative );
        
            if( isValid( creativeRendition ) === true )
            {
                creativeRendition.debugLog();
        
                // Do we have a Vast wrapper?
                var wrapperType = creativeRendition.getWrapperType();
                var validator = FreeWheelModel.CreativeRendition.WRAPPER.VAST_TYPE;
                Logger.log("AdHeader.processAdHeaderNode() - validation =  " + wrapperType + " / " + validator);
        
                if ( creativeRendition.getWrapperType() == FreeWheelModel.CreativeRendition.WRAPPER.VAST_TYPE )
                {
                    m_is_vast = true;
                    m_parser = new VastParser( This, creativeRendition.getWrapperUrl() );
                }
                else
                {
                    Logger.log("AdManager.processAdHeaderNode() - wrapper type is not vast");
                    m_is_vast = false;
                }
            }
            else
            {
                Logger.warn("AdManager.processAdHeaderNode() no creative rendition!");
            }
        }
        else
        {
            Logger.warn("AdHeader.processAdHeaderNode() - multiple creatives found");
            // note: I'm not sure what the total_creatives === 1 is for
        }
    }

    /**
     * get the creative with the highest rendition
     * @param {object} creativeObj blah blah, sick of commenting other ppl's code.
     */
    function getHighestPreferenceCreativeRendition( creativeObj )
    {
        // is the argument valid?
        if( isValid( creativeObj ) === false )
        {
            Logger.log("ADHeader.getHighestPreferenceCreativeRendition(" + typeof creativeObj + ") invalid arg");
            return null;
        }
    
        // does it have the required API?
        if( typeof creativeObj.getCreativeRenditionList !== "function" )
        {
            Logger.log("ADHeader.getHighestPreferenceCreativeRendition() - creativeObj.getCreativeRenditionList not a function");
            return null;
        }
    
        var rendList = creativeObj.getCreativeRenditionList();
        
        // is the rendition list valid?
        if( isValid( rendList ) === false )
        {
            Logger.log("ADHeader.getHighestPreferenceCreativeRendition() - renditionList is not valid");
            return null;
        }
    
        // does it have our API?
        if( typeof rendList.getTotalCreativeRenditions !== "function" )
        {
            Logger.log("ADHeader.getHighestPreferenceCreativeRendtion() - rendList.getTotalCreativeRenditions() is not a function");
            return null;
        }
    
        var highest_preference = -999999;
        var highest_creative_rendition = null;

        for( var i = 0; i < rendList.getTotalCreativeRenditions(); i++ )
        {
            var creativeRendition = rendList.getCreativeRendition( i );
        
            if( isValid( creativeRendition ) === false )
            {
                Logger.log("ADHeader.getHighestPreferenceCreativeRendition() - iteration: " + i + " creativeRendition not valid");
                continue;
            }
        
            if( creativeRendition.getPreference() > highest_preference )
            {
                highest_creative_rendition = creativeRendition;
                highest_preference = creativeRendition.getPreference();
            }
        }
    
    if( highest_creative_rendition )
        Logger.log("AdHeader.getHighestPreferenceCreativeRendition() - FOUND");
    else Logger.log("AdHeader.getHighestPreferenceCreativeRendition() - NOT FOUND");
    
    Logger.logObj( highest_creative_rendition );
    
        return highest_creative_rendition;
    }

    processAdHeaderNode();
};