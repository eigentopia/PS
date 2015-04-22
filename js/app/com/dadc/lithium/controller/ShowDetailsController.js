include( "js/app/com/dadc/lithium/view/widgets/ShowDetailTextWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/ShowDetailThumbWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/ShowDetailsMenuWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/PlaylistMenuButtonWidget.js" );

include( "js/app/com/dadc/lithium/model/MenuItem.js" );
include( "js/app/com/dadc/lithium/model/EpisodeMenuItem.js" );
include( "js/app/com/dadc/lithium/model/MediaDetails.js" );
include( "js/app/com/dadc/lithium/model/ChannelDetails.js" );
include( "js/app/com/dadc/lithium/model/ChannelFolderList.js" );



include( "js/app/com/dadc/lithium/view/widgets/NextVideoWidget.js" );

var ShowDetailsController = function( ParentControllerObj ){
    var m_unique_id                             = Controller.reserveUniqueID();
    var m_parent_controller_obj                 = ParentControllerObj;
    var m_root_node                             = engine.createContainer();
    var m_master_container                      = engine.createContainer();
    var m_show_detail_text_widget               = new ShowDetailTextWidget( null );
    var m_show_detail_thumb_widget              = new ShowDetailThumbWidget( null );
    var showWatchlistButton                     = new PlaylistMenuButtonWidget(" ", false)
    var m_show_details_menu_widgets             = [];
    var m_is_focussed                           = false;
    var m_item_objs = [];
    var m_calling_controller                    = null;
    var m_http_requests                         = [];
    var m_media_details_request                 = undefined;
    var m_media_details_timer;
    var media_details_request                   = null;
    var self = this;
    var media_objs = [];
    var crackleUser = ApplicationController.getUserInfo()
    var showChannelId;
    var currentMediaDetails; //for tracking. note this only loads on a second call to the API?!?!


    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'ShowDetailsController';};

        //God, really?
    this.getItemList = function(){ 
        var list = [];
        var channelMediaList =  media_objs

        if(channelMediaList){
            for(var i=0;i<channelMediaList.length;i++){
                list.push(channelMediaList[i].data)
            }
        }

        return list;

       
    }

    function checkUserWatchList(){
        ApplicationController.getUserPauseResumeList(function(){
            for( var i in m_show_details_menu_widgets ){
                m_show_details_menu_widgets[ i ].refreshVideoProgressWidgets();
            }
        })
    }
    this.open = function( ){
        Logger.log( 'Show details open' );
        m_root_node.addChild( m_master_container );
        
        /**
         * Force video progress widgets to update themselves
         * This is the case when the video playback ends/stops and we need
         * to show the new progress for the video
         */
        refreshWatchlistButton(showChannelId)

        UtilLibraryInstance.garbageCollect();
        m_media_details_timer = 0;

        checkUserWatchList();

        AnalyticsManagerInstance.firePageViewEvent({cc0:'shows', cc1:'details'})
    };
    this.close = function( ){
        if ( m_root_node.contains( m_master_container ) ) m_root_node.removeChild( m_master_container );
    };
    this.setFocus = function(){
        var visibleMenuWidgetIndex = getVisibleMenuWidgetIndex();
        if( visibleMenuWidgetIndex >= 0 ){
            m_show_details_menu_widgets[ visibleMenuWidgetIndex ].setFocus();
            m_show_detail_text_widget.refreshWidget( m_show_details_menu_widgets[ visibleMenuWidgetIndex ].getSelectedObj() );
        }
//        m_show_details_episodes_menu_widget.selectRow( 0 );
        m_is_focussed = true;
    }
    this.setCallingController = function( controller ){m_calling_controller = controller;}
    this.getCallingController = function(){return m_calling_controller;}
    this.unsetFocus = function(){
        m_is_focussed = false;
    }    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ShowDetailsController update() ' + engine_timer );
        
        var visibleMenuWidgetIndex = getVisibleMenuWidgetIndex();
        refreshWatchlistButton(showChannelId)
        if( visibleMenuWidgetIndex >= 0 ){
            if( m_show_details_menu_widgets[ visibleMenuWidgetIndex ].getSelectedRowIndex() >= 0 && m_show_detail_text_widget ){
                m_show_detail_text_widget.update( engine_timer );
            }
            if( m_media_details_timer > 0 && ( engine_timer > m_media_details_timer + 2 ) ){
                populateTextWidgetWithMediaObj( m_show_details_menu_widgets[ visibleMenuWidgetIndex ].getSelectedObj() );
                m_media_details_timer = -1;
            }
            if( m_media_details_timer === 0 ){
                m_media_details_timer = engine_timer;
            }
        }
    };
    var channel_folder_list;
    this.prepareToOpen = function( channel_id, media_id  ){
        Logger.log( 'channel_id = ' + channel_id );
        var selMediaIdx = 0
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }

        showChannelId = channel_id
        var channel_folder_list_request = new ChannelFolderListRequest( channel_id, StorageManagerInstance.get( 'geocode' ), function( ChannelFolderListObj, status ){
            removeRequest( channel_folder_list_request );
            if ( status != 200 ){
                // inform our parent controller our request failed
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
            }else{
                channel_folder_list = ChannelFolderListObj;
                var folders_cnt = ChannelFolderListObj.getTotalItems();

                for( var i = 0; i < folders_cnt; i++ ){
                    var folder_obj  = ChannelFolderListObj.getItem( i );
                    var folder_name = folder_obj.getName();
                    var playlistListObj = folder_obj.getPlaylistList();
                    
                    if( playlistListObj.getTotalLockedToChannel() > 0 ){
                        for( var ii = 0; ii < playlistListObj.getTotalLockedToChannel(); ii++ ){
                            var playlistObj = playlistListObj.getLockedToChannelItem( ii );
                            for( var iii = 0; iii < playlistObj.getMediaList().getTotalItems(); iii++ ){
                                var a = playlistObj.getMediaList()
                                var b =playlistObj.getMediaList().getItem( iii );
                                var id =b.getID()
                                if (id == media_id){
                                    selMediaIdx = iii;
                                }
                                media_objs.push( playlistObj.getMediaList().getItem( iii ) );
                            }
                        }
                        m_show_details_menu_widgets.push( new ShowDetailsMenuWidget( media_objs, selMediaIdx ) );

                        m_show_details_menu_widgets[ m_show_details_menu_widgets.length - 1 ].getDisplayNode().x = -120;
                    }
                }

                m_master_container.addChild( m_show_details_menu_widgets[ 0 ].getDisplayNode() );
                m_show_detail_text_widget.refreshWidget( m_show_details_menu_widgets[ 0 ].getSelectedObj() );
                
                var channel_details_request = new ChannelDetailsRequest( channel_id, StorageManagerInstance.get( 'geocode' ), function( ChannelDetailsObj, status ){
                    removeRequest( channel_details_request );
                    if ( status != 200 ){
                        // inform our parent controller our request failed
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                    }else{
                        // inform our parent controller that we are ready to go
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );                            
                        // Update widgets with data
                        m_show_detail_thumb_widget.refreshWidget( ChannelDetailsObj );
                        ChannelDetailsObj = null;

        // var nvWidget = new NextVideoWidget( m_show_details_menu_widgets[ 0 ].getSelectedObj())
        // nvWidget.x = 100
        // nvWidget.y = 100
        // m_master_container.addChild(nvWidget)
                    }
                });
                m_http_requests.push( channel_details_request );
                channel_details_request.startRequest();
            } // status
        });
        m_http_requests.push( channel_folder_list_request );
        channel_folder_list_request.startRequest();
        
        m_is_focussed = true;
    };
    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};
    this.navDown = function(){
        if ( m_is_focussed ) {
            if ( m_show_detail_text_widget.getScrollbarVisibility() && m_show_detail_text_widget.getScrollbarFocus() ){
                m_show_detail_text_widget.scrollDown();
                return;
            }
        //var a = m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].isActive()
        
            else if (crackleUser.name != '' && showWatchlistButton.isActive()){
                m_show_detail_text_widget.setScrollbarFocus(false)
                m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].setActive();
                showWatchlistButton.setInactive();
                return
            }
            
            else if ( getVisibleMenuWidgetIndex() >= 0 && m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].navDown()){
                abandonResponse();

                m_show_detail_text_widget.setScrollbarFocus(false)
                m_media_details_timer = 0;
                // Remove the current detail widgets from the screen 
                m_show_detail_text_widget.refreshWidget( m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].getSelectedObj() );
                m_show_detail_text_widget.resetContainerPositionsAndCheckForAnimation();
                return
            }
        }
    }
    this.navUp = function(){
        if ( m_is_focussed ){
            if ( m_show_detail_text_widget.getScrollbarVisibility() && m_show_detail_text_widget.getScrollbarFocus() ){
                m_show_detail_text_widget.scrollUp();
                return;
            }

            if ( getVisibleMenuWidgetIndex() >= 0 &&  m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].navUp() ){ 

                    abandonResponse();
                    m_media_details_timer = 0;
                    // Remove the current detail widgets from the screen 
                    m_show_detail_text_widget.refreshWidget( m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].getSelectedObj() );
                    m_show_detail_text_widget.resetContainerPositionsAndCheckForAnimation();
                    return;
                }
                else if(crackleUser.name != ''){
                    m_show_detail_text_widget.setScrollbarFocus(false);
                    m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].setInactive();
                    showWatchlistButton.setActive();
                    return;

                } 
                
            
            if(crackleUser.name != '' && showWatchlistButton.isActive()){
                if ( m_show_detail_text_widget.getScrollbarVisibility() && !m_show_detail_text_widget.getScrollbarFocus()){
                    m_show_detail_text_widget.setScrollbarFocus(true);
                    showWatchlistButton.setInactive();
                }
                return;
            }
        }
    }
    
    this.navLeft = function(){
        if ( m_is_focussed ){
            if ( getVisibleMenuWidgetIndex() >= 0 &&  m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].navLeft() ){
                return;
            }


            if ( crackleUser.name != '' && m_show_detail_text_widget.getScrollbarVisibility() && m_show_detail_text_widget.getScrollbarFocus() ){
                m_show_detail_text_widget.setScrollbarFocus( false );
                showWatchlistButton.setActive();
            }
            else{
                m_show_detail_text_widget.setScrollbarFocus( false );
                if(crackleUser.name != ''){
                    showWatchlistButton.setInactive();
                }
		// MILAN-BEN HACK: ALLOW FOR THE SHOW DETAILS RESPONSE TO BE ABANDONED (EG: USER PRESSES PLAY & CIRCLE *BEFORE* MEDIA DETAILS ARE RETURNED, PUTTING THE APP INTO A WEIRD STATE)
                abandonResponse();
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
                );
            }
        }
    }
    
    this.navRight = function(){
        if ( m_is_focussed ){
            if ( getVisibleMenuWidgetIndex() >= 0 && m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].navRight() ){
                return;
            }
            else if ( crackleUser.name != '' && m_show_detail_text_widget.getScrollbarVisibility() && !m_show_detail_text_widget.getScrollbarFocus() ){
                if(showWatchlistButton.isActive()){
                    m_show_detail_text_widget.setScrollbarFocus( true );
                    showWatchlistButton.setInactive();
                }
                else{
                    m_show_detail_text_widget.setScrollbarFocus( false );
                    showWatchlistButton.setActive();   
                }

            }            
        }
    }
    var m_ad_manager;
    this.enterPressed = function(){
                
            if ( m_is_focussed && getVisibleMenuWidgetIndex() >= 0 && m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].isActive() && m_media_details_request === undefined ){
                var media_id = m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].getMediaIdSelectedRow();
                
                if (!m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].enterPressed(self.doWatchlistItem) ){
                    if ( media_id ){
                        Logger.log( 'Media ID = ' + media_id );
                        // MILAN-BEN HACK: ALLOW FOR THE SHOW DETAILS RESPONSE TO BE ABANDONED (EG: USER PRESSES PLAY & CIRCLE *BEFORE* MEDIA DETAILS ARE RETURNED, PUTTING THE APP INTO A WEIRD STATE)
                        abandonResponse();
                        media_details_request = new MediaDetailsRequest( media_id, StorageManagerInstance.get( 'geocode' ), function( MediaDetailsObj, status ){
                            Logger.log("********************* VALID RESPONSE");
                            if ( status != 200 ){
                                // inform our parent controller our request failed
                                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                            }else{
                                // Request from the application controller to start the video playback
                                // m_ad_manager = new ADManager( MediaDetailsObj, self );
                                // m_ad_manager.prepare();        
                                // m_ad_manager.addListener( self);
                                m_parent_controller_obj.requestingParentAction(
                                    {action: ApplicationController.OPERATIONS.START_VIDEO_PLAYBACK, MediaDetailsObj: MediaDetailsObj, calling_controller: this}
                                );
                            }
                        });
                        media_details_request.startRequest();
                //        m_show_details_menu_widget.enterPressed();
                    }
                }
            }
            else if (crackleUser.name != '' && showWatchlistButton.isActive() ){
                // Request from the application controller to add this item to the playlist
                var itemId = parseInt(showChannelId);
                var itemType = "channel" // check for medidatailsobject episode to determine if channel add?

                self.doWatchlist(itemId, itemType, function(isAdd){
                    var buttonText = Dictionary.getText( Dictionary.TEXT.WATCHLIST );
                    //console.log("DO WATCH called back- isAdd "+ isAdd) 
                    if(isAdd){
                        buttonText = "+ " + buttonText;
                    }
                    else{
                        buttonText = "- " + buttonText;
                    }
                    showWatchlistButton.refreshWidget(buttonText, true)
                })
            }
    
    }

    var m_playlists = []
    this.notifyAdManagerUpdated = function( ADManager_EVENT ){
        for( var i = 0; i < m_ad_manager.getTotalTemporaAdSlots(); i++ ){
            var temporal_ad_slot = m_ad_manager.getTemporaAdSlot( i );
            var time_position = parseInt( temporal_ad_slot.getTimePosition() );

            m_playlists[ time_position ] = new FreewheelPlaylist( temporal_ad_slot, self );
        }

        console.log("playlists")
        console.dir(m_playlists)
    }
    
    // MILAN-BEN HACK: ALLOW FOR THE SHOW DETAILS RESPONSE TO BE ABANDONED (EG: USER PRESSES PLAY & CIRCLE *BEFORE* MEDIA DETAILS ARE RETURNED, PUTTING THE APP INTO A WEIRD STATE)
    function abandonResponse(){
        Logger.log("********************* ABANDON RESPONSE");
        if (media_details_request != null) media_details_request.cancelRequest();
        media_details_request = null;
    }
    
    this.circlePressed = function(){
        if ( m_is_focussed){
            abandonResponse();
            m_show_detail_text_widget.setScrollbarFocus( false );
            if(crackleUser.name != ''){
                showWatchlistButton.setInactive();
            }
            m_show_details_menu_widgets[ getVisibleMenuWidgetIndex() ].setInactive()
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.CLOSE_DETAILS_PAGE, calling_controller: this, details_calling_controller: m_calling_controller}
            );
        }
    }
    this.destroy = function(){
        Logger.log( 'ShowDetailsController destroy()' );
        try{
            while( m_master_container.numChildren > 0 ){
                m_master_container.removeChildAt( 0 );
            }
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
            while( m_http_requests.length > 0 ){
                m_http_requests.pop().cancelRequest();
            }
            for( var i in m_show_details_menu_widgets ){
                m_show_details_menu_widgets[ i ].destroy();
            }
            
            m_show_detail_thumb_widget.destroy();
        }catch( e ){
            Logger.log( '!!! ShowDetailsController EXCEPTION destroy()' );
            Logger.logObj( e );
        }finally{
            m_root_node = null;
            m_master_container = null;
            m_show_detail_text_widget = null;
            m_show_detail_thumb_widget = null;
            m_show_details_menu_widgets = null;
        }
    }
    function getVisibleMenuWidgetIndex(){
        for( var i in m_show_details_menu_widgets ){
            if( m_master_container.contains( m_show_details_menu_widgets[ i ].getDisplayNode() ) ){
                return i;
            }
        }
        return -1;
    }
    function removeRequest( request ){
        var tmp_requests = [];
        
        for ( var i in m_http_requests ){
            if( m_http_requests[ i ] != request ){
                tmp_requests.push( m_http_requests[ i ] );
            }
        }
        m_http_requests = tmp_requests;
        
        return m_http_requests;
    }

    function populateTextWidgetWithMediaObj( ChannelFolderMediaDetailsObj ){
        if ( ChannelFolderMediaDetailsObj ){
            currentMediaDetails = null
            Logger.log('populateTextWidgetWithMediaObj');
            var media_id = ChannelFolderMediaDetailsObj.getID();
            var media_details_request = new MediaDetailsRequest( media_id, StorageManagerInstance.get( 'geocode' ), function( MediaDetailsObj, status ){
                Logger.log('status = ' + status );
                try{
                    if( status == 200 ){
                        currentMediaDetails = MediaDetailsObj
                        m_show_detail_text_widget.refreshWidget( MediaDetailsObj );
                        refreshWatchlistButton(media_id)
                    }
                }catch( e ){
                    currentMediaDetails = null
                    Logger.log( '!!! ShowDetailsController EXCEPTION populateTextWidgetWithMediaObj()' );
                    Logger.logObj( e );
                }
                finally{
                    
                }
            });
            media_details_request.startRequest();        
        }
    }

    function refreshWatchlistButton(id) {
        if( crackleUser.name != '' && showWatchlistButton ){
            var watchListText = Dictionary.getText( Dictionary.TEXT.WATCHLIST );
            if(ApplicationController.isInUserWatchlist( id )){
                watchListText = "- " + watchListText;
            }
            else{
                watchListText = "+ " + watchListText;
            }

            showWatchlistButton.refreshWidget(watchListText, showWatchlistButton.isActive())
        }
    }
    // no PlaystationConfig.forcedRegistration == true here because it should never come here
    this.doWatchlist = function(id, type, callback){
        var user = ApplicationController.getUserInfo()
        //console.log("DO WATCH id type "+id, type)
        if (user.id !== null){
            if(ApplicationController.isInUserWatchlist(id)){
                ApplicationController.removeFromUserWatchlist(id, type, function(success){
                    if(success){
                        //console.log("DO WATCH REMOVED")
                        AnalyticsManagerInstance.removeFromWatchlistEvent( {media:channel_folder_list, pageName: "ShowDetails"} );
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
                        //console.log("DO WATCH ADD")
                        AnalyticsManagerInstance.addToWatchlistEvent( {media:channel_folder_list, pageName: "ShowDetails"} );
                        callback()
                    }
                    else{
                        m_parent_controller_obj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
                    }
                })
            }
        }
        else{
            showWatchlistButton.setInactive();
            m_parent_controller_obj.requestingParentAction({
                action: ApplicationController.OPERATIONS.OPEN_LOGIN, 
                calling_controller: this, openPreviousOnSuccess:true, 
                previousAction:{action: ApplicationController.OPERATIONS.OPEN_PREVIOUS_CONTROLLER, calling_controller: this}
            });
        }
    }

    this.doWatchlistItem = function(id, type, callback){
        var user = ApplicationController.getUserInfo()
        //console.log("DO WATCH id type "+id, type)
        if (user.id !== null){
            if(ApplicationController.isInUserWatchlist(id)){
                ApplicationController.removeFromUserWatchlist(id, type, function(success){
                    if(success){
                        //console.log("DO WATCH REMOVED")
                        AnalyticsManagerInstance.removeFromWatchlistEvent( {media:currentMediaDetails, pageName: "ShowDetailsItem"} );
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
                        //console.log("DO WATCH ADD")
                        AnalyticsManagerInstance.addToWatchlistEvent( {media:currentMediaDetails, pageName: "ShowDetailsItem"} );
                        callback(false)
                    }
                    else{
                        m_parent_controller_obj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
                    }
                })
            }
        }
        else{
            m_parent_controller_obj.requestingParentAction({
                action: ApplicationController.OPERATIONS.OPEN_LOGIN, 
                calling_controller: this, openPreviousOnSuccess:true, 
                previousAction:{action: ApplicationController.OPERATIONS.OPEN_PREVIOUS_CONTROLLER, calling_controller: this}
            });
        }
    }

    
    function watchnow_CALLBACK(){
        
    }
    
    function watchlist_CALLBACK(){
        
    }
    
    m_master_container.addChild( m_show_detail_thumb_widget.getDisplayNode() );
    m_master_container.addChild( m_show_detail_text_widget.getDisplayNode() );
    
    m_show_detail_thumb_widget.getDisplayNode().x = 30;
    m_show_detail_text_widget.getDisplayNode().x = 350;

    if(crackleUser.name != ''){
        m_master_container.addChild( showWatchlistButton.getDisplayNode() );
        showWatchlistButton.getDisplayNode().x = 30;
        showWatchlistButton.getDisplayNode().y = 420;
        
    }
};