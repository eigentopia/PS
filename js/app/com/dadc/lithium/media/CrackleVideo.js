include( "js/app/com/dadc/lithium/media/FreewheelAdVideo.js" );
include( "js/app/com/dadc/lithium/media/FreewheelPlaylist.js" );
include( "js/app/com/dadc/lithium/util/ADManager.js" );
include( "js/app/com/dadc/lithium/util/Uplynk.js" );
include( "js/app/com/dadc/lithium/view/widgets/SubtitleWidget.js" );
include( "js/app/com/dadc/lithium/parsers/TTMLSubtitle.js" );
include( "js/app/com/dadc/lithium/model/TTMLSubtitleModel.js" );


var CrackleVideo = function( MediaDetailsObj, audioVideoUrl, subtitle_url, PlaybackReadyListener, PlaybackErrorListener )
{
    Logger.shout( "NEW CRACKLE VIDEO CREATED " + audioVideoUrl );
    var This                    = this;
    //This will return the default, or first in the list. This is what was asked for. 
    var m_video_url             = audioVideoUrl;
    var m_media_details_obj     = MediaDetailsObj;
    var m_playback_listeners    = []
    var m_playback_marks_tc     = []
    var m_playback_marks_map    = {};
    var m_previous_time         = 0;
    var m_current_time          = 0;
    var m_playlists             = [];
    var m_omni_events           = [];
    var m_omni_marks            = [];
    var m_subtitle_start_marks  = [];
    var m_subtitle_end_marks    = [];
    var m_marks_finalized       = false;
    var m_video_ended           = false;
    var m_is_paused             = false;
    var m_is_playing            = false;
    var m_subtitle_widget       = new SubtitleWidget( );
    var m_subtitle_url          = subtitle_url;
    var m_subtitle_container;
    var m_ad_manager;
    var m_disposed              = false;

    //Uplynk
    var adManager = Uplynk;
    This.inAd = false;
    var playingAd = null
    This.preRollPlayed = false

    if( !m_video_url ){
        PlaybackErrorListener.notifyPlaybackError( This );
        return;
    }

    Logger.log( 'video url ' + m_video_url );


    // INNOVID INTEGRATION: listen for notification from videos that have an interactive graphics layer
    this.notifyIGAdVideoStarted = function( IGVideoObj )
    {
        Logger.log("CrackleVideo.notifyIGAdVideoStarted");
        // CRACKLE VIDEO DOESN'T KNOW WHAT TO DO WITH IG-LAYERS, SO IT SHOULD NOTIFY THE VIDEO CONTROLLER
        PlaybackErrorListener.notifyIGVideoStarted( IGVideoObj );
    };

    // INNOVID INTEGRATION:
    this.notifyIGAdVideoEnded = function( IGVideoObj )
    {
        PlaybackErrorListener.notifyIGVideoEnded( IGVideoObj );
    };

    var uplynkAdOffsets = []
    //Playback URL is here. Bad. 
    this.notifyUplynkUpdated = function(data, status){
        Logger.log( 'Uplynk parse status = ' + status );
        if(data !== null && status == 200){
            
            if(data.ad_info.slots){
                var slots = data.ad_info.slots
                //Uplynk - if an innovid go get the ad and put it in the slot.
                for( var i = 0; i < slots.length; i++ ){
                    var slot = slots[i]
                    var time_position = parseInt(slot.start_time );

                    m_playlists[ time_position ] = slot
                    //Logger.log( 'creating ad slot at ' + time_position );
                    if( time_position >= 0 && time_position <= parseInt( m_media_details_obj.getDurationInSeconds() ) ){
                        This.addPlaybackMark( time_position );
                    }
                }

                m_video_url = adManager.adsData.playURL //+ "&sid="+adManager.adsData.sid

                // if(adManager.hasPreroll){

                //     timeBeforePreroll = m_current_time
                //     m_current_time = 0
                // }  

            }
            
            PlaybackReadyListener.notifyPlaybackReady();
        }else{
            PlaybackErrorListener.notifyPlaybackError();
        }
    }

    this.addPlaybackListener = function( playbackListener ){
        m_playback_listeners[ m_playback_listeners.length ] = playbackListener;
    };

    this.addPlaybackMark = function( double_time_in_seconds ){
        // if marks have not been finalized, more can be added.
        if( ! m_marks_finalized ){
            m_playback_marks_tc[ m_playback_marks_tc.length ] = double_time_in_seconds;
            Logger.log(m_playback_marks_tc.length + " mark added @ " +  double_time_in_seconds );
        }else{
            Logger.log("mark not added");
        }
    };

    this.getVideoURL = function(){return m_video_url + "&hlsver=4";};
    this.getMediaDetailsObj = function(){return m_media_details_obj;};

    this.getResumeTime = function(){return m_current_time;};
    this.getCurrentTime = function(){return m_current_time;};
    this.getWidth = function(){
        try{
            var ratio_w = parseFloat( 1920 / parseFloat(MediaDetailsObj.getDimensionWidth() ) );
            var ratio_h = parseFloat( 1080 / parseFloat(MediaDetailsObj.getDimensionHeight() ) );
            var ratio = ( ratio_w < ratio_h ? ratio_w : ratio_h );
            Logger.log( 'ratio_w = ' + ratio_w );
            Logger.log( 'ratio_h = ' + ratio_h );
            Logger.log( 'getWidth = ' + ( parseFloat( MediaDetailsObj.getDimensionWidth() ) * ratio ) );
            return parseFloat( MediaDetailsObj.getDimensionWidth() ) * ratio;
        }catch( e ){
            return 1920;
        }
    };
    this.getHeight = function(){
        try{
            var ratio_w = parseFloat( 1920 / parseFloat(MediaDetailsObj.getDimensionWidth() ) );
            var ratio_h = parseFloat( 1080 / parseFloat(MediaDetailsObj.getDimensionHeight() ) );
            var ratio = ( ratio_w < ratio_h ? ratio_w : ratio_h );
            Logger.log( 'ratio_w = ' + ratio_w );
            Logger.log( 'ratio_h = ' + ratio_h );
            Logger.log( 'getHeight = ' + ( parseFloat( MediaDetailsObj.getDimensionHeight() ) * ratio ) );
            return parseFloat( MediaDetailsObj.getDimensionHeight() ) * ratio;
        }catch( e ){
            return 1080;
        }
    };
    this.play = function()
    {
        Logger.shout("CrackleVideo.play() called");
        // For Event52
        AnalyticsManagerInstance.resetTime();
        //Comscore.clearPlaylist()
        //Comscore.startPlaylist(m_media_details_obj)

        if( ! m_marks_finalized ){
            finalizePlaybackMarks();
        }
        // IF SUBS ARE NEEDED && SUBS ARE *NOT* RESOLVED YET RESOLVE THEM. onResoved: ACTUALLY PLAY
        Logger.log("SUBS URL: " + m_subtitle_url)
        if( m_subtitle_url && ! m_subtitle_widget.subtitlesObjectReady() )
        {
            Logger.log("subtitles are required and not ready yet. will begin the loading process");
            This.loadSubtitles(m_subtitle_url);
        }
            // ELSE PLAYBACK CAN HAPPEN NOW.
        else
        {
            Logger.log("subtitles are not required OR are already resolved");
            playCrackleVideo()
        }
    };

    var currentVideoEndCreditMark = null

// local func to start CrackleVideo
    function playCrackleVideo()
    {
        Logger.log("CrackleVideo.playCrackleVideo()");
        
        //Scrub from somewhere to zero- play preroll or not?
        if(adManager.hasPreroll){
            timeBeforePreroll = m_current_time
            m_current_time = 0
        }

                //This needs to be moved.
        currentVideoEndCreditMark = m_media_details_obj.data.EndCreditStartMarkInMilliSeconds/1000;
        if(m_media_details_obj.data.EndCreditStartMarkInMilliSeconds == null){
            currentVideoEndCreditMark = m_media_details_obj.data.DurationInSeconds - 10
        }

        VideoManagerInstance.play( This )

    };

    // onResolved
    //  NOW PLAY THE VIDEO

    this.pause = function( state ){
        VideoManagerInstance.pause( state );
    };
    this.notifyPlaybackError = function(){
        PlaybackErrorListener.notifyPlaybackError( This );
    };
    this.stop = function(){
        Logger.log("stop called in CrackleVideo");
        if( VideoManagerInstance.getCurrentJSVideo() === this ){
            try{
                Logger.log("will stop");
                m_disposed = true;
                VideoManagerInstance.stop( );
                VideoManagerInstance.close( );
                // MILAN: ON CHANGE SUBTITLE AD FORGIVENESS
                ADSubtitleForgivenessInstance.startTimer( /*m_media_details_obj.getID()*/ m_video_url );
            }
            catch(e){Logger.logObj(e);}

        }else{
            Logger.log("will not stop");
        }
    };


    // DETECT MARK REACHED EVENTS AND DISPATCH
    this.onTimeUpdate = function( currentTime, currentPTS ){

       Logger.log("currentTime: " + currentTime );
     Logger.log("currentPTS: " + currentPTS );
     Logger.log("m_current_time: " +m_current_time);
     Logger.log( "-" );
        m_previous_time = m_current_time;
        m_current_time = currentTime;
        // Check if we have fired video started omniture event
        // If not, fire it
        if ( m_omni_events.indexOf( CrackleVideo.OMNIEVENTS.VIDEOSTARTED ) < 0 ){
            Logger.log( '*** FIRING VIDEO START ***' );
            m_omni_events.push( CrackleVideo.OMNIEVENTS.VIDEOSTARTED );
            AnalyticsManagerInstance.fireVideoStartEvent( MediaDetailsObj );
        }
        //check for inad here
        if(This.inAd == true){
            console.log("IN AD")
            //for uplynk ads
            if(playingAd != null && (playingAd.end_time && m_current_time >= playingAd.end_time)){
                console.log("After AD")
                if(!This.preRollPlayed){
                    console.log("PreRoll not played")
                    This.preRollPlayed = true
                    if(timeBeforePreroll>0 && timeBeforePreroll <playingAd.end_time){
                        VideoManagerInstance.setCurrentTime(timeBeforePreroll)
                        timeBeforePreroll=0
                    }
                }
                
                //VideoProgressManagerInstance.setProgress(m_media_details_obj.getID(), m_current_time)
                
                PlaybackReadyListener.inAd = false
                playingAd = null
                This.inAd = false
                return;      
            }
        }
        else{
            if(!m_is_playing){
                m_is_playing = true;
            }
        }

        for( var i = 0; i < m_playback_marks_tc.length; i++ ){
            // MILAN: ADDED >= FOR FIRST TIMECHECK

            if( m_playback_marks_tc[i] >= m_previous_time && m_playback_marks_tc[i] < m_current_time && ( ( m_current_time - 2 ) < m_playback_marks_tc[i] ) ){
                var mark_number = m_playback_marks_map[ m_playback_marks_tc[ i ] ];
                var time_pos = m_playback_marks_tc[ i ];

                Logger.log("------------- mark hit! " +  time_pos );
                Logger.log("------------- mark number is: " +  mark_number );

                // Playlist mark?
                if ( m_playlists[ time_pos ] && ADForgivenessInstance.shouldPlayAds( m_media_details_obj.getScrubbingForgiveness() ) ){

                    //figure out which type of ad
                    //if( m_current_timem_playlists[ time_pos ].start_time + m_playlists[ time_pos ].durtation && This.inAd == false){
                        //This.inAd = true
                    //}
                    Logger.log( 'playlist AD mark' );
                   //if(time_pos < 0.1  && )
                    //VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), m_current_time)
                    //if(time_pos >= 0 && time_pos < 0.1){
                    //VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), m_current_time + m_playlists[ time_pos ].end_time )
                    playAd( time_pos );
                    return
                }

                // Omniture mark?
                if ( m_omni_marks[ time_pos ] ){
                    Logger.log( 'omniture mark' );
                    switch( m_omni_marks[ time_pos ] ){
                        case CrackleVideo.OMNIEVENTS.PCT25:
                            if ( m_omni_events.indexOf( CrackleVideo.OMNIEVENTS.PCT25 ) < 0 ){
                                m_omni_events.push( CrackleVideo.OMNIEVENTS.PCT25 );
                                AnalyticsManagerInstance.fireVideo25PctEvent( MediaDetailsObj);
                            }
                            break;
                        case CrackleVideo.OMNIEVENTS.PCT50:
                            if ( m_omni_events.indexOf( CrackleVideo.OMNIEVENTS.PCT50 ) < 0 ){
                                m_omni_events.push( CrackleVideo.OMNIEVENTS.PCT50 );
                                AnalyticsManagerInstance.fireVideo50PctEvent( MediaDetailsObj );
                            }
                            break;
                        case CrackleVideo.OMNIEVENTS.PCT75:
                            if ( m_omni_events.indexOf( CrackleVideo.OMNIEVENTS.PCT75 ) < 0 ){
                                m_omni_events.push( CrackleVideo.OMNIEVENTS.PCT75 );
                                AnalyticsManagerInstance.fireVideo75PctEvent( MediaDetailsObj );
                            }
                            break;
                        case CrackleVideo.OMNIEVENTS.VIDEOCOMPLETE:
                            if ( m_omni_events.indexOf( CrackleVideo.OMNIEVENTS.VIDEOCOMPLETE ) < 0 ){
                                m_omni_events.push( CrackleVideo.OMNIEVENTS.VIDEOCOMPLETE );
                                AnalyticsManagerInstance.fireVideoCompleteEvent( MediaDetailsObj );
                            }
                            break;
                    }
                }


                if(PlaybackReadyListener.m_show_subtitles == true ){
                    // Subtitles end mark
                    if( m_subtitle_end_marks[ time_pos] ){
                        Logger.log( 'sub end_mark: ' + m_subtitle_end_marks[ time_pos ] );
                        m_subtitle_widget.displaySubtitleLine( null );
                    }

                    // Subtitles start mark
                    if( m_subtitle_start_marks[ time_pos ] ){
                        Logger.log( 'sub start_mark: ' + m_subtitle_start_marks[ time_pos ]  );
                        m_subtitle_widget.displaySubtitleLine( m_subtitle_start_marks[ time_pos ] );
                    }
                }
                break;
            }

        }
    };
    
    this.onEnded = function(){
        //Uplynk
        Logger.log( 'CrackleVideo onEnded()' );
        m_video_ended = true;
        //Comscore.sendEnd(m_current_time * 1000)
        // DO we have a postroll?
        // if( m_playlists[ m_media_details_obj.getDurationInSeconds() ] && ADForgivenessInstance.shouldPlayAds( m_media_details_obj.getScrubbingForgiveness() ) ){
        //     playAd( m_media_details_obj.getDurationInSeconds() );
        // }else{
            //ConvivaIntegration.cleanUpSession();
            PlaybackReadyListener.notifyPlaybackEnded();
        //}
    };

    this.onError = function(){
        m_disposed = true;
        //ConvivaIntegration.cleanUpSession();
        VideoManagerInstance.stop();
        VideoManagerInstance.close();
        notifyListeners( new PlaybackError( VideoManagerInstance.getPlaybackTimePTS() ) );
    };

    this.onOpened = function(){
        // if(ConvivaIntegration.sessionId == null){
        //     ConvivaIntegration.createSession(parentVideo, m_video_url, m_media_details_obj)
        // }
            
        // ConvivaIntegration.attachStreamer(parentVideo)
        //ConvivaIntegration.attachStreamer()
        //Comscore.sendClip(m_current_time)
        // var video_config = VideoManagerInstance.getCurrentJSVideo().getVideoConfig()
        // if(video_config["content-type"] == "video/m3u8"){
        //     ConvivaIntegration.attachStreamer()
        // }
    }

    this.onPlaying = function(){
    // DAN: instead of beginning the timer at the end of an ad, begin it when we actually start watching a video,
    // ads will flag the ADForgiveness object to disregard this call when neccessary
        ADForgivenessInstance.startTimer();
        notifyListeners( new PlayingEvent( VideoManagerInstance.getPlaybackTimePTS() ) );
        //Comscore.sendPlay(m_current_time * 1000)
        // DAN & MILAN: videoView analytic call
        //m_ad_manager.sendVideoViewCallback();
        //ConvivaIntegration.attachStreamer()
    };

    this.onTextDisplay = function(TextInfo){
        //if(PlaybackReadyListener.m_show_subtitles == true ){
            m_subtitle_widget.displayText( TextInfo );
        //}
    }

    //this.stCallback = null
    this.loadSubtitles = function(url){
        Logger.log("loadSubtitles called");
        //This.stCallback = cb
        // MILAN: MOVED SUBTITLE REQUEST TO TTMLSubtitleModel.js
        try{
            m_subtitle_url = url.replace( 'media/', '' );
            Logger.log( 'closed_caption_path = ' + m_subtitle_url );

            var subtitleModelRequest = new TTMLSubtitleModelRequest(m_subtitle_url, onSubtitlesCallback);
            subtitleModelRequest.startRequest();
        }catch( e ){
            Logger.log( '!!! EXCEPTION loadSubtitles' );
            Logger.logObj( e );
            m_subtitle_widget.setSubtitlesFailed();
            //PlaybackReadyListener.notifySubtitlesError();
            PlaybackReadyListener.notifyPlaybackReady();
        }
    }
    function onSubtitlesCallback( data, status ){
        Logger.shout( 'onSubtitlesCallback ' + status );
        //console.dir(data)
        if (status !== 200) {
            Logger.log("Failed to load subtitle: " + status);
        } else if (!m_disposed) {
            Logger.log("Subtitle loaded");

            if(status !== 200){
                Logger.log( '!!! EXCEPTION onSubtitlesCallback' );
                m_subtitle_widget.setSubtitlesFailed();
                PlaybackReadyListener.notifyPlaybackReady()
            }
            else{
                
                // MILAN: DATA PARSING MOVED TO TTMLSubtitleModel.js
                var subtitle_lines = data.getSubtitleLines;

                // Loop through each subtitle line and add playback marks to both
                // begin and end position

                //Add the offset here for subs mark.
                var adArray = adManager.adsData.ad_info.slots
                
                for( var subidx in subtitle_lines ){
                    var adOffsetTime = 0
                    var subtitle = subtitle_lines[ subidx ];
                    var startMark = subtitle.getBegin.seconds
                    var endMark = subtitle.getEnd.seconds
                    if(adArray.length){
                        for (var i= 0 ; i<adArray.length; i++){
                            var ad = adArray[i]
                            if(endMark > ad.end_time){
                                adOffsetTime += ad.end_time - ad.start_time;
                            }
                            else if( (ad.start_time >= startMark) && (ad.end_time <= endMark) ){
                                console.log("inside")
                                adOffsetTime += ad.end_time - ad.start_time;
                            }
                        }
                    }
                    m_subtitle_start_marks[ startMark + adOffsetTime ] = subtitle;
                    m_subtitle_end_marks[ endMark + adOffsetTime ] = subtitle;
                    This.addPlaybackMark( startMark + adOffsetTime );
                    This.addPlaybackMark( endMark + adOffsetTime );
                }


                m_subtitle_widget.refreshWidget( data.getParsedSubtitleObj );
                PlaybackReadyListener.subsLoaded();
            }
        } else {
            
            Logger.log("disposed of subtitles");
        }
    }

    this.onStalled = function(){
        notifyListeners( new PlaybackStalledEvent( VideoManagerInstance.getPlaybackTimePTS() ) );
    };

    this.notifyPlaybackEvent = function( playbackEventObj, VideoObj ){
        Logger.log("notify playback event");
    }
    
    this.checkIsPlaybackReady = function(){
        Logger.log("checkIsPlaybackReady called in CrackleVideo");
        // if ( ! m_ad_manager.hasPreroll() ){
        //     PlaybackReadyListener.notifyPlaybackReady();
        // }else{
        //     if ( m_ad_manager.isPrerollReady() ){
        //         PlaybackReadyListener.notifyPlaybackReady();
        //     }
        // }

        if(adManager.receivedAds)
            PlaybackReadyListener.notifyPlaybackReady();
    };

    this.notifyPlaylistEnded = function(){
        Logger.log("notifyPlaylistEnded");
        if( !m_video_ended ){
            Logger.log("notifyPlaylistEnded NOT ENDED");
            if( m_subtitle_container ){
                addSubtitleContainer();
            }
            
            playCrackleVideo();
        
        }else{
            PlaybackReadyListener.notifyPlaybackEnded();
        }
    };

    // generates a config for the engine.createVideo calls
    this.getVideoConfig = function(){
        return VideoManager.VIDEOCONFIG.TYPE_PROGRESSIVE;
    };

    this.getAdTimePositions = function(){
        //Uplynk- this is used to set marks I think

        //M_playlists should be uplynk time data 
        var time_pos = [];

        //Logger.log( 'getAdTimePositions' );

        for( var i in m_playlists ){
            //Logger.log( 'i = ' + i );
            if ( parseInt( i ) > 0 && parseInt( i ) < parseInt( m_media_details_obj.getDurationInSeconds() ) ){
                //Logger.log( 'i OK' );
                time_pos.push( i );
            }
        }

        //Logger.log( 'm_media_details_obj.getDurationInSeconds() = ' + m_media_details_obj.getDurationInSeconds() );
        return time_pos;
    };
    this.setCurrentTime = function( time_pos ){
        var prev_time = m_current_time;
        var last_diff = 99999999;
        var last_ad = -1;

        //m_is_playing = false;

        m_subtitle_widget.displaySubtitleLine( null );
        console.log("JS SETCURRENT "+ time_pos)

        //You've already seen the preroll?
        if( time_pos < adManager.preRollDuration){
            if(adManager.hasPreroll && This.preRollPlayed){
                time_pos +=  adManager.preRollDuration
            }
        }

        // if( time_pos === m_media_details_obj.getDurationInSeconds() || time_pos > m_media_details_obj.getDurationInSeconds() ){
        //     PlaybackReadyListener.notifyPlaybackEnded();
        //     return;
        // }

        //Set the time to the begining of an ad break if you seek in to one?
        // var adArray = adManager.adsData.ad_info.slots
        // for(var i=0;i <adArray.length; i++){
        //     var ad = adArray[i]
        //     if((ad.start_time && time_pos >= ad.start_time) && (ad.end_time && time_pos <= ad.end_time) ){
        //         if( ADForgivenessInstance.shouldPlayAds( m_media_details_obj.getScrubbingForgiveness() ) && 
        //             m_current_time < currentVideoEndCreditMark){
        //             m_is_playing = false
        //             time_pos = ad.start_time
        //         }
        //         else{
        //             m_is_playing = true
        //             time_pos = ad.end_time +.01
        //         }
                
        //         break
        //     }

        // }

        m_current_time = time_pos;
        VideoManagerInstance.setCurrentTime( time_pos );

        //m_is_paused = false;
        Logger.log( 'CrackleVideo.setCurrentTime ' +time_pos);
        Logger.log( 'CrackleVideo.DURATION' +m_media_details_obj.getDurationInSeconds());

    };
    this.togglePause = function(){
        m_is_paused = !m_is_paused;
        if(m_is_paused){
            VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), m_current_time);
            //Comscore.sendPause(m_current_time *1000)
        }
        this.pause( m_is_paused );
    };
    this.isPaused = function(){
        return m_is_paused;
    };
    this.isPlaying = function(){
        return m_is_playing;
    };
    this.setSubtitleContainer = function( subtitle_container ){

        if(subtitle_container === null){
            removeSubtitleContainer()
            m_subtitle_container = subtitle_container;
        }
        else{
            m_subtitle_container = subtitle_container;
            addSubtitleContainer();
        }
        // TESTING: THIS SEEMS TO NOT BE NEEDED, REDUNDANT W/ VIDEO CONTROLLER
//        while( m_subtitle_container.numChildren > 0 ){
//            m_subtitle_container.removeChildAt( 0 );
//        }
        
    };

var timeBeforePreroll = 0;

    function playAd( adIndex ){
        //Uplynk- pause for innovid, hide timeline for everything else.
        Logger.log("play ad called: index " + adIndex);
        if( typeof m_playlists[ adIndex ] !== "undefined" ){
            if(adIndex == 0){
                //This.preRollPlayed = true;
                //ConvivaIntegration.createSession(null, m_video_url, m_media_details_obj)
                //ConvivaIntegration.adStart();

            }

            This.inAd = true;
            playingAd = m_playlists[adIndex]
            if( m_subtitle_container ) removeSubtitleContainer();

            //ConvivaIntegration.detachStreamer();

            PlaybackReadyListener.notifyAdPlaybackStarting();
            //m_playlists[ adIndex ].play(adIndex);
            
            
            //return true;
        }
        else{
            Logger.log("CrackleVideo.playAd(" + adIndex + ") - index in m_playlists is undefined");
            This.inAd = false;
            playingAd = null
            //return false;
        }
    }

    function removeSubtitleContainer(){
        Logger.log("remove subtitle container called");
        //m_subtitle_widget.setSubtitlesFailed()
        if( m_subtitle_container && m_subtitle_container.contains( m_subtitle_widget.getDisplayNode() ) ){
            m_subtitle_container.removeChild( m_subtitle_widget.getDisplayNode() );
        }
    }
    function addSubtitleContainer(){
        Logger.shout( 'addSubtitleContainer() called *NEW*' );

        if( m_subtitle_container ){
            Logger.log("m_subtitle_container is defined, removing subtitle container children");
            while( m_subtitle_container.numChildren > 0 ){
                Logger.log("child found... removing.");
                m_subtitle_container.removeChildAt( 0 );
            }
            Logger.log( 'addSubtitleContainer OK, children removed.' );

            m_subtitle_container.addChild( m_subtitle_widget.getDisplayNode() );

        }else{
            Logger.log("m_subtitle_container is not defined, cannot add it.");
        }
    }

    function addMarks(){
        var duration = MediaDetailsObj.getDurationInSeconds();

        m_omni_marks[ duration * .25 ] = CrackleVideo.OMNIEVENTS.PCT25;
        m_omni_marks[ duration * .5 ] = CrackleVideo.OMNIEVENTS.PCT50;
        m_omni_marks[ duration * .75 ] = CrackleVideo.OMNIEVENTS.PCT75;
        m_omni_marks[ duration * .95 ] = CrackleVideo.OMNIEVENTS.VIDEOCOMPLETE;
        // Omniture marks
        This.addPlaybackMark( duration * .25 );
        This.addPlaybackMark( duration * .5 );
        This.addPlaybackMark( duration * .75 );
        This.addPlaybackMark( duration * .95 );
    }

    function processAdSlots(){

        //Uplynk - if an innovid go get the ad and put it in the slot.
        for( var i = 0; i < m_ad_manager.getTotalTemporaAdSlots(); i++ ){
            var temporal_ad_slot = m_ad_manager.getTemporaAdSlot( i );
            var time_position = parseInt( temporal_ad_slot.getTimePosition() );

            m_playlists[ time_position ] = new FreewheelPlaylist( temporal_ad_slot, This );
            //Logger.log( 'creating ad slot at ' + time_position );
            if( time_position > 0 && time_position < parseInt( m_media_details_obj.getDurationInSeconds() ) ){
                This.addPlaybackMark( time_position );
            }
        }
    }
    function adUplynkMarks(){
        var slots = adManager.adsData.ad_info.slots
        //Uplynk - if an innovid go get the ad and put it in the slot.
        for( var i = 0; i < slots.length; i++ ){
            var slot = slots[i]
            var time_position = parseInt(slot.start_time );

            m_playlists[ time_position ] = slot
            //Logger.log( 'creating ad slot at ' + time_position );
            if( time_position > 0 && time_position < parseInt( m_media_details_obj.getDurationInSeconds() ) ){
                This.addPlaybackMark( time_position );
            }
        }
    }

    function finalizePlaybackMarks(){
        m_playback_marks_tc.sort( function( a, b ){return a - b;} );
        for( var i = 0; i < m_playback_marks_tc.length; i++ ){
            // create an object entry: time => mark number (eg: 4351112 => 56)
            m_playback_marks_map[ m_playback_marks_tc[ i ] ] = ( i + 1 );
        }
    }


    function notifyListeners( playbackEventObj ){
        Logger.log("notifyListeners called in CrackleVideo");
        Logger.log("event type: " + playbackEventObj.getEventType());
        Logger.log("number of listeners: " + m_playback_listeners.length );

        if(playbackEventObj.getEventType() == 9){
            console.log("*****ERROR TOWN")
            PlaybackErrorListener.notifyPlaybackError( This );
        }
        
        if(playbackEventObj.getEventType() == 7){
            console.log("GOT PLAY EVBENT PODCOMPLETE TO FALSE")
            ADForgiveness.podComplete = false;
        }

        for( var i = 0; i < m_playback_listeners.length; i++ ){
            try
            {
                Logger.log("notify listener " + i);
                m_playback_listeners[ i ].notifyPlaybackEvent( playbackEventObj, This );
            }
            catch( e )
            {
                Logger.log("CrackleVideo.notifyListeners() - EXCEPTION RAISED");
                Logger.logObj( e );
            }
        }
    }

    function getVideoURLFromList( list ){
        for( var i in list ){
            var video_urls = list[ i ];
            //Logger.logObj( video_urls );
            if ( video_urls && video_urls.Type && video_urls.Type === ApplicationController.PLATFORM.toUpperCase()+'_Trilithium.m3u8' ){
                return video_urls.Path;
            }
        }
        for( var i in list ){
            var video_urls = list[ i ];
            if ( video_urls && video_urls.Type && video_urls.Type === 'iPad_Wifi.m3u8' ){
                return video_urls.Path;
            }
        }
        return null;
    }

    function populateOmniMarksBeforeCurrentTime(){
        // Populate Omniture array so we don't fire Omniture events again
        if( m_current_time > 0 ){
            m_omni_events.push( CrackleVideo.OMNIEVENTS.VIDEOSTARTED );

            var duration = MediaDetailsObj.getDurationInSeconds();

            if( m_current_time > duration * 0.25 ){
                m_omni_events.push( CrackleVideo.OMNIEVENTS.PCT25 );
            }
            if( m_current_time > duration * 0.5 ){
                m_omni_events.push( CrackleVideo.OMNIEVENTS.PCT50 );
            }
            if( m_current_time > duration * 0.75 ){
                m_omni_events.push( CrackleVideo.OMNIEVENTS.PCT75 );
            }
            if( m_current_time > duration * 0.95 ){
                m_omni_events.push( CrackleVideo.OMNIEVENTS.VIDEOCOMPLETE );
            }
        }
    }
    //Uplynk - adManager should now be uplynk data
    // m_ad_manager = new ADManager( MediaDetailsObj, this );

    // var ep = MediaDetailsObj.getEpisode();

    // // DAN says: "I've always wondered if theres a better way to decide if its a movie or show"
    // m_ad_manager.prepare( ep ? FreewheelMediaType.SHOW : FreewheelMediaType.MOVIE );

    //var uplynkUrl = MediaDetailsObj.getUplynkURLFromList()

    adManager.getAds(m_video_url, this.notifyUplynkUpdated)

    addMarks();

    // Set the current time to the previously played time, if it exists
    try{
        
        if( VideoProgressManagerInstance.getProgress( MediaDetailsObj.getID() ) ){
            Logger.log( 'setting progress time to ' + VideoProgressManagerInstance.getProgress( MediaDetailsObj.getID() ) );
            populateOmniMarksBeforeCurrentTime();

            m_current_time = VideoProgressManagerInstance.getProgress( MediaDetailsObj.getID() );

            if( m_current_time === m_media_details_obj.getDurationInSeconds() ){
                // Restart playback if user has watched the entire media
                m_current_time = 0;
            }
        }

    }catch( e ){
        Logger.log( 'CrackleVideo set current time: Exception!' );
    }
};


CrackleVideo.OMNIEVENTS = {
    VIDEOSTARTED: 1,
    PCT25: 2,
    PCT50: 3,
    PCT75: 4,
    VIDEOCOMPLETE: 5
};

var PlaybackEvent = function( ){ };

PlaybackEvent.TYPE = {
    PAUSED: 0,
    UNPAUSED: 1,
    STARTED: 2,
    ENDED: 3,
    STOPPED: 4, // timecode passed
    MARKREACHED: 5, // mark index passed, timecode passed
    PLAYING: 7,
    STALLED: 8,
    ERROR: 9,
    ENDOFMEDIA: 10
};

var EndOfMediaEvent = function(){
    this.getEventType = function(){return PlaybackEvent.TYPE.ENDOFMEDIA;};
};

var PlaybackError = function( current_time ){
    this.getTime = function(){return current_time;};
    this.getEventType = function(){return PlaybackEvent.TYPE.ERROR;};
};

var PlaybackStalledEvent = function( current_time ){
    this.getTime = function(){return current_time;};
    this.getEventType = function(){return PlaybackEvent.TYPE.STALLED;};
};

var PlayingEvent = function( ){
    this.getEventType = function(){return PlaybackEvent.TYPE.PLAYING;};
};

var MarkReachedEvent = function( mark_reached_number, current_time ){
    this.getMarkNumber = function(){return mark_reached_number;};
    this.getTime = function(){return current_time;};
    this.getEventType = function(){return PlaybackEvent.TYPE.MARKREACHED;};
};

var StoppedEvent = function( current_time ){
    this.getTime = function(){return current_time;};
    this.getEventType = function(){return PlaybackEvent.TYPE.STOPPED;};
};

var PausedEvent = function( current_time ){
    this.getTime = function(){return current_time;};
    this.getEventType = function(){return PlaybackEvent.TYPE.PAUSED;};
};

var UnPausedEvent = function( current_time ){
    this.getTime = function(){return current_time;};
    this.getEventType = function(){return PlaybackEvent.TYPE.UNPAUSED;};
};