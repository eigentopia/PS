/**
 *  Slide Show 
 */
var SlideShowPromotionalMessageWidget = function( SlideShowItemObj ) {
    
    var m_root_node = engine.createContainer();
    var m_image_container = engine.createContainer();
    var m_slideshow_item_obj = SlideShowItemObj;
    var This = this;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SlideShowPromotionalMessageWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( SlideShowItemObj ){
        initWidget();
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    
    this.notifyJSImageUpdated = function( js_image ){
        addImageToContainer( js_image );
    }
    
    function addImageToContainer( js_image ){
       // if(js_image){
         //  m_image_container.addChild( js_image.getRawImage() );
       // }
    }    
    function loadImage( url ){
        var js_image = ImageManagerInstance.requestImage( url );
        
        if ( js_image.getStatus() == ImageManager.IMAGESTATUS.READY ){
            addImageToContainer( js_image );
        }else if ( js_image.getStatus() == ImageManager.IMAGESTATUS.FAILED ){
            // TODO: Handle image failures
        }else{
            js_image.addImageReadyListener( This );
        }
    }    
    function initWidget(){
        var tblock;
        var tmp_slate = engine.createSlate();
        
        m_root_node.height = 0;
        
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getPROMOTIONALCOLOR( 1 ) );
        tmp_slate.height = 105;
        tmp_slate.width = 1920;
        
        m_root_node.addChild( tmp_slate );

        
        if( m_slideshow_item_obj.getAdditionalInfo() != '' ){
            tblock = engine.createTextBlock( m_slideshow_item_obj.getAdditionalInfo(), FontLibraryInstance.getFont_SLIDESHOWPROMOTIONALMESSAGE(), 1130 );
        }else{
            tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.EMPTY_PROMO_MESSAGE ), FontLibraryInstance.getFont_SLIDESHOWPROMOTIONALMESSAGE(), 1130 );
        }
        m_root_node.height += tblock.naturalHeight;
        m_root_node.addChild( tblock );
        tblock.x = 30;
        tblock.y = 18;
        
        if( m_slideshow_item_obj.getSponsoredByImage_240x100 && m_slideshow_item_obj.getSponsoredByImage_240x100() ){
            m_image_container.x = 1140;
            m_image_container.y = 2;
            // image is at 1180px
            var id = m_slideshow_item_obj.getSlideID();
            var url = 'http://23adc.v.fwmrm.net/ad/g/1?nw=146140&prof=146140:crackle_'+ApplicationController.PLATFORM+'_test&csid=crackle_ps_app_home&pvrn=23412341234;slide=6122;slid=_fw_form_adsponsorlogo6059&ptgt=s&w=120&h=60'
       
            loadImage( url );
            
            tblock = engine.createTextBlock( UtilLibraryInstance.removeNonPrintableCharacters( m_slideshow_item_obj.getSlideDescription() ), FontLibraryInstance.getFont_SLIDESHOWWHYITCRACKLES(), 1060 );
            m_root_node.height += tblock.naturalHeight;
            m_root_node.addChild( tblock );
            tblock.x = 30;
            tblock.y = 54;
            
            m_root_node.addChild( m_image_container );
        }else{
            tblock = engine.createTextBlock( UtilLibraryInstance.removeNonPrintableCharacters( m_slideshow_item_obj.getSlideDescription() ), FontLibraryInstance.getFont_SLIDESHOWWHYITCRACKLES(), 1060 + 268 );
            m_root_node.height += tblock.naturalHeight;
            m_root_node.addChild( tblock );
            tblock.x = 30;
            tblock.y = 54;
            
        }
    }
    
    initWidget();

};