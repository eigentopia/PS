include( "js/app/com/dadc/lithium/view/widgets/MovieListWidget.js" );

include( "js/app/com/dadc/lithium/model/Browse.js" );
include( "js/app/com/dadc/lithium/model/ChannelFolderList.js" );
include( "js/app/com/dadc/lithium/model/Featured.js" );
include( "js/app/com/dadc/lithium/model/Popular.js" );
include( "js/app/com/dadc/lithium/model/Recent.js" );
include( "js/app/com/dadc/lithium/util/AnalyticsManager.js" );

var MoviesOrShowsListController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_movie_list_widget;
    var m_movie_data_obj            = null;
    var m_is_focussed               = false;
    var m_category;
    var m_data_ready                = false;
    var m_http_requests                         = [];
    
    var MOVIE_LIST_WIDGET_Y         = 54;
    var ROW_SPACING                 = 80;

    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'MoviesOrShowsListController';};
    this.open = function( ){
        Logger.log( 'MoviesOrShowsListController ' + m_unique_id + ' open()' );
        m_root_node.addChild( m_master_container );
        UtilLibraryInstance.garbageCollect();
    };
    this.close = function( ){
        Logger.log( 'MoviesOrShowsListController ' + m_unique_id + ' close()' );
        if ( m_root_node.contains( m_master_container ) ) m_root_node.removeChild( m_master_container );
    };
    this.setFocus = function(){
        m_is_focussed = true;
        Logger.log( 'MoviesOrShowsListController setFocus()' );
        var last_active = m_movie_list_widget.getLastActive();
        if ( m_movie_list_widget ) {
            m_movie_list_widget.setFocus();
            if( last_active ){
                m_movie_list_widget.setActive( last_active[ 0 ], last_active[ 1 ] );
            }else{
                if( m_data_ready ){
                    m_movie_list_widget.setActive( 0, 0 );
                }
            }
        }
    }
    this.unsetFocus = function(){
        Logger.log( 'MoviesOrShowsListController ' + m_unique_id + ' unsetFocus()' );
        if ( m_movie_list_widget ) m_movie_list_widget.closeBubble();
        m_is_focussed = false;
    }
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MoviesOrShowsListController update() ' + engine_timer );
        
//        Logger.log( 'MoviesOrShowsListController ' + m_unique_id + ' update()' );
        if ( m_movie_list_widget ) m_movie_list_widget.update( engine_timer );
    };
    this.destroy = function(){
        Logger.log( 'MoviesOrShowsListController destroy()' );
        try{
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
            while( m_master_container.numChildren > 0 ){
                m_master_container.removeChildAt( 0 );
            }
            while( m_http_requests.length > 0 ){
                m_http_requests[ 0 ].cancelRequest();
                m_http_requests.pop();
            }        
    //        m_movie_list_widget.destroy();
        }catch( e ){
            
        }finally{
            m_master_container = null;
            m_root_node = null;
        }
    }
    this.prepareToOpen = function( MoviesOrShowsListController_CATEGORY, MoviesOrShowsListController_TYPE, genre, collection_id ){
        var request;
        Logger.log( 'MoviesOrShowsListController ' + m_unique_id + ' prepareToOpen() ');
        m_category = MoviesOrShowsListController_CATEGORY;
        
        if ( m_movie_list_widget ) {
            if ( m_master_container.contains( m_movie_list_widget.getDisplayNode() ) ){
                m_master_container.removeChild( m_movie_list_widget.getDisplayNode() )
            }
            delete( m_movie_list_widget );
            m_movie_list_widget = null;
        }
        
        m_movie_list_widget = new MovieListWidget();
        m_master_container.addChild( m_movie_list_widget.getDisplayNode() );
        m_movie_list_widget.setClippingHeight( 1080, MOVIE_LIST_WIDGET_Y * 2 );
        m_movie_list_widget.setRowPadding( ROW_SPACING );
        m_movie_list_widget.getDisplayNode().y = MOVIE_LIST_WIDGET_Y;
        
        switch( MoviesOrShowsListController_TYPE ){
            case MoviesOrShowsListController.TYPE.FEATURED:
                request = new FeaturedRequest( MoviesOrShowsListController_CATEGORY, FeaturedRequest.FILTER_TYPE.ALL, StorageManagerInstance.get( 'geocode' ), 60, function( FeaturedObj, status ){
                    m_http_requests = [];
                    if ( status != 200 ){
                        // inform our parent controller our request failed
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                    }else{
                        m_movie_data_obj = FeaturedObj;
                        if ( MoviesOrShowsListController_CATEGORY == FeaturedRequest.CATEGORY.MOVIES ){
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.MOVIES );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'movies', cc1:'browse', cc2:'featured'})
                        }else{
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.SHOWS );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'shows', cc1:'browse', cc2:'featured'})
                        }
                        
                        if( m_is_focussed )
                            m_movie_list_widget.setActive( 0, 0 );

                        m_data_ready = true;
                        // inform our parent controller that we are ready to go
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
                    }
                });
                break;
            case MoviesOrShowsListController.TYPE.POPULAR:
                request = new PopularRequest( MoviesOrShowsListController_CATEGORY, PopularRequest.FILTER_TYPE.ALL, StorageManagerInstance.get( 'geocode' ), 60, function( PopularObj, status ){
                    m_http_requests = [];
                    if ( status != 200 ){
                        // inform our parent controller our request failed
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                    }else{
                        m_movie_data_obj = PopularObj;
                        if ( MoviesOrShowsListController_CATEGORY == PopularRequest.CATEGORY.MOVIES ){
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.MOVIES  );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'movies', cc1:'browse', cc2:'popular'})
                        }else{
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.SHOWS );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'shows', cc1:'browse', cc2:'popular'})
                        }

                        if( m_is_focussed )
                            m_movie_list_widget.setActive( 0, 0 );
                        
                        m_data_ready = true;
                        // inform our parent controller that we are ready to go
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
                    }
                });
                break;
             case MoviesOrShowsListController.TYPE.RECENT:
                request = new RecentRequest( MoviesOrShowsListController_CATEGORY, RecentRequest.FILTER_TYPE.ALL, StorageManagerInstance.get( 'geocode' ), 60, function( RecentObj, status ){
                    m_http_requests = [];
                    if ( status != 200 ){
                        // inform our parent controller our request failed
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                    }else{
                        m_movie_data_obj = RecentObj;
                        if ( MoviesOrShowsListController_CATEGORY == RecentRequest.CATEGORY.MOVIES ){
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.MOVIES  );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'movies', cc1:'browse', cc2:'recent'})

                        }else{
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.SHOWS );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'shows', cc1:'browse', cc2:'recent'})
                        }                    
                        
                        if( m_is_focussed )
                            m_movie_list_widget.setActive( 0, 0 );
                        
                        m_data_ready = true;
                        // inform our parent controller that we are ready to go
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
                    }
                });
                break;
             case MoviesOrShowsListController.TYPE.GENRE:
                request = new BrowseRequest( MoviesOrShowsListController_CATEGORY, BrowseRequest.FILTER_TYPE.ALL, genre, BrowseRequest.SORT_ORDER.ALPHA, StorageManagerInstance.get( 'geocode' ), function( BrowseObj, status ){
                    m_http_requests = [];
                    if ( status != 200 ){
                        // inform our parent controller our request failed
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                    }else{
                        m_movie_data_obj = BrowseObj;
                        if ( MoviesOrShowsListController_CATEGORY == BrowseRequest.CHANNEL_NAME.MOVIES ){
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.MOVIES  );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'movies', cc1:'browse', cc2:genre})

                        }else{
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.SHOWS );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'shows', cc1:'browse', cc2:genre})
                        }                                       
                        
                        if( m_is_focussed )
                            m_movie_list_widget.setActive( 0, 0 );
                        
                        m_data_ready = true;
                        // inform our parent controller that we are ready to go
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
                    }
                });
                break;
             case MoviesOrShowsListController.TYPE.BROWSEALL:
                request = new BrowseRequest( MoviesOrShowsListController_CATEGORY, BrowseRequest.FILTER_TYPE.ALL, 'All', BrowseRequest.SORT_ORDER.ALPHA, StorageManagerInstance.get( 'geocode' ), function( BrowseObj, status ){
                    m_http_requests = [];
                    if ( status != 200 ){
                        // inform our parent controller our request failed
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );
                    }else{

                        m_movie_data_obj = BrowseObj;
                        if ( MoviesOrShowsListController_CATEGORY == BrowseRequest.CHANNEL_NAME.MOVIES ){
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.MOVIES  );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'movies', cc1:'browse', cc2:'all'})

                        }else{
                            m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.SHOWS );
                            AnalyticsManagerInstance.firePageViewEvent({cc0:'shows', cc1:'browse', cc2:'all'})

                        }                                 
                        
                        if( m_is_focussed )
                            m_movie_list_widget.setActive( 0, 0 );
                        
                        m_data_ready = true;
                        // inform our parent controller that we are ready to go
                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
                    }
                });
                break;
//             case MoviesOrShowsListController.TYPE.COLLECTION:
//                request = new ChannelFolderListRequest( collection_id, StorageManagerInstance.get( 'geocode' ), function( ChanneLFolderListObj, status ){
//                    if ( status != 200 ){
//                        // inform our parent controller our request failed
//                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
//                    }else{
//
//                        m_movie_data_obj = ChanneLFolderListObj;
//
//                        m_movie_list_widget.refreshWidget( m_movie_data_obj, true, MovieListWidget.STYLE.WATCHLIST  );
//                        
//                        if( m_is_focussed )
//                            m_movie_list_widget.setActive( 0, 0 );
//                        
//                        m_data_ready = true;
//                        
//                        // inform our parent controller that we are ready to go
//                        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
//                    }
//                });
//                break;
        }
        m_http_requests.push( request );
        request.startRequest();
            
    };
    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};

    // NAVIGATION METHODS
    this.navLeft = function(){
//        if ( !m_is_focussed || !m_movie_list_widget ) return;
        if( ! m_movie_list_widget.navLeft() ){
            // Select menu on the left
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
            );
        }
    };
    this.navRight = function(){
        if ( !m_is_focussed || !m_movie_list_widget ) return;
        m_movie_list_widget.navRight();
    };
    this.navDown = function(){
        if ( !m_is_focussed || !m_movie_list_widget ) return;
        m_movie_list_widget.navDown();
    };
    this.navUp = function(){
        if ( !m_is_focussed || !m_movie_list_widget ) return;
        m_movie_list_widget.navUp();
    };
    this.circlePressed = function(){
        var last_active = m_movie_list_widget.getLastActive();
        
        if( last_active ){
            m_movie_list_widget.setInactive( last_active[ 0 ], last_active[ 1 ] );
        }
        
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
        );
    }
    
    this.enterPressed = function(){
        if ( !m_is_focussed || !m_movie_list_widget || !m_data_ready ) return;
        
        var data_obj = m_movie_list_widget.getDataObjectAtSelection();
        var is_show = false;
        var is_collection = false;
        
        if( !data_obj || !data_obj.getID() ) return;
        
        Logger.logObj( data_obj );
        
        m_movie_list_widget.enterPressed();
        
        // Is selected title a show?
        if ( m_category == FeaturedRequest.CATEGORY.SHOWS ||
             m_category == RecentRequest.CATEGORY.SHOWS ||
             m_category == PopularRequest.CATEGORY.SHOWS ||
             m_category == BrowseRequest.CHANNEL_NAME.SHOWS || 
             m_category == BrowseRequest.CHANNEL_NAME.TELEVISION
            ){
                is_show = true;
            }
        if ( m_category == BrowseRequest.CHANNEL_NAME.COLLECTIONS ){
            is_collection = true;
        }
        // Is the title a show?
        if ( is_show ){
            // If it's a show, request application controller to open show details
            // for the channel id selected
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.OPEN_SHOW_DETAILS, channel_id: data_obj.getID(), calling_controller: this}
            );               
        }else if( is_collection ){
            if ( data_obj.getRootChannelID && (data_obj.getRootChannelID() == 114 || data_obj.getRootChannelID() == 46) ){
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.OPEN_SHOW_DETAILS, channel_id: data_obj.getParentChannelID(), calling_controller: this}
                );               
            }else{
                m_parent_controller_obj.requestingParentAction(
                    {action: ApplicationController.OPERATIONS.OPEN_MOVIE_DETAILS, channel_id: data_obj.getParentChannelID(), calling_controller: this}
                );               
            }
        }else {
            // Open next screen according to the item type
            // We ethier pass a channel id or a movie id parameter to the application
            // controller
            var id = data_obj.getID();
            var channelId = (data_obj.getParentChannelID)?data_obj.getParentChannelID():data_obj.getID();
            var itemType = data_obj.getItemType();

            if(itemType == "Channel"){ //Because apparently movies can be channels now.
                channelId = id
            }

            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.OPEN_MOVIE_DETAILS, channel_id: channelId, media_id: id, calling_controller: this}
            );               
        }
        
    };

};

MoviesOrShowsListController.TYPE = {
    FEATURED: 1,
    POPULAR: 2,
    RECENT: 3,
    BROWSEALL: 4,
    GENRE: 5,
    COLLECTION: 6
}