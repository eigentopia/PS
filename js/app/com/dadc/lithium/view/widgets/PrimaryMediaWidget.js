/**
 * this will basically just be a screen bug
 * --------------------------------------------
 * 
 */
var PrimaryMediaWidget = function( interactiveAdConfigObj, mediaGalleryAdViewObj ){
    
    Logger.log("PrimaryMediaWidget - construct");
    
    var PLACEHOLDER_IDENTIFIER = "png";    
    var m_root_node = engine.createContainer();
    
    this.getDisplayNode = function(){
	Logger.log("PrimaryMediaWidget::getDisplayNode()");
        return m_root_node;
    }
    
    this.update = function( engine_timer ){ Logger.log("PrimaryMediaWidget::update()"); }
    this.onUp = function( ) { Logger.log("PrimaryMediaWidget::onUp()"); } 
    this.onDown = function( ) {Logger.log("PrimaryMediaWidget::onDown()");}
    this.onLeft = function( ){Logger.log("PrimaryMediaWidget::onLeft()");}
    this.onRight = function( ){Logger.log("PrimaryMediaWidget::onRight()");}
    this.onEnter = function( ){Logger.log("PrimaryMediaWidget::onEnter()");}
    this.onBack = function( ){Logger.log("PrimaryMediaWidget::onBack()");}
    
    function screenBugError(){
        Logger.log("screenBugLoaded - image was loaded");
        mediaGalleryAdViewObj.notifyLoadStatus( false, "couldn't load the screen bug!" );
    }
    
    function screenBugLoaded( img )
    {
        Logger.log("screenBugLoaded - image was loaded");
//	var config = widget && widget.getConfigurationObject();
	var pos = interactiveAdConfigObj.getInteractiveAdApps()[0].getPlaceHolder();
	var placeHolder = interactiveAdConfigObj.getInteractiveAdApps()[0].getCustomLauncher();

	img.width = placeHolder.getWidth();
	img.height = placeHolder.getHeight();

	var slate = AssetLoaderInstance.createSlate( img );
	m_root_node.addChild( slate );

	slate.x = pos.getLeft();// * 1920) / 100;
	slate.y = pos.getTop();// * 1080) / 100;
        
        mediaGalleryAdViewObj.notifyLoadStatus( true, "screen bug loaded OK" );
    }
    
    function construct(){
	Logger.log("PrimaryMediaWidget.construct()");
	//Logger.logObj( interactiveAdConfigObj );
	var lch = interactiveAdConfigObj.getInteractiveAdApps()[0].getCustomLauncher();

	var imgs = [];
	for(var index in lch.getSources()){
	    imgs.push({
		format: lch.getSources()[index].getFormat(),
		url: lch.getSources()[index].getUrl()
	    });
	}

	var url = "";
	for(var idx in imgs)
	    if( imgs[idx].format == PLACEHOLDER_IDENTIFIER )
		url = imgs[idx].url;

	if( url != "" ){
            Logger.log("screen bug url - " + url );
            engine.loadImage( url, screenBugLoaded, screenBugError );
        }else{
          Logger.log("MediaGalleryAdView.loadPlaceholder() - unable to find correct placeholder url");
          mediaGalleryAdViewObj.notifyLoadStatus( false, "failed to find screen bug image!" );
        }
    }
    
    construct();
    
}