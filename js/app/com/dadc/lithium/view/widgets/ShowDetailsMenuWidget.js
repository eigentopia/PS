include( "js/app/com/dadc/lithium/view/widgets/ShowDetailsMenuItemWidget.js" );

/**
 * Show Details Menu Widget
 */
var ShowDetailsMenuWidget = function( MediaObjs, selIdx ) {
    var m_root_node                             = engine.createContainer();
    var m_menu_container                        = engine.createContainer();
    var m_show_details_episodes_menu_widgets    = [];
    var m_media_objs                            = MediaObjs;

    var selectedIdx = selIdx
    
    var m_selected_index                        = -1;
    var RENDER_THRESHOLD                    = 5;
    var RENDER_FWD_THRESHOLD                = 3;
    
    var ROW_WIDTH                           = 100;
    var ROW_SPACING                         = 2;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ShowDetailsMenuWidget update() ' + engine_timer );
        
    };
    this.destroy = function(){
        try{
            for( var i in m_show_details_episodes_menu_widgets ){
                m_show_details_episodes_menu_widgets[ i ].destroy();
            }
            while( m_menu_container.numChildren > 0 ){
                m_menu_container.removeChildAt( 0 );
            }
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
        }catch( e ){
            Logger.log( '!!! ShowDetailsMenuWidget EXCEPTION destroy()' );
            Logger.logObj( e );
        }finally{
            m_media_objs = null;
            m_root_node = null;
            m_menu_container = null;
            m_show_details_episodes_menu_widgets = null;
        }
    }
    this.refreshWidget = function( MediaObjs ){
        m_media_objs = MediaObjs;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    
    this.getSelectedRowIndex = function(){
        return m_selected_index;
    }
    
    this.navUp = function(){
        if ( m_selected_index > 0 ){

            // Set to inactive the current selected episode
            m_show_details_episodes_menu_widgets[ m_selected_index ].setDisabled();

            // Set to active the previous episode
            m_show_details_episodes_menu_widgets[ m_selected_index - 1 ].setActive();

            m_selected_index--;
            scrollIfNeeded();
            
            return true;
        }else{
            return false;
        }
    }
    
    this.navDown = function(){
        if ( m_selected_index < m_show_details_episodes_menu_widgets.length - 1 ){
            // Set to inactive the current selected episode
            m_show_details_episodes_menu_widgets[ m_selected_index ].setDisabled();

            // Set to active the next episode
            m_show_details_episodes_menu_widgets[ m_selected_index + 1 ].setActive();

            m_selected_index++;
            scrollIfNeeded();
            
            return true;
        }else{
            return false;
        }
    }

    this.navRight = function(){
        if(m_show_details_episodes_menu_widgets[ m_selected_index ].navRight()){
            return true
        }
        else{

            m_show_details_episodes_menu_widgets[ m_selected_index ].setInactive()
            return false
        }

    }
    this.navLeft = function(){
        if(m_show_details_episodes_menu_widgets[ m_selected_index ].navLeft()){
            return true
        }
        else{
            m_show_details_episodes_menu_widgets[ m_selected_index ].setInactive()
            return false
        }
        ;
    }
    
    this.enterPressed = function(doWatchlist){
//        this.disableRow( m_selected_episode_row );
        return m_show_details_episodes_menu_widgets[ m_selected_index ].enterPressed(doWatchlist)
    }
    
    this.getSelectedMenuItemIndex = function(){
        return m_selected_index;
    }
    
    this.getMediaIdSelectedRow = function(){
        var media_id = null;
        
        if ( m_selected_index >= 0 &&
             m_show_details_episodes_menu_widgets[ m_selected_index ] &&
             m_show_details_episodes_menu_widgets[ m_selected_index ].getMediaID ){
             
            media_id = m_show_details_episodes_menu_widgets[ m_selected_index ].getMediaID()
        }
        return media_id;
    }
    this.isActive = function(){
        if( m_selected_index >= 0 && m_show_details_episodes_menu_widgets[ m_selected_index ] ){
            return m_show_details_episodes_menu_widgets[ m_selected_index ].isActive();
        }else{
            return false;
        }
    }
    this.setFocus = function(){
        if( this.getSelectedRowIndex() >= 0 ){
            this.setActive();
        }        
    }
    this.unsetFocus = function(){
        if( this.getSelectedRowIndex() >= 0 ){
            this.setInactive();
        }        
    }
    this.setActive = function(){
        if ( m_show_details_episodes_menu_widgets[ m_selected_index ] )
            m_show_details_episodes_menu_widgets[ m_selected_index ].setActive();
    }

    this.setInactive = function(){
        if ( m_show_details_episodes_menu_widgets[ m_selected_index ] )
            m_show_details_episodes_menu_widgets[ m_selected_index ].setInactive();
    }
    
    this.setDisabled = function(){
        if ( m_show_details_episodes_menu_widgets[ m_selected_index ] )
            m_show_details_episodes_menu_widgets[ m_selected_index ].setDisabled();
    }
    
    this.refreshVideoProgressWidgets = function(){
        for( var i in m_show_details_episodes_menu_widgets ){
            m_show_details_episodes_menu_widgets[ i ].refreshVideoProgressWidget();
        }
    }
    this.refreshWatchlistButton = function(){
        for( var i in m_show_details_episodes_menu_widgets ){
            m_show_details_episodes_menu_widgets[ i ].refreshWatchlistButton();
        }
    }
    this.getSelectedObj = function(){
        Logger.log('getSelectedObj');
        Logger.logObj( m_media_objs[ m_selected_index ] );
        Logger.log( 'm_selected_index = ' + m_selected_index );
        return m_media_objs[ m_selected_index ];
    }
    this.getY = function(){
        return 520;
    }

    function getCellDisabledContainer(){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getGRAY( 1 ) );
        tmp_slate.height = 100;
        tmp_slate.width = 1920;
        
        tmp_container.addChild( tmp_slate );

        return tmp_container;
    }
    
    function initWidget(idx){
        while ( m_menu_container.numChildren > 0 ){
            m_menu_container.removeChildAt( 0 );
        }
        
        // The following for loops will search for media objects in the channel and populate widgets accordingly
        for ( var i = 0; i < m_media_objs.length; i++ ){
            var media_obj = m_media_objs[ i ];
            var media_id = media_obj.getID();

            var widget = new ShowDetailsMenuItemWidget( media_obj, media_id );
            m_show_details_episodes_menu_widgets.push( widget );

            // Add episode menu widget to our container
            m_menu_container.addChild( widget.getDisplayNode() );
            widget.getDisplayNode().y = ( ( m_menu_container.numChildren - 1 ) * 102 );
        }
        
        var tmp_container;
        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_show_details_episodes_menu_widgets.length ) * 102 );
        m_menu_container.addChild( tmp_container );

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_show_details_episodes_menu_widgets.length + 1 ) * 102 );
        m_menu_container.addChild( tmp_container );

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_show_details_episodes_menu_widgets.length + 2 ) * 102 );
        m_menu_container.addChild( tmp_container );

        tmp_container = getCellDisabledContainer();
        tmp_container.y = ( ( m_show_details_episodes_menu_widgets.length + 3 ) * 102 );
        m_menu_container.addChild( tmp_container );
        
        // If we have shows to display, select the first one
        if ( m_show_details_episodes_menu_widgets.length > 0 ){
            m_selected_index = idx;
            m_show_details_episodes_menu_widgets[ idx ].setActive();
            scrollIfNeeded();
        }
    }
    
    function scrollIfNeeded(){
        var selected_tile_y         = m_selected_index * ( ROW_WIDTH + ROW_SPACING );
        var selected_tile_height    = ( ROW_WIDTH + ROW_SPACING );
        var clip_rect_height        = m_menu_container.clipRect.height;
        var diff                    = selected_tile_y + selected_tile_height - clip_rect_height;

        // Is selected tile visible?
        if( diff > -( ROW_WIDTH + ROW_SPACING ) ){
            // Scroll up 'diff' pixels
            m_menu_container.y = 520 - diff - ( ROW_WIDTH + ROW_SPACING );
            m_menu_container.clipRect.y = diff + ( ROW_WIDTH + ROW_SPACING );
            UtilLibraryInstance.garbageCollect();
        }else{
            m_menu_container.y = 520;
            m_menu_container.clipRect.y = 0;
        }
        
        UtilLibraryInstance.garbageCollect();
    }        
    
    m_root_node.addChild( m_menu_container );
    m_menu_container.clipRect.x = 0;
    m_menu_container.clipRect.y = 0;
    m_menu_container.clipRect.width = 1920;
    m_menu_container.clipRect.height = 510;
    m_menu_container.y = 520;
    
    if ( MediaObjs ){
        initWidget(selectedIdx);
    }
  

};