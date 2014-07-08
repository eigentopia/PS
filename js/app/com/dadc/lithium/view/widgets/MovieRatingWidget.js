/**
 * Movie Rating Widget
 * 
 * @params num_stars Numbers of stars to show. Value can be in decimal to show
 * half of a start. For example, if num_stars = 3.5, three and half of a star
 * will be rendered
 */
var MovieRatingWidget = function( num_stars, text_before ) {
    var m_root_node = engine.createContainer();
    var m_num_stars = num_stars;
    var m_text_before = text_before;
    
    var STAR_SPACING = 36;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MovieRatingWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( num_stars, text_before ){
        m_num_stars = num_stars;
        m_text_before = text_before;
        
        // Remove all children from root node
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        initWidget();
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.clear = function(){
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }        
    }    
    this.destroy = function(){
        Logger.log( 'MovieRatingWidget destroy()' );
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }        
    }
    function initWidget(){
        var tmp_slate;
        var total_width = 0;
        var i;
        var star_container = engine.createContainer();
        var text_container = engine.createContainer();

        if ( !m_num_stars ){
            var tblock = engine.createTextBlock( '(' + Dictionary.getText( Dictionary.TEXT.NOT_YET_RATED ) + ')', FontLibraryInstance.getFont_NOTYETRATED(), 500 );
            text_container.addChild( tblock );
        }
        
        for( i = 0; i < Math.floor( m_num_stars ); i++ ){
            tmp_slate = getStarSlate();
            tmp_slate.x = (i * STAR_SPACING );
            star_container.addChild( tmp_slate );
            total_width += STAR_SPACING;
        }
        
        // Add half star if needed
        if ( Math.floor( m_num_stars ) != m_num_stars ){
            var tmp_container = engine.createContainer();
            tmp_slate = getStarSlate();
            
            tmp_container.x = (i * STAR_SPACING );
            tmp_container.height = tmp_slate.height;
            tmp_container.width = tmp_slate.width;
            tmp_container.clipRect.width = AssetLoaderInstance.getImage( "Artwork/rating_star.png" ).width / 2;
            tmp_container.clipRect.height = AssetLoaderInstance.getImage( "Artwork/rating_star.png" ).height;
            tmp_container.addChild( tmp_slate );
            
            star_container.addChild( tmp_container );
        }
        
        // Add the gray stars
        for ( i = Math.ceil( m_num_stars ); i < 5; i++ ){
            tmp_slate = getDisabledStarSlate();
            tmp_slate.x = (i * STAR_SPACING );
            star_container.addChild( tmp_slate );
            total_width += STAR_SPACING;
        }
        
        star_container.width = total_width;
        
        Logger.log( 'star_container.width = ' + star_container.width );
        Logger.log( 'm_num_stars = ' + m_num_stars );
        
        if ( !m_num_stars ){
            
            if ( m_text_before ){
                text_container.x = 0;
                star_container.x = tblock.naturalWidth + 20;
                total_width += ( tblock.naturalWidth + 20 );
            }else{
                text_container.x = total_width + 20;
                star_container.x = 0;
                total_width += ( tblock.naturalWidth - 20 );
            }
            
            text_container.y = -8;
            
            m_root_node.addChild( text_container );
            m_root_node.addChild( star_container );
        }else{
            star_container.x = 0;
            m_root_node.addChild( star_container );
        }
        
        m_root_node.width = total_width;
        m_root_node.height = tmp_slate.height;
    }
    
    function getStarSlate(){
        var tmp_slate;
            tmp_slate = engine.createSlate();
            tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
            tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/rating_star.png" ).shader.texture;
            tmp_slate.height = AssetLoaderInstance.getImage( "Artwork/rating_star.png" ).height;
            tmp_slate.width = AssetLoaderInstance.getImage( "Artwork/rating_star.png" ).width;
            
            return tmp_slate;
    }
    function getDisabledStarSlate(){
        var tmp_slate;
            tmp_slate = engine.createSlate();
            tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
            tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/rating_star_disabled.png" ).shader.texture;
            tmp_slate.height = AssetLoaderInstance.getImage( "Artwork/rating_star_disabled.png" ).height;
            tmp_slate.width = AssetLoaderInstance.getImage( "Artwork/rating_star_disabled.png" ).width;
            
            return tmp_slate;
    }

    if ( num_stars ){
        initWidget();
    } 

};