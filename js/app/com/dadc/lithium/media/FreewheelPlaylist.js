include( "js/app/com/dadc/lithium/media/FreewheelAdFactory.js" );
include( "js/app/com/dadc/lithium/util/FreewheelEventCallbackHelper.js" );

var FreewheelPlaylist = function( AdManager_TemporalAdSlot, CrackleVideoObj )
{
    var This            = this;
    var m_ads           = [];
    var m_ad_ix         = -1;
    var m_time_started      = engine.getTimer();
    var m_time_ended        = -1;
    var m_ads_to_resolve    = [];
    var adBreak;
    

    /**
     * If we have VAST ads, we need to resolve them before the playback can actually start
     */
    this.play = function(adIndex)
    {
        Logger.log( 'FreewheelPlaylist.play()' );
        var has_vast = false;

        if( LoggerConfig.CONFIG.SKIP_ADS )
        {
            ADForgivenessInstance.startTimer();
            CrackleVideoObj.notifyPlaylistEnded( this );
            return;
        }
        //TODO- a better way
        adBreak = (adIndex === 0)?'preroll':'midroll';

        m_ads = [];
        m_ads_to_resolve = [];

        Logger.log( 'Freewheel Playlist has ' + AdManager_TemporalAdSlot.countTotalAds() + ' ads. Resolving them...' );
        // Resolve every ad in the temporal ad slot node
        for ( var i = 0; i < AdManager_TemporalAdSlot.countTotalAds(); i++ )
        {
            var ad_header = AdManager_TemporalAdSlot.getAdHeader( i );
            // MILAN: REFACTORING "MULTIPLE CREATIVES BUG" SOLUTION
            var creative_id = AdManager_TemporalAdSlot.getCreativeId( i );
            var rendition_id = AdManager_TemporalAdSlot.getRenditionId( i );
        
            Logger.log("FreewheelPlaylist.play() - creativeID: " + creative_id + ", " + "renditionID: " + rendition_id);

            if( ad_header.isVast() || ad_header.isInnovid() )
            {
                Logger.log("VAST AD or INNOVID AD FOUND");
                // Add ourself as listener for ad resolving
                ad_header.addOnResolvedListener(this);
                has_vast = true;
                // If a VAST ad, resolve it
                m_ads_to_resolve.push( ad_header );
                ad_header.clearResolvedStatus();
                ad_header.doResolve();
            }
            else
            {
                Logger.log("DIRECT AD FOUND");
                // If not a VAST ad, just add it to our array of ads to be played
                var freewheelEventCallbackHelperObj = new FreewheelEventCallbackHelper( AdManager_TemporalAdSlot, ad_header );

                // MILAN: REFACTORING "MULTIPLE CREATIVES BUG" SOLUTION
                m_ads.push( FreewheelAdFactoryInstance.createPlayableAd( ad_header, freewheelEventCallbackHelperObj, This, creative_id, rendition_id, CrackleVideoObj.getMediaDetailsObj() ) );
//                m_ads.push( new FreewheelVideo( ad_header, freewheelEventCallbackHelperObj, This, creative_id, rendition_id ) );
            }
        }

        if( !has_vast )
        {
            onAllAdsResolved();
        }

        //ADForgivenessInstance.flagAvertisement();
    };
    this.onEnded = function( FreewheelAdVideoObj )
    {
        Logger.log( 'FreewheelPlaylist onEnded()' );
        m_ad_ix++;
        
        var freewheel_ad_video = m_ads[ m_ad_ix ];
        if(freewheel_ad_video){
            if(!freewheel_ad_video.play(adBreak) ){
                this.onEnded( freewheel_ad_video );
            }
        }
        else{
            ADForgivenessInstance.startTimer();
            Logger.log("SETTING PODCOMPLETE TRUE")
            ADForgiveness.podComplete = true;
            m_time_ended = engine.getTimer();
            clearAdResolvedListener();
            CrackleVideoObj.notifyPlaylistEnded( this );
        }

    };

    this.onStalled = function( FreewheelAdVideoObj )
    {
        ADForgivenessInstance.startTimer();
        this.onEnded( FreewheelAdVideoObj );
    };

    this.hasPlayed = function()
    {
        if( m_ads.length === 0 )
        {
            return false;
        }
        else
        {
            return m_ad_ix >= ( m_ads.length - 1 );
        }
    };

    this.getTimeStarted = function() { return m_time_started; };
    this.getTimeEnded = function() { return m_time_ended; };

    this.notifyAdResolved = function( ADHeaderObj )
    {
        Logger.log( 'FreewheelPlaylist.notifyAdResolved()' );

        popAdFromResolveArray( ADHeaderObj );
        ADHeaderObj.removeResolvedListener( This );
    
        var cID = AdManager_TemporalAdSlot.getCreativeIDByAdID( ADHeaderObj.getAdID() );
        var rID = AdManager_TemporalAdSlot.getRenditionIDByAdID( ADHeaderObj.getAdID() );

        // create the helper object that will post the quartile notifications and whatnot...
        var freewheelEventCallbackHelperObj = new FreewheelEventCallbackHelper( AdManager_TemporalAdSlot, ADHeaderObj );

        // INNOVID INTEGRATION: modified the interface here...
        m_ads.push( FreewheelAdFactoryInstance.createPlayableAd( ADHeaderObj, freewheelEventCallbackHelperObj, This, cID, rID, CrackleVideoObj.getMediaDetailsObj() ) );

        // Did we resolve all the ads?
        if( m_ads_to_resolve.length < 1 )
        {
            onAllAdsResolved();
        }
    };

    this.notifyPlaybackError = function()
    {
        Logger.log("notifyPlaybackError called in FreewheelPlaylist");
        CrackleVideoObj.notifyPlaybackError();
    };

    // INNOVID INTEGRATION: listen for notification from videos that have an interactive graphics layer
    this.notifyIGAdVideoStarted = function( IGVideoObj )
    {
        Logger.log("notifyIGAdVideoStarted called in FreewheelPlaylist");
        // THIS PLAYLIST DOESN'T KNOW WHAT TO DO WITH IG-LAYERS, SO IT SHOULD NOTIFY IT'S PARENT...
        CrackleVideoObj.notifyIGAdVideoStarted( IGVideoObj );
    };

    // INNOVID INTEGRATION: listen for ended events as well.
    this.notifyIGAdVideoEnded = function( IGVideoObj )
    {
        CrackleVideoObj.notifyIGAdVideoEnded( IGVideoObj );
    };

    function clearAdResolvedListener()
    {
        for ( var i = 0; i < AdManager_TemporalAdSlot.countTotalAds(); i++ )
        {
            var ad_header = AdManager_TemporalAdSlot.getAdHeader( i );
            if( ad_header )
                ad_header.removeResolvedListener( This );
        }
    }

    function onAllAdsResolved()
    {
        Logger.log( 'FreewheelPlaylist onAllAdsResolved' );
        m_ad_ix = 0;
        var freewheel_ad_video = m_ads[ m_ad_ix ];

        if ( freewheel_ad_video )
        {
            if( !freewheel_ad_video.play(adBreak))
            {
                This.onEnded( freewheel_ad_video );
            }
        }
        else{
            clearAdResolvedListener();
            ADForgivenessInstance.startTimer();
            CrackleVideoObj.notifyPlaylistEnded( this );
        }
    }

    function popAdFromResolveArray( ADHeaderObj )
    {
        var tmp = [];
        for(var i in m_ads_to_resolve)
        {
            if( m_ads_to_resolve[i] !== ADHeaderObj )
            {
                tmp.push( m_ads_to_resolve[i] );
            }
        }
        m_ads_to_resolve = tmp;
        return m_ads_to_resolve;
    }
};