/**
 * InteractiveAdImageGallery.js
 * @author Daniel Cuccia
 */

/**
 * Concrete implementation of IInteractiveAdViewBuilder for an Image Gallery type
 **/
var ImageGalleryAdView = function( widget )
{
    // all hardcode values are found here
    var m_constants =
    {
        placeHolderFormat:      "png",
        galleryImageFormat:     "jpg",
        imageTimeOut:           10000,
        initialVelocity:        0.25,
        accelerationMultiplier: 1.5,
        controlBarColor:        [0/255, 0/255, 0/255, 0.8],
        controlBarHeight:       128,
        controlEdgeBuffer:      215,
        controlHeightBuffer:    4,
        controlTextSize:        24,
        controlFont:            "fonts/sans.ttf",
        galleryIndexY:          16
    };

    this.widget = widget
    var m_imageContainer            = null;         // blank container used for the image gallery
    var m_galleryUrls               = [];           // pre-decide image url's during initialization, and store them here
    var m_currentGalleryIndex       = 0;            // the current image index of the gallery

    var m_disableGallery            = false;        // when things go wrong, this flag is flipped, and the video plays normally with no gallery
    var m_galleryIsOpen             = false;        // flag flipped when the image gallery is opened
    var m_currentSpeed              = 0;            // current speed of the moving gallery imge
    var m_acceleration              = 0;            // per-cycle gallery image acceleration (this is set manually avoiding excess members)

    var ImgGalleryQualities         = {Best: 0, Good: 1, OK: 2};// of the given image qualities, which do we use (index)
    var m_galleryQuality            = ImgGalleryQualities.Best; // the set quality to use for images

    var m_controlBar                = null;         // the container that displays the image gallery controls
    var m_controlBarText            = null;         // the text displaying which image is on screen ( [1/5] )
    var m_placeHolder               = null;         // the placeholder image (the thing that says: "push x for more")
    var m_currentImage              = null;         // the image currently displayed
    var m_scrollingImage            = null;         // the image that is scrolling to be displayed (may be null)
    var m_activityIndicator         = null;         // loading wheel

    var m_isLoadingImage            = false;        // flag to count image load time
    var m_currentTimeOut            = 0;            // current millies count
    var m_lastTime                  = null;         // cause we dont have delta time

    var m_placeHolderIsOnScreen     = false;        // the placeholder image waits until video begins
    var m_placeHolderFinished       = false;        // prevent the placeholder from permanently staying on screen

    var This = this;

    // make sure everything is off the screen and ready for cleaning
    this.clearWidget = function( )
    {
        Logger.log("ImageGalleryAdView::clearWidget()");

        var rootNode = This.widget.getDisplayNode();

        if( null != m_placeHolder )
        {
            if( rootNode.contains( m_placeHolder ) )
                rootNode.removeChild( m_placeHolder );
        }
        m_placeHolder&&m_placeHolder.unload();
        m_placeHolder = null;

        if( null != m_imageContainer )
        {
            if( rootNode.contains( m_imageContainer ) )
                rootNode.removeChild( m_imageContainer );
        }
        m_imageContainer&&m_imageContainer.unload();
        m_imageContainer = null;

        rootNode&&rootNode.unload();

        m_currentImage&&m_currentImage.unload();
        m_currentImage = null;

        m_scrollingImage&&m_scrollingImage.unload();
        m_scrollingImage = null;

        m_controlBar&&m_controlBar.unload();
        m_controlBar = null;

        m_controlBarText = null;
        m_disableGallery = true;

        m_activityIndicator&&m_activityIndicator.clear();
        m_activityIndicator = null;

        UtilLibraryInstance.garbageCollect();
    }

    // called on initial playback of the primary video
    this.onPlaying = function(){
        
    }

    // per-cycle update
    this.update = function( time )
    {
        m_activityIndicator&&m_activityIndicator.update( time );

        // placeholder on screen (waits for video to actually play, and not buffer)
        if ( m_placeHolderIsOnScreen === false && m_placeHolderFinished === false )
        {
            if( VideoManagerInstance.getPlaybackTimePTS() > 0.1 )
            {
                if( m_galleryIsOpen === false )
                {
                    showPlaceHolder();
                    m_placeHolderFinished = true;
                }
            }
        }

        // timeout counter
        if( m_isLoadingImage == true )
        {
            if( m_lastTime != null )
            {
                m_currentTimeOut += (time - m_lastTime) * 1000;
                if( m_currentTimeOut >= m_constants.imageTimeOut )
                {
                    disableGallery("exceeded timeout");
                    m_currentTimeOut = 0;
                }
            }
        }

        m_lastTime = null;
        m_lastTime = time;

        // image animation
        if( m_acceleration != 0 && m_scrollingImage != null )
        {
            m_currentSpeed += m_acceleration;
            m_acceleration *= m_constants.accelerationMultiplier;
            m_scrollingImage.x += m_currentSpeed;

            if( m_currentSpeed < 0 )
            {
                if( m_scrollingImage.x + (m_scrollingImage.width * 0.5) < (1920 * 0.5) )
                {
                    finishScroll();
                }
            }
            else
            {
                if( m_scrollingImage.x + (m_scrollingImage.width * 0.5) > (1920 * 0.5) )
                {
                    finishScroll();
                }
            }
        }

        // analytics
        var duration = This.widget.getConfigurationObject().getAdVideo().getDuration();
        var current = VideoManagerInstance.getPlaybackTimePTS();
        if( current >= duration * 0.25 && This.widget.getAnalytics().fire25Percent.hasFired == false )
            widget.getAnalytics().fire25Percent();
        if( current >= duration * 0.50 && This.widget.getAnalytics().fire50Percent.hasFired == false )
            widget.getAnalytics().fire50Percent();
        if( current >= duration * 0.75 && This.widget.getAnalytics().fire75Percent.hasFired == false )
            widget.getAnalytics().fire75Percent();
        if( current >= duration * 0.99 && This.widget.getAnalytics().fire100Percent.hasFired == false )
        {
            This.widget.getAnalytics().fire100Percent();
            this.clearWidget();
        }
    }


    // when the scrolling image finishes
    function finishScroll()
    {
        m_acceleration = m_currentSpeed = 0;
        m_scrollingImage.x = (1920 * 0.5) - (m_scrollingImage.width * 0.5);

        m_imageContainer.removeChild( m_currentImage );
        m_imageContainer.removeChild( m_scrollingImage );
        m_imageContainer.unload();

        m_currentImage.unload();
        m_currentImage = null;
        m_currentImage = m_scrollingImage;
        m_scrollingImage = null;

        m_imageContainer.addChild( m_currentImage );

        UtilLibraryInstance.garbageCollect();
    }


    // master build-all call
    this.buildView = function( config )
    {
        Logger.log("ImageGalleryAdView::buildView() - building Image Gallery interactive ad visuals");
        buildPlaceHolder( config.getInteractiveAdApps()[0] );
        buildGallery( config.getInteractiveAdApps()[0].getData() );
        buildControlBar();
    }


    // create the placeholder image
    function buildPlaceHolder( config )
    {
        Logger.log("ImageGalleryAdView::buildPlaceHolder() - building Image Gallery placeHolder");
        var lch = config.getCustomLauncher();

        var imgs = [];
        for(var index in lch.getSources())
        {
            imgs.push({
                format: lch.getSources()[index].getFormat(),
                url: lch.getSources()[index].getUrl()
            });
        }

        var url = "";
        for(var idx in imgs)
            if( imgs[idx].format == m_constants.placeHolderFormat )
                url = imgs[idx].url;

        if( url != "" ) engine.loadImage( url, placeHolderLoaded, onPlaceHolderLoadError );
        else Logger.log("ImageGalleryAdView::buildPlaceHolder() - unable to find correct placeholder url")
    }


    // callback when the placeholder has loaded
    function placeHolderLoaded( img )
    {
        Logger.log("ImageGalleryAdView::placeHolderLoaded()");
        var config = This.widget&&This.widget.getConfigurationObject();
        var pos = config.getInteractiveAdApps()[0].getPlaceHolder();
        var placeHolder = config.getInteractiveAdApps()[0].getCustomLauncher();

        img.width = placeHolder.getWidth();
        img.height = placeHolder.getHeight();

        var slate = AssetLoaderInstance.createSlate( img );
        m_placeHolder = slate;

        // Innovid requested scale parameter to be ignored
        //slate.scaleX = pos.getScale();
        //slate.scaleY = pos.getScale();

        slate.x = (pos.getLeft() * 1920) / 100;
        slate.y = (pos.getTop() * 1080) / 100;
    }


    // callback when the placeholder image errors out
    function onPlaceHolderLoadError( msg )
    {
        Logger.log("ImageGalleryAdView::onPlaceHolderLoadError() - " + msg);
        disableGallery("place holder load failure");
    }


    //create the control bar, keep it hidden underneath the screen
    function buildControlBar()
    {
        Logger.log("ImageGalleryAdView::buildControlBar() - building control bar visuals");

        m_controlBar = engine.createContainer();
        m_controlBar.x = 0;
        m_controlBar.y = 1080 - m_constants.controlBarHeight;

        var shader = ShaderCreatorInstance.createSolidColorShader( m_constants.controlBarColor );

        var bkg = engine.createSlate();
        bkg.shader = shader;
        bkg.width = 1920;
        bkg.height = m_constants.controlBarHeight;
        m_controlBar&&m_controlBar.addChild( bkg );

        engine.loadImage( "Artwork/controls/Direct_Pad_RightLeft.png", onControlImageLoad_direction, onControlImageFail );
        engine.loadImage( "Artwork/controls/Circle.png", onControlImageLoad_circle, onControlImageFail );
    }


    // callback when the dpad image loads
    function onControlImageLoad_direction( img )
    {
        var s = AssetLoaderInstance.createSlate( img );
        s.y = m_constants.controlHeightBuffer;
        s.x = m_constants.controlEdgeBuffer;
        m_controlBar&&m_controlBar.addChild( s );

        var txt = engine.createTextBlock( "Navigate",
            { font: m_constants.controlFont, size: m_constants.controlTextSize },
            512 );

        txt.x = m_constants.controlEdgeBuffer + img.width;
        txt.y = img.y + (img.height * 0.25) - m_constants.controlHeightBuffer;

        m_controlBar&&m_controlBar.addChild( txt );
    }


    // callback when the circle button loads
    function onControlImageLoad_circle( img )
    {
        var txt = engine.createTextBlock( "Exit",
            { font: m_constants.controlFont, size: m_constants.controlTextSize },
            512 );

        txt.x = 1920 - m_constants.controlEdgeBuffer - txt.naturalWidth;
        txt.y = (img.height * 0.25) - m_constants.controlHeightBuffer;

        m_controlBar&&m_controlBar.addChild( txt );

        var s = AssetLoaderInstance.createSlate( img );
        s.y = m_constants.controlHeightBuffer;
        s.x = 1920 - m_constants.controlEdgeBuffer - txt.naturalWidth - img.width;
        m_controlBar&&m_controlBar.addChild( s );
    }


    // callback when either controlbar images fail to load
    function onControlImageFail( msg )
    {
        Logger.log("InteractiveAdView::onControlImageFail() - " + msg);
        disableGallery("control bar images load failure");
    }


    // compile the list of gallery url's, stick an empty container for it's future use
    function buildGallery( config )
    {
        Logger.log("ImageGalleryAdView::buildGallery() - building Image Gallery container and data");
        m_imageContainer = engine.createContainer();
        This.widget.getDisplayNode().addChild( m_imageContainer );

        for(var index in config.getItems())
        {
            var image = [];
            for( var srcIndex in config.getItems()[index].getSources() )
            {
                var src = config.getItems()[index].getSources()[srcIndex];

                if( src.getFormat() == m_constants.galleryImageFormat )
                    image.push({
                        width: src.getWidth(),
                        url: src.getUrl(),
                        fit: config.getItems()[index].getAutoFit()
                    });
            }

            image.sort( function(a,b){ return b.width - a.width; } );

            m_galleryUrls.push( {
                url: image[m_galleryQuality] ? image[m_galleryQuality].url : image[0].url,
                fit: image[m_galleryQuality] ? image[m_galleryQuality].fit : image[0].fit
            } );
        }
    }


    // logic when the user goes into the gallery
    this.enterGallery = function()
    {
        This.widget.getAnalytics().fireClick();

        if( true == m_disableGallery ) return;
        if( true == m_galleryIsOpen) return;
        Logger.log("ImageGalleryAdView::enterGallery() - transitioning into interactive ad's image gallery - loading first image");
        m_galleryIsOpen = true;

        This.widget.getVideoReference().pause(true)

        showActivityIndicator();

        This.widget.getAnalytics().fireEngagement();

        engine.loadImage( m_galleryUrls[m_currentGalleryIndex].url, firstImageLoaded, onFirstImageError );
    }


    // callback when the first image has loaded
    function firstImageLoaded( img )
    {
        This.widget.getAnalytics().fireOpenSlate();

        if( true == m_disableGallery ) return;
        Logger.log("ImageGalleryAdView::firstImageLoaded() - first image of the gallery loaded, gallery will now open");

        m_isLoadingImage = false;
        m_currentTimeOut = 0;
        disableActivityIndicator();

        var slate = AssetLoaderInstance.createSlate( img );
        m_currentImage = slate;

        // Innovid requested this value to be ignored
        if( true )//m_galleryUrls[m_currentGalleryIndex].fit == true )
        {
            m_currentImage.width = 1920;
            m_currentImage.height = 1080;
        }
        m_currentImage.y = (1080 * 0.5) - (m_currentImage.height * 0.5);
        m_currentImage.x = (1920 * 0.5) - (m_currentImage.width * 0.5);

        m_imageContainer&&m_imageContainer.addChild( m_currentImage );

        disablePlaceHolder();
        showControls();
        updateText();
    }


    // place holder image has failed to load
    function onFirstImageError( msg )
    {
        Logger.log("ImageGalleryAdView::onFirstImageError() - " + msg);
        disableGallery("first image load failure");
        m_isLoadingImage = false;
        m_currentTimeOut = 0;
    }


    // logic when the user closes the gallery
    this.exitGallery = function()
    {
        This.widget.getAnalytics().fireClick();

        if( true == m_disableGallery ) return;   // gallery is disabled
        if( false == m_galleryIsOpen ) return;   // gallery is already closed
        if( null != m_activityIndicator ) return;// gallery is currently loading
        if( null != m_scrollingImage ) return;   // gallery is scrolling

        Logger.log("ImageGalleryAdView::exitGallery() - exiting image gallery");
        m_galleryIsOpen = false;

        for(var i=0; i < m_imageContainer.numChildren; i++)
            m_imageContainer.removeChildAt(0);

        This.widget.getVideoReference().pause( false );

        m_currentGalleryIndex = 0;

        disableActivityIndicator();
        showPlaceHolder();
        disableControls();
        m_isLoadingImage = false;
        m_currentTimeOut = 0;

        m_currentImage&&m_currentImage.unload();
        m_currentImage = null;

        m_scrollingImage&&m_scrollingImage.unload();
        m_scrollingImage = null;

        This.widget.getAnalytics().fireInUnitClick();
        This.widget.getAnalytics().fireCloseSlate();

        UtilLibraryInstance.garbageCollect();
    }


    // logic when the user scrolls left in the gallery
    this.scrollLeft = function()
    {
        This.widget.getAnalytics().fireClick();

        if( true == m_disableGallery ) return;   // gallery is disabled
        if( false == m_galleryIsOpen ) return;   // gallery already open
        if( null != m_scrollingImage ) return;   // gallery already scrolling
        if( null != m_activityIndicator ) return;// gallery is currently loading
        Logger.log("ImageGalleryAdView::scrollLeft() - loading the next image to the left");

        m_currentGalleryIndex--;
        if( m_currentGalleryIndex < 0 )
            m_currentGalleryIndex = m_galleryUrls.length - 1;

        showActivityIndicator();
        m_isLoadingImage = true;

        engine.loadImage( m_galleryUrls[m_currentGalleryIndex].url, leftImageLoaded, leftImageLoadError );

        This.widget.getAnalytics().fireInUnitClick();
    }


    // callback when the left image has loaded
    function leftImageLoaded( img )
    {
        if( null == m_activityIndicator ) return;   // already loading an image
        if( true == m_disableGallery ) return;      // gallery has been disabled
        Logger.log("ImageGalleryAdView::leftImageLoaded() - image to the left loaded, beginning scroll");

        disableActivityIndicator();
        m_isLoadingImage = false;
        m_currentTimeOut = 0;

        var slate = AssetLoaderInstance.createSlate( img );

        m_scrollingImage = slate;

        // Innovid requested this value to be ignored
        if( true )//m_galleryUrls[m_currentGalleryIndex].fit == true )
        {
            m_scrollingImage.width = 1920;
            m_scrollingImage.height = 1080;
        }

        m_scrollingImage.x = -1920;
        m_scrollingImage.y = (1080 * 0.5) - (m_scrollingImage.height * 0.5);
        m_acceleration = m_constants.initialVelocity;

        m_imageContainer&&m_imageContainer.addChild( m_scrollingImage );

        updateText();
    }


    // when the image to the left fails - quit gallery and play like a normal ad
    function leftImageLoadError( msg )
    {
        Logger.log("ImageGalleryAdView::leftImageLoadError() - " + msg);
        disableGallery("image load failure");
        m_isLoadingImage = false;
        m_currentTimeOut = 0;
    }


    // logic when the user scrolls to the right in the gallery
    this.scrollRight = function()
    {
        This.widget.getAnalytics().fireClick();

        if( true == m_disableGallery ) return;
        if( false == m_galleryIsOpen ) return;
        if( null != m_scrollingImage ) return;
        if( null != m_activityIndicator ) return;
        Logger.log("ImageGalleryAdView::scrollRight() - loading the next image to the right");

        m_currentGalleryIndex++;
        if( m_currentGalleryIndex >= m_galleryUrls.length )
            m_currentGalleryIndex = 0;

        showActivityIndicator();
        m_isLoadingImage = true;

        engine.loadImage( m_galleryUrls[m_currentGalleryIndex].url, rightImageLoaded, rightImageLoadError );

        This.widget.getAnalytics().fireInUnitClick();
    }


    // callback when the right image has loaded
    function rightImageLoaded( img )
    {
        if( null == m_activityIndicator ) return;   // already loading an image
        if( true == m_disableGallery ) return;      // gallery has been disabled
        Logger.log("ImageGalleryAdView::rightImageLoaded() - image to the right loaded, beginning scroll");

        disableActivityIndicator();
        m_isLoadingImage = false;
        m_currentTimeOut = 0;

        var slate = AssetLoaderInstance.createSlate( img );

        m_scrollingImage = slate;

        // Innovid requested this value to be ignored
        if( true )//m_galleryUrls[m_currentGalleryIndex].fit == true )
        {
            m_scrollingImage.width = 1920;
            m_scrollingImage.height = 1080;
        }

        m_scrollingImage.x = 1920;
        m_scrollingImage.y = (1080 * 0.5) - (m_scrollingImage.height * 0.5);
        m_acceleration = -m_constants.initialVelocity;

        m_imageContainer&&m_imageContainer.addChild( m_scrollingImage );

        updateText();
    }


    // when the image to the right fails
    function rightImageLoadError( msg )
    {
        Logger.log("ImageGalleryAdView::rightImageLoadError() - " + msg);
        disableGallery("image load failure");
        m_isLoadingImage = false;
        m_currentTimeOut = 0;
    }


    // update the text showing which slide the user is viewing
    function updateText()
    {
        if( m_controlBarText )
        {
            if( m_controlBar&&m_controlBar.contains( m_controlBarText ) )
                m_controlBar&&m_controlBar.removeChild( m_controlBarText );
            m_controlBarText = null;
        }

        m_controlBarText = engine.createTextBlock(
            (m_currentGalleryIndex + 1) + "/" + (m_galleryUrls.length),
            {font: m_constants.controlFont, alignment: 'center', size: m_constants.controlTextSize},
            512
        );

        m_controlBarText.x = (1920 * 0.5) - (m_controlBarText.naturalWidth * 0.5);
        m_controlBarText.y = m_constants.galleryIndexY;

        m_controlBar&&m_controlBar.addChild( m_controlBarText );

        UtilLibraryInstance.garbageCollect();
    }


    // put the wheel on the screen
    function showActivityIndicator()
    {
        if( m_activityIndicator == null)
        {
            m_activityIndicator = new LoadingWidget();
            var node = m_activityIndicator.getDisplayNode();
            node.x = 1920 * 0.5;
            node.y = 1080 * 0.5;
            This.widget.getDisplayNode().addChild( node );
        }
    }


    // show the control bar
    function showControls()
    {
        if( m_controlBar ) This.widget.getDisplayNode().addChild( m_controlBar );
    }


    // take the control bar off the screen
    function disableControls()
    {
        if( m_controlBar )
            if( This.widget.getDisplayNode().contains( m_controlBar ) )
                This.widget.getDisplayNode().removeChild( m_controlBar );
    }


    // take the wheel off the screen
    function disableActivityIndicator()
    {
        if( m_activityIndicator )
        {
            This.widget.getDisplayNode().removeChild( m_activityIndicator.getDisplayNode() );
            m_activityIndicator.clear();
            m_activityIndicator = null;
        }
    }


    // do not let the user open the gallery - errors occured
    function disableGallery( msg )
    {
        Logger.log("InteractiveAdView::disableGallery() - IMAGE GALLERY WILL NOW BE DISABLED, Reason= " + msg);
        disableActivityIndicator();
        disablePlaceHolder();
        m_placeHolder = null;
        disableControls();
        This.widget.getVideoReference().pause( false );
        for(var i=0; i < m_imageContainer.numChildren; i++)
            m_imageContainer.removeChildAt(0);
        m_disableGallery = true;
        m_isLoadingImage = false;
        UtilLibraryInstance.garbageCollect();
    }


    // put the palceholder on the screen
    function showPlaceHolder()
    {
        if( m_placeHolder )
        {
            var node = This.widget.getDisplayNode();
            if( node )
            {
                if(! node.contains( m_placeHolder ) )
                {
                    node.addChild( m_placeHolder );
                    m_placeHolderIsOnScreen = true;
                }
            }
        }
    }


    // take the placeholder off the screen
    function disablePlaceHolder()
    {
        if( m_placeHolder )
        {
            var node = This.widget.getDisplayNode();
            if( node )
            {
                if( node.contains( m_placeHolder ) )
                    node.removeChild( m_placeHolder );
                m_placeHolderIsOnScreen = false;
            }
        }
    }

}


/**
 * concrete implementation of IInteractiveAdInputHandler for an Image Gallery type
 *      -comments ommited (its all single calls to the respective InteractiveAdView)
 */
var ImageGalleryInputHandler = function( widget )
{
    var m_view = null;

    this.onLeft = function( )
    {
        Logger.log("ImageGalleryInputHandler::onLeft()");
        m_view&&m_view.scrollLeft();
    }

    this.onRight = function( )
    {
        Logger.log("ImageGalleryInputHandler::onRight()");
        m_view&&m_view.scrollRight();
    }

    this.onUp = function( )
    {
        Logger.log("ImageGalleryInputHandler::onUp()");
    }

    this.onDown = function( )
    {
        Logger.log("ImageGalleryInputHandler::onDown()");
    }

    this.onEnter = function( )
    {
        Logger.log("ImageGalleryInputHandler::onEnter()");
        m_view&&m_view.enterGallery();
    }

    this.onBack = function( )
    {
        Logger.log("ImageGalleryInputHandler::onBack()");
        m_view&&m_view.exitGallery();
    }

    this.onStart = function( ){}

    this.setView = function( view ) { m_view = view; }
    this.close = function( ) { m_view = null; }
}