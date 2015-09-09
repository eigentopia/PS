/**
 * Widget template
 */
var LoadingWidget = function( ) {
    var m_root_node = engine.createContainer();
    var m_master_container = engine.createContainer();
    var m_last_engine_timer = 0;
    
    this.refreshWidget = function(){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.clear = function(){
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        while( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
    }
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'LoadingWidget update() ' + engine_timer );
    
        if ( m_master_container && engine_timer > m_last_engine_timer + 0.2 ){

            m_last_engine_timer = engine_timer;
            m_master_container.rotationZ++;
        }        
    }
    /**
     * Load image from m_image_url and add it to our root container
     */
    function init(){
        var tmp_slate;
        var tmp_container;

        tmp_container = engine.createContainer();
        
        tmp_slate = engine.createSlate( );
        tmp_slate.width = AssetLoaderInstance.getImage( "Artwork/loading.png" ).naturalWidth;
        tmp_slate.height = AssetLoaderInstance.getImage( "Artwork/loading.png" ).naturalHeight;
        tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/loading.png" ).shader.texture;
        tmp_container.x -= tmp_slate.width / 2;
        tmp_container.y -= tmp_slate.width / 2;
        tmp_container.addChild( tmp_slate );
        m_master_container.addChild( tmp_container );
        
        m_master_container.scaleX = 1;
        m_master_container.scaleY = 1;
        
        m_master_container.width = tmp_slate.width;
        m_master_container.height = tmp_slate.height;
    }
    
    m_root_node.addChild( m_master_container );
    
    init();
    
    m_root_node.width = m_master_container.width;
    m_root_node.height = m_master_container.height;

};