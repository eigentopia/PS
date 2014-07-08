/**
 * Slide Show Arrow Widget
 */
var SlideShowArrowWidget = function( SlideShowArrowWidget_DIRECTION, SlideShowArrowWidget_COLOR ) {
    var m_root_node = engine.createContainer();
    var m_direction = SlideShowArrowWidget_DIRECTION;
    var m_color = SlideShowArrowWidget_COLOR;
    var m_arrow_container = engine.createContainer();

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SlideShowArrowWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( SlideShowArrowWidget_DIRECTION, SlideShowArrowWidget_COLOR ){
        m_direction = SlideShowArrowWidget_DIRECTION;
        m_color = SlideShowArrowWidget_COLOR;
        initWidget();
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    
    function initWidget(){
        var image;
        var tmp_slate = engine.createSlate();
        
        while ( m_arrow_container.numChildren > 0 ){
            m_arrow_container.removeChildAt( 0 );
        }
        
        if ( m_direction == SlideShowArrowWidget.DIRECTION.PREV && m_color == SlideShowArrowWidget.COLOR.WHITE ){
            image = AssetLoaderInstance.getImage( "Artwork/prev_arrow_white.png" );
        }
        if ( m_direction == SlideShowArrowWidget.DIRECTION.PREV && m_color == SlideShowArrowWidget.COLOR.GRAY ){
            image = AssetLoaderInstance.getImage( "Artwork/prev_arrow_gray.png" );
        }
        if ( m_direction == SlideShowArrowWidget.DIRECTION.NEXT && m_color == SlideShowArrowWidget.COLOR.WHITE ){
            image = AssetLoaderInstance.getImage( "Artwork/next_arrow_white.png" );
        }
        if ( m_direction == SlideShowArrowWidget.DIRECTION.NEXT && m_color == SlideShowArrowWidget.COLOR.GRAY ){
            image = AssetLoaderInstance.getImage( "Artwork/next_arrow_gray.png" );
        }
        
        tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture = image.shader.texture;
        tmp_slate.width = 21;
        tmp_slate.height = 39;
        
        m_arrow_container.addChild( tmp_slate );
    }
    
    if ( m_direction && m_color ) initWidget();
    m_root_node.addChild( m_arrow_container );
    m_root_node.width = 21;
    m_root_node.width = 39;

};

SlideShowArrowWidget.DIRECTION = {
    PREV: 1,
    NEXT: 2
}

SlideShowArrowWidget.COLOR = {
    WHITE: 1,
    GRAY: 2
}