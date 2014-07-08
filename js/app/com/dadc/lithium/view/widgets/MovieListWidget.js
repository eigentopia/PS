include( "js/app/com/dadc/lithium/view/widgets/MovieListTileWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/MovieListRowWidget.js" );

/**
 * Movie List Widget
 */
var MovieListWidget = function() {
    var This                                = this;
    var m_data_obj                          = null;
    var m_style                             = null;
    var m_root_node                         = engine.createContainer();
    var m_tile_container                    = engine.createContainer();
    var m_master_container                  = engine.createContainer();
    var m_selected_row                      = -1;
    var m_row_tile_widgets                  = [];
    var m_clipping_rect_height              = 1080 - 150;
    var m_row_padding                       = 80;
    
    var m_ix_selected_tile                  = [ -1, -1 ]; // [row,col]
    
    var m_bubble_start_time                 = undefined;
    var BUBBLE_TIME_IN_SECONDS              = 1;

    var RENDER_THRESHOLD                    = 3;
    var RENDER_FWD_THRESHOLD                = 1;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MovieListWidget update() ' + engine_timer );
        for ( var i in m_row_tile_widgets ){
            m_row_tile_widgets[ i ].update( engine_timer );
        }
        // Has the bubble timer started?
        if ( m_bubble_start_time && engine.getTimer() >= m_bubble_start_time + BUBBLE_TIME_IN_SECONDS && m_selected_row >= 0 ){
            var data_obj = m_row_tile_widgets[ m_selected_row ].getDataObj() [ m_row_tile_widgets[ m_selected_row ].getSelectedIndex() ];

            var bubble_style;// = BubbleWidget.STYLE.MOVIES;
            
            switch ( m_style ) {
                case MovieListWidget.STYLE.MOVIES:
                    bubble_style = BubbleWidget.STYLE.MOVIES;
                    break;
                case MovieListWidget.STYLE.SHOWS:
                    bubble_style = BubbleWidget.STYLE.SHOWS;
                    break;
                case MovieListWidget.STYLE.WATCHLIST:
                    bubble_style = BubbleWidget.STYLE.WATCHLIST;
                    break;
            }
            
            // If timer has elapsed, show the bubble widget
            m_bubble_start_time = undefined;
            
            BubbleWidgetInstance.getDisplayNode().y = m_row_tile_widgets[ m_selected_row ].getDisplayNode().y + ( m_tile_container.y ) + 312;
            BubbleWidgetInstance.refreshWidget( data_obj, m_row_tile_widgets[ m_selected_row ].getSelectedIndex(), bubble_style );
            if( !m_root_node.contains( BubbleWidgetInstance.getDisplayNode() ) )
                m_root_node.addChild( BubbleWidgetInstance.getDisplayNode() );
            Logger.log( 'BubbleWidgetInstance.getDisplayNode().y = ' + BubbleWidgetInstance.getDisplayNode().y );
        }
    };
    
    this.closeBubble = function(){
        if ( m_root_node.contains( BubbleWidgetInstance.getDisplayNode() ) ){
            m_root_node.removeChild( BubbleWidgetInstance.getDisplayNode() );
        }
        m_bubble_start_time = undefined;
    }
    this.destroy = function(){
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        while( m_tile_container.numChildren > 0 ){
            m_tile_container.removeChildAt( 0 );
        }
        while( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
        
        m_row_tile_widgets = null;
        m_master_container = null;
        m_tile_container = null;
        m_root_node = null;
        
    }
    
    this.refreshWidget = function( DataObj, MovieListWidget_STYLE  ){
        m_data_obj = DataObj;
        m_style = MovieListWidget_STYLE;

        initWidget();
        
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.getDataObjectAtSelection = function(){
        Logger.log('m_selected_row = ' + m_selected_row);
        if( m_selected_row < 0 ) return null;
        
        var row_data = m_data_obj.getItemList().getNonClipsRow( m_selected_row, 5 )
        if( row_data ){
            return row_data[ m_row_tile_widgets[ m_selected_row ].getSelectedIndex() ];
        }else{
            return null;
        }

    }
    this.getSelectedTileCoordinates = function(){return m_ix_selected_tile;}
    this.getTileAt = function( row, col ){
//        return m_movie_list_tile_widgets[ row ][ col ];
    }
    
    this.setFocus = function(){
        
    }
    
    this.setActive = function( row, col ){
        Logger.log( 'setactive()' );
        Logger.log( 'row = ' + row );
        Logger.log( 'col = ' + col );
        if( m_row_tile_widgets[ row ] ){
            m_row_tile_widgets[ row ].setActive( col );
            m_bubble_start_time = engine.getTimer();
            m_selected_row = row;
        }
    }
    
    this.setInactive = function( row, col ){
        if( m_row_tile_widgets[ row ] ){
            m_row_tile_widgets[ row ].setInactive( col );
        }
    }
    
    this.getNumberOfRows = function(){
//        return m_movie_list_tile_widgets.length;
    }
    this.getLastActive = function(){
        if( m_selected_row >= 0 ){
            if( ! m_row_tile_widgets[ m_selected_row ] ) return null;
            return [ m_selected_row, m_row_tile_widgets[ m_selected_row ].getSelectedIndex() ];
        }else{
            return null;
        }
    }

    // NAVIGATION METHODS
    this.navLeft = function(){
        if( m_selected_row < 0 ) return false;
        if ( ! m_row_tile_widgets[ m_selected_row ].navLeft() ){
            m_row_tile_widgets[ m_selected_row ].setInactive( 0 );
            return false;
        }else{
            this.closeBubble();
            m_bubble_start_time = engine.getTimer();
            return true;
        }
    };
    this.navRight = function(){
        if( m_selected_row < 0 ) return false;
        if( ! m_row_tile_widgets[ m_selected_row ].navRight() ){
            if( m_selected_row < m_row_tile_widgets.length - 1 ){
                m_row_tile_widgets[ m_selected_row ].setInactive( m_row_tile_widgets[ m_selected_row ].getSelectedIndex() );
                m_row_tile_widgets[ m_selected_row + 1 ].setActive( 0 );
                renderTileWidgets( m_selected_row + 1 );
                clearTileWidgets( m_selected_row + 1 );
                m_selected_row++;
                this.closeBubble();
                m_bubble_start_time = engine.getTimer();
                scrollDownIfNeeded();
            }
        }else{
            this.closeBubble();
            m_bubble_start_time = engine.getTimer();
        }
    };
    this.navDown = function(){
        if( m_selected_row < 0 ) return false;
        
        Logger.log( 'm_row_tile_widgets.length = ' + m_row_tile_widgets.length );
        if( m_selected_row < m_row_tile_widgets.length - 1 ){
            Logger.log( 'm_selected_row = ' + m_selected_row );
            renderTileWidgets( m_selected_row + 1 );
            clearTileWidgets( m_selected_row + 1 );
            m_row_tile_widgets[ m_selected_row ].setInactive( m_row_tile_widgets[ m_selected_row ].getSelectedIndex() );
            m_row_tile_widgets[ m_selected_row + 1 ].setActive( m_row_tile_widgets[ m_selected_row ].getSelectedIndex() );
            m_selected_row++;
            this.closeBubble();
            m_bubble_start_time = engine.getTimer();
            scrollDownIfNeeded();
            
        }
        Logger.log( 'm_selected_row = ' + m_selected_row );
        Logger.log( 'm_row_tile_widgets.length - 1 = ' + ( m_row_tile_widgets.length - 1 ) );
        
    };
    this.navUp = function(){
        if( m_selected_row < 0 ) return false;
        
        if( m_selected_row > 0 ){
            renderTileWidgets( m_selected_row - 1 );
            clearTileWidgets( m_selected_row + 1 );
            m_row_tile_widgets[ m_selected_row ].setInactive( m_row_tile_widgets[ m_selected_row ].getSelectedIndex() );
            m_row_tile_widgets[ m_selected_row - 1 ].setActive( m_row_tile_widgets[ m_selected_row ].getSelectedIndex() );
            m_selected_row--;
            this.closeBubble();
            m_bubble_start_time = engine.getTimer();
            scrollUpIfNeeded();
        }
        Logger.log( 'm_selected_row = ' + m_selected_row );

    };
    this.enterPressed = function(){
        this.closeBubble();
    }
    this.circlePressed = function(){
    }
    
    this.setClippingHeight = function( height, offset ){
        m_master_container.clipRect.height = height;
        m_clipping_rect_height = height - offset;
    }
    this.setRowPadding = function( padding ){
        m_row_padding = padding;
    }
    function displayNumberOfChildren( container, level ){
        Logger.log( 'lvl ' + level + ' container.numChildren = ' + container.numChildren );
        for( var i = 0 ; i < container.numChildren; i++ ){
            if( container.getChildAt( i ).numChildren > 0 ){
                displayNumberOfChildren( container.getChildAt( i ), level + 1 );
            }
            Logger.log( '---------------------------------------------------------------------------' );
        }
    }
    function renderTileWidgets( start_row_index ){
//        displayNumberOfChildren( m_root_node, 1 );
        
        for( var i = start_row_index - RENDER_FWD_THRESHOLD; i < start_row_index + 1 + RENDER_FWD_THRESHOLD; i++ ){
            if( i >= 0 && m_row_tile_widgets[ i ] ){
                Logger.log( 'i = ' + i );
                
                m_row_tile_widgets[ i ].getDisplayNode().y = ( m_row_padding * i ) + ( m_row_tile_widgets[ i ].getHeight() * i );
                if( !m_tile_container.contains( m_row_tile_widgets[ i ].getDisplayNode() ) )
                    m_tile_container.addChild( m_row_tile_widgets[ i ].getDisplayNode() );
                
                m_row_tile_widgets[ i ].renderTileWidgets();
            }
        }
    }
    
    function clearTileWidgets( start_row_index ){
        Logger.log( 'clearTileWidgets( ' + start_row_index + ')' );
        
        var cleared = false;
        for( var i = 0; i < m_row_tile_widgets.length; i++ ){
            if( i < ( start_row_index - RENDER_FWD_THRESHOLD - RENDER_THRESHOLD ) || i > ( start_row_index + RENDER_FWD_THRESHOLD + RENDER_THRESHOLD ) ){
                Logger.log( 'i = ' + i );
                
                if( m_tile_container.contains( m_row_tile_widgets[ i ].getDisplayNode() ) ){
                    m_tile_container.removeChild( m_row_tile_widgets[ i ].getDisplayNode() );
                    cleared = true;
                }
                m_row_tile_widgets[ i ].clearTileWidgets();
            }
        }
        if( cleared ) UtilLibraryInstance.garbageCollect();

        
    }
    function scrollUpIfNeeded(){
        var cur_pos = ( m_selected_row * m_row_tile_widgets[ m_selected_row ].getHeight() ) + ( ( m_selected_row * m_row_padding ) - m_row_padding ) + m_tile_container.y;
        var tile_end_pos = cur_pos + m_row_tile_widgets[ m_selected_row ].getHeight();
        
        if( tile_end_pos <= 0 ){
            var offscreen_pixel_height = m_row_tile_widgets[ m_selected_row ].getHeight() - ( m_clipping_rect_height - cur_pos );
            Logger.log( 'needs scroll' );
            m_tile_container.y += ( m_row_tile_widgets[ m_selected_row ].getHeight() + m_row_padding );//m_row_padding - m_row_tile_widgets[ m_selected_row ].getHeight() - offscreen_pixel_height - m_row_padding;
            Logger.log( ' m_row_padding - m_row_tile_widgets[ m_selected_row ].getHeight() - offscreen_pixel_height - m_row_padding = ' +  ( m_row_padding - m_row_tile_widgets[ m_selected_row ].getHeight() - offscreen_pixel_height - m_row_padding ) );
            UtilLibraryInstance.garbageCollect();
        }
    }
    function scrollDownIfNeeded(){
        // (rowindex * rowheight) + ((rowindex * padding)-padding) + tilecontainer.y
        var cur_pos = ( m_selected_row * m_row_tile_widgets[ m_selected_row ].getHeight() ) + ( ( m_selected_row * m_row_padding ) - m_row_padding ) + m_tile_container.y;
        var tile_end_pos = cur_pos + m_row_tile_widgets[ m_selected_row ].getHeight();
        
        if( tile_end_pos > m_clipping_rect_height ){
            var offscreen_pixel_height = m_row_tile_widgets[ m_selected_row ].getHeight() - ( m_clipping_rect_height - cur_pos );
            Logger.log( 'needs scroll' );
            m_tile_container.y -= ( m_row_tile_widgets[ m_selected_row ].getHeight() + m_row_padding );//m_row_padding - m_row_tile_widgets[ m_selected_row ].getHeight() - offscreen_pixel_height - m_row_padding;
            Logger.log( ' m_row_padding - m_row_tile_widgets[ m_selected_row ].getHeight() - offscreen_pixel_height - m_row_padding = ' +  ( m_row_padding - m_row_tile_widgets[ m_selected_row ].getHeight() - offscreen_pixel_height - m_row_padding ) );
            UtilLibraryInstance.garbageCollect();
        }
        Logger.log( 'cur_pos = ' + cur_pos );
    }
    function initWidget(){

        var tile_widget;
        
        m_row_tile_widgets = [];
        
        while( m_tile_container.numChildren > 0 ){
            m_tile_container.removeChildAt( 0 );
        }

        m_tile_container.width = 1920;
        m_tile_container.height = m_clipping_rect_height;

        m_bubble_start_time = engine.getTimer();
        
        for( var row = 0; row < m_data_obj.getItemList().countNonClipsRows( 5 ); row++ ){
            tile_widget = new MovieListRowWidget( m_data_obj.getItemList().getNonClipsRow( row , 5 ), ( row < RENDER_THRESHOLD ), m_style );
            m_row_tile_widgets.push( tile_widget );
            
            if( row < RENDER_THRESHOLD ){
                m_row_tile_widgets[ m_row_tile_widgets.length - 1 ].getDisplayNode().y = ( m_row_padding * row ) + ( m_row_tile_widgets[ m_row_tile_widgets.length - 1 ].getHeight() * row );
                m_tile_container.addChild( m_row_tile_widgets[ m_row_tile_widgets.length - 1 ].getDisplayNode() );
            }
        }
        
        UtilLibraryInstance.garbageCollect();
    }

    m_root_node.addChild( m_master_container );
    
    m_master_container.addChild( m_tile_container );
    
    m_master_container.clipRect.x = -50;
    m_master_container.clipRect.y = 0;
    m_master_container.clipRect.width = 1920;
    m_master_container.clipRect.height = m_clipping_rect_height;//
    
    m_master_container.width = 900;
    m_master_container.height = 1080;
    
    m_root_node.width = m_master_container.width;
    m_root_node.height = m_master_container.height;
};

MovieListWidget.STYLE = {
    MOVIES: 1,
    SHOWS: 2,
    WATCHLIST: 3
}