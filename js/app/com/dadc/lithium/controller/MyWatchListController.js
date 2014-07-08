include( "js/app/com/dadc/lithium/view/widgets/MovieListWidget.js" );
include( "js/app/com/dadc/lithium/model/Watchlist.js");

var MyWatchlistController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_movie_list_widget;
    var m_movie_data_obj            = null;
    var m_is_focussed               = false;
    var m_category;
    var m_data_ready                = false;
    
    var MOVIE_LIST_WIDGET_Y         = 64;
    var ROW_SPACING                 = 80;

    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'MyWatchlistController';};
    this.open = function( ){
        Logger.log( 'MyWatchlistController ' + m_unique_id + ' open()' );

        //if( m_is_focussed ){
          //   m_movie_list_widget.setActive( 0, 0 );
        //}
        if ( m_movie_list_widget ) {
            var last_active = m_movie_list_widget.getLastActive();
            //var user = ApplicationController.getUserInfo();
            if(m_movie_data_obj.length && m_movie_data_obj.length>0){
                m_movie_list_widget.refreshWidget(m_movie_data_obj, MovieListWidget.STYLE.MOVIES);
                m_movie_list_widget.setFocus();
            }
            if( last_active ){
                m_movie_list_widget.setActive( last_active[ 0 ], last_active[ 1 ] );
            }else{
                if( m_data_ready ){
                    m_movie_list_widget.setActive( 0, 0 );
                }
            }
        }
        
        m_root_node.addChild( m_master_container );
        UtilLibraryInstance.garbageCollect();
        AnalyticsManagerInstance.firePageViewEvent({cc0:'watchlists', cc1:'mywatchlists'})
    };
    this.close = function( ){
        Logger.log( 'MyWatchlistController ' + m_unique_id + ' close()' );
        if ( m_root_node.contains( m_master_container ) ) m_root_node.removeChild( m_master_container );
    };
    this.setFocus = function(){
        m_is_focussed = true;
        Logger.log( 'MyWatchlistController setFocus()' );
        if ( m_movie_list_widget ) {
            var last_active = m_movie_list_widget.getLastActive();
            //var user = ApplicationController.getUserInfo();
            if(m_movie_data_obj.length && m_movie_data_obj.length>0){
                m_movie_list_widget.refreshWidget(m_movie_data_obj, MovieListWidget.STYLE.MOVIES);
                m_movie_list_widget.setFocus();
            }
            if( last_active ){
                m_movie_list_widget.setActive( last_active[ 0 ], last_active[ 1 ] );
            }else{
                if( m_data_ready ){
                    m_movie_list_widget.setActive( 0, 0 );
                }
            }
        }
        else{
            this.prepareToOpen();
        }
    }
    this.cancel = function(){

    }
    this.unsetFocus = function(){
        Logger.log( 'MyWatchlistController ' + m_unique_id + ' unsetFocus()' );
        if ( m_movie_list_widget ) m_movie_list_widget.closeBubble();
        m_is_focussed = false;
    }
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MyWatchlistController update() ' + engine_timer );
        
//        Logger.log( 'MoviesOrShowsListController ' + m_unique_id + ' update()' );
        if ( m_movie_list_widget ) m_movie_list_widget.update( engine_timer );
    };
    this.destroy = function(){
        Logger.log( 'MyWatchlistController destroy()' );
        try{
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
            while( m_master_container.numChildren > 0 ){
                m_master_container.removeChildAt( 0 );
            }      
            
            m_movie_list_widget.destroy();
        }catch( e ){
            
        }finally{
            m_master_container = null;
            m_root_node = null;
            m_data_ready = false;
        }
    }

    this.prepareToOpen = function( ){

        Logger.log( 'MyWatchlistController ' + m_unique_id + ' prepareToOpen() ');
        var user = ApplicationController.getUserInfo();
        if(user){
            m_movie_data_obj = new Watchlist(user.watchlist);
        }

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
        m_movie_list_widget.getDisplayNode().x = 50;


        m_movie_list_widget.refreshWidget( m_movie_data_obj, MovieListWidget.STYLE.MOVIES );

        // if( m_is_focussed ){
        //      m_movie_list_widget.setActive( 0, 0 );
        // }
        m_data_ready = true;
        // inform our parent controller that we are ready to go
        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
            
    };
    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};

    // NAVIGATION METHODS
    this.navLeft = function(){
        console.log("L "+ m_is_focussed)
//        if ( !m_is_focussed || !m_movie_list_widget ) return;
        if( ! m_movie_list_widget.navLeft() ){
            // Select menu on the left
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU, calling_controller: this}
            );
        }
    };
    this.navRight = function(){
        console.log("R "+ m_is_focussed)
        if ( !m_is_focussed || !m_movie_list_widget ) return;
        m_movie_list_widget.navRight();
    };
    this.navDown = function(){
        console.log("D "+ m_is_focussed)
        if ( !m_is_focussed || !m_movie_list_widget ) return;
        m_movie_list_widget.navDown();
    };
    this.navUp = function(){
        console.log("U "+ m_is_focussed)
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
        
        m_movie_list_widget.enterPressed();
        
        // Open next screen according to the item type
        // We ethier pass a channel id or a movie id parameter to the application
        // controller
        var itemType = data_obj.getItemType();
        var mediaType = data_obj.getMediaType();
        var id = data_obj.getID();
        var channelId = data_obj.getParentChannelID()
        var root = data_obj.getRootChannelID();
        var parentName = data_obj.getParentChannelName();

        if ( data_obj.getRootChannelID &&  (root == 114 || root == 46) ){
            if(itemType == "Channel"){
                //Damn, really?
                channelId = id
            }
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.OPEN_SHOW_DETAILS, channel_id: channelId, media_id: id, calling_controller: this}
            );               
        }
        else 
        if ( data_obj.getItemType && itemType == 'Channel' && parentName == 'Watchlists' ){
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.OPEN_COLLECTION, collection_id: id, calling_controller: this}
            );               
        }
        else{ // TODO: Replace else for else if Movie ?
            
            if(itemType == "Channel"){ //Because apparently movies can be channels now.
                channelId = id
            }
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.OPEN_MOVIE_DETAILS, channel_id:channelId, media_id: id, calling_controller: this}
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