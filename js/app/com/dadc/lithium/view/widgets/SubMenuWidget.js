include( "js/app/com/dadc/lithium/view/widgets/SubMenuItemWidget.js" );

/**
 * Menu Widget
 * 
 * Widget to render a menu. If its constructor parameter is null, an empty
 * container is created.
 * 
 * Call refreshWidget() with an array of MenuItem model's objects to pass the
 * menu items to be displayed
 * 
 * @param MenuItemObjs An array of MenuItem model's objects
 */
var SubMenuWidget = function( MenuItemObjs, HeaderText ) {
    var m_root_node                         = engine.createContainer();
    var m_nodes_container                   = engine.createContainer();
    var m_menu_item_objs                    = MenuItemObjs;
    var m_sub_menu_item_widgets             = [];
    var m_header_text                       = HeaderText;
    var m_selected_widget;
    
    // To keep track of the last y's position for a menu item container in 
    // order to position a new container underneath the last one
    var m_menu_container_last_y;
    
    var MENU_CONTAINER_INITIAL_Y = 0;
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SubMenuWidget update() ' + engine_timer );
        
        for( var i in m_sub_menu_item_widgets ){
            m_sub_menu_item_widgets[ i ].update( engine_timer );
        }
    };
    
    this.refreshWidget = function( MenuItemObjs, HeaderText ){
        m_menu_item_objs = MenuItemObjs;
        m_header_text = HeaderText;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    
    /**
     * Select row at index. This method will remove the disable container
     * if exists and add the selection container
     */
    this.selectRow = function( index ){
        if ( m_sub_menu_item_widgets[ index ] ){
            m_sub_menu_item_widgets[ index ].setActive();
            m_sub_menu_item_widgets[ index ].setFocus();
            m_selected_widget = m_sub_menu_item_widgets[ index ];
        }
    }
    
    /**
     * Disable row at index. This method will remove the selected container
     * if exists and add the disabled container
     * 
     * Note that this is not the same as unselect a row. A disabled row
     * contains a gray background whereas an unselected row doesn't contain
     * anything else but the menu text
     */
    this.disableRow = function( index ){
        if( m_sub_menu_item_widgets[ index ] ){
            m_sub_menu_item_widgets[ index ].setDisabled();
            m_sub_menu_item_widgets[ index ].removeFocus();
        }
    }
    
    /**
     * Remove all the background containers (disabled and selected) at row index
     */
    this.unselectRow = function( index ){
        if ( m_sub_menu_item_widgets[ index ] ){
            m_sub_menu_item_widgets[ index ].setInactive();
            m_sub_menu_item_widgets[ index ].removeFocus();
        }
    }
    
    this.scrollIfNeeded = function( SubMenuWidget_DIRECTION ){
        var diff = m_selected_widget.getDisplayNode().y - 450;
        Logger.log( 'diff = ' + diff );
        Logger.log( 'm_selected_container.y = ' + m_selected_widget.getDisplayNode().y );
        if ( m_selected_widget.getDisplayNode().y > 450 ){
            if ( SubMenuWidget_DIRECTION == SubMenuWidget.DIRECTION.UP ){
                m_nodes_container.y += 90;
            }else{
                m_nodes_container.y -= 90;
            }
        }
        
        if ( m_selected_widget.getDisplayNode().y <= 450 && m_nodes_container.y != 90 * 2 && SubMenuWidget_DIRECTION == SubMenuWidget.DIRECTION.UP ){
            m_nodes_container.y += 90;
        }
        Logger.log( 'm_nodes_container.y = ' + m_nodes_container.y );
    }
    
    function initWidget(){
        var submenu_item_widget;
        
        m_menu_container_last_y = MENU_CONTAINER_INITIAL_Y;
        while ( m_nodes_container.numChildren > 0 ){
            m_nodes_container.removeChildAt( 0 );
        }
        
        if( m_header_text && m_header_text !== undefined ){
            var tblock = engine.createTextBlock( m_header_text, FontLibraryInstance.getFont_SUBMENUHEADER(), 500 );
            m_nodes_container.addChild( tblock );
            tblock.x = 50;
            tblock.y = 45 - tblock.naturalHeight / 2;
            m_menu_container_last_y = 90;
        }
            
        for ( var i in m_menu_item_objs ){
            var menu_item_obj = m_menu_item_objs[ i ];
            
            if ( ! menu_item_obj.getText() ){

                // Menu separator
                submenu_item_widget = new SubMenuItemWidget( menu_item_obj );
                submenu_item_widget.getDisplayNode().x = 30;
                submenu_item_widget.getDisplayNode().y = m_menu_container_last_y;
                m_menu_container_last_y = m_menu_container_last_y + 1;
                m_nodes_container.addChild( submenu_item_widget.getDisplayNode() );
                m_sub_menu_item_widgets.push( submenu_item_widget );
                
            }else{
                submenu_item_widget = new SubMenuItemWidget( menu_item_obj );
                submenu_item_widget.getDisplayNode().y = m_menu_container_last_y;
                submenu_item_widget.getDisplayNode().x = 10;
                m_menu_container_last_y = m_menu_container_last_y + 90;
                m_nodes_container.addChild( submenu_item_widget.getDisplayNode() );
                m_sub_menu_item_widgets.push( submenu_item_widget );
            }
        }
    }
    
    /**
     * Return a container that will be added to a row upon a selectRow call
     */
    function getCellSelectionContainer(){
        var tmp_slate = engine.createSlate();
        var slice_shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slice_shader.texture = AssetLoaderInstance.getImage( "Artwork/subnav_button_orange.png" ).shader.texture;
        tmp_slate.shader = slice_shader;
        
        tmp_slate.width = 360;
        tmp_slate.height = 90;
        
        return tmp_slate;
    }

    /**
     * Return a container that will be added to a row upon a disableRow call
     */
    function getCellDisabledContainer(){
        var tmp_slate = engine.createSlate();
        var slice_shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slice_shader.texture = AssetLoaderInstance.getImage( "Artwork/subnav_button_gray.png" ).shader.texture;
        tmp_slate.shader = slice_shader;
        
        tmp_slate.width = 360;
        tmp_slate.height = 90;
        
        return tmp_slate;
    }
    
    m_nodes_container.y = 90 * 2;
    m_root_node.addChild( m_nodes_container );
    
    if ( MenuItemObjs ){
        initWidget();
    }

};

SubMenuWidget.DIRECTION = {
    UP: 1,
    DOWN: 2
};