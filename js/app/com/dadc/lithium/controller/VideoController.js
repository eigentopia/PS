
include( "js/app/com/dadc/lithium/view/widgets/LoadingWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/TimelineWidget.js" );

var VideoController = function( ParentControllerObj )
{
    var This = this;

    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_is_focussed               = false;

    var m_timeline_widget           = new TimelineWidget();
        m_timeline_widget.setVisible( false );
        m_timeline_widget.getDisplayNode().x = 0;
        m_timeline_widget.getDisplayNode().y = 850;

    var m_subtitle_container        = engine.createContainer();
    m_subtitle_container.y = 900;
    var m_crackle_video;
    var m_media_details_obj;

    var m_loading_widget;
        m_loading_widget = new LoadingWidget( null );
        m_loading_widget.getDisplayNode().x = (1920 * 0.5) - ( AssetLoaderInstance.getImage( "Artwork/loading.png" ).width * 0.5 );
        m_loading_widget.getDisplayNode().y = (1080 * 0.5) - ( AssetLoaderInstance.getImage( "Artwork/loading.png" ).height * 0.5 );

    var m_playback_ready = false;
    var m_subtitles_ready = false;
    var m_show_subtitles = LoggerConfig.CONFIG.SHOW_SUBTITLES ? true : false;

    var m_seek_direction = null;
    var m_last_seek_timer;

    var INITIAL_SEEK_INTERVAL = .6;
    var INTERVAL_INCREMENT = .08;
    var m_seek_interval = INITIAL_SEEK_INTERVAL;
    var m_last_time = 0;

    this.audioVideoUrlSwitch = false;

        // INNOVID INTEGRATION: maintain a reference to any IG videos that are playing
    var m_current_ig_video = undefined;

    // INNOVID INTEGRATION: listen for notification from videos that have an interactive graphics layer
    this.notifyIGVideoStarted = function( IGVideoObj ){
        Logger.log("notifyIGVideoStarted called in VideoController");
        if( m_current_ig_video == undefined ){
            Logger.log("current ig video is undefined. VideoController will add the current IGVideo's IG layer to it's display node");
            // on-start: add the IG layer
            m_master_container.addChild( IGVideoObj.getIGLayer().getDisplayNode() );
            m_current_ig_video = IGVideoObj;
            Logger.log("added...");
            Logger.log("current ig video: ");
            Logger.logObj( m_current_ig_video );
        }else{
            Logger.log( "notifyIGVideoStarted: could not add new IG layer! layer already added." );
        }
    }

    // INNOVID INTEGRATION: listen for ig videos ending
    this.notifyIGVideoEnded = function( IGVideoObj ){
        console.log("IG VIDEO HAS ENDED")
        // on-end: remove the IG layer
        if( IGVideoObj == m_current_ig_video ){
            // INNOVID TODO: CONFIRM THAT LITHIUM ALLOWS US TO REMOVE CHILDREN LIKE THIS
            m_master_container.removeChild( IGVideoObj.getIGLayer().getDisplayNode() );
            m_current_ig_video = undefined;
        }else{
            Logger.log( "notifyIGVideoEnded: could not remove IG layer! layer argued does not match currently visible layer!" );
        }
    }


    this.getParentController =              function() { return m_parent_controller_obj; };
    this.getDisplayNode =                   function() { return m_root_node; };
    this.getControllerName =                function() { return 'VideoController'; };
    this.setFocus =                         function() { m_is_focussed = true; };
    this.unsetFocus =                       function() { m_is_focussed = false; };
    this.requestParentAction =              function( json_data_args ){};
    this.notifyPreparationStatus =          function( controller_id ){};
    this.getUniqueID =                      function(){return m_unique_id;};


    this.open = function( )
    {
        m_root_node.addChild( m_master_container );
        m_last_time = 0;
        m_playback_ready = false;
    };


    this.close = function( )
    {
        subsLoaded = false
        if( m_root_node.contains( m_master_container ) )
            m_root_node.removeChild( m_master_container );
        if( m_crackle_video )
        {
            m_crackle_video.stop();
            m_crackle_video = null;
            UtilLibraryInstance.garbageCollect();
        }
    };


    this.update = function( engine_timer ){
        //Logger.log(engine.stats.memory.available);
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'VideoController update() ' + engine_timer );

        if( m_is_focussed ){
            if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && InputManager.isKeyCurrentlyPressed() && InputManager.getCurrentlyPressedKey() == 271 ) {
                if ( m_timeline_widget.isVisible() ){
                    if( engine_timer > m_last_seek_timer + m_seek_interval ){
                        m_last_seek_timer = engine.getTimer();
                        m_seek_interval -= INTERVAL_INCREMENT;
                        if( m_seek_interval < 0 ) m_seek_interval = 0;
                        m_timeline_widget.scanBackward();
                    }
                }else{
                    m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                    m_timeline_widget.showCursor();
                    m_timeline_widget.setVisible( true );
                }
            }else if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && InputManager.isKeyCurrentlyPressed() && InputManager.getCurrentlyPressedKey() == 272 ) {
                if ( m_timeline_widget.isVisible() ){
                    if( engine_timer > m_last_seek_timer + m_seek_interval ){
                        m_last_seek_timer = engine.getTimer();
                        m_seek_interval -= INTERVAL_INCREMENT;
                        if( m_seek_interval < 0 ) m_seek_interval = 0;
                        m_timeline_widget.scanForward();
                    }
                }else{
                    m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                    m_timeline_widget.showCursor();
                    m_timeline_widget.setVisible( true );
                }
            }else{
                m_last_seek_timer = -1;
                m_seek_interval = INITIAL_SEEK_INTERVAL;
            }

            // INNOVID INTEGRATION: if not undefined IG video, then we need to notify the IG video's IG-layer that we have an update
            if( m_current_ig_video != undefined ){
                // let my layer know!
                m_current_ig_video.getIGLayer().update( engine_timer );
            }

            m_loading_widget.update( engine_timer );
            if( m_crackle_video && m_timeline_widget.isVisible() && m_crackle_video.getCurrentTime() > m_last_time + 1 ){
                m_last_time = m_crackle_video.getCurrentTime();
                m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
            }
            m_timeline_widget.update( engine_timer );
        }
    };

    var currentAudioVideoUrl=null; 
    var currentSubtitleUrl=null;
    var subsLoaded = false

    this.prepareToOpen = function( MediaDetailsObj, audioVideoUrl, subtitleUrl )
    {
        This.audioVideoUrlSwitch = false;
        //Add stuff here for the video stream
        // console.log("1 prepareToOpen with")
        // console.log(audioVideoUrl)
        // console.dir(MediaDetailsObj.getMediaURLs())

        //Is everything the same?
        if(m_media_details_obj == MediaDetailsObj && currentSubtitleUrl == subtitleUrl && currentAudioVideoUrl == audioVideoUrl){
            if(m_crackle_video.isPaused()){
                m_crackle_video.togglePause();
                return;
            }
        }


        m_media_details_obj = MediaDetailsObj;

        // console.log("2 prepareToOpen with")
        // console.log(currentAudioVideoUrl)
        // console.log(subtitleUrl)

        if(currentSubtitleUrl != subtitleUrl){

            currentSubtitleUrl = subtitleUrl
            if(subtitleUrl != null){
                if(!subsLoaded){
                    subsLoaded = true;
                     m_crackle_video.loadSubtitles(subtitleUrl);
                }
                Logger.log("NEW Subtitle URL: " + subtitleUrl);
                AnalyticsManagerInstance.subTitleOnEvent(  );
                m_show_subtitles = true;

            }
            else{
                AnalyticsManagerInstance.subTitleOffEvent(  );
                // if(m_master_container.contains(m_subtitle_container)){
                //     m_master_container.removeChild(m_subtitle_container)
                // }
                // while ( m_subtitle_container.numChildren > 0 ){
                //     m_subtitle_container.removeChildAt( 0 );
                // }
                if(m_crackle_video){
                    m_crackle_video.setSubtitleContainer(null)
                }
                m_show_subtitles = false;
            }

            //Is the media url the same?
            if(currentAudioVideoUrl == audioVideoUrl){
                if(m_show_subtitles ){
                    m_crackle_video.setSubtitleContainer(m_subtitle_container)
                }
                else{
                     m_crackle_video.setSubtitleContainer(null)   
                }
                m_crackle_video.togglePause()
                m_timeline_widget.setPauseStatus(false);
                return;
            }
        }

        if(audioVideoUrl){
            This.audioVideoUrlSwitch = true;
            currentAudioVideoUrl = audioVideoUrl
        }
        else{
            currentAudioVideoUrl = MediaDetailsObj.getMediaURLs()[0].Path;
        }
        
        //this is the default path
        
        while ( m_master_container.numChildren > 0 )
            m_master_container.removeChildAt( 0 );

        while ( m_subtitle_container.numChildren > 0 )
            m_subtitle_container.removeChildAt( 0 );


        m_seek_direction = null;
        m_timeline_widget.setVisible( false );
        m_timeline_widget.setPauseStatus(false);

        m_master_container.addChild( getBackgroundContainer() );
        m_master_container.addChild( m_loading_widget.getDisplayNode() );
        m_master_container.addChild( VideoManagerInstance.getDisplayNode() );
        m_master_container.addChild( m_subtitle_container );
        m_master_container.addChild( m_timeline_widget.getDisplayNode() );


        if ( m_media_details_obj )
        {

            Logger.log("currentAudioVideoUrl: " + currentAudioVideoUrl);
            m_crackle_video = new CrackleVideo( MediaDetailsObj, currentAudioVideoUrl, currentSubtitleUrl, This, This );
            m_crackle_video.setSubtitleContainer(m_subtitle_container)
            
            if(m_last_time>0){
                m_crackle_video.setCurrentTime(m_last_time)
                if(m_crackle_video.isPaused()){
                    m_crackle_video.togglePause();
                }
            }
        }
    };


    this.navLeft = function(){
        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video ){
            m_last_seek_timer = engine.getTimer();
            m_seek_direction = VideoController.SEEK_DIRECTION.RW;

            if( m_timeline_widget.isVisible() ){
                m_timeline_widget.scanBackward();
            }else{
                m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                m_timeline_widget.showCursor();
                m_timeline_widget.setVisible( true );
            }
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().navLeft();
        }
    }
    this.navRight = function(){

//        m_crackle_video.forward();
        Logger.log('VideoController navRight' );

        Logger.log( 'VideoManagerInstance.getCurrentJSVideo() == m_crackle_video ' + ( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video ) );

        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video ){
            m_last_seek_timer = engine.getTimer();
            m_seek_direction = VideoController.SEEK_DIRECTION.FW;

            if( m_timeline_widget.isVisible() ){
                m_timeline_widget.scanForward();
            }else{
                m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                m_timeline_widget.showCursor();
                m_timeline_widget.setVisible( true );
            }

        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().navRight();
        }
    }

    this.navR2 = function() { Logger.log( 'navR2' ); };
    this.navL2 = function() { Logger.log( 'navL2' ); };

    this.navDown = function(){
        Logger.log( 'navDown' );
        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video ){
            if( !m_timeline_widget.isVisible() ){
                m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                m_timeline_widget.showCursor();
                m_timeline_widget.setVisible( true );
            }else{
                Logger.log( 'resetTimer' );
                m_timeline_widget.resetTimer();
            }
        }


        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().navDown();
        }

    }
    this.enterPressed = function(){
        Logger.log( 'VideoController enterPressed' );
        if( m_seek_direction && m_crackle_video.isPlaying() ){
            toggleTimeline();
            m_seek_direction = null;
            if( m_crackle_video.isPaused() ){
                m_timeline_widget.setPauseStatus( false );
                m_crackle_video.togglePause();
            }
            Logger.log( 'setting current time to ' + m_timeline_widget.getSeekTime() );
            m_crackle_video.setCurrentTime( m_timeline_widget.getSeekTime() );

            // Setting to zero here so timeline can be reupdated regardless
            // of what the "real" current time is
            m_last_time = 0;
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().enterPressed();
        }
    }

    this.startPressed = function(){

        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && m_crackle_video.isPlaying() ){
            m_crackle_video.togglePause();
            m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
            m_timeline_widget.showCursor();
            m_timeline_widget.setPauseStatus( m_crackle_video.isPaused() );
            m_timeline_widget.setVisible( true );
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().startPressed();
        }
    }
    this.circlePressed = function(){
        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video ){
            // TODO: Maybe check if resume time is equal to movie's length and then restart the movie?
            //
            //
            // store video progress
            VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), m_crackle_video.getResumeTime() );
            VideoManagerInstance.stop();
            VideoManagerInstance.close();

            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_STOPPED, calling_controller: this}
            );
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().circlePressed();
        }
    }
    this.trianglePressed = function()
    {

        if(m_is_focussed && VideoManagerInstance.getCurrentJSVideo() == m_crackle_video){
            if(m_crackle_video.isPlaying() )
            {
                m_timeline_widget.setVisible(false)
                //toggleTimeline();
               // m_timeline_widget.setVisible(false)
                //m_seek_direction = null;
                if( ! m_crackle_video.isPaused() )
                {
                    m_timeline_widget.setPauseStatus( true );
                    m_crackle_video.togglePause();
                }
                //Logger.log( 'setting current time to ' + m_timeline_widget.getSeekTime() );
                //m_crackle_video.setCurrentTime( m_timeline_widget.getSeekTime() );

                m_last_time = m_crackle_video.getCurrentTime();

                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.OPEN_SUBTITLE_CHOOSER, MediaDetailsObj:m_media_details_obj, currentAV:currentAudioVideoUrl, currentCC:currentSubtitleUrl, calling_controller: this}
                );
            }
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().trianglePressed();
        }
    }
    this.navUp = function(){
        Logger.log( 'navUp' );
        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video ){
            if( !m_timeline_widget.isVisible() ){
                m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                m_timeline_widget.showCursor();
                m_timeline_widget.setVisible( true );
            }else{
                Logger.log( 'resetTimer' );
                m_timeline_widget.resetTimer();
            }
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().navUp();
        }
    }

    this.remotePlay = function(){
        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && m_crackle_video.isPaused() ){
            m_crackle_video.togglePause();
            m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
            m_timeline_widget.showCursor();
            m_timeline_widget.setPauseStatus( m_crackle_video.isPaused() );
            m_timeline_widget.setVisible( true );
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().remotePlay();
        }
    }
    this.remotePause = function(){
        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && !m_crackle_video.isPaused() ){
            m_crackle_video.togglePause();
            m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
            m_timeline_widget.showCursor();
            m_timeline_widget.setPauseStatus( m_crackle_video.isPaused() );
            m_timeline_widget.setVisible( true );
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().remotePause();
        }
    }
    this.remoteStop = function(){
        this.circlePressed();
    }


    /// potentially an issue
    this.notifyPlaybackReady = function()
    {
        Logger.log("notifyPlaybackReady called in VideoController");
        startPlayback();
    };

    this.notifyPlaybackEnded = function()
    {
        subsLoaded = false
        try
        {
            VideoManagerInstance.stop();
            VideoManagerInstance.close();
            VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), m_media_details_obj.getDurationInSeconds() );
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_STOPPED, calling_controller: this}
            );
        }
        catch( e )
        {
            Logger.log( '!!! EXCEPTION notifyPlaybackEnded' );
            Logger.logObj( e );
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR, calling_controller: this}
            );
        }
    };

    this.notifyAdPlaybackStarting = function(){
        Logger.log("notifyAdPlaybackStarting called in VideoController");
        m_timeline_widget.setVisible( false );
        m_seek_direction = null;
    };

    this.notifyAdPlaybackStalling = function(){
        Logger.log("notifyAdPlaybackStalling called in VideoController");

    };

    this.notifyPlaybackError = function(){
        Logger.log( 'VideoController !!!!!!!!!!! PLAYBACK ERROR !!!!!!!!!!!!' );
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR, calling_controller: this}
        );
    };

    function startPlayback(){
        Logger.log( '!!!!!!!!!!! PLAYBACK READY !!!!!!!!!!!!' );
        try
        {
            m_crackle_video.play();
            m_timeline_widget.refreshWidget( 0, m_media_details_obj.getDurationInSeconds(), m_crackle_video.getAdTimePositions() );
        }
        catch( e )
        {
            Logger.log( '!!! EXCEPTION notifyPlaybackReady VideoController' );
            Logger.logObj( e );
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR, calling_controller: this}
            );
        }
    }

    function getOverlayScreen(){ }

    function toggleTimeline()
    {
        Logger.log( 'toggleTimeline()' );
        m_timeline_widget.setVisible( !m_timeline_widget.isVisible() );
    }

    function getBackgroundContainer()
    {
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLACK( 1 ) );
        tmp_slate.height = 5000;
        tmp_slate.width = 5000;

        tmp_container.addChild( tmp_slate );

        return tmp_container;
    }


};

VideoController.SEEK_DIRECTION = {
    FW: 1,
    RW: 2
};