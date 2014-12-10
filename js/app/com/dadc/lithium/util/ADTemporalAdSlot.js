/**
 * ADTemporalAdSlot.js
 */

ADManager.TemporalAdSlot = function( temporalAdSlotNode, ADManagerObj )
{
    var This = this;

    /** get the time position of this slot */
    this.getTimePosition = function()
    {
        if( isValid( temporalAdSlotNode ) === true )
        {
            if( typeof temporalAdSlotNode.getTimePosition === "function" )
                return temporalAdSlotNode.getTimePosition();
            else Logger.log("TemporalAdSlot.getTimePosition() - node missing getTimePosition() API");
        }
        else Logger.log("TemporalAdSlot.getTimePosition() - node found invalid");
        
        Logger.log("TemporalAdSlot.getTimePosition() - unable to get time position, returning -1");
        return -1;
    };

    /**
     * Get the adHeader of this slot
     * @param {number} index
     */
    this.getAdHeader = function( index )
    {
        if( typeof index !== "number" )
        {
            Logger.log("TemporalAdSlot.getAdHeader(" + typeof index + ") invalid argument");
            return null;
        }
        
        var adID = null,
            creativeID = null,
            renditionID = null;
            
        var adReference = null;
        
        if( isValid( ADManagerObj ) === true )
            if( typeof ADManagerObj.getAdHeaderById === "function" )
                if( isValid( temporalAdSlotNode ) === true )
                    if( typeof temporalAdSlotNode.getSelectedAds === "function" )
                        if( typeof temporalAdSlotNode.getSelectedAds().getAdReferenceList === "function" )
                            if( typeof temporalAdSlotNode.getSelectedAds().getAdReferenceList().getAdReference === "function" )
                                adReference = temporalAdSlotNode.getSelectedAds().getAdReferenceList().getAdReference( index );
                            else Logger.log("ADManager.getAdHEader() - getAdReference() not a function");
                        else Logger.log("ADMAnager.getAdHEader() - getAdReferenceList() not a function");
                    else Logger.log("ADManager.getAdHeader() - getSelectedAds() not a function");
                else Logger.log("ADManager.getAdHeader() - temporalAdSlotNode not valid");
            else Logger.log("ADManager.getAdHeader() - ADMaager.getAdHeaderByID() not a function");
        else Logger.log("ADManager.getAdHeader() - ADManagerObj is not valid");
        
        if( adReference !== null )
        {
            if( typeof adReference.getAdId === "function" )
            adID = adReference.getAdId();
            else Logger.log("ADManager.getAdHeader() - adReference.getAdID() is not a function");
            if( typeof adReference.getCreativeId === "function" )
            creativeID = adReference.getCreativeId();
            else Logger.log("ADManager.getAdHeader() - adReference.getCreativeId() is not a function");
            if( typeof adReference.getCreativeRenditionId === "function" )
            renditionID = adReference.getCreativeRenditionId();
            else Logger.log("ADManager.getAdHeader() - adReference.getCreativeRenditionId() is not a function");
        }
        
        if( adID !== null && creativeID !== null && renditionID !== null )
            return ADManagerObj.getAdHeaderById( adID, creativeID, renditionID );
        else return null;
    };
    
    /**
     * get the creative id of this temporal ad slot
     * @param {number} index
     */
    this.getCreativeId = function( index )
    {
        if( typeof index === "number" )
        {
            if( isValid( temporalAdSlotNode ) === true )
            {
                if( typeof temporalAdSlotNode.getSelectedAds === "function" )
                {
                    var selectedAds = temporalAdSlotNode.getSelectedAds();
                    if( isValid( selectedAds ) === true )
                    {
                        if( typeof selectedAds.getAdReferenceList === "function" )
                        {
                            var adRefList = selectedAds.getAdReferenceList();
                            if( isValid( adRefList ) === true )
                            {
                                if( typeof adRefList.getAdReference === "function" )
                                {
                                    var adReference = adRefList.getAdReference( index );
                                    if( isValid( adReference ) === true )
                                    {
                                        if( typeof adReference.getCreativeId === "function" )
                                        {
                                            return adReference.getCreativeId();
                                        }
                                    }
                                    else Logger.log("TemporalAdSlot.getCreativeId(" + index + ") adReference is not valid");
                                }
                                else Logger.log("TemporalAdSlot.getCreativeId(" + index + ") adRefList.getAdReference is not a function");
                            }
                            else Logger.log("TemporalAdSlot.getCreativeId(" + index + ") adReferenceList is not valid");
                        }
                        else Logger.log("TemporalAdSlot.getCreativeId(" + index + ") selectedAds.getAdReferenceList not a function");
                    }
                    else Logger.log("TemporalAdSlot.getCreativeId(" + index + ") selectedAds found invalid");
                }
            }
            else Logger.log("TemporalAdSlot.getCreativeId(" + index + ") temporalAdSlotNode found invalid");
        }
        else Logger.log("TemporalAdSlot.getCreativeId(" + typeof index + ") - invalid argument");
        
        Logger.log("TemporalAdSlot.getCreativeID(" + index + ") error occurred, returning null");
        return null;
    };
    
    /**
     * Get a creative ID by the Ad ID
     * @param {number} adID
     */
    this.getCreativeIDByAdID = function( adID )
    {
        if( typeof adID !== "undefined" )
        {
            if( isValid( temporalAdSlotNode ) === true )
            {
                if( typeof temporalAdSlotNode.getSelectedAds === "function" )
                {
                    var selectedAds = temporalAdSlotNode.getSelectedAds();
                    if( isValid( selectedAds ) === true )
                    {
                        var adRefList = selectedAds.getAdReferenceList();
                        if( isValid( adRefList ) === true )
                        {
                            var ad = adRefList.getAdReferenceByID( adID );
                            if( isValid( ad ) === true )
                            {
                                return ad.getCreativeId();
                            }
                        }
                    }
                }
            }
        }
    };
    
    /**
     * get the rendition id of this temporal ad slot
     * @param {number} index
     */
    this.getRenditionId = function( index )
    {
        if( typeof index === "number" )
        {
            if( isValid( temporalAdSlotNode ) === true )
            {
                if( typeof temporalAdSlotNode.getSelectedAds === "function" )
                {
                    var selectedAds = temporalAdSlotNode.getSelectedAds();
                    if( isValid( selectedAds ) === true )
                    {
                        if( typeof selectedAds.getAdReferenceList === "function" )
                        {
                            var adRefList = selectedAds.getAdReferenceList();
                            if( isValid( adRefList ) === true )
                            {
                                if( typeof adRefList.getAdReference === "function" )
                                {
                                    var adReference = adRefList.getAdReference( index );
                                    if( isValid( adReference ) === true )
                                    {
                                        if( typeof adReference.getCreativeRenditionId === "function" )
                                        {
                                            return adReference.getCreativeRenditionId();
                                        }
                                        else Logger.log("TemporalAdSlot.getRenditionId(" + index + ") adReference.getCreativeRenditionId is not a function");
                                    }
                                    else Logger.log("TemporalAdSlot.getRenditionId(" + index + ") adReference is not valid");
                                }
                                else Logger.log("TemporalAdSlot.getRenditionId(" + index + ") adRefList.getAdReference is not a function");
                            }
                            else Logger.log("TemporalAdSlot.getRenditionId(" + index + ") adReferenceList is not valid");
                        }
                        else Logger.log("TemporalAdSlot.getRenditionId(" + index + ") selectedAds.getAdReferenceList not a function");
                    }
                    else Logger.log("TemporalAdSlot.getRenditionId(" + index + ") selectedAds found invalid");
                }
            }
            else Logger.log("TemporalAdSlot.getRenditionId(" + index + ") temporalAdSlotNode found invalid");
        }
        else Logger.log("TemporalAdSlot.getRenditionId(" + typeof index + ") - invalid argument");
        
        Logger.log("TemporalAdSlot.getRenditionId(" + index + ") error occurred, returning null");
        return null;
    };
    
    /**
     * Get a creative ID by the Ad ID
     * @param {number} adID
     */
    this.getRenditionIDByAdID = function( adID )
    {
        if( typeof adID !== "undefined" )
        {
            if( isValid( temporalAdSlotNode ) === true )
            {
                if( typeof temporalAdSlotNode.getSelectedAds === "function" )
                {
                    var selectedAds = temporalAdSlotNode.getSelectedAds();
                    if( isValid( selectedAds ) === true )
                    {
                        var adRefList = selectedAds.getAdReferenceList();
                        if( isValid( adRefList ) === true )
                        {
                            var ad = adRefList.getAdReferenceByID( adID );
                            if( isValid( ad ) === true )
                            {
                                return ad.getCreativeRenditionId();
                            }
                        }
                    }
                }
            }
        }
    };
    
    /**
     * get the impression urls for this slot
     * @param {number} id
     */
    this.getImpressionUrlsByAdId = function( id )
    {
        if( typeof id !== "undefined" )
        {
            if( isValid( temporalAdSlotNode ) === true )
            {
                if( typeof temporalAdSlotNode.getSelectedAds === "function" )
                {
                    var selectedAds = temporalAdSlotNode.getSelectedAds();
                    if( isValid( selectedAds ) === true )
                    {
                        if( typeof selectedAds.getAdReferenceList === "function" )
                        {
                            var adRefList = selectedAds.getAdReferenceList();
                            if( isValid( adRefList ) === true )
                            {
                                if( typeof adRefList.getAdReference === "function" )
                                {
                                    var adReference = adRefList.getAdReferenceByID( id );
                                    if( isValid( adReference ) === true )
                                    {
                                        if( typeof adReference.getEventCallbackList === "function" )
                                        {
                                            var eventList = adReference.getEventCallbackList();
                                            if( isValid( eventList ) === true )
                                            {
                                                if( typeof eventList.getEventCallbacksByType === "function" )
                                                {
                                                    var impression = eventList.getEventCallbacksByType("IMPRESSION");
                                                    if( isValid( impression ) === true )
                                                    {
                                                        return impression;
                                                    }
                                                    else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") impression found invalid");
                                                }
                                                else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") eventList.getEventCallbacksByType is not a function");
                                            }
                                            else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") event list is not valid");
                                        }
                                        else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") adReference.getEventCallbackList is not a function");
                                    }
                                    else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") adReference is not valid");
                                }
                                else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") adRefList.getAdReference is not a function");
                            }
                            else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") adReferenceList is not valid");
                        }
                        else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") selectedAds.getAdReferenceList not a function");
                    }
                    else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") selectedAds found invalid");
                }
            }
            else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + id + ") temporalAdSlotNode found invalid");
        }
        else Logger.log("TemporalAdSlot.getImpressionUrlsByAdId(" + typeof id + ") invalid arugment");
        
        Logger.log("TemporalAdSlot.getImpressionUrlsByAdId() - error occurred, returning null");
        return null;
    };

    /**
     * get the tracking urls by ad id, returns "generic"
     * @param {number} id
     */
    this.getTrackingUrlsByAdId = function( id )
    {
        if( typeof id !== "undefined" )
        {
            if( isValid( temporalAdSlotNode ) === true )
            {
                if( typeof temporalAdSlotNode.getSelectedAds === "function" )
                {
                    var selectedAds = temporalAdSlotNode.getSelectedAds();
                    if( isValid( selectedAds ) === true )
                    {
                        if( typeof selectedAds.getAdReferenceList === "function" )
                        {
                            var adRefList = selectedAds.getAdReferenceList();
                            if( isValid( adRefList ) === true )
                            {
                                if( typeof adRefList.getAdReference === "function" )
                                {
                                    var adReference = adRefList.getAdReferenceByID( id );
                                    if( isValid( adReference ) === true )
                                    {
                                        if( typeof adReference.getEventCallbackList === "function" )
                                        {
                                            var eventList = adReference.getEventCallbackList();
                                            if( isValid( eventList ) === true )
                                            {
                                                if( typeof eventList.getEventCallbacksByType === "function" )
                                                {
                                                    var impression = eventList.getEventCallbacksByType("GENERIC");
                                                    if( isValid( impression ) === true )
                                                    {
                                                        return impression;
                                                    }
                                                    else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") impression found invalid");
                                                }
                                                else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") eventList.getEventCallbacksByType is not a function");
                                            }
                                            else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") event list is not valid");
                                        }
                                        else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") adReference.getEventCallbackList is not a function");
                                    }
                                    else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") adReference is not valid");
                                }
                                else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") adRefList.getAdReference is not a function");
                            }
                            else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") adReferenceList is not valid");
                        }
                        else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") selectedAds.getAdReferenceList not a function");
                    }
                    else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") selectedAds found invalid");
                }
            }
            else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + id + ") temporalAdSlotNode found invalid");
        }
        else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + typeof id + ") invalid arugment");
        
        Logger.log("TemporalAdSlot.getTrackingUrlsByAdId() - error occurred, returning null");
        return null;
    };
    
    this.getAllEventCallbacksByAdID = function( adID )
    {
        if( typeof adID !== "undefined" )
        {
            if( isValid( temporalAdSlotNode ) === true )
            {
                if( typeof temporalAdSlotNode.getSelectedAds === "function" )
                {
                    var selectedAds = temporalAdSlotNode.getSelectedAds();
                    if( isValid( selectedAds ) === true )
                    {
                        if( typeof selectedAds.getAdReferenceList === "function" )
                        {
                            var adRefList = selectedAds.getAdReferenceList();
                            if( isValid( adRefList ) === true )
                            {
                                if( typeof adRefList.getAdReference === "function" )
                                {
                                    var adReference = adRefList.getAdReferenceByID( adID );
                                    if( isValid( adReference ) === true )
                                    {
                                        if( typeof adReference.getEventCallbackList === "function" )
                                        {
                                            var eventList = adReference.getEventCallbackList();
                                            if( isValid( eventList ) === true )
                                            {
                                                return eventList.getEventCallbackList();
                                            }
                                            else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + adID + ") event list is not valid");
                                        }
                                        else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + adID + ") adReference.getEventCallbackList is not a function");
                                    }
                                    else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + adID + ") adReference is not valid");
                                }
                                else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + adID + ") adRefList.getAdReference is not a function");
                            }
                            else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + adID + ") adReferenceList is not valid");
                        }
                        else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + adID + ") selectedAds.getAdReferenceList not a function");
                    }
                    else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + adID + ") selectedAds found invalid");
                }
            }
            else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + adID + ") temporalAdSlotNode found invalid");
        }
        else Logger.log("TemporalAdSlot.getTrackingUrlsByAdId(" + typeof adID + ") invalid arugment");
        
        Logger.log("TemporalAdSlot.getTrackingUrlsByAdId() - error occurred, returning null");
        return null;
    };
    
    /**
     * Get all "slotImpressions" for this temporal ad slot
     */
    this.getSlotImpression = function()
    {
        var ec = temporalAdSlotNode.getEventCallbacks();
        if( isValid( ec ) === true ){
            return ec.getEventCallbackList();
        }
        return null;
    };

    /**
     * determine if this adSlot is a preroll
     */
    this.isPreroll = function()
    {
        return ( This.getTimePosition() == 0 ? true : false );
    };

    /**
     * determine if this slot has been prepared
     */
    this.isPrepared = function()
    {
        // is the node valid?
        if( isValid( temporalAdSlotNode ) === false )
        {
            Logger.log("TemporalAdSlot.isPrepared() - temporalAdSlotNode is not valid");
            return false;
        }
        // is the adManager reference valid?
        if( isValid( ADManagerObj ) === false )
        {
            Logger.log("TemporalAdSlot.isPrepared() - ADManagerObj is not valid");
            return false;
        }
        // does the adManager have the required API?
        if( typeof ADManagerObj.getAdHeaderById !== "function" )
        {
            Logger.log("TemporalAdSlot.isPrepared() - ADManagerObj.getAdHeaderById() is not a function");
            return false;
        }
    
        // get totalAdReferences, and the reference to the AdReferenceList
        var totalAdReferences = 0;
        var adReferenceList = null;
        if( typeof temporalAdSlotNode.getSelectedAds === "function" )
        {
            var selectedAds = temporalAdSlotNode.getSelectedAds();
            if( isValid( selectedAds ) === true )
            {
                if( typeof selectedAds.getAdReferenceList === "function" )
                {
                    adReferenceList = selectedAds.getAdReferenceList();
                    if( isValid( adReferenceList ) === true )
                    {
                        if( typeof adReferenceList.getTotalAdReferences === "function" )
                        {
                            totalAdReferences = adReferenceList.getTotalAdReferences();
                        }
                        else Logger.log("TemporalAdSlot.isPrepared() - adReferenceList.getTotalAdReferences() is not a function");
                    }
                    else Logger.log("TemporalAdSlot.isPrepareD() - adReferenceList is not valid");
                }
                else Logger.log("TemporalAdSlot.isPrepared() - selectedAds.getAdReferenceList() is not a function");
            }
            else Logger.log("TemporalAdSlot.isPrepared() - selectedAds is not valid");
        }
        else Logger.log("TemporalAdSlot.isPrepared() - temporalAdSlotNode.getSelectedAds() is not a function");
    
        // can't continue if the adReferenceList was invalid
        if( isValid( adReferenceList ) === false )
        {
            return false;
        }
    
        // iterate the ads, determine if the any of them aren't prepared
        for( var i = 0; i < totalAdReferences; i++ )
        {
            var adReference = adReferenceList.getAdReference( i );
            // is this adReference valid?
            if( isValid( adReference ) === true )
            {
                // validate the iteration's API
                if( typeof adReference.getAdId !== "function" ||
                    typeof adReference.getCreativeId !== "function" ||
                    typeof adReference.getCreativeRenditionId !== "function" )
                {
                    Logger.log("TemporalAdSlot.isPrepared() - iteration: " + i + " has invalid API");
                    continue;
                }
                else
                {
                    // get the adHeader
                    var adHeader = ADManagerObj.getAdHeaderById( adReference.getAdId(), adReference.getCreativeId(), adReference.getCreativeRenditionId() );
                    // is the header valid?
                    if( isValid( adHeader ) === true )
                    {
                        // if its not ready, return false
                        if( adHeader.isReady() === false )
                        {
                            Logger.log("TemporalAdSlot.isPrepared() - iteration: " + i + " is not ready");
                            return false;
                        }
                        else Logger.log("TemporalAdSlot.isPrepared() - iteration: " + i + " is ready");
                    }
                    else Logger.log("TemporalAdSlot.isPrepared() - iteration: " + i + " retrieved adHeader found invalid");
                }
            }
        }
        // all seems good, return true!
        return true;
    };
    
    this.prepare = function()
    {
        Logger.log( 'TemporalAdSlot.prepare()' );
    
        // is the node valid?
        if( isValid( temporalAdSlotNode ) === false )
        {
            Logger.log("TemporalAdSlot.prepare() - temporalAdSlotNode is not valid");
            return false;
        }
        // is the adManager reference valid?
        if( isValid( ADManagerObj ) === false )
        {
            Logger.log("TemporalAdSlot.prepare() - ADManagerObj is not valid");
            return false;
        }
        // does the adManager have the required API?
        if( typeof ADManagerObj.getAdHeaderById !== "function" )
        {
            Logger.log("TemporalAdSlot.prepare() - ADManagerObj.getAdHeaderById() is not a function");
            return false;
        }
    
        // get totalAdReferences, and the reference to the AdReferenceList
        var totalAdReferences = 0;
        var adReferenceList = null;
        if( typeof temporalAdSlotNode.getSelectedAds === "function" )
        {
            var selectedAds = temporalAdSlotNode.getSelectedAds();
            if( isValid( selectedAds ) === true )
            {
                if( typeof selectedAds.getAdReferenceList === "function" )
                {
                    adReferenceList = selectedAds.getAdReferenceList();
                    if( isValid( adReferenceList ) === true )
                    {
                        if( typeof adReferenceList.getTotalAdReferences === "function" )
                        {
                            totalAdReferences = adReferenceList.getTotalAdReferences();
                        }
                        else Logger.log("TemporalAdSlot.prepare() - adReferenceList.getTotalAdReferences() is not a function");
                    }
                    else Logger.log("TemporalAdSlot.prepare() - adReferenceList is not valid");
                }
                else Logger.log("TemporalAdSlot.prepare() - selectedAds.getAdReferenceList() is not a function");
            }
            else Logger.log("TemporalAdSlot.prepare() - selectedAds is not valid");
        }
        else Logger.log("TemporalAdSlot.prepare() - temporalAdSlotNode.getSelectedAds() is not a function");
    
        // can't continue if the referenceList was invalid
        if( isValid( adReferenceList ) === false )
        {
            Logger.log("TemporalAdSlot.prepare() - adReferenceList found invalid");
            return;
        }
        // can't continue if the referenceList is missing required API
        if( typeof adReferenceList.getAdReference !== "function" )
        {
            Logger.log("TemporalAdSlot.prepare() - adReferenceList.getAdReference() is not a function");
            return;
        }
    
        for( var i = 0; i < totalAdReferences; i++ )
        {
            var adReference = adReferenceList.getAdReference( i );
        
            // check the iteration's API
            if( typeof adReference.getAdId !== "function" ||
                typeof adReference.getCreativeId !== "function" ||
                typeof adReference.getCreativeRenditionId !== "function" )
            {
                Logger.log("TemporalAdSlot.prepare() - iteration: " + i + " has invalid API");
                continue;
            }
        
            // get the IDs
            var ad_id = adReference.getAdId();
            var creative_id = adReference.getCreativeId();
            var creative_rendition_id = adReference.getCreativeRenditionId();
        
            // get the header and validate it
            var header = ADManagerObj.getAdHeaderById( ad_id, creative_id, creative_rendition_id );
            if( isValid( header ) === false )
            {
                Logger.log("TemporalAdSlot.prepare() - iteration: " + i + " header is not valid");
                continue;
            }
        
            if( header.isReady() === false )
            {
                Logger.log("TemporalAdSlot.prepare() - iteration: " + i + "header is not resolved, will call doResolve");
                if( typeof header.doResolve === "function" )
                {
                    header.doResolve();
                }
                else Logger.log("TemporalAdSlot.prepare() - iteration: " + i + " doResolve() is not a function");
                return;
            }
        }

        ADManagerObj.notifyTemporalAdSlotPrepared( this );
    };
    
    /** determine how many ads are in this slot */
    this.countTotalAds = function()
    {
        Logger.log("ADManager.countTotalAds()");
        if( isValid( temporalAdSlotNode ) === false )
        {
            Logger.log("ADManager.countTotalAds() - temporalAdSlot is not valid");
            return 0;
        }
        
        var totalAdReferences = 0;
        if( typeof temporalAdSlotNode.getSelectedAds === "function" )
        {
            var selectedAds = temporalAdSlotNode.getSelectedAds();
            if( isValid( selectedAds ) === true )
            {
                if( typeof selectedAds.getAdReferenceList === "function" )
                {
                    var adReferenceList = selectedAds.getAdReferenceList();
                    if( isValid( adReferenceList ) === true )
                    {
                        if( typeof adReferenceList.getTotalAdReferences === "function" )
                        {
                            totalAdReferences = adReferenceList.getTotalAdReferences();
                        }
                        else Logger.log("TemporalAdSlot.countTotalAds() - adReferenceList.getTotalAdReferences() is not a function");
                    }
                    else Logger.log("TemporalAdSlot.countTotalAds() - adReferenceList is not valid");
                }
                else Logger.log("TemporalAdSlot.countTotalAds() - selectedAds.getAdReferenceList() is not a function");
            }
            else Logger.log("TemporalAdSlot.countTotalAds() - selectedAds is not valid");
        }
        else Logger.log("TemporalAdSlot.countTotalAds() - temporalAdSlotNode.getSelectedAds() is not a function");
            
        return totalAdReferences;
    };

    /** determine if all ads are ready */
    this.areAdsReady = function()
    {
        Logger.log("TemporalAdSlot.areAdsReady()");
    
        var total = this.countTotalAds();
        for( var i = 0; i < total; i++ )
        {
            var header = this.getAdHeader( i );
            if( isValid( header ) === true )
            {
                if( typeof header.isReady === "function" )
                {
                    if( header.isReady() === false )
                        return false;
                }
                else Logger.log("TemporalAdSlot.areAdsReady() - iteration: " + i + " header.isReady() is not a function");
            }
            else Logger.log("TemporalAdSlot.areAdsReady() - iteration: " + i + " header found invalid");
        }
    
        return true;
    };
    
    /**
     * I have no clue....
     * @param {object} adHeaderObj
     */
    this.notifyAdResolved = function( adHeaderObj )
    {
        Logger.log( 'TemporalAdSlot.notifyAdResolved() start' );
        this.prepare();
        Logger.log( 'TemporalAdSlot.notifyAdResolved() end' );
    };
};