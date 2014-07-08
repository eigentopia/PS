/**
 * Subtitle Chooser Row Widget
 */
var SubtitleChooserRowWidget = function( file, width ) {
    var m_root_node                 = engine.createContainer();
    var ccOrMediafile               = file;
    var m_selection_container       = engine.createContainer();
    var m_mark_container            = engine.createContainer();
    var m_checkmark_slate           = AssetLoaderInstance.getSlate( "Artwork/subtitle_checkmark.png", 1 );
    var m_checkmark_orange_slate    = AssetLoaderInstance.getSlate( "Artwork/subtitle_checkmark_orange.png", 1 );
    //var m_is_default                = false;
    //var m_index = index;
    var m_width = width;
    var m_tblock;
    var This = this;
    
    var ASSET_NAMES = {
        ENABLED: "Artwork/global_nav_button_orange.png",
        DISABLED: "Artwork/global_nav_button_gray.png"
    };
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SubtitleChooserRowWidget update() ' + engine_timer );
        
    };
    
    this.setActive = function(){
        while( m_selection_container.numChildren > 0 ) m_selection_container.removeChildAt( 0 );
        this.showMark( SubtitleChooserRowWidget.MARK_TYPES.WHITE );
        m_selection_container.addChild( getContainer( ASSET_NAMES.ENABLED ) );
    }
    this.setDisabled = function(){
        while( m_selection_container.numChildren > 0 ) m_selection_container.removeChildAt( 0 );
        m_selection_container.addChild( getContainer( ASSET_NAMES.DISABLED ) );
        This.hideMark();
    }
    this.enterPressed = function(){
        if(This.isMarked()){
            return false
        }
        else{
            This.showMark( SubtitleChooserRowWidget.MARK_TYPES.ORANGE );
            return true;
        }
    }
    
   this.setDefault = function( value ){
       this.showMark( SubtitleChooserRowWidget.MARK_TYPES.ORANGE );
   }
    this.refreshWidget = function( fileArray, index, width ){
        Logger.log("************** IS THIS REFRESH BEING CALLED? SubtitleChooserRowWidget")
        if( fileArray ){
            file_array  = fileArray;
            m_index = index;
            m_width = width;
            initWidget();
        }
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    
    this.getHeight = function(){
        return AssetLoaderInstance.getImage( ASSET_NAMES.ENABLED ).height;
    }
    this.isMarked = function(){
        return m_mark_container.contains( m_checkmark_orange_slate );
    }
    this.unMark = function(){
        if(m_mark_container.contains( m_checkmark_orange_slate )){
            m_mark_container.removeChild(m_checkmark_orange_slate)
        }
    }
    this.showMark = function( SubtitleChooserRowWidget_MARK_TYPE ){
        if(m_mark_container.contains( m_checkmark_orange_slate ) ) return;
        
        while( m_mark_container.numChildren > 0 ) m_mark_container.removeChildAt( 0 );
        switch( SubtitleChooserRowWidget_MARK_TYPE ){
            case SubtitleChooserRowWidget.MARK_TYPES.ORANGE:
                m_mark_container.addChild( m_checkmark_orange_slate );
                break;
            case SubtitleChooserRowWidget.MARK_TYPES.WHITE:
                //m_mark_container.addChild( m_checkmark_slate );
                break;
        }
    }
    this.hideMark = function(){
        if(m_mark_container.contains(m_checkmark_slate)){
            m_mark_container.removeChild(m_checkmark_slate)
        }
    }
    
    this.getFilePath = function(){
        if( ccOrMediafile && ccOrMediafile.Path ){
            return ccOrMediafile.Path;
        }else{
            return null;
        }
    }
    
    function initWidget(){
        m_root_node.addChild( m_selection_container );

        if(ccOrMediafile.Locale){
            m_tblock = engine.createTextBlock( Dictionary.getSubtitleLocale( ccOrMediafile.Locale ), FontLibraryInstance.getFont_SUBTITLECHOOSER(), 300 );
        }
        else{
            m_tblock = engine.createTextBlock( ccOrMediafile.LocalizedLanguage, FontLibraryInstance.getFont_SUBTITLECHOOSER(), 300 );
        }
        m_tblock.x = 80;
        m_tblock.y = 15;
        m_root_node.addChild( m_tblock );
        
        m_root_node.addChild( m_mark_container );
        m_mark_container.x = 20;
        m_mark_container.y = 24;
        
        This.setDisabled();
    }
    
    function getContainer( asset_name ){
        var slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( asset_name ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        slate.width = m_width;
        slate.height = AssetLoaderInstance.getImage( asset_name ).height;
        slate.x = 10;
        return slate;
    }

    if( ccOrMediafile ){
        initWidget();
    }
};

SubtitleChooserRowWidget.MARK_TYPES = {
    ORANGE: 1,
    WHITE: 2
}