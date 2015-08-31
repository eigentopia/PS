
include( "js/app/com/dadc/lithium/view/widgets/LoadingWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/TimelineWidget.js" );

var VideoController = function( ParentControllerObj )
{
    var This = this;

    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var isFocused               = false;

    var m_timeline_widget           = new TimelineWidget();
        m_timeline_widget.setVisible( false );
        m_timeline_widget.getDisplayNode().x = 0;
        m_timeline_widget.getDisplayNode().y = 870;

    var m_subtitle_container        = engine.createContainer();
    m_subtitle_container.y = 885;
    var m_crackle_video;
    var m_media_details_obj;

    var m_loading_widget;
        m_loading_widget = new LoadingWidget( null );
        m_loading_widget.getDisplayNode().x = (1920 * 0.5) - ( AssetLoaderInstance.getImage( "Artwork/loading.png" ).width * 0.5 );
        m_loading_widget.getDisplayNode().y = (1080 * 0.5) - ( AssetLoaderInstance.getImage( "Artwork/loading.png" ).height * 0.5 );

    var m_playback_ready = false;
    var m_subtitles_ready = false;
    this.m_show_subtitles = LoggerConfig.CONFIG.SHOW_SUBTITLES ? true : false;

    var m_seek_direction = null;
    var m_last_seek_timer;

    var INITIAL_SEEK_INTERVAL = .6;
    var INTERVAL_INCREMENT = .08;
    var m_seek_interval = INITIAL_SEEK_INTERVAL;
    var m_last_time = 0;

    //stuff for UpNext
    var totalVideosPlayed= 0;
    var currentVideoEndCreditMark= null;
    var nextVideoOverlay = null
    var nextVideoContinueOverlay = null
    var currentMediaList = null
    var currentMediaListIndex = 0;
    var startingMediaListIndex = 0;
    var continueCalled = false
    var userOptOut = false

    //For disabling the controls during Uplynk ad.
    this.inAd = false
    

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
            This.inAd   = true
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
        This.inAd   = false
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
    this.setFocus =                         function() { isFocused = true; };
    this.unsetFocus =                       function() { isFocused = false; };
    this.requestParentAction =              function( json_data_args ){};
    this.notifyPreparationStatus =          function( controller_id ){};
    this.getUniqueID =                      function(){return m_unique_id;};


    this.open = function( )
    {
        m_root_node.addChild( m_master_container );
        totalVideosPlayed = 0
        m_last_time = 0;
        m_playback_ready = false;

        totalVideosPlayed= 0;
        currentVideoEndCreditMark= null;
        nextVideoOverlay = null
        nextVideoContinueOverlay = null
        currentMediaList = null
        currentMediaListIndex = 0;
        startingMediaListIndex = 0;
        continueCalled = false
        userOptOut = false
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
            //UtilLibraryInstance.garbageCollect();
        }
    };


    this.update = function( engine_timer ){
        //Logger.log(engine.stats.memory.available);
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'VideoController update() ' + engine_timer );

        if( isFocused ){
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

        if ( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && m_crackle_video.isPlaying() &&
            m_crackle_video.getCurrentTime() >= currentVideoEndCreditMark){
            //Show the overlay- remember the conditions in enterpressed.
            var nextIndex = (currentMediaListIndex + 1 <= currentMediaList.length -1)?currentMediaListIndex + 1:0 //loop back
            if(nextIndex !== startingMediaListIndex){ //have we finished the whole list?

                nextVideo = currentMediaList[nextIndex];
    
                if (continueCalled == false && !nextVideoContinueOverlay && totalVideosPlayed == 5 ){
                    //show would you like to continue
                    openNextVideoContinueOverlay();
                    return;
                }

                if((!nextVideoOverlay&& userOptOut == false) && totalVideosPlayed < 5){//} && userOptOut == false){ //More to play? If the tvp hasn't been reset we skip this part.
                    openNextVideoOverlay();       
                }
            }
         }
    };

    function openNextVideoContinueOverlay(){
        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && m_crackle_video.isPlaying() ){
            m_crackle_video.togglePause();
        }
        m_timeline_widget.setVisible( false );
        nextVideoContinueOverlay = new ContinueWidget()
        nextVideoContinueOverlay.rootNode.x=1920/2 - 920/2
        nextVideoContinueOverlay.rootNode.y=1080/2 - 325/2

        m_root_node.addChild(nextVideoContinueOverlay.rootNode)
        //position

    }

    function closeNextVideoContinueOverlay(){
        if(nextVideoContinueOverlay != null){
            m_root_node.removeChild(nextVideoContinueOverlay.rootNode)

            nextVideoContinueOverlay = null;
            if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && m_crackle_video.isPlaying() ){
                m_crackle_video.togglePause();
            }
        }
    }

    function openNextVideoOverlay(){

        m_timeline_widget.setVisible( false );
        nextVideoOverlay = new NextVideoWidget(nextVideo)
        nextVideoOverlay.x = 1920 - 730 - 10
        nextVideoOverlay.y = 10
        m_root_node.addChild(nextVideoOverlay)
    }

    function closeNextVideoOverlay(){
        if(nextVideoOverlay != null){
            m_root_node.removeChild(nextVideoOverlay)
            nextVideoOverlay = null
        }
    }    

    var currentAudioVideoUrl=null; 
    var currentSubtitleUrl=null;
    var subsLoaded = false

    //should be called before prepareToOpen
    this.setMediaList = function (mediaList){

        currentMediaList = mediaList
    }
    var nextvideo
    this.mediaObj = null;
    this.prepareToOpen = function( MediaDetailsObj, audioVideoUrl, subtitleUrl )
    {
        userOptOut = false
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
        This.mediaObj = MediaDetailsObj
        // console.log("2 prepareToOpen with")
        // console.log(currentAudioVideoUrl)
        // console.log(subtitleUrl)
        //console.log("EndCreditStartMarkInMilliSeconds "+ MediaDetailsObj.data.EndCreditStartMarkInMilliSeconds)
        
        //dont start right at the end if that's where it is. 
        currentVideoEndCreditMark = MediaDetailsObj.data.EndCreditStartMarkInMilliSeconds/1000;
        if(MediaDetailsObj.data.EndCreditStartMarkInMilliSeconds == null){
            currentVideoEndCreditMark = MediaDetailsObj.data.DurationInSeconds - 10
        }
        //console.log("END CREDIT MARK "+currentVideoEndCreditMark)

        if(currentSubtitleUrl != subtitleUrl){

            currentSubtitleUrl = subtitleUrl
            if(subtitleUrl != null){
                if(!subsLoaded){
                    subsLoaded = true;
                    m_crackle_video.loadSubtitles(subtitleUrl);
//                     var tt = url.replace( 'media/', '' );
//                     var video  = VideoManagerInstance.getCoreVideo()
//                     video.addTimedTextTrack(tt, "Track01", "EN", "caption")
//                     video.timedTextTrackSetPosAndDim(video.x, video.y, video.width, video.height)
//                     track = video.textTracks[0];
// //            Logger.logObj( track );
//                     track.resumeTrack();

                }
                Logger.log("1NEW Subtitle URL: " + subtitleUrl);
                AnalyticsManagerInstance.subTitleOnEvent(  );
                This.m_show_subtitles = true;

            }
            else{
                if(m_crackle_video){
                    m_crackle_video.setSubtitleContainer(null)
                }
                This.m_show_subtitles = false;
            }

            //Is the media url the same?
            if(currentAudioVideoUrl == audioVideoUrl){
                if(This.m_show_subtitles ){
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

        //have you given me a AVURL?
        if(audioVideoUrl){
            currentAudioVideoUrl = audioVideoUrl
        }
        else{
            var avUrls = MediaDetailsObj.getMediaURLs()
            if(avUrls != null){ //Make sure the media is there
                currentAudioVideoUrl = MediaDetailsObj.getMediaURLs()[0].Path;
            }
            else{
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
                return;
            }
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
            userOptOut = false;
            Logger.log("currentAudioVideoUrl: " + currentAudioVideoUrl);
            //This should keep the context of the autoPlay list.
            if(currentMediaList == null && MediaDetailsObj.videoContextList){
                currentMediaList = MediaDetailsObj.videoContextList
                for (var i=0; i<MediaDetailsObj.videoContextList.length;i++){
                    if (MediaDetailsObj.data.ID == MediaDetailsObj.videoContextList[i].ID){
                        console.log("FOUND "+ MediaDetailsObj.data.ID+ " AT "+ i)
                        startingMediaListIndex = i
                        currentMediaListIndex = i;
                    }
                }
            }

            //console.log("startingMediaListIndex "+ startingMediaListIndex)

            totalVideosPlayed ++
            continueCalled = false;
            console.log("prepareToOpen is setting CrackleVideo to "+ m_last_time)
            m_crackle_video = new CrackleVideo( MediaDetailsObj, currentAudioVideoUrl, currentSubtitleUrl, This, This );
            m_crackle_video.setSubtitleContainer(m_subtitle_container)

            //check here if next item is show or movie
            if(currentMediaList != null){ 
                
                var nextIndex = (currentMediaListIndex + 1 <= currentMediaList.length-1)?currentMediaListIndex+1:0 //Loop back if you need to
                if(nextIndex !== startingMediaListIndex){
                    nextVideo = currentMediaList[nextIndex]
                    
                    //if show, get list splice in to existing list.
                    if(nextVideo.Season && nextVideo.Season == "" && 
                        (nextVideo.RootChannelID == 114 || nextVideo.RootChannelID == 46)){
                        CrackleApi.Collections.showEpisodeList(currentVideo.ID,
                            function(showList, status){
                                if(showList != false && showList.length){
                                    Array.prototype.splice.apply(currentMediaList, [(currentMediaListIndex+1), 1].concat(showList));
                                }
                            })
                        //this little shuffle will put the index 
                        //back to where it was because we've removed the offender
                        nextVideo = currentMediaList[currentMediaListIndex]
                    }
                    if(nextVideo.ItemType && nextVideo.ItemType == "Channel"){
                            var channel_details_request = new ChannelDetailsRequest( nextVideo.ID, StorageManagerInstance.get( 'geocode' ), function( ChannelDetailsObj, status ){
                            if ( status != 200 ){
                //                // inform our parent controller our request failed
                                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                            }else{
                                var channelId = ChannelDetailsObj.getID();
                                var channel_folder_list_request = new ChannelFolderListRequest( channelId, StorageManagerInstance.get( 'geocode' ), function( ChannelFolderListObj, status ){
                                    if ( status != 200 ){
                                        // inform our parent controller our request failed
                                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                                    }else{

                                        var folder_obj  = ChannelFolderListObj.getItem( 0);
                                        var folder_name = folder_obj.getName();
                                        var playlistListObj = folder_obj.getPlaylistList();

                                        if( playlistListObj.getTotalLockedToChannel() > 0 ){
                                            var playlistObj = playlistListObj.getLockedToChannelItem( 0 );
                                            var item =playlistObj.getMediaList().getItem( 0 );
                                            //console.log("**** iiiget"+item.getID())
                                            //if( ChannelDetailsObj.getFeaturedMedia() == null ){
                                            currentMediaList.splice((currentMediaListIndex+1), 1, item.data)
                                           // }else{
                                           //     doMediaRequest( channelId );
            //                                }
                                        }

                                    }

                                })
                                channel_folder_list_request.startRequest();
                            }
                        });
                        channel_details_request.startRequest();
                    }
                }
            }

            
            if(m_last_time>0){
                console.log("Prepare to open time:"+m_last_time)
                m_crackle_video.setCurrentTime(m_last_time)
                if(m_crackle_video.isPaused()){
                    m_crackle_video.togglePause();
                }
            }
        }
    };


    this.navLeft = function(){
        if(nextVideoContinueOverlay){
            nextVideoContinueOverlay.navLeft();
            return;
        }
        if(!This.inAd){
            if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && nextVideoOverlay == null && nextVideoContinueOverlay == null){
                if(subtitleChooserController !== null){
                    subtitleChooserController.navLeft()
                    return
                }
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
        if(nextVideoContinueOverlay){
            nextVideoContinueOverlay.navRight();
            return;
        }
        if(!This.inAd){
            if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && nextVideoOverlay == null && nextVideoContinueOverlay == null){
                if(subtitleChooserController !== null){
                    subtitleChooserController.navRight()
                    return
                }
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
        if(!This.inAd){
            if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video  && nextVideoOverlay == null && nextVideoContinueOverlay == null){
                if(subtitleChooserController !== null){
                    subtitleChooserController.navDown()
                    return
                }
                if( !m_timeline_widget.isVisible() ){
                    m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                    m_timeline_widget.showCursor();
                    m_timeline_widget.setVisible( true );
                }else{
                    Logger.log( 'resetTimer' );
                    m_timeline_widget.resetTimer();
                }
            }
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().navDown();
        }

    }
    this.enterPressed = function(){
        Logger.log( 'VideoController enterPressed' );
        if(subtitleChooserController !== null){
            subtitleChooserController.enterPressed()
            return
        }
        
        if(nextVideoOverlay){
                        // store video progress
            VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), m_crackle_video.getResumeTime() );
            VideoManagerInstance.stop();
            VideoManagerInstance.close();
            This.playNext()
            return;
        }
        
        if(nextVideoContinueOverlay){
            if(nextVideoContinueOverlay.yesButton.selected()){
                totalVideosPlayed = 0;
                continueCalled = false
            }
            else{
                continueCalled = true;
            }

            closeNextVideoContinueOverlay()
        }
        if(!This.inAd){
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
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().enterPressed();
        }
    }

    this.resumeFrom = function(time){
        toggleTimeline();
        m_seek_direction = null;
        if( m_crackle_video.isPaused() ){
            m_timeline_widget.setPauseStatus( false );
            m_crackle_video.togglePause();
        }
        Logger.log( 'setting resume from time to ' + time );
        m_crackle_video.setCurrentTime( time );

        // Setting to zero here so timeline can be reupdated regardless
        // of what the "real" current time is
        m_last_time = 0;
            
    }

    this.startPressed = function(){
        if(!This.inAd){
            if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && m_crackle_video.isPlaying()  && nextVideoOverlay == null && nextVideoContinueOverlay == null){
                if(subtitleChooserController !== null){
                    //subtitleChooserController.startPressed()
                    return
                }
                m_crackle_video.togglePause();
                m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                m_timeline_widget.showCursor();
                m_timeline_widget.setPauseStatus( m_crackle_video.isPaused() );
                m_timeline_widget.setVisible( true );
            }
        }
        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().startPressed();
        }
    }
    this.circlePressed = function(){
        if(!This.inAd){
            if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video ){
                if(subtitleChooserController !== null){
                    subtitleChooserController.enterPressed()
                    return
                }
                // TODO: Maybe check if resume time is equal to movie's length and then restart the movie?
                //
                if(nextVideoOverlay != null){
                    userOptOut = true;
                    closeNextVideoOverlay();
                    return;
                }
            
                // if(nextVideoContinueOverlay != null){
                //     return;
                // }
                //
                // store video progress
                VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), m_crackle_video.getResumeTime() );
                closeNextVideoOverlay()
                closeNextVideoContinueOverlay()
                VideoManagerInstance.stop();
                VideoManagerInstance.close();

                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_STOPPED, calling_controller: This}
                );
            }
        }
        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().circlePressed();
        }
    }
    this.trianglePressed = function()
    {

        if(VideoManagerInstance.getCurrentJSVideo() == m_crackle_video  && nextVideoOverlay == null && nextVideoContinueOverlay == null){
            if(!This.inAd)
            {
                if(subtitleChooserController !== null){
                    subtitleChooserController.trianglePressed()
                    return
                }
                m_timeline_widget.setVisible(false)
                //toggleTimeline();
               // m_timeline_widget.setVisible(false)
                //m_seek_direction = null;
                if( ! m_crackle_video.isPaused() ){
                    m_timeline_widget.setPauseStatus( true );
                    m_crackle_video.togglePause();
                }
                //Logger.log( 'setting current time to ' + m_timeline_widget.getSeekTime() );
                //m_crackle_video.setCurrentTime( m_timeline_widget.getSeekTime() );

                m_last_time = m_crackle_video.getCurrentTime();

                openSubtitleChooser();

                // m_parent_controller_obj.requestingParentAction(
                //     {action: ApplicationController.OPERATIONS.OPEN_SUBTITLE_CHOOSER, MediaDetailsObj:m_media_details_obj, currentAV:currentAudioVideoUrl, currentCC:currentSubtitleUrl, calling_controller: This}
                // );
            }
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().trianglePressed();
        }
    }
    var subtitleChooserController = null;

    function openSubtitleChooser(){
        subtitleChooserController = new SubtitleChooserController( This );
        // subtitleDisplay.x=600
        // subtitleDisplay.y=600
        isFocused = false
        subtitleChooserController.prepareToOpen(currentAudioVideoUrl, currentSubtitleUrl );
        var subtitleDisplay = subtitleChooserController.getDisplayNode()
        m_root_node.addChild(subtitleDisplay);
        subtitleChooserController.setFocus();
    }

var previousSubUrl=""
    this.closeSubtitleChooser = function(avFile, ccFile){
        m_root_node.removeChild( subtitleChooserController.getDisplayNode() );
       
        subtitleChooserController.unsetFocus();
        subtitleChooserController.close();
        // if( m_subtitle_chooser_controller.getDisplayNode() && m_content_container.contains( m_subtitle_chooser_controller.getDisplayNode() ) )
        //     m_content_container.removeChild( m_subtitle_chooser_controller.getDisplayNode() );
        subtitleChooserController.destroy();
        subtitleChooserController = null;
        isFocused = true;

        //Need new video if new AVUrl
        if(avFile != currentAudioVideoUrl){
            if(ccFile != currentSubtitleUrl){
                //reset all of it
                This.prepareToOpen(m_media_details_obj, avFile, ccFile);
            }
            else{ //just the avFile
                This.prepareToOpen(m_media_details_obj, avFile, currentSubtitleUrl);
            }

        }
        else if(ccFile != currentSubtitleUrl){
            
            currentSubtitleUrl = ccFile
            if(ccFile != null){ //get the file and parse it, turn on subs
            //     var tt = ccFile.replace( 'media/', '' );
            //     console.log("CC File "+ tt)
            //     var video  = VideoManagerInstance.getCoreVideo()
            //     video.addTimedTextTrack(tt, "Track01", "EN", "subtitles")
            //     console.log ("TT "+ video.x +" "+video.y+" "+ video.width+" "+ video.height);
            //     video.timedTextTrackSetPosAndDim(video.x, video.y, video.width, video.height)
            //     This.notifyPlaybackReady()
            //     track = video.textTracks[0];
            // Logger.logObj( track );
                //track.resumeTrack();
                // AnalyticsManagerInstance.subTitleOnEvent(  );
                // This.m_show_subtitles = true;
                // m_crackle_video.setSubtitleContainer(m_subtitle_container)
                if(previousSubUrl != ccFile){
                    previousSubUrl = ccFile;
                    m_crackle_video.loadSubtitles(ccFile);
                    Logger.log("2NEW Subtitle URL: " + ccFile);
                }
                else{
                    This.subsLoaded();
                }

            }
            else{ //no file returned from chooser, shut them off
                AnalyticsManagerInstance.subTitleOffEvent(  );

                if(m_crackle_video){
                    m_crackle_video.setSubtitleContainer(null)
                    m_crackle_video.togglePause()
                }

                This.m_show_subtitles = false;
                currentSubtitleUrl = null;
                m_timeline_widget.setPauseStatus(false);
            }
        }
        else{
            m_crackle_video.togglePause()
        }
    }

    this.subsLoaded = function(){
        AnalyticsManagerInstance.subTitleOnEvent(  );
        This.m_show_subtitles = true;
        m_crackle_video.setSubtitleContainer(m_subtitle_container)
        m_crackle_video.togglePause()
        m_timeline_widget.setPauseStatus(false);

    }

    this.subsFailed = function(){
        m_crackle_video.setSubtitleContainer(null)
        This.m_show_subtitles = false;
        currentSubtitleUrl = null;
        m_crackle_video.togglePause()
        m_timeline_widget.setPauseStatus(false);
    }

    this.navUp = function(){
        Logger.log( 'navUp' );
        if(!This.inAd){
            if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && nextVideoOverlay == null && nextVideoContinueOverlay == null){
                if(subtitleChooserController !== null){
                    subtitleChooserController.navUp()
                    return
                }
                if( !m_timeline_widget.isVisible() ){
                    m_timeline_widget.setTime( m_crackle_video.getCurrentTime() );
                    m_timeline_widget.showCursor();
                    m_timeline_widget.setVisible( true );
                }else{
                    Logger.log( 'resetTimer' );
                    m_timeline_widget.resetTimer();
                }
            }
        }

        // INNOVID INTEGRATION: dispatch key press events
        if( m_current_ig_video != undefined ){
            m_current_ig_video.getIGLayer().navUp();
        }
    }

    this.remotePlay = function(){
        if( VideoManagerInstance.getCurrentJSVideo() == m_crackle_video && m_crackle_video.isPaused() ){
            if(subtitleChooserController !== null){
                return       
            }
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
            if(subtitleChooserController !== null){
                return
            }
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
        This.circlePressed();
    }

    this.playNext = function(){
        currentMediaListIndex ++
        if(currentMediaListIndex > currentMediaList.length -1){
            currentMediaListIndex = 0;
        }

        //prevents hopping to the end if user pressed x before
        VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), 0 );
        m_last_time = 0;
        m_playback_ready = false;
        currentVideo = null;
        var media_details_request = new MediaDetailsRequest( currentMediaList[currentMediaListIndex].ID, StorageManagerInstance.get( 'geocode' ), function( MediaDetailsObj, status ){
            if ( status != 200 ){
                // inform our parent controller our request failed
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
            }else{
                if(nextVideoOverlay){
                    closeNextVideoOverlay()
                }
                This.prepareToOpen(MediaDetailsObj);
            }
        });

        media_details_request.startRequest();
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
            closeNextVideoOverlay()
            closeNextVideoContinueOverlay();
        try
        {
            VideoManagerInstance.stop();
            VideoManagerInstance.close();

            //Is there more in the list?
            var nextIndex = (currentMediaListIndex + 1 <= currentMediaList.length-1)?currentMediaListIndex+1:0 //Loop back if you need to
            if(nextIndex !== startingMediaListIndex && totalVideosPlayed<5){

                This.playNext();
            }
            else{
                
                VideoProgressManagerInstance.setProgress( m_media_details_obj.getID(), 0);
                
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_STOPPED, calling_controller: This}
                );
            }
        }
        catch( e )
        {
            Logger.log( '!!! EXCEPTION notifyPlaybackEnded' );
            Logger.logObj( e );
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR, calling_controller: This}
            );
        }
    };
    
    this.notifyAdPlaybackStarting = function(){
        Logger.log("notifyAdPlaybackStarting called in VideoController");
        m_timeline_widget.setVisible( false );
        m_seek_direction = null;
        This.inAd = true;
    };

    this.notifyAdEnd = function(){
        This.inAd = false;
    }
    this.notifyAdPlaybackStalling = function(){
        Logger.log("notifyAdPlaybackStalling called in VideoController");

    };

    this.notifyPlaybackError = function(){
        Logger.log( 'VideoController !!!!!!!!!!! PLAYBACK ERROR !!!!!!!!!!!!' );
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR, calling_controller: This}
        );
        This.inAd = false
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
                {action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR, calling_controller: This}
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