include( "js/app/com/dadc/lithium/view/widgets/RecommendedWatchlistTemplate1.js" );
include( "js/app/com/dadc/lithium/view/widgets/RecommendedWatchlistThumbWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/RecommendedWatchlistTextWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/MediaInfoWidget.js" );

include( "js/app/com/dadc/lithium/model/EpisodeMenuItem.js" );
include( "js/app/com/dadc/lithium/model/MediaDetails.js" );
include( "js/app/com/dadc/lithium/model/ChannelDetails.js" );
include( "js/app/com/dadc/lithium/model/ChannelFolderList.js" );

var RecommendedWatchlistController = function( ParentControllerObj ){
    var m_unique_id                             = Controller.reserveUniqueID();
    var m_parent_controller_obj                 = ParentControllerObj;
    var m_root_node                             = engine.createContainer();
    var m_master_container                      = engine.createContainer();
//    var m_show_detail_text_widgets              = [];
    var m_recommended_watchlist_text_widget     = new RecommendedWatchlistTextWidget();
    var m_recommended_watchlist_template1       = null;
    var m_present_widgets                       = [];
    var m_recommended_watchlist_thumb_widget    = new RecommendedWatchlistThumbWidget( null );
//    var m_show_details_menu_widget              = new ShowDetailsMenuWidget( null );
    var m_is_focussed                           = false;
    var m_collection_id;
    var m_http_requests                         = [];
    var m_channel_folder_list_obj               = null;
    var m_media_details_request;
    var media_details_request                   = null;

    var channelDetails;

    var myWatchlistButton                       = new PlaylistMenuButtonWidget(" ");
    var self = this;
    
    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'RecommendedWatchlistController';};
    this.open = function( ){
        Logger.log( 'Show details open' );
        UtilLibraryInstance.garbageCollect();
        m_root_node.addChild( m_master_container );
        
        if( m_present_widgets && m_present_widgets.length > 0 ){
            if( m_present_widgets[ m_present_widgets.length - 1 ].hasOwnProperty( 'refreshVideoWidgets' ) ){
                m_present_widgets[ m_present_widgets.length - 1 ].refreshVideoWidgets();
            }
        }
    };
    this.close = function( ){
        if ( m_root_node.contains( m_master_container) ) m_root_node.removeChild( m_master_container );
    };
    this.destroy = function(){
        Logger.log( 'RecommendedWatchlistController destroy()' );
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        while( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
        // while( m_http_requests.length > 0 ){
        //     m_http_requests[ 0 ].cancelRequest();
        //     m_http_requests.pop();
        // }
        m_recommended_watchlist_text_widget.destroy();
        m_recommended_watchlist_thumb_widget.destroy();
        if( m_recommended_watchlist_template1 ) m_recommended_watchlist_template1.destroy();
        m_recommended_watchlist_template1 = null;
        m_master_container = null;
        m_root_node = null;
        m_present_widgets = null;
    }    
    this.setFocus = function(){
        //m_show_details_menu_widget.selectRow( m_show_details_menu_widget.getSelectedMenuItemIndex() );
//        m_show_details_episodes_menu_widget.selectRow( 0 );
        m_is_focussed = true;
        if ( m_present_widgets.length > 0 && m_present_widgets[ m_present_widgets.length - 1].hasOwnProperty( 'setFocus' ) ){
            m_present_widgets[ m_present_widgets.length - 1].setFocus();
        }
    }
    this.unsetFocus = function(){
        m_is_focussed = false;
        if ( m_present_widgets.length > 0 && m_present_widgets[ m_present_widgets.length - 1].hasOwnProperty( 'unsetFocus' ) ){
            m_present_widgets[ m_present_widgets.length - 1].unsetFocus();
        }
    } 
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'RecommendedWatchlistController update() ' + engine_timer );
        
//        if ( m_selected_episode_row >= 0 && m_show_detail_text_widgets[ m_selected_episode_row ] ){
//            m_show_detail_text_widgets[ m_selected_episode_row ].update( engine_timer );
//        }
    };
    this.getCollectionId = function(){
        return m_collection_id;
    }
    this.prepareToOpen = function( collection_id ){
        m_collection_id = collection_id;
        Logger.log( 'collection_id = ' + collection_id );
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
//        m_show_details_menu_widget.refreshWidget( m_menu_items );
        
        // Select the first row in the menu
//        m_show_details_menu_widget.selectRow( 0 );
        
        var channel_folder_list_request = new ChannelFolderListRequest( collection_id, StorageManagerInstance.get( 'geocode' ), function( ChannelFolderListObj, status ){
            removeRequest( this );
            m_channel_folder_list_obj = ChannelFolderListObj;
            if ( status != 200 ){
                // inform our parent controller our request failed
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
            }else{
                m_recommended_watchlist_template1 = new RecommendedWatchlistTemplate1( ChannelFolderListObj );
                m_present_widgets[ 0 ] = m_recommended_watchlist_template1;
                m_master_container.addChild( m_recommended_watchlist_template1.getDisplayNode() );
                
                var channel_details_request = new ChannelDetailsRequest( collection_id, StorageManagerInstance.get( 'geocode' ), function( ChannelDetailsObj, status ){
                    removeRequest( this );
                    if ( status != 200 ){
                        // inform our parent controller our request failed
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                    }else{
                        channelDetails = ChannelDetailsObj;
                        // Update widgets with data
                        m_recommended_watchlist_thumb_widget.refreshWidget( ChannelDetailsObj );
                        m_recommended_watchlist_text_widget.refreshWidget( ChannelDetailsObj );

                        AnalyticsManagerInstance.firePageViewEvent({cc0:'watchlists', cc1:'recommended', cc2:'', title:ChannelDetailsObj.getName()})
                        
                        //Weird new conditional rules around activation
                        if( PlaystationConfig.forcedRegistration == true){
                            var buttonText = Dictionary.getText( Dictionary.TEXT.WATCHLIST)
                            if (ApplicationController.isInUserWatchlist(ChannelDetailsObj.getID())){
                                buttonText = "- " + buttonText
                            }
                            else{
                                buttonText = "+ " + buttonText
                            }
                            myWatchlistButton.refreshWidget(buttonText)
                        }
                        
                        // inform our parent controller that we are ready to go
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );            
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
    //God, really?
    this.getItemList = function(){ 
        var list = [];
        var channelMediaList =  m_channel_folder_list_obj.m_data.FolderList[0].PlaylistList[0].MediaList

        if(channelMediaList){
            list = channelMediaList;
        }

        return list;

       
    }
    
    this.navDown = function(){
        if ( m_is_focussed && m_present_widgets.length > 0) {
            
            if( PlaystationConfig.forcedRegistration == true && myWatchlistButton.isActive()){
                myWatchlistButton.setInactive(); 
                m_recommended_watchlist_template1.setFocus();
            }
            else if( m_recommended_watchlist_template1.hasFocus() && m_recommended_watchlist_template1.navDown() ){
                abandonResponse()
                // if ( m_present_widgets[ m_present_widgets.length - 1 ]){
                //     m_present_widgets[ m_present_widgets.length - 1].navDown();
                // }
            }
        }
    }
    this.navUp = function(){
        if ( m_is_focussed && m_present_widgets.length > 0){
            if( PlaystationConfig.forcedRegistration == true && m_recommended_watchlist_template1.hasFocus() && !m_recommended_watchlist_template1.navUp() ){
                m_recommended_watchlist_template1.unsetFocus();
                myWatchlistButton.setActive();
            }
            else {
                abandonResponse();
                return;
                // if ( m_present_widgets[ m_present_widgets.length - 1 ] && m_present_widgets[ m_present_widgets.length - 1].hasOwnProperty( 'navUp' ) ){
                //     m_present_widgets[ m_present_widgets.length - 1].navUp();
                // }
            }
        }
    }
    
    this.navLeft = function(){
        if ( m_is_focussed ) {
//            Logger.log( 'm_selected_episode_row = ' + m_selected_episode_row );
//            // Set to inactive the current selected episode
//            m_playlist_menu_item_widgets[ m_selected_episode_row ].setInactive();
            if(  PlaystationConfig.forcedRegistration == true && myWatchlistButton.isActive() ){
                abandonResponse();
                myWatchlistButton.setInactive();
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
                );
            }
            else if ( ( m_present_widgets[ m_present_widgets.length - 1 ] 
                && m_present_widgets[ m_present_widgets.length - 1].hasOwnProperty( 'navLeft' ) 
                && !m_present_widgets[ m_present_widgets.length - 1].navLeft() ) 
                ||
                ( m_present_widgets[ m_present_widgets.length - 1 ] 
                && !m_present_widgets[ m_present_widgets.length - 1 ].hasOwnProperty( 'navLeft' ) )
            ){
                return false;
            }
        }
    }
    
    this.navRight = function(){
        if ( m_is_focussed && m_present_widgets.length > 0 ) {
//            m_show_details_menu_widget.disableRow( m_show_details_menu_widget.getSelectedMenuItemIndex() );
//            m_is_focussed = false;

//            var menu_item = m_menu_items[ m_show_details_menu_widget.getSelectedMenuItemIndex() ];
//            menu_item.getCallbackFunc()( menu_item.getCallbackArgs() );
            if ( m_present_widgets[ m_present_widgets.length - 1 ] && m_present_widgets[ m_present_widgets.length - 1].hasOwnProperty( 'navRight' ) ){
                m_recommended_watchlist_template1.navRight();
            }
        }
    }
    
    this.enterPressed = function(){
        if ( m_is_focussed && m_present_widgets.length > 0 ){
            UtilLibraryInstance.garbageCollect();
            // we are inside Template 1
            var selected_button = m_recommended_watchlist_template1.getSelectedButtonIndex();

            if( m_recommended_watchlist_template1.hasFocus() ){
                var media_id =  m_recommended_watchlist_template1.getSelectedArgs().getID();
                if ( selected_button === 0 && m_media_details_request === undefined ){
                    // WATCH NOW
                    Logger.log( 'WATCH NOW' );

                        // MILAN-BEN HACK: ALLOW FOR THE SHOW DETAILS RESPONSE TO BE ABANDONED (EG: USER PRESSES PLAY & CIRCLE *BEFORE* MEDIA DETAILS ARE RETURNED, PUTTING THE APP INTO A WEIRD STATE)
                    abandonResponse();
                    media_details_request = new MediaDetailsRequest( media_id, StorageManagerInstance.get( 'geocode' ), function( MediaDetailsObj, status ){
                            Logger.log("********************* VALID RESPONSE");
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
            
                    media_details_request.startRequest();

                }else if ( selected_button == 1 ){
                    // INFO
                    abandonResponse();
                    m_parent_controller_obj.requestingParentAction(
                        {action: ApplicationController.OPERATIONS.OPEN_MEDIA_INFO, calling_controller: this, media_id: media_id}
                    );
                }
            }
            else if (  PlaystationConfig.forcedRegistration == true && myWatchlistButton.isActive()){
                var itemId = m_collection_id;
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
                    myWatchlistButton.refreshWidget(buttonText, true)
                })
            }
        }
    }

    this.doWatchlist = function(id, type, callback){
        var user = ApplicationController.getUserInfo()
        //console.log("DO WATCH id type "+id, type)
        if (user.id !== null){
            if(ApplicationController.isInUserWatchlist(id)){
                ApplicationController.removeFromUserWatchlist(id, type, function(success){
                    if(success){
                        //console.log("DO WATCH REMOVED")
                        AnalyticsManagerInstance.removeFromWatchlistEvent( {media:channelDetails, pageName: "RecommendedWatchlist"} );
                        callback(true)
                    }
                })
            }
            else{
                ApplicationController.addToUserWatchlist(id, type, function(success){
                    if(success){
                        //console.log("DO WATCH ADD")
                        AnalyticsManagerInstance.addToWatchlistEvent( {media:channelDetails, pageName: "RecommendedWatchlist"} );
                        callback()
                    }
                })
            }
        }
        else{
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.OPEN_LOGIN, 
                calling_controller: this,  
                previousAction:{action: ApplicationController.OPERATIONS.OPEN_PREVIOUS_CONTROLLER, calling_controller: this}
            });
        }
    }

    // MILAN-BEN HACK: ALLOW FOR THE SHOW DETAILS RESPONSE TO BE ABANDONED (EG: USER PRESSES PLAY & CIRCLE *BEFORE* MEDIA DETAILS ARE RETURNED, PUTTING THE APP INTO A WEIRD STATE)
    function abandonResponse(){
        Logger.log("********************* ABANDON RESPONSE");
        if (media_details_request != null) media_details_request.cancelRequest();
        media_details_request = null;
    }

    this.circlePressed = function(){
        if( m_is_focussed ){
            if ( m_present_widgets.length >= 2 ){
                if ( m_master_container.contains( m_present_widgets[ m_present_widgets.length - 1 ].getDisplayNode() ) ){
                    m_master_container.removeChild( m_present_widgets[ m_present_widgets.length - 1 ].getDisplayNode() );
                }
                var widget = m_present_widgets.pop();
                widget.destroy();
                widget = null;
                UtilLibraryInstance.garbageCollect();
                m_master_container.addChild( m_present_widgets[ m_present_widgets.length - 1 ].getDisplayNode() );
            }else{
                abandonResponse();
                if ( m_present_widgets[ m_present_widgets.length - 1 ] && m_present_widgets[ m_present_widgets.length - 1].hasOwnProperty( 'circlePressed' ) ){
                    m_present_widgets[ m_present_widgets.length - 1].circlePressed();
                }                
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
                );
            }
        }
    }
    
    function populateTextWidgetWithMediaObj( media_id, widget ){
        var media_details_request = new MediaDetailsRequest( media_id, StorageManagerInstance.get( 'geocode' ), function( MediaDetailsObj, status ){
            widget.refreshWidget( MediaDetailsObj );
        });
        media_details_request.startRequest();        
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
    
    function watchnow_CALLBACK(){
        
    }
    
    function watchlist_CALLBACK(){
        
    }
    
//    m_menu_items = [
//        new MenuItem('Watch Now', null, watchnow_CALLBACK, null )
//    ];    
   
    m_master_container.addChild( m_recommended_watchlist_thumb_widget.getDisplayNode() );
    m_master_container.addChild( m_recommended_watchlist_text_widget.getDisplayNode() );
//    m_master_container.addChild( m_show_details_menu_widget.getDisplayNode() );
//    m_master_container.addChild( m_menu_container );
    

    
    m_recommended_watchlist_thumb_widget.getDisplayNode().x = 30;
    m_recommended_watchlist_text_widget.getDisplayNode().x = 350;

    //Weird new auth rules
    if(PlaystationConfig.forcedRegistration == true){
        m_master_container.addChild(myWatchlistButton.getDisplayNode() );
        myWatchlistButton.getDisplayNode().x = 30;
        myWatchlistButton.getDisplayNode().y = 420;
    }

//    m_show_details_menu_widget.getDisplayNode().y = 650;
//    m_show_details_menu_widget.getDisplayNode().x = 150;
};