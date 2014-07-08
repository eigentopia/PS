include( "js/app/com/dadc/lithium/model/MenuItem.js" );

include( "js/app/com/dadc/lithium/view/widgets/MainMenuWidget.js" );

var MainMenuController = function( ParentControllerObj ){
    
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj = ParentControllerObj;
    var m_root_node             = engine.createContainer();
    var m_master_container      = engine.createContainer();
    var m_is_focussed           = false;
    var m_menu_widget           = new MainMenuWidget( null );
    var m_menu_items;
    var m_ix_selected_menu_item = null;

    this.getUniqueID = function(){return m_unique_id;};
    this.getControllerName = function(){return 'MainMenuController';};
    this.open = function(){
        m_root_node.addChild( m_master_container );
    }
    this.close = function(){
        if ( m_root_node.contains( m_master_container ) ) m_root_node.removeChild( m_master_container );
    }
    this.getDisplayNode = function(){return m_root_node;};
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MainMenuController update() ' + engine_timer );
    }
    this.getParentControllerObj = function(){return m_parent_controller_obj;};
    
    /**
     * Called when user navigates back to the menu
     */
    this.setFocus = function(){
        m_menu_widget.selectRow( m_ix_selected_menu_item );
        m_is_focussed = true;
    }
    this.unsetFocus = function(){
        m_is_focussed = false;
    }    
    this.prepareToOpen = function( ){
        // Refresh the menu widget with MenuItemObjs
        m_menu_widget.refreshWidget( m_menu_items );
        
        // Select the first row in the menu
        m_menu_widget.selectRow( 0 );
        m_ix_selected_menu_item = 0;
        m_is_focussed = true;
        // inform our parent controller that we are ready to go
        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
    }
    
    // NAVIGATION METHODS
    this.navDown = function(){
        if ( m_is_focussed ) {
            if ( m_menu_items.length - 1 > m_ix_selected_menu_item ){
                m_menu_widget.unselectRow( m_ix_selected_menu_item );
                m_menu_widget.selectRow( m_ix_selected_menu_item + 1 );
                m_ix_selected_menu_item++;
            }        
        }
    }
    this.navUp = function(){
        if ( m_is_focussed ) {
            if ( m_ix_selected_menu_item > 0 ){
                m_menu_widget.unselectRow( m_ix_selected_menu_item );
                m_menu_widget.selectRow( m_ix_selected_menu_item - 1 );
                m_ix_selected_menu_item--;
            }        
        }
    }
    this.navLeft = function(){
    }
    this.navRight = function(){
        if ( m_is_focussed ){
            m_menu_widget.disableRow( m_ix_selected_menu_item );
            m_is_focussed = false;

            var menu_item = m_menu_items[ m_ix_selected_menu_item ];
            menu_item.getCallbackFunc()();
        }
    }
    this.enterPressed = function(){
        this.navRight();
    }
    
    /**
     * ### MENU CALLBACKS ###
     */
    function home_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_SLIDESHOW, calling_controller: this}
        );
    }

    function movies_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_MOVIES_MENU, calling_controller: this}
        );
    }
    
    function shows_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_SHOWS_MENU, calling_controller: this}
        );
    }
    
    function watchlist_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_WATCHLIST_MENU, calling_controller: this}
        );
    }  
    function mycrackle_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_MYCRACKLE_MENU, calling_controller: this}
        );
    }
    /**
     * ### END OF MENU CALLBACKS ###
     */
    
    function getBackgroundContainer(){
        var tmp_container = engine.createContainer();
        var tmp_slate = engine.createSlate();
        
        Logger.log( 'm_menu_widget.getDisplayNode().width = ' + m_menu_widget.getDisplayNode().width );
        tmp_slate = engine.createSlate();
        tmp_slate.width = 410;
        tmp_slate.height = 1080*2;
        tmp_container.x = -96;
        tmp_container.y = -1080;
        
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLACK( 1 ) );
        
        tmp_container.addChild( tmp_slate );
        
        return tmp_container;
    }    
    
    m_menu_items = [
            new MenuItem( Dictionary.getText( Dictionary.TEXT.HOME ), AssetLoaderInstance.getImage( "Artwork/menu_button_home.png" ), home_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.MOVIES ), AssetLoaderInstance.getImage( "Artwork/menu_button_movies.png" ), movies_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.SHOWS ), AssetLoaderInstance.getImage( "Artwork/menu_button_shows.png" ), shows_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.WATCHLISTS ), AssetLoaderInstance.getImage( "Artwork/menu_button_watchlist.png" ), watchlist_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.MY_CRACKLE ), AssetLoaderInstance.getImage( "Artwork/menu_button_my_crackle.png" ), mycrackle_CALLBACK, null, null )
        ];    
    
    // Add the menu widget to the master container
    // 
    // By now, the menu widget should be empty as we haven't passed the
    // MenuItemObjs yet
    m_master_container.addChild( getBackgroundContainer() );
    m_master_container.addChild( m_menu_widget.getDisplayNode() );
}
