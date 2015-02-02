
var AssetLoader = function(){
    
    var m_required_assets = new Array( );
    var m_asset_load_listeners = new Array( );
    var m_images_loaded = 0;
    var m_images_obj = {};
    var webglDev = (engine.stats.device.platform === 'html')?"file:///C:/Users/davidv/Crackle/Playstation3/":"";
    
    this.requireAsset = function( asset_path ){
        m_required_assets[ m_required_assets.length ] = asset_path;
        //Logger.log("adding asset path: " + asset_path );
    }
    
    this.registerAssetLoadListener = function( AssetLoadListenerObj ){
        m_asset_load_listeners[ m_asset_load_listeners.length ] = AssetLoadListenerObj;
    }
    
    // kick off the loading process
    this.loadAssets = function( ){
        for( var i = 0; i < m_required_assets.length; i++ ){
            var image_path = m_required_assets[ i ];
            Logger.log( image_path );
            engine.loadImage( 
                image_path, 
                function( image ){
                    // notify the image completed method
                    imageCompleted( image );
                }, 
                function( err ){
                    Logger.log( "image load error: " + err );
                }
            );
        }
    }
    
    // image completed, store path => imageobj
    function imageCompleted( image ){
        m_images_loaded++;
        m_images_obj[ image.url ] = image;
        Logger.log("loaded image: " + image.url );
        // if we're done, notify listeners
        if( m_images_loaded == m_required_assets.length ){
            for( var i = 0; i < m_asset_load_listeners.length; i++ ){
                Logger.log("dispatching");
                m_asset_load_listeners[ i ].loadingComplete();
            }
        }
    }
    
    this.getImage = function( image_path ){return m_images_obj[webglDev + image_path];}    
    
    this.checkAssetsReady = function( array_of_asset_paths ){
        for( var i = 0; i < array_of_asset_paths.length; i++ )
            if( m_images_obj[ webglDev + array_of_asset_paths[ i ] ] == undefined ){

                return false;
            }
   
        return true;
    }

    this.createSlate = function( imageObj ){
        var tmp_slate = engine.createSlate();
            tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
            tmp_slate.shader.texture = imageObj.shader.texture;
            tmp_slate.width = imageObj.width;
            tmp_slate.height = imageObj.height;
        return tmp_slate;
    }
    
    
    this.getSlate = function( image_path, alpha ){
        var tmp_image = this.getImage( image_path );
        var tmp_slate = engine.createSlate();
        tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( alpha );
        tmp_slate.shader.texture = tmp_image.shader.texture;
        tmp_slate.width = tmp_image.width;
        tmp_slate.height = tmp_image.height;
        return tmp_slate;
    }
}

// create a "static" instance of the AssetLoader object
var AssetLoaderInstance = new AssetLoader();

AssetLoaderInstance.requireAsset( "Artwork/crackle_loading.png" ); 
AssetLoaderInstance.requireAsset( "Artwork/concrete_bg.png" );

AssetLoaderInstance.requireAsset( "Artwork/error_dialog.png" );
AssetLoaderInstance.requireAsset( "Artwork/rating_star.png" );
AssetLoaderInstance.requireAsset( "Artwork/rating_star_disabled.png" );
AssetLoaderInstance.requireAsset( "Artwork/crackle_logo.png" );
AssetLoaderInstance.requireAsset( "Artwork/loading.png" );
AssetLoaderInstance.requireAsset( "Artwork/bubble_1.png" );
AssetLoaderInstance.requireAsset( "Artwork/bubble_2.png" );
AssetLoaderInstance.requireAsset( "Artwork/bubble_arrow.png" );
AssetLoaderInstance.requireAsset( "Artwork/menu_bg.png" );
AssetLoaderInstance.requireAsset( "Artwork/menu_bg_alpha.png" );

AssetLoaderInstance.requireAsset( "Artwork/promo_background.png" );

AssetLoaderInstance.requireAsset( "Artwork/tooltip_background_column_1.png" );
AssetLoaderInstance.requireAsset( "Artwork/tooltip_background_column_2.png" );
AssetLoaderInstance.requireAsset( "Artwork/tooltip_background_column_3.png" );
AssetLoaderInstance.requireAsset( "Artwork/tooltip_background_column_4.png" );
AssetLoaderInstance.requireAsset( "Artwork/tooltip_background_column_5.png" );

AssetLoaderInstance.requireAsset( "Artwork/prev_arrow_white.png" );
AssetLoaderInstance.requireAsset( "Artwork/prev_arrow_gray.png" );
AssetLoaderInstance.requireAsset( "Artwork/next_arrow_white.png" );
AssetLoaderInstance.requireAsset( "Artwork/next_arrow_gray.png" );


//AssetLoaderInstance.requireAsset( "Artwork/menu_bg2.png" );
AssetLoaderInstance.requireAsset( "Artwork/menu_button_enabled.png" );
AssetLoaderInstance.requireAsset( "Artwork/menu_button_disabled.png" );
AssetLoaderInstance.requireAsset( "Artwork/global_nav_button_orange.png" );
AssetLoaderInstance.requireAsset( "Artwork/global_nav_button_gray.png" );
AssetLoaderInstance.requireAsset( "Artwork/subnav_button_orange.png" );
AssetLoaderInstance.requireAsset( "Artwork/subnav_button_gray.png" );

AssetLoaderInstance.requireAsset( "Artwork/menu_button_home.png" );
AssetLoaderInstance.requireAsset( "Artwork/menu_button_movies.png" );
AssetLoaderInstance.requireAsset( "Artwork/menu_button_shows.png" );
AssetLoaderInstance.requireAsset( "Artwork/menu_button_watchlist.png" );
AssetLoaderInstance.requireAsset( "Artwork/menu_button_my_crackle.png" );

AssetLoaderInstance.requireAsset( "Artwork/innovid_mediaGallery_selector.png" );

AssetLoaderInstance.requireAsset( "Artwork/buttons/button_small_orange.png" );
AssetLoaderInstance.requireAsset( "Artwork/buttons/button_small_gray.png" );
AssetLoaderInstance.requireAsset( "Artwork/buttons/button_small_lightgray.png" );

AssetLoaderInstance.requireAsset( "Artwork/buttons/tab_button_lightgray.png" );
AssetLoaderInstance.requireAsset( "Artwork/buttons/tab_button_gray.png" );
AssetLoaderInstance.requireAsset( "Artwork/buttons/tab_button_orange.png" );
AssetLoaderInstance.requireAsset( "Artwork/buttons/button_large_orange.png" );
AssetLoaderInstance.requireAsset( "Artwork/buttons/button_large_gray.png" );


//AssetLoaderInstance.requireAsset( "Artwork/buttons/focused_watch_now.png" );

AssetLoaderInstance.requireAsset( "Artwork/scrollbar_short.png" );
AssetLoaderInstance.requireAsset( "Artwork/scrollbar_long.png" );
AssetLoaderInstance.requireAsset( "Artwork/scrollbar_indicator_enabled.png" );
AssetLoaderInstance.requireAsset( "Artwork/scrollbar_indicator_disabled.png" );

AssetLoaderInstance.requireAsset( "Artwork/timeline/bar.png" );
AssetLoaderInstance.requireAsset( "Artwork/timeline/filled_bar.png" );
AssetLoaderInstance.requireAsset( "Artwork/timeline/current_time_indicator.png" );
AssetLoaderInstance.requireAsset( "Artwork/timeline/play.png" );
AssetLoaderInstance.requireAsset( "Artwork/timeline/rw.png" );
AssetLoaderInstance.requireAsset( "Artwork/timeline/fw.png" );
AssetLoaderInstance.requireAsset( "Artwork/timeline/adbreak.png" );

AssetLoaderInstance.requireAsset( "Artwork/controls/Circle.png" );
AssetLoaderInstance.requireAsset( "Artwork/controls/Circle_No_Reflection.png" );
AssetLoaderInstance.requireAsset( "Artwork/controls/Cross_No_Reflection.png" );
AssetLoaderInstance.requireAsset( "Artwork/controls/Cross.png" );
AssetLoaderInstance.requireAsset( "Artwork/controls/Triangle_No_Reflection.png" );
AssetLoaderInstance.requireAsset( "Artwork/controls/Triangle.png" );
AssetLoaderInstance.requireAsset( "Artwork/controls/Start.png" );
AssetLoaderInstance.requireAsset( "Artwork/controls/Direct_Pad_RightLeft.png" );
AssetLoaderInstance.requireAsset( "Artwork/controls/Direct_Pad_UpDown_No_Reflection.png" );


AssetLoaderInstance.requireAsset( "Artwork/media_info_bg.png" );

AssetLoaderInstance.requireAsset( "Artwork/subtitle_bg.png" );
AssetLoaderInstance.requireAsset( "Artwork/subtitle_checkmark.png" );
AssetLoaderInstance.requireAsset( "Artwork/subtitle_checkmark_orange.png" );

AssetLoaderInstance.requireAsset( "Artwork/pauseButton.png" )
