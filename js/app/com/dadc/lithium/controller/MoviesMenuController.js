include( "js/app/com/dadc/lithium/model/MenuItem.js" );
include( "js/app/com/dadc/lithium/model/LocaleGenre.js" );

include( "js/app/com/dadc/lithium/view/widgets/SubMenuWidget.js" );

var MoviesMenuController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj = ParentControllerObj;
    var m_root_node             = engine.createContainer();
    var m_master_container      = engine.createContainer();
    var m_is_focussed           = false;
    var m_sub_menu_widget       = new SubMenuWidget( null );
    var m_ix_selected_menu_item = -1;
    var m_menu_items;
    
    this.getUniqueID = function(){return m_unique_id;};
    this.getControllerName = function(){return 'MoviesMenuController';};

    this.open = function(){
        m_root_node.addChild( m_master_container );
    }
    this.close = function(){
        if ( m_root_node.contains( m_master_container) ) m_root_node.removeChild( m_master_container );
    }
    this.getDisplayNode = function(){return m_root_node;};
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MoviesMenuController update() ' + engine_timer );
    }
    this.getParentControllerObj = function(){return m_parent_controller_obj;};
    
    /**
     * Called when user navigates back to the menu
     */
    this.setFocus = function(){
        m_sub_menu_widget.selectRow( m_ix_selected_menu_item );
        m_is_focussed = true;
    }
    this.unsetFocus = function(){
        m_is_focussed = false;
    }    
    this.prepareToOpen = function( ){
        // Static menu items
        m_menu_items = [
            new MenuItem( Dictionary.getText( Dictionary.TEXT.FEATURED ), null, featured_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.MOST_POPULAR ), null, popular_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.RECENTLY_ADDED ), null, recent_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.BROWSE_ALL ), null, browse_CALLBACK, null ),
            new MenuItem( null ), // separator
        ];
        
        // We are going to query the genreFilters API in order to add menu items
        // with the genre as the option
        var genreFiltersRequest = new LocaleGenreRequest( 'movies', StorageManagerInstance.get( 'geocode' ), function( LocaleGenreObj, status ){
            if ( status != 200 ){
                // inform our parent controller our request failed
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
            }else{
                var genres = LocaleGenreObj.getItemList();

                for( var i = 0; i < genres.getTotalItems(); i++ ){
                    var genre_name = genres.getItem( i ).getName();
                    var genre_id = genres.getItem( i ).getID();

                    // Create a menu item with the filter name as an argument to
                    // the callback function. The filter name = genre
                    m_menu_items.push( new MenuItem( genre_name, null, genre_CALLBACK, genre_id ) );
                }

                // Refresh the menu widget with MenuItemObjs
                m_sub_menu_widget.refreshWidget( m_menu_items );

                // Select the first row in the menu
                m_sub_menu_widget.selectRow( 0 );
                m_ix_selected_menu_item = 0;
                m_is_focussed = true;

                // inform our parent controller that we are ready to go
                ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
            }
        });
        
        // FIXME: Disable it for now
        genreFiltersRequest.startRequest();
//        m_menu_items.push(new MenuItem( 'Crime', null, genre_CALLBACK, 'Crime' ));
//        m_menu_items.push(new MenuItem( 'Action', null, genre_CALLBACK, 'Action' ));
//        m_menu_items.push(new MenuItem( 'Sci-Fi', null, genre_CALLBACK, 'Sci-Fi' ));
//        m_menu_items.push(new MenuItem( 'Comedy', null, genre_CALLBACK, 'Comedy' ));
//        m_menu_items.push(new MenuItem( 'Horror', null, genre_CALLBACK, 'Horror' ));
//        m_menu_items.push(new MenuItem( 'Thriller', null, genre_CALLBACK, 'Thriller' ));
//        m_menu_items.push(new MenuItem( 'All', null, genre_CALLBACK, 'All' ));
//        
//        // Refresh the menu widget with MenuItemObjs
//        m_sub_menu_widget.refreshWidget( m_menu_items );
//
//        // Select the first row in the menu
//        m_sub_menu_widget.selectRow( 0 );
//        m_ix_selected_menu_item = 0;
//        m_is_focussed = true;
//        
//        // inform our parent controller that we are ready to go
//        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
    }
    
    this.navDown = function(){
        if ( m_is_focussed ) {
            var found_row = false;
            var offset = 0;

            for ( var i = m_ix_selected_menu_item + 1; i < m_menu_items.length; i++ ){
                Logger.log( 'm_menu_item_objs[ i ].getText() = ' + m_menu_items[ i ].getText() );
                if ( m_menu_items[ i ].getText() ){
                    found_row = true;
                    break;
                }
            }
            if ( found_row ){
                offset = i - m_ix_selected_menu_item - 1;
                m_sub_menu_widget.unselectRow( m_ix_selected_menu_item );
                m_sub_menu_widget.selectRow( m_ix_selected_menu_item + 1 + offset );
                m_ix_selected_menu_item = m_ix_selected_menu_item + 1 + offset;
                m_sub_menu_widget.scrollIfNeeded( SubMenuWidget.DIRECTION.DOWN );
            }
        }
    }
    this.navUp = function(){
        if ( m_is_focussed ) {
            var found_row = false;
            var offset = 0;

            for ( var i = m_ix_selected_menu_item - 1; i >= 0; i-- ){
                Logger.log( 'm_menu_item_objs[ i ].getText() = ' + m_menu_items[ i ].getText() );
                if ( m_menu_items[ i ].getText() ){
                    found_row = true;
                    break;
                }
            }
            if ( found_row ){
                offset = i - m_ix_selected_menu_item + 1;
                m_sub_menu_widget.unselectRow( m_ix_selected_menu_item );
                m_sub_menu_widget.selectRow( m_ix_selected_menu_item - 1 + offset );
                m_ix_selected_menu_item = m_ix_selected_menu_item - 1 + offset;
                m_sub_menu_widget.scrollIfNeeded( SubMenuWidget.DIRECTION.UP );
            }
        }
    }
    this.navLeft = function(){
        if ( m_is_focussed ){
            m_parent_controller_obj.requestingParentAction(
                {action: ApplicationController.OPERATIONS.CLOSE_AND_SELECT_PREVIOUS_MENU, calling_controller: this}
            );
        }
    }
    this.navRight = function(){
        if ( m_is_focussed ){
            m_sub_menu_widget.disableRow( m_ix_selected_menu_item );
            m_is_focussed = false;

            var menu_item = m_menu_items[ m_ix_selected_menu_item ];
            menu_item.getCallbackFunc()( menu_item.getCallbackArgs() );
        }
    }
    this.enterPressed = function(){
        if ( m_is_focussed ){
            m_sub_menu_widget.disableRow( m_ix_selected_menu_item );
            m_is_focussed = false;

            var menu_item = m_menu_items[ m_ix_selected_menu_item ];
            menu_item.getCallbackFunc()( menu_item.getCallbackArgs() );
        }
    }
    this.circlePressed = function(){
        this.navLeft();
    }
    
    /**
     * ### MENU CALLBACKS ###
     */
    
    function featured_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_FEATURED, calling_controller: this, category: FeaturedRequest.CATEGORY.MOVIES}
        );        
    }

    function popular_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_POPULAR, calling_controller: this, category: PopularRequest.CATEGORY.MOVIES}
        );
    }

    function recent_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_RECENT, calling_controller: this, category: RecentRequest.CATEGORY.MOVIES}
        );        
    }

    function browse_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_BROWSEALL, calling_controller: this, category: BrowseRequest.CHANNEL_NAME.MOVIES}
        );        
    }
    
    function genre_CALLBACK( genre ){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_GENRE, genre: genre, calling_controller: this, category: BrowseRequest.CHANNEL_NAME.MOVIES}
        );        
    }
    /**
     * ### END OF MENU CALLBACKS ###
     */
    
    
    /**
     * Create and return the menu background container
     */
    function getBackgroundContainer(){
        var tmp_container = engine.createContainer();
        var tmp_slate = engine.createSlate();
        
        tmp_slate = engine.createSlate();
        tmp_slate.width = AssetLoaderInstance.getImage( "Artwork/menu_bg.png" ).width;
        tmp_slate.height = 1080*2;
        
        tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/menu_bg.png" ).shader.texture;
        
        tmp_container.addChild( tmp_slate );
//        tmp_container.y = -1080;
        
        return tmp_container;
    }
    
    function getBackgroundAlphaContainer(){
        var tmp_container = engine.createContainer();
        var tmp_slate = engine.createSlate();
        
        tmp_slate = engine.createSlate();
        tmp_slate.width = AssetLoaderInstance.getImage( "Artwork/menu_bg_alpha.png" ).width;
        tmp_slate.height = 1080;
        
        tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/menu_bg_alpha.png" ).shader.texture;
        
        tmp_container.addChild( tmp_slate );
        tmp_container.x = 10;
//        tmp_container.y = -1080;
        
        return tmp_container;
    }    
    
    m_master_container.addChild( getBackgroundContainer() );
    
    // Add the menu widget to the master container
    // 
    // By now, the menu widget should be empty as we haven't passed the
    // MenuItemObjs yet
    m_master_container.addChild( m_sub_menu_widget.getDisplayNode() );
    m_sub_menu_widget.getDisplayNode().y = 150;
    m_sub_menu_widget.getDisplayNode().clipRect.x = 0;
    m_sub_menu_widget.getDisplayNode().clipRect.y = 0;
    m_sub_menu_widget.getDisplayNode().clipRect.width = 378;
    m_sub_menu_widget.getDisplayNode().clipRect.height = 1080;
    
    m_master_container.addChild( getBackgroundAlphaContainer() );
    
    m_sub_menu_widget.getDisplayNode().x = 0;
}
