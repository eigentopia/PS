include( "js/app/com/dadc/lithium/model/MenuItem.js" );

include( "js/app/com/dadc/lithium/view/widgets/SubMenuWidget.js" );

var MyCrackleMenuController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj = ParentControllerObj;
    var m_root_node             = engine.createContainer();
    var m_master_container      = engine.createContainer();
    var m_is_focussed           = false;
    var m_sub_menu_widget       = new SubMenuWidget( null );
    var m_menu_items;
    var m_ix_selected_menu_item = -1;
    
    this.getControllerName = function(){return 'MyCrackleMenuController';};
    this.getUniqueID = function(){return m_unique_id;};
    this.open = function(){
        m_root_node.addChild( m_master_container );
    }
    this.close = function(){
        if ( m_root_node.contains( m_master_container) ) m_root_node.removeChild( m_master_container );
    }
    this.getDisplayNode = function(){return m_root_node;};
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MyCrackleMenuController update() ' + engine_timer );
    
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
        m_menu_items = [
           // new MenuItem( Dictionary.getText( Dictionary.TEXT.HISTORY ), null, history_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.LOGIN ), null, login_CALLBACK, null ),
            new MenuItem( Dictionary.getText( Dictionary.TEXT.ABOUT ), null, about_CALLBACK, null ),

        ];    
        m_sub_menu_widget.refreshWidget( m_menu_items );
        // Select the first row in the menu
        m_sub_menu_widget.selectRow( 0 );
        m_ix_selected_menu_item = 0;
        m_is_focussed = true;
        // inform our parent controller that we are ready to go
        ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_READY );
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
        this.navRight();
    }
    this.circlePressed = function(){
        this.navLeft();
    }
    
    /**
     * ### MENU CALLBACKS ###
     */
    
    function about_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_ABOUT, calling_controller: this }
        );        
    }

    function login_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_LOGIN, calling_controller: this }
        );

    }

    function history_CALLBACK(){
        m_parent_controller_obj.requestingParentAction(
            {action: ApplicationController.OPERATIONS.OPEN_HISTORY, calling_controller: this }
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
        tmp_slate.width = 378;
        tmp_slate.height = 1080*2;
        
        tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/menu_bg.png" ).shader.texture;
        
        tmp_container.addChild( tmp_slate );
        tmp_container.y = -1080;
        
        return tmp_container;
    }
    
    function getBackgroundAlphaContainer(){
        var tmp_container = engine.createContainer();
        var tmp_slate = engine.createSlate();
        
        tmp_slate = engine.createSlate();
        tmp_slate.width = 370;
        tmp_slate.height = 1080;
        
        tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/menu_bg_alpha.png" ).shader.texture;
        
        tmp_container.addChild( tmp_slate );
//        tmp_container.x = 10;
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
