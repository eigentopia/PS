include( "js/app/com/dadc/lithium/view/widgets/RecommendedWatchlistTemplate1MenuWidget.js" );
//include( "js/app/com/dadc/lithium/view/widgets/TabbedWidget.js" );

var RecommendedWatchlistTemplate1 = function( ChannelFolderListObj ){
    var m_root_node                 = engine.createContainer();
    var m_menu_widgets              = [];
    var m_channel_folder_list_obj   = ChannelFolderListObj;
    var isFocused = false;

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
        }catch( e ){
            Logger.log( '!!! RecommendedWatchlistTemplate1 EXCEPTION destroy()' );
            Logger.logObj( e );
        }finally{
            m_root_node = null;
            m_menu_widgets = null;
            m_channel_folder_list_obj = null;
        }        
    }
    this.setFocus = function(){
        if ( getVisibleMenuWidgetIndex() >= 0 ){
            m_menu_widgets[ getVisibleMenuWidgetIndex() ].setFocus()
            isFocused = true;
        } 
    }
    this.unsetFocus = function(){
        if ( getVisibleMenuWidgetIndex() >= 0 ){
            m_menu_widgets[ getVisibleMenuWidgetIndex() ].unsetFocus();
            isFocused = false;
        }
    }
    this.hasFocus = function(){
        return isFocused;
    }
    this.isTabbedWidgetFocussed = function(){
       // return m_tabbed_widget.isFocussed();
    }
    
    this.navDown = function(){
        if ( getVisibleMenuWidgetIndex() >= 0){
            return m_menu_widgets[ getVisibleMenuWidgetIndex() ].navDown();
        }
        else{
            return false
        }
    }

    this.navUp = function(){
        if ( getVisibleMenuWidgetIndex() >= 0 ){
            return m_menu_widgets[ getVisibleMenuWidgetIndex() ].navUp()
        }
        else{
            return false
        }
    }
    
    this.navLeft = function(){
        if( getVisibleMenuWidgetIndex() >= 0 ){
            return m_menu_widgets[ getVisibleMenuWidgetIndex() ].navLeft();
        }else{
            return false;
        }

    }
    
    this.navRight = function(){
        if( getVisibleMenuWidgetIndex() >= 0 ){
            return m_menu_widgets[ getVisibleMenuWidgetIndex() ].navRight();
        }else{
            return false;
        }

    }
    this.circlePressed = function(){
   
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
            m_root_node.addChild( m_menu_widgets[ 0 ].getDisplayNode() );

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
    
    
    if( ChannelFolderListObj ){
        initWidget();
    }
};