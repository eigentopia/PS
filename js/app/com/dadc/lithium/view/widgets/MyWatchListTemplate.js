include( "js/app/com/dadc/lithium/view/widgets/RecommendedWatchlistTemplate1MenuWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/TabbedWidget.js" );

var RecommendedWatchlistTemplate1 = function( ChannelFolderListObj ){
    var m_root_node                 = engine.createContainer();
    var m_tabbed_widget             = new TabbedWidget( null );
    var m_menu_widgets              = [];
    var m_channel_folder_list_obj   = ChannelFolderListObj;

    this.getDisplayNode = function(){return m_root_node;}
    this.refreshWidget = function( ChannelFoderListObj ){
        m_channel_folder_list_obj   = ChannelFoderListObj;
        initWidget();
    }
    this.refreshVideoWidgets = function(){
        for( var i in m_menu_widgets ){
            m_menu_widgets[ i ].refreshVideoWidgets();
        }
    }    
    this.destroy = function(){
        Logger.log( 'RecommendedWatchlistTemplate1 destroy()' );
        try{
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
            for( var i in m_menu_widgets ){
                m_menu_widgets[ i ].destroy();
            }
            m_tabbed_widget.destroy();
        }catch( e ){
            Logger.log( '!!! RecommendedWatchlistTemplate1 EXCEPTION destroy()' );
            Logger.logObj( e );
        }finally{
            m_root_node = null;
            m_menu_widgets = null;
            m_channel_folder_list_obj = null;
            m_tabbed_widget = null;
        }        
    }
    this.setFocus = function(){
        if ( getVisibleMenuWidgetIndex() >= 0 ) m_menu_widgets[ getVisibleMenuWidgetIndex() ].setFocus();
    }
    this.unsetFocus = function(){
        if ( getVisibleMenuWidgetIndex() >= 0 ) m_menu_widgets[ getVisibleMenuWidgetIndex() ].unsetFocus();
    }
    this.isTabbedWidgetFocussed = function(){
        return m_tabbed_widget.isFocussed();
    }
    this.navDown = function(){
        if( m_tabbed_widget.isFocussed() ){
            m_tabbed_widget.unsetFocus();
            m_menu_widgets[ getVisibleMenuWidgetIndex() ].setFocus();
        }else{
            if ( getVisibleMenuWidgetIndex() >= 0 && m_menu_widgets[ getVisibleMenuWidgetIndex() ].navDown() ){
            }
        }
    }
    this.navUp = function(){
        if ( getVisibleMenuWidgetIndex() >= 0 ){
            if( m_menu_widgets[ getVisibleMenuWidgetIndex() ].navUp() ){
            }else{
                Logger.log( 'm_tabbed_widget.setFocus()' );
                m_tabbed_widget.setFocus();
                m_menu_widgets[ getVisibleMenuWidgetIndex() ].unsetFocus();
            }
        }
    }
    
    this.navLeft = function(){
        if( m_tabbed_widget.isFocussed() ){
            if( m_tabbed_widget.navLeft() ){
                var visible_menu_widget_index = getVisibleMenuWidgetIndex();
                var new_index = parseInt( visible_menu_widget_index ) - 1;
                Logger.log( 'visible_menu_widget_index = ' + visible_menu_widget_index );
                m_root_node.removeChild( m_menu_widgets[ visible_menu_widget_index ].getDisplayNode() );
                m_root_node.addChild( m_menu_widgets[ new_index ].getDisplayNode() );
                m_menu_widgets[ new_index ].unsetFocus();
                return true;
            }else{
                m_tabbed_widget.unsetFocus();
                return false;
            }
        }else{
            if( getVisibleMenuWidgetIndex() >= 0 ){
                return m_menu_widgets[ getVisibleMenuWidgetIndex() ].navLeft();
            }else{
                return false;
            }
        }
    }
    
    this.navRight = function(){
        if( m_tabbed_widget.isFocussed() ){
            if( m_tabbed_widget.navRight() ){
                var visible_menu_widget_index = getVisibleMenuWidgetIndex();
                var new_index = parseInt( visible_menu_widget_index ) + 1;
                Logger.log( 'new_index = ' + new_index );
                m_root_node.removeChild( m_menu_widgets[ visible_menu_widget_index ].getDisplayNode() );
                m_root_node.addChild( m_menu_widgets[ new_index ].getDisplayNode() );
                m_menu_widgets[ new_index ].unsetFocus();
                return true;
            }else{
                return false;
            }
        }else{
            if( getVisibleMenuWidgetIndex() >= 0 ){
                return m_menu_widgets[ getVisibleMenuWidgetIndex() ].navRight();
            }else{
                return false;
            }
        }
    }
    this.circlePressed = function(){
        if( m_tabbed_widget.isFocussed() ){
            m_tabbed_widget.unsetFocus();
            m_menu_widgets[ getVisibleMenuWidgetIndex() ].setFocus();
        }        
    }
    this.getSelectedButtonIndex = function(){
        return m_menu_widgets[ getVisibleMenuWidgetIndex() ].getSelectedButtonIndex();
    }
    this.getSelectedArgs = function(){
        return m_menu_widgets[ getVisibleMenuWidgetIndex() ].getSelectedArgs();
    }
    function initWidget(){
        var tabbed_items = [];
        var folders_cnt = m_channel_folder_list_obj.getTotalItems();
        
        for( var i = 0; i < folders_cnt; i++ ){
            var folder_obj  = m_channel_folder_list_obj.getItem( i );
            var folder_name = folder_obj.getName();
            var playlistObj = folder_obj.getPlaylistList();
            var mediaListObj = playlistObj.getItem( 0 ).getMediaList();
            m_menu_widgets.push( new RecommendedWatchlistTemplate1MenuWidget( mediaListObj ) );
            tabbed_items.push( folder_name );
        }
        
        if( tabbed_items.length > 0 ){
            m_tabbed_widget.refreshWidget( tabbed_items );
            m_tabbed_widget.unsetFocus();
            m_root_node.addChild( m_menu_widgets[ 0 ].getDisplayNode() );
            m_tabbed_widget.getDisplayNode().y = m_menu_widgets[ 0 ].getY() - m_tabbed_widget.getHeight();
            m_tabbed_widget.getDisplayNode().x = 50;
        }
    }
    
    function getVisibleMenuWidgetIndex(){
        for( var i in m_menu_widgets ){
            if( m_root_node.contains( m_menu_widgets[ i ].getDisplayNode() ) ){
                return i;
            }
        }
        return -1;
    }    
    
    m_root_node.addChild( m_tabbed_widget.getDisplayNode() );
    
    if( ChannelFolderListObj ){
        initWidget();
    }
};