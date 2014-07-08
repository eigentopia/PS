/**
 * About Widget
 */
var AboutWidget = function( ) {
    var m_root_node = engine.createContainer();
    var m_master_container = engine.createContainer();
    
    this.refreshWidget = function(){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'AboutWidget update() ' + engine_timer );
        
    }


    function init(){
        var tmp_container;
        var tblock;

        tmp_container = engine.createContainer();
        tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.ABOUT_TEXT ), FontLibraryInstance.getFont_ABOUT(), 1100 );
        tmp_container.addChild( tblock );
        m_master_container.addChild( tmp_container );
        m_master_container.width = tblock.naturalWidth;
        m_master_container.height = tblock.naturalHeight;
    }
    
    m_root_node.addChild( m_master_container );
    
    init();
    
//    m_root_node.width = m_master_container.width;
//    m_root_node.height = m_master_container.height;

};