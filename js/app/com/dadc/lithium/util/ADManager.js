/**
 * ADManager.js
 * @author unknown
 * I understand why.
 */

include( "js/app/com/dadc/lithium/model/FreeWheel_SmartXML.js" );
include( "js/app/com/dadc/lithium/model/Vast.js" );
include( "js/app/com/dadc/lithium/util/ADUrlManager.js" );
include( "js/app/com/dadc/lithium/util/VastParser.js" );

// DAN: SlotImpresionTracker will prevent slot impressions from firing more than once.
// After reviewing/stepping through the code, unfortunately this is the easiest way to do it.
include( "js/app/com/dadc/lithium/util/SlotImpressionTracker.js" );

/**
 * AD MANAGER
 * @param mediaDetailsObj {MediaDetails}
 * @param crackleVideoObj {CrackleVideo}
 */
var ADManager = function( mediaDetailsObj, crackleVideoObj )
{
    var m_ad_headers = [];
    var m_temporal_ad_slots = [];
    var This = this;

    /** 
     * Begin a new FreeWheel_SmartXMLRequest 
     * @param {FreewheelMediaType} freewheelMediaType
     */
    this.prepare = function( freewheelMediaType )
    {
        var freewheel_request = new FreeWheelModel.FreeWheel_SmartXMLRequest( mediaDetailsObj.getID(), onFreewheelResponded, freewheelMediaType );
        freewheel_request.startRequest();
    };

    /** does this adManager have a preroll? */
    this.hasPreroll = function()
    {
        return (getPrerollTemporalAdSlot() !== null);
    };
    
    /** is the preroll ready to play? */
    this.isPrerollReady = function()
    {
        var preroll_slots = getPrerollTemporalAdSlot();

        for (var i in preroll_slots ){
            if( ! preroll_slots.isPrepared() ){
                return false;
            }
        }

        return true;
    };

    /** 
     * callback when the request completes 
     * @param {object} freewheelObj
     * @param {number} status
     */
    function onFreewheelResponded( freewheelObj, status )
    {
    Logger.log("ADManager.onFreewheelResponded() - status: " + typeof status + "/" + status );
        try
        {
            var adList = freewheelObj.getAdList();

            if( isValid( adList ) === false )
            {
                Logger.log("ADManager.onFreewheelResponded() - adList not valid")
                crackleVideoObj.notifyAdManagerUpdated( ADManager.EVENT.NOADS );

                return;
            }
            else{

                var totalAds = adList.getTotalAds();
                Logger.log( 'ADManager.onFreewheelResponded() | totalAds: ' + totalAds );

                // Create the ad Header objects
                for( var i = 0; i < totalAds; i++ )
                {
                    var header = new ADManager.AdHeader( freewheelObj.getAdList().getAd( i ), This);
                    Logger.log("ADManager.onFreewheelResponded() | iteration: " + i + ", id: " + header.getAdID() );
                    m_ad_headers.push( header );
                }
            }

            // Create the temporal Ad Slots
            var temporalAdSlotList = getTemporalAdSlotList( freewheelObj );
            Logger.log( 'ADManager.onFreewheelResponded() | total temporal ad slots: ' + temporalAdSlotList.getTotalTemporalAdSlots() );

            if( isValid( temporalAdSlotList ) === true )
            {   
                for( i = 0; i < temporalAdSlotList.getTotalTemporalAdSlots(); i++ )
                {
                    var temporalType = temporalAdSlotList.getTemporalAdSlot(i).getTimePositionClass();
                    // because this derelict of a system doesn't know what to do with anything besides these 3, 
                    // only push the temporal node types the system can handle.
                    if( temporalType === "midroll" || temporalType === "preroll" || temporalType === "postroll" )
                        m_temporal_ad_slots.push( new ADManager.TemporalAdSlot( temporalAdSlotList.getTemporalAdSlot( i ), This ) );
                    else Logger.log("ADManager.onFreewheelResponded() - unhandled temporal ad slot of type: " + temporalType);
                }
            }
            else Logger.log("ADManager.onFreewheelResponded() - unable to get temporalAdSlotList");

            // Store the VideoView analytic
            var videoView = getVideoView( freewheelObj );
            if( videoView !== null )
            {
                m_videoViewUrl = videoView.getUrl() + "&init=1";
            }
            else Logger.log("ADManager.onFreewheelResponded() - unable to find videoView url callback");

            // tell crackle video we're ready
            crackleVideoObj.notifyAdManagerUpdated( ADManager.EVENT.FREEWHEEL_READY );
        }
        catch( e )
        {
            Logger.log("ADManager.onFreewheelResponded() - EXCEPTION RAISED");
            Logger.logObj( e );
            if( isValid( crackleVideoObj ) === true )
            {
                crackleVideoObj.notifyAdManagerUpdated( ADManager.EVENT.FREEWHEEL_ERROR );
            }
        }
    }
    
    /**
     * SAFELY get the ad slot list
     * @param {FreeWheelModel.AdResponse} freewheel
     * @returns {Array}
     */
    function getTemporalAdSlotList( freewheel )
    {
    if( typeof freewheel !== "undefined" )
    {
        if( typeof freewheel.getSiteSection === "function" )
        {
        var siteSection = freewheel.getSiteSection();
        if( isValid( siteSection ) === true )
        {
            if( typeof siteSection.getVideoPlayer === "function" )
            {
            var videoPlayer = siteSection.getVideoPlayer();
            if( isValid( videoPlayer ) === true )
            {
                if( typeof videoPlayer.getVideoAsset === "function" )
                {
                var videoAsset = videoPlayer.getVideoAsset();
                if( isValid( videoAsset ) === true )
                {
                    if( typeof videoAsset.getAdSlots === "function" )
                    {
                    var adSlots = videoAsset.getAdSlots();
                    if( isValid( adSlots ) === true )
                    {
                        if( typeof adSlots.getTemporalAdSlotList === "function" )
                        {
                        var temporalSlots = adSlots.getTemporalAdSlotList();
                        if( isValid( temporalSlots ) === true )
                            return temporalSlots;
                        else return null;
                        }
                        else Logger.log("ADManager.getTemporalAdSlotList() - adSlots.getTemporalAdSlotList() is not a function");
                    }
                    else Logger.log("ADManager.getTemporalAdSlotList() - adSlots found invalid");
                    }
                    else Logger.log("ADManager.getTemporalAdSlotList() - videoAsset.getAdSlots() is not a function");
                }
                else Logger.log("ADManager.getTemporalAdSlotList() - videoASset found invalid");
                }
                else Logger.log("ADManager.getTemporalAdSlotList() - videoPlayer.getVideoAsset() is not a function");
            }
            else Logger.log("ADManager.getTemporalAdSlotList() - videoPlayer found invalid");
            }
            else Logger.log("ADManager.getTemporalAdSlotList() - siteSection.getVideoPlayer() is not a function");
        }
        else Logger.log("ADManager.getTemporalAdSlotList() - siteSection found invalid");
        }
        else Logger.log("ADManager.getTemporalAdSlotList() - getSiteSection() is not a function");
    }
    }
    
    /** 
     * SAFELY get the videoView analytic call
     * @param {FreeWheelModel.AdResponse} freewheel
     * @returns {string} url or null
     */
    function getVideoView( freewheel )
    {
    if( typeof freewheel !== "undefined" )
    {
        if( typeof freewheel.getSiteSection === "function" )
        {
        var siteSection = freewheel.getSiteSection();
        if( isValid( siteSection ) === true )
        {
            if( typeof siteSection.getVideoPlayer === "function" )
            {
            var videoPlayer = siteSection.getVideoPlayer();
            if( isValid( videoPlayer ) === true )
            {
                if( typeof videoPlayer.getVideoAsset === "function" )
                {
                var videoAsset = videoPlayer.getVideoAsset();
                if( isValid( videoAsset ) === true )
                {
                    if( typeof videoAsset.getEventCallbackList === "function" )
                    {
                    var callbackList = videoAsset.getEventCallbackList();
                    if( isValid( callbackList ) === true )
                    {
                        if( typeof callbackList.getEventCallbackByName === "function" )
                        {
                        var event = callbackList.getEventCallbackByName("videoView");
                        if( typeof event !== "undefined" || event !== null )
                            return event;
                        else return null;
                        }
                        else Logger.log("ADManager.getVideoView() - eventCallbackList.getEventCallbackByName() is not a function");
                    }
                    else Logger.log("ADManager.getVideoView() - eventCallbackList is invalid");
                    }
                    else Logger.log("ADManager.getVideoView() - videoASset.getEventCallbackList() is not a function");
                }
                else Logger.log("ADManager.getVideoView() - videoASset found invalid");
                }
                else Logger.log("ADManager.getVideoView() - videoPlayer.getVideoAsset() is not a function");
            }
            else Logger.log("ADManager.getVideoView() - videoPlayer found invalid");
            }
            else Logger.log("ADManager.getVideoView() - siteSection.getVideoPlayer() is not a function");
        }
        else Logger.log("ADManager.getVideoView() - siteSection found invalid");
        }
        else Logger.log("ADManager.getVideoView() - getSiteSection() is not a function");
    }
    else Logger.log("ADManager.getVideoView(" + typeof freewheel + ") invalid arrrrg");
    }

    this.notifyTemporalAdSlotPrepared = function( temporalAdSlotObj )
    {
        Logger.log( 'ADManager:notifyTemporalAdSlotPrepared' );
        if ( temporalAdSlotObj.isPreroll() ){
            crackleVideoObj.notifyAdManagerUpdated( ADManager.EVENT.PREROLL_SLOT_READY );
        }else{
            crackleVideoObj.notifyAdManagerUpdated( ADManager.EVENT.AD_SLOT_READY );
        }
    };

    /**
     * get the ad header object by the argued parameters
     * @param {number} ad_id
     * @param {number} creative_id
     * @param {number} creative_rendition_id
     * @returns {AdHeader}
     */
    this.getAdHeaderById = function( ad_id, creative_id, creative_rendition_id )
    {
        Logger.log("ADManager.getAdHeaderById(ad_id:" + ad_id + ", creative_id:" + creative_id + ", creative_rendition_id:" + creative_rendition_id + ")");
        for( var i = 0; i < m_ad_headers.length; i++ )
    {
        if( isValid( m_ad_headers[i] ) === true )
        {
        if( typeof m_ad_headers[i].getAdID === "function" )
        {
            if( m_ad_headers[ i ].getAdID() === ad_id )
            {
//          MILAN: PART 3 OF "MULTIPLE CREATIVES BUG" FIX
//          SETTING UP CREATIVE ID AND RENDITION ID FOR WANTED HEADER
//          Logger.log("SETTING CREATIVE ID TO " + creative_id);
//          m_ad_headers[ i ].setCreativeId(creative_id);
//          Logger.log("SETTING CREATIVE RENDITION ID TO " + creative_rendition_id);
//              m_ad_headers[ i ].setCreativeRenditionId(creative_rendition_id);
            return m_ad_headers[ i ];
            }
        }
        else Logger.log("ADManager.getAdHeaderByID() - iteration: " + i + " getAdID() not a function");
        }
        else Logger.log("ADManager.getAdHeaderByID() - iteration: " + i + " found invalid");
        }
        return null;
    };

    /** 
     * get an ad slot by index
     * @param {number} index
     * @returns {TemporalAdSlot}
     */
    this.getTemporaAdSlot = function( index )
    { 
    if( typeof index === "number" )
    {
        if( isValid( m_temporal_ad_slots[ index ] ) === true )
        return m_temporal_ad_slots[ index ];
        else Logger.log("ADManager.getTemporalAdSlot(" + index + ") invalid index or object at index");
    }
    else Logger.log("ADManager.getTemporalAdSlot(" + typeof index + ") invalid argument");
    return null;
    };
    
    /** determine how many temporal ad slots are in the list */
    this.getTotalTemporaAdSlots = function() { return m_temporal_ad_slots.length;  };
    
    /** determine how many ad headers have been created */
    this.getTotalAds = function() { return m_ad_headers.length; };
    
    /** get the first ad slot which has 0 as a time */
    function getPrerollTemporalAdSlot()
    {
        Logger.log( 'ADManager.getPrerollTemporalAdSlot()' );
        if(m_temporal_ad_slots && m_temporal_ad_slots.length){
            for( var i = 0; i < m_temporal_ad_slots.length; i++ ){
                var slot = m_temporal_ad_slots[ i ];
                if( typeof slot.isPreroll === "function" ){
                    if( slot.isPreroll() === true ){
                        return slot;
                    }
                }
            }
        }
        else {
            Logger.log("ADManager.getPrerollTemporalAdSlot() - slot found without isPreroll() API");
        }
            
    
        Logger.log("ADManager.getPrerollTemporalAdSlot() - unable to find ad slot, returning null");
        return null;
    }

    /** get a list of all mid-roll or post-roll ads */
    function getNonPrerollAds()
    {
        var ads = [];

        for( var i = 0; i < m_temporal_ad_slots.length; i++ )
    {
        if( isValid( m_temporal_ad_slots[i] ) === true )
        {
        if( typeof m_temporal_ad_slots[ i ].getTimePosition === "function" )
        {
            if ( m_temporal_ad_slots[ i ].getTimePosition() !== 0 )
            {
            ads.push( m_temporal_ad_slots[ i ] );
            }
        }
        else Logger.log("ADManager.getNonPrerollAds() - object at iteration: " + i + " has invalid API");
        }
        else Logger.log("ADManager.getNonPrerollAds() - object at iteration: " + i + " found invalid");
    }

        Logger.log( 'ADManager.getNonPrerollAds() - num of non_preroll ads = ' + ads.length );
        return ads;
    }

    //
    // DAN & MILAN EDIT:
    // send the new VideoView ping callback to freewheel
    // @remark this is sent only once when the video first starts to play
    //
    var m_videoViewUrl = null;
    this.sendVideoViewCallback = function()
    {
    if( this.sendVideoViewCallback.hasFired === false )
    {
        if( m_videoViewUrl )
        {
        Logger.log("ADManager.sendVideoViewCallback() - sending video view analytic url");
        ADUrlManagerInstance.fireUrl( m_videoViewUrl );
        this.sendVideoViewCallback.hasFired = true;
        }
    }
    };
    this.sendVideoViewCallback.hasFired = false;
};

// DAN: pulling objects into their own respective files
include( "js/app/com/dadc/lithium/util/ADTemporalAdSlot.js" );
include( "js/app/com/dadc/lithium/util/ADHeader.js" );

ADManager.EVENT = 
{
    FREEWHEEL_READY: 1,
    PREROLL_SLOT_READY: 2,
    AD_SLOT_READY: 3,
    FREEWHEEL_ERROR: 4,
    NOADS:5
};

ADUrlManagerInstance = new ADUrlManager();