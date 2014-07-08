include( "js/app/com/dadc/lithium/parsers/XMLParser.js" );
include( "js/app/com/dadc/lithium/config/FreewheelConfig.js" );

var FreeWheelModel = function(){};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
FreeWheelModel.FreeWheel_SmartXMLRequest = function( media_id, callback, freewheelMediaType )
{
    //SAMPLE URL
    // 151933
    //http://2517d.v.fwmrm.net/ad/g/1?prof=146140%3acrackle_test_ps3&nw=146140&caid=2482483&asnw=146140&csid=crackle_ps3_home&ssnw=146140&resp=smrx&vdur=6444&flag=+sltp

    var url = FreewheelConfig.getFreeWheelURL( media_id, freewheelMediaType );
    Logger.log( 'FREEWHEEL URL ' + url );
    var httpRequestObj;
    var api_retries;
    var http_retries;
    var This = this;

    this.startRequest = function( )
    {
        http_retries = 0;
        api_retries = 0;
        initHttpRequest();
        httpRequestObj.start();
    };

    function initHttpRequest()
    {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19'
        };
//        httpRequestObj = ModelConfig.httpClientObj.request( "GET", url, null, headers );
//        httpRequestObj.onComplete = This.onRequestComplete;
        
        // BENUPDATE: CONFIGURABLE SDK TYPE
        httpRequestObj = ModelConfig.createRequest( "GET", url, headers, null );        
        httpRequestObj.onComplete = This.onRequestComplete;
    }

    this.onRequestComplete = function( data, status )
    {
        Logger.log( 'FreeWheelSmartXML STATUS: ' + status );
        Logger.log( 'FREEWHEEL DATA' );
        Logger.log( data );

        if ( status != 200 ){
            callback( null, status );
        }else {
            try{
                var json_data = XMLParser_DAC.XMLToJSON( data );
                Logger.logObj( json_data );
                if ( !json_data ||
                    (
                        json_data.siteSection &&
                        json_data.siteSection.videoPlayer &&
                        json_data.siteSection.videoPlayer.videoAsset &&
                        json_data.siteSection.videoPlayer.videoAsset.adSlots &&
                        !json_data.siteSection.videoPlayer.videoAsset.adSlots.temporalAdSlot
                    ) &&
                    api_retries < ModelConfig.CONFIG.API_ERROR_RETRY
                ){
                    api_retries++;
                    initHttpRequest();
                    httpRequestObj.start();
                }else{
                    callback( new FreeWheelModel.AdResponse( json_data ), status );
                }
            }catch( e ){
                Logger.log( '!!! EXCEPTION !!!' );
                Logger.logObj( e );
                callback( null, ModelConfig.API_ERROR );
            }
        }
    };
};

// =============================================================================
//              MODEL OBJECTS
// =============================================================================

FreeWheelModel.AdResponse = function( data )
{
    var adListObj       = data.ads ? new FreeWheelModel.AdList( data.ads ) : null;
    var siteSectionObj  = data.siteSection ? new FreeWheelModel.SiteSection( data.siteSection ) : null;

    this.getAdList      = function() { return adListObj; };
    this.getSiteSection = function() { return siteSectionObj; };
};

FreeWheelModel.AdList = function( data )
{
    var adArray         = [];
    this.getTotalAds    = function() { return adArray.length; };
    this.getAd          = function( index ) { return adArray[ index ]; };

    try
    {
        if ( data.ad )
        {
            if( isArray( data.ad ) === true )
            {
                for( var i = 0; i < data.ad.length; i++ )
                {
                    adArray.push( new FreeWheelModel.Ad( data.ad[ i ] ) );
                }
            }
            else
            {
                adArray.push( new FreeWheelModel.Ad( data.ad ) );
            }
        }
    }
    catch( e )
    {
        Logger.log( 'FreeWheelModel.AdList EXCEPTION THROWN' );
        Logger.logObj( e );
    }
};

FreeWheelModel.Ad = function( data )
{
    var creativeListObj = new FreeWheelModel.CreativeList( data.creatives );

    this.getAdId = function() { return getTextFromNode( data.attributes['adId'] ); };
    this.getCreativeList = function() { return creativeListObj; };
};

FreeWheelModel.CreativeList = function( data )
{
    var creativeArray = [];
    
    if( isArray( data.creative ) === true )
    {
        for( var i = 0; i < data.creative.length; i++ )
            creativeArray.push( new FreeWheelModel.Creative( data.creative[ i ] ) );
    }
    else
    {
        creativeArray.push( new FreeWheelModel.Creative( data.creative ) );
    }
    
    this.getTotalCreatives    = function(){return creativeArray.length;};
    this.getCreative          = function( index ){return creativeArray[ index ];};
};

FreeWheelModel.Creative = function( data )
{
    var creativeRenditionListObj = new FreeWheelModel.CreativeRenditionList( data.creativeRenditions );

    this.getCreativeId = function(){return getTextFromNode( data.attributes[ 'creativeId' ] ); };
    this.getRedirectUrl = function(){return getTextFromNode( data.attributes[ 'redirectUrl' ] ); };
    this.getDuration = function(){return getTextFromNode( data.attributes[ 'duration' ] ); };
    this.getCreativeRenditionList = function() {return creativeRenditionListObj;};
};

FreeWheelModel.CreativeRenditionList = function( data )
{
    var creativeRenditionsArray = [];
    
    if( isArray( data.creativeRendition ) === true )
    {
        for( var i = 0; i < data.creativeRendition.length; i++ )
            creativeRenditionsArray.push( new FreeWheelModel.CreativeRendition( data.creativeRendition[ i ] ) );
    }
    else
    {
        creativeRenditionsArray.push( new FreeWheelModel.CreativeRendition( data.creativeRendition ) );
    }

    this.getTotalCreativeRenditions = function(){return creativeRenditionsArray.length;};
    this.getCreativeRendition = function( index ){return creativeRenditionsArray[ index ];};
};

FreeWheelModel.CreativeRendition = function( data )
{
    var assetObj = data.asset ? new FreeWheelModel.Asset( data.asset ) : null;
    
    this.getCreativeRenditionId = function(){ return getTextFromNode( data.attributes[ 'creativeRenditionId' ] ); };
    this.getWrapperType         = function(){ return getTextFromNode( data.attributes[ 'wrapperType' ] ); };
    this.getWrapperUrl          = function(){ return getTextFromNode( data.attributes[ 'wrapperUrl' ] ); };
    this.getPreference          = function(){ return getTextFromNode( data.attributes[ 'preference' ] ); };
    this.getAsset               = function(){ return assetObj; };
    this.debugLog = function()
    {
        Logger.log("FreeWheelModel.CreativeRendition() - DEBUG LOG");
        Logger.log("getCreativeRenditionId: " + this.getCreativeRenditionId());
        Logger.log("getWrapperType: " + this.getWrapperType());
        Logger.log("getPreference: " + this.getPreference());
        Logger.log("getAsset: " + this.getAsset());
    };
};

FreeWheelModel.Asset = function( data )
{
    this.getUrl         = function() { return getTextFromNode( data.attributes["url"] ); };
    this.getContentType     = function() { return getTextFromNode( data.attributes["contentType"] ); };
    this.getID          = function() { return getTextFromNode( data.attributes["id"] ); };
    this.getMimeType        = function() { return getTextFromNode( data.attributes["mimeType"] ); };
    this.getName        = function() { return getTextFromNode( data.attributes["name"] ); };
    this.getBytes       = function() { return getTextFromNode( data.attributes["bytes"] ); };
    this.debugLog = function()
    {
        Logger.log("FreeWheelModel.Asset() - DEBUG LOGS");
        Logger.log("getUrl: " + this.getUrl());
        Logger.log("getContentType: " + this.getContentType());
        Logger.log("getID: " + this.getID());
        Logger.log("getMimeType: " + this.getMimeType());
        Logger.log("getName: " + this.getName());
        Logger.log("getBytes: " + this.getBytes());
    };
};

// ####################
// ### SITE SECTION ###
// ####################
FreeWheelModel.SiteSection = function( data )
{
    var videoPlayerObj = new FreeWheelModel.VideoPlayer( data.videoPlayer );

    this.getVideoPlayer     = function(){ return videoPlayerObj; };
};

FreeWheelModel.VideoPlayer = function( data )
{
    var videoAssetObj = new FreeWheelModel.VideoAsset( data.videoAsset );

    this.getVideoAsset      = function(){ return videoAssetObj; };
};

FreeWheelModel.VideoAsset = function( data )
{
    var adSlotsObj  = new FreeWheelModel.AdSlots( data.adSlots );
    this.getAdSlots     = function(){return adSlotsObj;};

    // DAN & MILAN videoView analytic integration
    var eventCallbackList = new FreeWheelModel.EventCallbackList( data.eventCallbacks );
    this.getEventCallbackList   = function() { return eventCallbackList; };
};

FreeWheelModel.AdSlots = function( data )
{
    var temporalAdSlotListObj   = new FreeWheelModel.TemporalAdSlotList( data.temporalAdSlot );
    this.getTemporalAdSlotList  = function(){return temporalAdSlotListObj;};
};

FreeWheelModel.TemporalAdSlotList = function( data )
{
    var temporalAdSlotsArray        = [];
    if( isArray( data ) === true )
    {
        for( var i in data )
            temporalAdSlotsArray.push( new FreeWheelModel.TemporalAdSlot( data[i] ) );
    }
    else
    {
        temporalAdSlotsArray.push( new FreeWheelModel.TemporalAdSlot( data ) );
    }
    
    
    this.getTotalTemporalAdSlots    = function(){return temporalAdSlotsArray.length;};
    this.getTemporalAdSlot          = function( index ){return temporalAdSlotsArray[ index ];};
};

FreeWheelModel.TemporalAdSlot = function( data )
{
    var m_selectedAds = (data && data.selectedAds) ? new FreeWheelModel.SelectedAds( data.selectedAds ) : null;
    var m_eventCallbacks = (data && data.eventCallbacks) ? new FreeWheelModel.EventCallbackList( data.eventCallbacks ) : null;

    this.getSelectedAds     = function() { return m_selectedAds; };
    this.getEventCallbacks  = function() { return m_eventCallbacks; };
    this.getTimePosition    = function() { return getTextFromNode( data.attributes["timePosition"] ); };
    this.getAdUnit      = function() { return getTextFromNode( data.attributes["adUnit"] ); };
    this.getCustomID        = function() { return getTextFromNode( data.attributes["customId"] ); };
    this.getSource      = function() { return getTextFromNode( data.attributes["source"] ); };
    this.getTimePositionClass   = function() { return getTextFromNode( data.attributes["timePositionClass"] ); };
};

FreeWheelModel.SelectedAds = function( data )
{
    var adReferenceListObj = data.adReference ? new FreeWheelModel.AdReferenceList( data.adReference ) : null;
    this.getAdReferenceList = function(){return adReferenceListObj;};
};

FreeWheelModel.AdReferenceList = function( data )
{
    var adReferenceArray = [];
    
    try
    {
        if( isArray( data ) === true )
        {
            for( var i = 0;i < data.length; i++ )
            {
                adReferenceArray.push( new FreeWheelModel.AdReference( data[ i ] ) );
            }
        }
        else
        {
            adReferenceArray.push( new FreeWheelModel.AdReference( data ) );
        }
    }
    catch( e ){ }
    
    this.getTotalAdReferences       = function(){return adReferenceArray.length;};
    this.getAdReference             = function( index ){return adReferenceArray[ index ];};
    this.getAdReferenceByID         = function( ad_id ){
        for( var i = 0; i < adReferenceArray.length; i++ ){
            if( adReferenceArray[ i ].getAdId() == ad_id )
                return adReferenceArray[ i ];
        }
    return null;
    };
};

FreeWheelModel.AdReference = function( data )
{
    var eventCallbackList = data.eventCallbacks ? new FreeWheelModel.EventCallbackList( data.eventCallbacks ) : null;

    this.getEventCallbackList   = function(){return eventCallbackList;};
    this.getAdId                = function(){return getTextFromNode( data.attributes[ 'adId' ] ); };
    this.getCreativeId          = function(){return getTextFromNode( data.attributes[ 'creativeId' ] ); };
    this.getCreativeRenditionId = function(){return getTextFromNode( data.attributes[ 'creativeRenditionId' ] ); };
};

FreeWheelModel.EventCallbackList = function( data )
{
    var eventCallbackList      = [];
    
    try
    {
        // if( typeof( data.eventCallback ) === 'object' && data.eventCallback instanceof Array )
        if( isArray( data.eventCallback ) === true )
        {
            for( var i = 0; i < data.eventCallback.length; i++ )
            {
                eventCallbackList.push( new FreeWheelModel.EventCallback( data.eventCallback[ i ] ) );
            }
        }
        else
        {
            eventCallbackList.push( new FreeWheelModel.EventCallback( data.eventCallback ) );
        }
    }catch( e ){ }
    
    this.getEventCallbackList       = function() { return eventCallbackList; };
    this.getTotalEventCallbacks     = function(){return eventCallbackList.length;};
    this.getEventCallback           = function( index ){return eventCallbackList[ index ];};
    
    this.getEventCallbacksByType    = function( type )
    {
        var arr = [];
        for( var i = 0; i < eventCallbackList.length; i++ )
        {
            if ( eventCallbackList[ i ].getType() === type )
            {
                arr.push( eventCallbackList[ i ] );
            }
        }
        return arr;
    };

    this.getEventCallbackByName     = function( name )
    {
    for( var i = 0; i < eventCallbackList.length; i++ )
    {
        if( eventCallbackList[i].getName() === name )
        {
            return eventCallbackList[i];
        }
    }
    return null;
    };

};

FreeWheelModel.EventCallback = function( data )
{
    this.getName = function()
    {
        if( typeof data.attributes !== "undefined" )
            return getTextFromNode( data.attributes[ 'name' ] );
        else if ( typeof data["name"] !== "undefined" )
            return getTextFromNode( data["name"] );
        else return null;
    };
    this.getType = function()
    {
        if( typeof data.attributes !== "undefined" )
            return getTextFromNode( data.attributes["type"] );
        else if ( typeof data["type"] !== "undefined" )
            return getTextFromNode( data["type"] );
        else return null;
    };
    this.getUrl  = function()
    {
        if( typeof data.attributes !== "undefined" )
            return getTextFromNode( data.attributes["url"] );
        else if ( typeof data["url"] !== "undefined" )
            return getTextFromNode( data["url"] );
        else return null;
    };
};

// INNOVID INTEGRATION:
FreeWheelModel.CreativeRendition.WRAPPER = 
{
    VAST_TYPE: "external/vast-2",
    INNOVID_TYPE: "external/innovid"
};