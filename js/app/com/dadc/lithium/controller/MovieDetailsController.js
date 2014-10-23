include( "js/app/com/dadc/lithium/view/widgets/MovieDetailTextWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/MovieDetailThumbWidget.js" );
//include( "js/app/com/dadc/lithium/view/widgets/MovieDetailsMenuWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/PlaylistMenuButtonWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/NextVideoContinueWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/NextVideoWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/VideoProgressWidget.js" );

//include( "js/app/com/dadc/lithium/model/MenuItem.js" );
//include( "js/app/com/dadc/lithium/model/EpisodeMenuItem.js" );
include( "js/app/com/dadc/lithium/model/MediaDetails.js" );
include( "js/app/com/dadc/lithium/model/ChannelDetails.js" );
include( "js/app/com/dadc/lithium/model/ChannelFolderList.js" );

var MovieDetailsController = function ( ParentControllerObj ){
    var m_unique_id                             = Controller.reserveUniqueID();
    var m_parent_controller_obj                 = ParentControllerObj;
    var m_root_node                             = engine.createContainer();
    var m_master_container                      = engine.createContainer();
    var m_movie_detail_text_widget              = new MovieDetailTextWidget( null );
    var m_movie_detail_thumb_widget             = new MovieDetailThumbWidget( null );
    var myWatchlistButton                       = new PlaylistMenuButtonWidget(" ");
    var watchNowButton                          = new PlaylistMenuButtonWidget(Dictionary.getText( Dictionary.TEXT.WATCHNOW ), true);
    var progressWidget                          = new VideoProgressWidget ()
    var m_is_focussed                           = false;
    var mediaObj;
    var m_calling_controller;
    var m_requests_ready                        = 0;
    var m_media_details_request                 = null;
    
    var m_media_details_timer;
    var currentFocus;
    var media_details_request                   = null;
    var self = this;
    var channelId = null;
    var mediaId;
    var channelObj = null;

    var m_channel_folder_list_obj;

    var watchListItem; //Because now we have arbitrary channels or media itemtypes in the watchlist.
    var watchListItemType;

    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'MovieDetailsController';};
    function checkUserWatchList(){
        ApplicationController.getUserPauseResumeList(function(){
            refreshVideoProgressWidget();
        })
    }
    this.open = function( ){
        Logger.log( 'Movie details open' );
        m_root_node.addChild( m_master_container );

        /**
         * Force video progress widgets to update themselves
         * This is the case when the video playback ends/stops and we need
         * to show the new progress for the video
         */


        checkUserWatchList();
        refreshWatchlistButton()
        m_media_details_timer = 0;
        if(currentFocus){
            m_is_focussed = true;
            currentFocus.setActive();
        }
        AnalyticsManagerInstance.firePageViewEvent({cc0:'movies', cc1:'details'})
    };
    this.close = function( ){
        if ( m_root_node.contains( m_master_container) ) m_root_node.removeChild( m_master_container );
    };
    this.destroy = function(){
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        while( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
    }
    this.setFocus = function(){
        m_is_focussed = true;
        if(currentFocus){
            currentFocus.setActive();
        }
    }
    this.setCallingController = function( controller ){m_calling_controller = controller;}
    this.getCallingController = function(){return m_calling_controller;}
    this.unsetFocus = function(){
        m_is_focussed = false;
        if (currentFocus){
            currentFocus.setInactive();
        }
    }    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'AboutController update() ' + engine_timer );
        if( m_media_details_timer == 0 ){
            m_media_details_timer = engine_timer;
        }
        if ( m_is_focussed) {
            m_movie_detail_text_widget.update( engine_timer );
        }
    };
    this.prepareToOpen = function( channel_id, media_id ){
        Logger.log( 'channel_id = ' + channel_id );
        if(media_id != channel_id){
            watchListItem = media_id;
            watchListItemType = "media"
        }
        else{
            watchListItem = channel_id;
            watchListItemType = "channel"
        }
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        if(channel_id == null){
            doMediaRequest(media_id);
        }
        else{
            var channel_details_request = new ChannelDetailsRequest( channel_id, StorageManagerInstance.get( 'geocode' ), function( ChannelDetailsObj, status ){
                if ( status != 200 ){
    //                // inform our parent controller our request failed
                    ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                }else{

                    channelObj = ChannelDetailsObj;
                    channelId = ChannelDetailsObj.getID();
                    var channel_folder_list_request = new ChannelFolderListRequest( channel_id, StorageManagerInstance.get( 'geocode' ), function( ChannelFolderListObj, status ){
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
                                    doMediaRequest( item.getID() );
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
        m_is_focussed = true;
    };

    function doMediaRequest( movie_id ){
        // Movie ID specified
        var media_details_request = new MediaDetailsRequest( movie_id, StorageManagerInstance.get( 'geocode' ), function( MediaDetailsObj, status ){
            if ( status != 200 ){
                // inform our parent controller our request failed
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
            }
            else{
                if(channelObj == null){
                    channelObj = MediaDetailsObj
                    channelId = channelObj.getID();
                }
                afterRequest( MediaDetailsObj );
                // inform our parent controller that we are ready to go
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
            }

            m_is_focussed = true;
        });

        media_details_request.startRequest();
    }
    function afterRequest( MediaDetailsObj ){
        if( !m_master_container ) return;
        while( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
      
        mediaObj = MediaDetailsObj;
        mediaId = MediaDetailsObj.getID();
        
        var buttonText = Dictionary.getText( Dictionary.TEXT.WATCHLIST)
        if (ApplicationController.isInUserWatchlist(watchListItem) ){
            buttonText = "- " + buttonText
        }
        else{
            buttonText = "+ " + buttonText
        }

        // Update widgets with data
        m_master_container.addChild( m_movie_detail_thumb_widget.getDisplayNode() );
        m_master_container.addChild( m_movie_detail_text_widget.getDisplayNode() );

        m_master_container.addChild( progressWidget.getDisplayNode() );
        m_master_container.addChild(myWatchlistButton.getDisplayNode() );
        m_master_container.addChild(watchNowButton.getDisplayNode() )

        // This size for shows
        var text_container = engine.createContainer();
        text_container.addChild( m_movie_detail_text_widget.getDisplayNode() );
        text_container.x = 500;
        text_container.y = 0;
        m_master_container.addChild( text_container );
        
        m_movie_detail_thumb_widget.getDisplayNode().x = 30;
        progressWidget.getDisplayNode().x = 75
        progressWidget.getDisplayNode().y = 620
        watchNowButton.getDisplayNode().x = 100;
        watchNowButton.getDisplayNode().y = 670;
        myWatchlistButton.getDisplayNode().x = 100;
        myWatchlistButton.getDisplayNode().y = 770;

        m_movie_detail_thumb_widget.refreshWidget( channelObj );
        m_movie_detail_text_widget.refreshWidget( channelObj );
        progressWidget.refreshWidget( MediaDetailsObj.getDurationInSeconds(), VideoProgressManagerInstance.getProgress( mediaId ) );
        currentFocus = watchNowButton;

        var nvcWidget = new ContinueWidget();
        nvcWidget.rootNode.y = 400
        m_master_container.addChild(nvcWidget.rootNode)

        var nvWidget = new NextVideoWidget(MediaDetailsObj)
        m_master_container.addChild(nvWidget)


    }

    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};
    this.navDown = function(){
        if ( m_movie_detail_text_widget.getScrollbarVisibility() && m_movie_detail_text_widget.getScrollbarFocus() ){
            m_movie_detail_text_widget.scrollDown();
            return;
        }
        
        if ( m_is_focussed ) {
            //abandonResponse();
            if(watchNowButton.isActive()){
                watchNowButton.setInactive();
                myWatchlistButton.setActive();
                currentFocus = myWatchlistButton
                return;
            }
        }
    }
    this.navUp = function(){

        if ( m_is_focussed ) {
            if (m_movie_detail_text_widget.getScrollbarVisibility() && m_movie_detail_text_widget.getScrollbarFocus() ){
                m_movie_detail_text_widget.scrollDown();
                return;
            }
            
            if(myWatchlistButton.isActive()){
                watchNowButton.setActive();
                myWatchlistButton.setInactive();
                currentFocus = watchNowButton;
            }
        }
    }
    
    this.navLeft = function(){
        if ( m_is_focussed ){

            if ( m_movie_detail_text_widget.getScrollbarVisibility() && m_movie_detail_text_widget.getScrollbarFocus() ){
                m_movie_detail_text_widget.setScrollbarFocus( false );
                currentFocus.setActive(); 
            }
            else{
                watchNowButton.setInactive();
                myWatchlistButton.setInactive();
                currentFocus = watchNowButton;
                abandonResponse();
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
                );
            }
        }
    }
    
    this.navRight = function(){
        if ( m_is_focussed ){
            if ( m_movie_detail_text_widget.getScrollbarVisibility() && !m_movie_detail_text_widget.getScrollbarFocus() ){
                m_movie_detail_text_widget.setScrollbarFocus( true );
                currentFocus.setInactive();
            }            
        }
    }
    
    this.enterPressed = function(){
        Logger.log( 'MDC enterPressed' );
        if ( m_is_focussed){
            if ( mediaId && watchNowButton.isActive() ){
                Logger.log( 'Media ID = ' + mediaId );
                // MILAN-BEN HACK: ALLOW FOR THE SHOW DETAILS RESPONSE TO BE ABANDONED (EG: USER PRESSES PLAY & CIRCLE *BEFORE* MEDIA DETAILS ARE RETURNED, PUTTING THE APP INTO A WEIRD STATE)
                //abandonResponse();
                m_media_details_request = new MediaDetailsRequest( mediaId, StorageManagerInstance.get( 'geocode' ), function( MediaDetailsObj, status ){
                    Logger.log("********************* VALID RESPONSE ", status);
                    //console.dir(MediaDetailsObj)
                    if ( status != 200 ){
                        // inform our parent controller our request failed
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
                    }else{
                        // Request from the application controller to start the video playback
                        m_parent_controller_obj.requestingParentAction(
                            {action: ApplicationController.OPERATIONS.START_VIDEO_PLAYBACK, MediaDetailsObj: MediaDetailsObj, calling_controller: this}
                        );
                    }
                });
                m_media_details_request.startRequest();
            }
            else if (myWatchlistButton.isActive() ){
                // Request from the application controller to add this item to the playlist
                self.doWatchlist(watchListItem, watchListItemType, function(isAdd){
                    var buttonText = Dictionary.getText( Dictionary.TEXT.WATCHLIST ); 
                    if(isAdd){
                        buttonText = "+ " + buttonText;
                        AnalyticsManagerInstance.addToWatchlistEvent({media:mediaObj, pageName: "MovieDetails"} );
                    }
                    else{
                        buttonText = "- " + buttonText;
                        AnalyticsManagerInstance.removeFromWatchlistEvent( {media:mediaObj, pageName: "MovieDetails"}  );
                    }
                    myWatchlistButton.refreshWidget(buttonText, true)
                })
            }
        }
    }

    this.doWatchlist = function(id, type, callback){
        var user = ApplicationController.getUserInfo()
        var itemId = parseInt(id)
        if (user.id != null){
            if(ApplicationController.isInUserWatchlist(id)){
                ApplicationController.removeFromUserWatchlist(itemId, type, function(success){
                    if(success){
                        callback(true)
                    }
                    else{
                        m_parent_controller_obj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR ); 
                    }
                })
            }
            else{
                ApplicationController.addToUserWatchlist(id, type, function(success){
                    if(success){
                        callback()
                    }
                    else{
                        m_parent_controller_obj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
                    }
                })
            }
        }
        else{
            
            m_is_focussed = false;
            m_parent_controller_obj.requestingParentAction({
                action: ApplicationController.OPERATIONS.OPEN_LOGIN, 
                calling_controller: this, 
                previousAction:{action: ApplicationController.OPERATIONS.OPEN_PREVIOUS_CONTROLLER, calling_controller: this}
            });
        }
    }
    
    this.circlePressed = function(){
        if(m_is_focussed){
            abandonResponse();
            m_is_focussed = false;
                watchNowButton.setInactive();
                myWatchlistButton.setInactive();
                currentFocus = watchNowButton;
                abandonResponse();
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.CLOSE_DETAILS_PAGE, calling_controller: this, details_calling_controller: m_calling_controller}
                );
        
        }
    }    
    
    // MILAN-BEN HACK: ALLOW FOR THE SHOW DETAILS RESPONSE TO BE ABANDONED (EG: USER PRESSES PLAY & CIRCLE *BEFORE* MEDIA DETAILS ARE RETURNED, PUTTING THE APP INTO A WEIRD STATE)
    function abandonResponse(){
        Logger.log("********************* ABANDON RESPONSE");
        if (m_media_details_request != null) m_media_details_request.cancelRequest();
        m_media_details_request = null;
    }

    function refreshVideoProgressWidget (){

        if( mediaObj ){
            progressWidget.refreshWidget( parseInt(mediaObj.getDurationInSeconds()), VideoProgressManagerInstance.getProgress( mediaObj.getID() ) );
        }
    }

    function refreshWatchlistButton() {
        if( mediaObj ){
            var watchListText = Dictionary.getText( Dictionary.TEXT.WATCHLIST );
            if(ApplicationController.isInUserWatchlist( watchListItem) ){
                watchListText = "- " + watchListText;
            }
            else{
                watchListText = "+ " + watchListText;
            }
            myWatchlistButton.refreshWidget(watchListText)
        }
    }
    
    //m_master_container.addChild( m_movie_detail_thumb_widget.getDisplayNode() );
    //m_master_container.addChild( m_movie_details_menu_widget.getDisplayNode() );
    //m_master_container.addChild(progressWidget.getDisplayNode() )

    // m_master_container.addChild( m_movie_detail_thumb_widget.getDisplayNode() );
    //     m_master_container.addChild( m_movie_detail_text_widget.getDisplayNode() );
    //     //m_master_container.addChild( m_movie_details_menu_widget.getDisplayNode() );
    //     //m_master_container.addChild( m_movie_rating_widget.getDisplayNode() );
    //     m_master_container.addChild( progressWidget.getDisplayNode() );
    //     m_master_container.addChild(myWatchlistButton.getDisplayNode() );
    //     m_master_container.addChild(watchNowButton.getDisplayNode() )

    // // This size for shows
    // var text_container = engine.createContainer();
    // text_container.addChild( m_movie_detail_text_widget.getDisplayNode() );
    // text_container.x = 500;
    // text_container.y = 0;
    // m_master_container.addChild( text_container );
    
    // m_movie_detail_thumb_widget.getDisplayNode().x = 30;
    // progressWidget.getDisplayNode().x = 75
    // progressWidget.getDisplayNode().y = 620
    // watchNowButton.getDisplayNode().x = 100;
    // watchNowButton.getDisplayNode().y = 670;
    // myWatchlistButton.getDisplayNode().x = 100;
    // myWatchlistButton.getDisplayNode().y = 770;
    //m_movie_details_menu_widget.getDisplayNode().x = -120;
};