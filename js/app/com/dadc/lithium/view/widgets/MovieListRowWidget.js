include( "js/app/com/dadc/lithium/view/widgets/MovieListTileWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/BubbleWidget.js" );

/**
 * Movie List Widget
 */
var MovieListRowWidget = function( DataObj, renderOnStart ) {
    var This                                = this;
    var m_data_obj                          = DataObj;
    var m_root_node                         = engine.createContainer();
    var m_movie_list_tile_widgets           = [];
    var m_render_on_start                   = renderOnStart;
    var m_selected_col                      = -1;
    var m_focussed                          = false;
    
    var TILE_SPACING                        = 50;
    
    var HEIGHT                              = 310;
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MovieListRowWidget update() ' + engine_timer );
        
        for( var i in m_movie_list_tile_widgets ){
            m_movie_list_tile_widgets[ i ].update( engine_timer );
        }
    };
    
    this.refreshWidget = function( DataObj ){
        m_data_obj = DataObj;
        
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.renderTileWidgets = function(){
        for( var i in m_movie_list_tile_widgets ){
            if( m_movie_list_tile_widgets[ i ].canRender() ){
                m_movie_list_tile_widgets[ i ].render();
            }
        }
    }
    this.clearTileWidgets = function(){
        for( var i in m_movie_list_tile_widgets ){
            m_movie_list_tile_widgets[ i ].clear();
        }
    }
    
    this.setActive = function( col ){
        if( col >= m_movie_list_tile_widgets.length ){
            col = m_movie_list_tile_widgets.length - 1;
        }
        if( m_movie_list_tile_widgets[ col ] ){
            m_movie_list_tile_widgets[ col ].setActive();
        }
        
        m_focussed = true;
        m_selected_col = col;
    }
    this.setInactive = function( col ){
        if( m_movie_list_tile_widgets[ col ] ){
            m_movie_list_tile_widgets[ col ].setInactive();
        }
        m_focussed = false;
    }
    this.navLeft = function(){
        if( m_selected_col >= 0 ){
            if( m_selected_col - 1 >= 0 ){
                This.setInactive( m_selected_col );
                This.setActive( m_selected_col - 1 );
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    this.navRight = function(){
        if( m_selected_col >= 0 ){
            if( m_selected_col + 1 < m_movie_list_tile_widgets.length ){
                This.setInactive( m_selected_col );
                This.setActive( m_selected_col + 1 );
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    this.getSelectedIndex = function(){
        return m_selected_col;
    }
    this.setAllInactive = function(){
        for( var i in m_movie_list_tile_widgets ){
            m_movie_list_tile_widgets[ i ].setInactive();
        }
    }
    this.getDataObj = function(){
        return m_data_obj;
    }
    this.getHeight = function(){
        return HEIGHT;
    }
    function initWidget(){
        var col = 0;
        m_movie_list_tile_widgets = [];
        
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        for( var i in DataObj ){
            var data_item = DataObj[ i ];
            var tile_widget = new MovieListTileWidget( data_item, m_render_on_start );
            
            // Automatic position of tiles based on # cols and # rows
            tile_widget.getDisplayNode().x = ( TILE_SPACING * col ) + ( 200 * col );
            m_movie_list_tile_widgets.push( tile_widget );
            m_root_node.addChild( tile_widget.getDisplayNode() );
            
            col++;
        }
    }
    
    m_root_node.width = 900;
    m_root_node.height = 300;
    
    if ( DataObj ){
        initWidget();
    }
};