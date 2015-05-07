
/**
 * This analytic helper will fire all events that come from the FREEWHEEL config call
 * (the call that gives us temporal ad slots, adReferences, generic impressions, etc...)
 * Note: Vast events will not fire here.
 * @param {type} AdManager_TemporalAdSlotObj
 * @param {type} ADHeaderObj
 * @param {type} creativeID
 * @returns {FreewheelEventCallbackHelper}
 */
var FreewheelEventCallbackHelper = function( AdManager_TemporalAdSlotObj, ADHeaderObj )
{
    var m_adID = ADHeaderObj.getAdID();
    var m_allEventCallbacks = AdManager_TemporalAdSlotObj.getAllEventCallbacksByAdID( m_adID );
    
    Logger.log("FreewheelEventCallbackHelper - CTOR - number of all Events = " + m_allEventCallbacks.length);

    if( isValid( m_allEventCallbacks ) === true )
    {
        if( isArray( m_allEventCallbacks ) === true )
        {
            var total = [];
            for( var i = 0; i < m_allEventCallbacks.length; i++ )
                total.push( m_allEventCallbacks[i].getUrl() );
            if( typeof ImpressionTracker !== "undefined" )
                ImpressionTracker.receiveFreewheelTracking( total );
        }
        else Logger.warn("FreewheelEventCallbackHelper.CTOR() - allEventCallbacks is not an array");
    }
    else Logger.warn("FreewheelEventcallbackHelper.CTOR() - allEventCallbacks is not valid");
    
    /**
     * Fire all impressions for a temporal ad slot node
     */
    this.postSlotImpressionUrls = function()
    {
        var slotImpressionList = AdManager_TemporalAdSlotObj.getSlotImpression();
        
        if( isValid( slotImpressionList ) === true )
        {
            Logger.shout( "FreewheelEventCallbackHelper.postSlotImpressionURLS() - firing " + slotImpressionList.length + " urls");
            
            // DAN: SlotImpressionTracker will tell us if the given url has already fired or not;
            // if for whatever reason the tracker is undefined, its going to send the impressions anyways
            if( typeof SlotImpressionTracker !== "undefined" )
            {
                for( var i = 0; i < slotImpressionList.length; i++ )
                {
                    if( SlotImpressionTracker.hasFired( slotImpressionList[i].getUrl() ) === false )
                    {
                        ADUrlManagerInstance.fireUrl( slotImpressionList[i].getUrl() );
                        SlotImpressionTracker.addFiredSlotImpression( slotImpressionList[i].getUrl() );
                    }
                    else Logger.log("FreewheelEventCallbackHelper.postSlotImpressionUrls() - impression has already fired, skipping.");
                }
            }
            else
            {
                Logger.warn("FreewheelEventcallbackHelper.postSlotImpressionUrls() - SlotImpressionTracker is undefined, will fire impressions anyways as a fallback");
                for( var i = 0; i < slotImpressionList.length; i++ )
                {
                    ADUrlManagerInstance.fireUrl( slotImpressionList[i].getUrl() );
                }
            }
        }
        else Logger.warn("FreewheelEventCallbackHelper.postSlotImpressionURLS() - slotImpressionList invalid");
    };
    
    /**
     * Fire all generic Impression URLS
     */
    this.postImpressionUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_allEventCallbacks.length; i++ )
        {
            var evtCb = m_allEventCallbacks[i]
            if(  m_allEventCallbacks[i].getName() === "defaultImpression" ){

                output.push( m_allEventCallbacks[i].getUrl() );
                
                if(evtCb.data.trackingURLs && evtCb.data.trackingURLs.url){
                    if(evtCb.data.trackingURLs.url.length){
                        for(z=0;z<evtCb.data.trackingURLs.url.length;z++){
                            var newData = evtCb.data.trackingURLs.url[z]
                            output.push( newData.attributes.value );
                        }
                    }
                    else{
                        output.push( evtCb.data.trackingURLs.url.attributes.value );
                    }
                }
            }
        }
    
        Logger.shout("FreewheelEventCallbackHelper.postImpressionUrls() - Total impressions of generic or defaultImpression: " + output.length);
        if( output.length !== 0 ){
            Logger.logObj( output );
        }
    
        for( var i = 0; i < output.length; i++ )
        {
            ADUrlManagerInstance.fireUrl( output[i] );
        }
    };
    
    /** Fire all url tracking events labeled to "play" or "start" */
    this.postPlayUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_allEventCallbacks.length; i++ )
        {
            if( m_allEventCallbacks[i].getType() === "play" || m_allEventCallbacks[i].getName() === "start" ){
                output.push( m_allEventCallbacks[i].getUrl() );
                var evtCb = m_allEventCallbacks[i]
                if(evtCb.data.trackingURLs && evtCb.data.trackingURLs.url){
                    if(evtCb.data.trackingURLs.url.length){
                        for(z=0;z<evtCb.data.trackingURLs.url.length;z++){
                            var newData = evtCb.data.trackingURLs.url[z]
                            output.push( newData.attributes.value );
                        }
                    }
                    else{
                        output.push( evtCb.data.trackingURLs.url.attributes.value );
                    }
                }
            }
        }
    
        Logger.shout("FreewheelEventCallbackHelper.postPlayUrls() - " + output.length + " start/play events to fire out of " + m_allEventCallbacks.length);
        if( output.length !== 0 )
            Logger.logObj( output );
    
        for( var i = 0; i < output.length; i++ )
        {
            ADUrlManagerInstance.fireUrl( output[i] );
        }
    };
    
    /**
     * Fire all 25% quartile URLS
     */
    this.postFirstQuartileTrackingUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_allEventCallbacks.length; i++ )
        {
            if( m_allEventCallbacks[i].getName() === "firstQuartile" )
            {
                output.push( m_allEventCallbacks[i].getUrl() );
                var evtCb = m_allEventCallbacks[i]
                if(evtCb.data.trackingURLs && evtCb.data.trackingURLs.url){
                    if(evtCb.data.trackingURLs.url.length){
                        for(z=0;z<evtCb.data.trackingURLs.url.length;z++){
                            var newData = evtCb.data.trackingURLs.url[z]
                            output.push( newData.attributes.value );
                        }
                    }
                    else{
                        output.push( evtCb.data.trackingURLs.url.attributes.value );
                    }
                }
            }
        }
    
        Logger.shout("FreewheelEventCallbackHelper.postFirstQuartile() - " + output.length + " firstQuarile events to fire out of " + m_allEventCallbacks.length);
        if( output.length !== 0 )
            Logger.logObj( output );
    
        for( var i = 0; i < output.length; i++ )
        {
            ADUrlManagerInstance.fireUrl( output[i] );
        }
    };
    
    /**
     * Fire all 50% quartile URLS
     */
    this.postMidpointTrackingUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_allEventCallbacks.length; i++ )
        {
            if( m_allEventCallbacks[i].getName() === "midPoint" || m_allEventCallbacks[i].getName() === "midpoint" )
            {
                output.push( m_allEventCallbacks[i].getUrl() );
                var evtCb = m_allEventCallbacks[i]
                if(evtCb.data.trackingURLs && evtCb.data.trackingURLs.url){
                    if(evtCb.data.trackingURLs.url.length){
                        for(z=0;z<evtCb.data.trackingURLs.url.length;z++){
                            var newData = evtCb.data.trackingURLs.url[z]
                            output.push( newData.attributes.value );
                        }
                    }
                    else{
                        output.push( evtCb.data.trackingURLs.url.attributes.value );
                    }
                }
            }
        }
    
        Logger.shout("FreewheelEventCallbackHelper.postMidpointTrackingUrls() - " + output.length + " midPoint events to fire out of " + m_allEventCallbacks.length);
        if( output.length !== 0 )
            Logger.logObj( output );
        
        for( var i = 0; i < output.length; i++ )
        {
            ADUrlManagerInstance.fireUrl( output[i] );
        }
    };
    
    /**
     * Fire all 75% quartile URLS
     */
    this.postThirdQuartileTrackingUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_allEventCallbacks.length; i++ )
        {
            if( m_allEventCallbacks[i].getName() === "thirdQuartile" )
            {
                output.push( m_allEventCallbacks[i].getUrl() );
                var evtCb = m_allEventCallbacks[i]
                if(evtCb.data.trackingURLs && evtCb.data.trackingURLs.url){
                    if(evtCb.data.trackingURLs.url.length){
                        for(z=0;z<evtCb.data.trackingURLs.url.length;z++){
                            var newData = evtCb.data.trackingURLs.url[z]
                            output.push( newData.attributes.value );
                        }
                    }
                    else{
                        output.push( evtCb.data.trackingURLs.url.attributes.value );
                    }
                }       
            }
        }
        
        Logger.shout("FreewheelEventCallbackHelper.postThirdQuartileTrackingUrls() - " + output.length + " thirdQuartile events to fire out of " + m_allEventCallbacks.length);
        if( output.length !== 0 )
            Logger.logObj( output );
        
        for( var i = 0; i < output.length; i++ )
        {
            ADUrlManagerInstance.fireUrl( output[i] );
        }
    };
    
    /**
     * Fire all completion URLS
     */
    this.postCompleteTrackingUrls = function()
    {
        var output = [];
        for( var i = 0; i < m_allEventCallbacks.length; i++ )
        {
            if( m_allEventCallbacks[i].getName() === "complete" )
            {
                output.push( m_allEventCallbacks[i].getUrl() );
                var evtCb = m_allEventCallbacks[i]
                if(evtCb.data.trackingURLs && evtCb.data.trackingURLs.url){
                    if(evtCb.data.trackingURLs.url.length){
                        for(z=0;z<evtCb.data.trackingURLs.url.length;z++){
                            var newData = evtCb.data.trackingURLs.url[z]
                            output.push( newData.attributes.value );
                        }
                    }
                    else{
                        output.push( evtCb.data.trackingURLs.url.attributes.value );
                    }
                }
            }
        }
    
        Logger.shout("FreewheelEventCallbackHelper.postCompleteTrackingUrls() - " + output.length + " complete events to fire out of " + m_allEventCallbacks.length);
        if( output.length !== 0 ){
            Logger.logObj( output );
        }
        
        for( var i = 0; i < output.length; i++ )
        {
            ADUrlManagerInstance.fireUrl( output[i] );
        }
    };
    
    function debugLog()
    {
        Logger.log("FreewheelEventCallbackHelper.debugLog() - ");
        Logger.log("Advertisement ID: " + m_adID );
        Logger.log("Advertisement Freewheel Tracking Events: (name/url)");
        
        var output = {};
        for( var i = 0; i < m_allEventCallbacks.length; i++ )
        {
            output[ m_allEventCallbacks[i].getName() ] = m_allEventCallbacks[i].getUrl();
        }
        Logger.logObj( output );
    };
    debugLog();
};
