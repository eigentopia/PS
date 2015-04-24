include( "js/app/com/dadc/lithium/util/UtilLibrary.js" );
include( "js/app/com/dadc/lithium/util/StorageManager.js" );
include( "js/app/com/dadc/lithium/config/OmnitureConfig.js" );
include( "js/app/com/dadc/lithium/controller/AssetLoader.js" );
include( "js/app/com/dadc/lithium/config/ModelConfig.js" );
include( "js/app/com/dadc/lithium/util/HTTP.js" );

include( "js/app/com/dadc/lithium/media/ImageManager.js" );
include( "js/app/com/dadc/lithium/media/VideoManager.js" );
include( "js/app/com/dadc/lithium/media/CrackleVideo.js" );

include( "js/app/com/dadc/lithium/config/FreewheelConfig.js" );
include( "js/app/com/dadc/lithium/util/ADForgiveness.js" );
include( "js/app/com/dadc/lithium/util/ADSubtitleForgiveness.js" );
include( "js/app/com/dadc/lithium/util/AnalyticsManager.js" );
include( "js/app/com/dadc/lithium/util/AnimationUtilities.js" );
include( "js/app/com/dadc/lithium/util/Authentication.js" );
include( "js/app/com/dadc/lithium/util/FontLibrary.js" );
include( "js/app/com/dadc/lithium/util/HTMLUtilities.js" );
include( "js/app/com/dadc/lithium/util/PSN.js" );
include( "js/app/com/dadc/lithium/util/RGBLibrary.js" );
include( "js/app/com/dadc/lithium/util/ShaderCreator.js" );
include( "js/app/com/dadc/lithium/util/VideoProgressManager.js" ); // ADD IT AFTER STORAGE MANAGER
include( "js/app/com/dadc/lithium/util/Dictionary.js" ); // ADD IT AFTER STORAGE MANAGER

include( "js/app/com/dadc/lithium/controller/Controller.js" );
include( "js/app/com/dadc/lithium/controller/AboutController.js" );
include( "js/app/com/dadc/lithium/controller/LoginController.js" );
include( "js/app/com/dadc/lithium/controller/HistoryController.js" );
include( "js/app/com/dadc/lithium/controller/DisclaimerController.js" );
include( "js/app/com/dadc/lithium/controller/ErrorController.js" );
include( "js/app/com/dadc/lithium/controller/GeoCountryController.js" );
include( "js/app/com/dadc/lithium/controller/LoadingController.js" );
include( "js/app/com/dadc/lithium/controller/LoadingScreenController.js" );
include( "js/app/com/dadc/lithium/controller/MainMenuController.js" );
include( "js/app/com/dadc/lithium/controller/MediaInfoController.js" );
include( "js/app/com/dadc/lithium/controller/MovieDetailsController.js" );
include( "js/app/com/dadc/lithium/controller/MoviesOrShowsListController.js" );
include( "js/app/com/dadc/lithium/controller/MoviesMenuController.js" );
include( "js/app/com/dadc/lithium/controller/MyCrackleMenuController.js" );
include( "js/app/com/dadc/lithium/controller/PSNSignupController.js" );
include( "js/app/com/dadc/lithium/controller/RecommendedWatchlistController.js" );
include( "js/app/com/dadc/lithium/controller/ShowDetailsController.js" );
include( "js/app/com/dadc/lithium/controller/ShowsMenuController.js" );
include( "js/app/com/dadc/lithium/controller/SlideShowController.js" );
include( "js/app/com/dadc/lithium/controller/VideoController.js" );
include( "js/app/com/dadc/lithium/controller/WatchlistMenuController.js" );
include( "js/app/com/dadc/lithium/controller/MyWatchListController.js" );

include( "js/app/com/dadc/lithium/controller/SubtitleChooserController.js" );


//include( "js/app/com/dadc/lithium/tests/JunkTests.js" );


include( "js/app/com/dadc/lithium/view/widgets/BackgroundWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/LogoWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/NavigationControlWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/TimelineWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/AuthScreen.js" );
//include( "js/app/com/dadc/lithium/view/widgets/HistoryListWidget.js" );
//include( "js/app/com/dadc/lithium/view/widgets/TestFontWidget.js" );
//include( "js/app/com/dadc/lithium/view/widgets/SubtitleWidget.js" );
//include( "js/app/com/dadc/lithium/view/widgets/VideoProgressWidget.js" );
//include( "js/app/com/dadc/lithium/view/widgets/MediaInfoWidget.js" );
//include( "js/app/com/dadc/lithium/view/widgets/ScrollbarWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/TabbedWidget.js" );

include( "js/app/com/dadc/lithium/model/FreeWheel_SmartXML.js" );

include( "js/app/com/dadc/lithium/model/EpisodeMenuItem.js" );
include( "js/app/com/dadc/lithium/model/ChannelFolderList.js" );

include( "js/app/com/dadc/lithium/model/ComScoreModel.js" );
include( "js/app/com/dadc/lithium/model/Conviva.js" );
include( "js/app/thirdparty/ConvivaLivePass_PlayStation_Trilithium_2_84_0_20794.js" );

include( "js/app/com/dadc/lithium/media/InnovidVideo.js" );
include( "js/app/com/dadc/lithium/media/InnovidInternalVideo.js" );
 
include( "js/app/com/dadc/lithium/model/InteractiveAdModel.js" );
include( "js/app/com/dadc/lithium/view/widgets/InteractiveAdWidget.js" );

include("js/app/crackleApi.js")


// THIS CONTROLLER WILL HANDLE THE FLOW OF THE APPLICATION
var ApplicationController = function( screenObj ){

    Logger.log( 'inside appcontroller' );

    VideoManagerInstance = new VideoManager();
    var localStorage = engine.storage.local;
    
    ApplicationController.PLATFORM = localStorage.platform;

    var m_focused_controller        = null;
    var m_present_menu_controllers  = new Array();
    var m_present_controllers       = [];
    var m_menu_container            = engine.createContainer();
    var m_content_container         = engine.createContainer();

    var m_last_psn_check            = undefined;
    var crackleUser = {watchlist:[], email:null, id:null}
    //var m_junk_tests                = null;

    var m_loading_controller;
    var m_error_controller;
    var m_about_controller;
    var m_login_controller;
    var m_history_controller;
    var m_loading_caller_controller = null;
    var m_app_started = false;
    var m_app_ready = false;
    var m_startup_controllers_ready = false;
    var m_last_gc_engine_timer = null;

    var m_main_menu_controller;
    var m_slide_show_controller;
//    var m_movies_list_controller;
    var m_loading_screen_controller = new LoadingScreenController();

    var m_movies_list_controllers = [];
//    var m_recommended_watchlist_controllers = [];
    var m_movies_menu_controller            = null;
    var m_my_crackle_menu_controller        = null;
    var m_shows_menu_controller             = null;
    var m_watchlist_menu_controller         = null;
    var m_movie_details_controller          = null;
    var m_show_details_controller           = null;
    var m_media_info_controller             = null;
    var m_disclaimer_controller             = null;
    var m_video_controller                  = null;
    var m_geo_country_controller            = null;
    var m_recommended_watchlist_controller  = null;
    var m_subtitle_chooser_controller       = null;
    var myWatchlistController               = null;

    var m_pending_focused_controller        = null;
    var m_parent_details_controller         = null;

    var m_psn = new PSN();

    var m_repeat_psn_check_callback         = undefined;

    var m_navigation_control_widget;

    var m_calling_controller                = null;
    var m_controller_before_video_started;

    var m_startup_controllers = [];

    var m_background_widget;
    var m_logo_widget;
//    var m_movie_playback_widget     = new MoviePlaybackWidget( null );
    var m_screenobj_children;

   // var m_startup_events_fired =  false;

    var m_abort_execution = false;

    var m_animation_open_submenu = false;
    var m_animation_open_submenu_last_update_timer = -1;
    var m_animation_open_submenu_direction;
    var m_animation_open_submenu_controller;
    var m_animation_open_time_start;

    var m_animation_close_submenu = false;
    var m_animation_close_submenu_last_update_timer = -1;
    var m_animation_close_submenu_direction;
    var m_animation_close_submenu_controller;
    var m_animation_close_submenu_initial_x;
    var m_animation_close_time_start;

    var ANIMATION_OPEN_SUBMENU_FINAL_RIGHT = 96+80+300;
    var ANIMATION_OPEN_SUBMENU_FINAL_LEFT = 96+55;
    var ANIMATION_OPEN_SUBMENU_DURATION = .4;

    var ANIMATION_CLOSE_SUBMENU_FINAL_RIGHT = 96+80+300;
    var ANIMATION_CLOSE_SUBMENU_FINAL_LEFT = 0;
    var ANIMATION_CLOSE_SUBMENU_DURATION = .2;

    var PSN_CHECK_INTERVALS = 60 * 1;

    var subtitle_widget;
    var m_last_video_pos = 0;
    var m_start_video_pos = 0;

    var This = this;

    // LOADING SCREEN CONTROLLER IS CREATED ON CONSTRUCT
    screenObj.addChild( m_loading_screen_controller.getDisplayNode() ); // ADD TO THE SCREEN IMMEDIATELY, AT WORST IT'LL JUST BE AN EMPTY CONTAINER AT THIS POINT. AND WHEN THE ASSETS BECOME READY, THEY WILL BE ADDED TO THE CONTAINER AND THE SCREEN WILL BE UPDATED AS A RESULT
    m_loading_screen_controller.open();

    engine.onExit = onExit;


//    m_loading_screen_controller.getDisplayNode().x = 1200;
//    m_loading_screen_controller.getDisplayNode().y = 550;
    m_present_controllers.push( m_loading_screen_controller );

    // THIS IS OUR START METHOD
    this.startApp = function(){
        m_app_started = true;

        repeatPSNCheck( function() {
            m_last_psn_check = engine.getTimer();

            // BENHACK: CHICKEN-BEFORE-THE-EGG:
            AssetLoaderInstance.registerAssetLoadListener( This );
            AssetLoaderInstance.loadAssets();

            // BENNOTE: THIS IS FIRED TOO SOON... GEO COUNTRY CONTROLLER IS NOT COMPLETED YET!
//            if( !m_startup_events_fired ){
//                m_startup_events_fired = true;
//                AnalyticsManagerInstance.fireInstallationEvent();
//
//                AssetLoaderInstance.registerAssetLoadListener( This );
//                AssetLoaderInstance.loadAssets();
//            }
        });
    }

//    this.onRequestComplete = function( data, status ){
//        var parser = new XMLParser();
//        var xmlDoc = parser.parseString( data );
//
//        AnalyticsManagerInstance.fireInstallationEvent();
//
//        var parsed_subtitle = TTMLSubtitle.createSubtitles( xmlDoc );
//
//        subtitle_widget.refreshWidget( parsed_subtitle );
//
//        m_start_video_pos = engine.getTimer();
//        m_last_video_pos = engine.getTimer();
//    }

    this.loadingComplete = function( ){
        Logger.log("loading completed");
        var geo_request = new GeoCountryRequest( function( geoCountryObj, status )
        {

            if(geoCountryObj){

                if(FreewheelConfig.getGeoLocation() != MRMLocation.Null)
                    return;
                
                FreewheelConfig.setGeoLocation( MRMLocation.getLocation( geoCountryObj.getCountryCode() ) );

                StorageManagerInstance.set( StorageManager.STORAGE_KEYS.IPADDRESS, geoCountryObj.getIPAddress() );

                m_geo_country_controller = new GeoCountryController( This );
                m_geo_country_controller.prepareToOpen();
                m_present_controllers.push( m_geo_country_controller );

                PlaystationConfig.setConfig(function(thing){console.log(thing)})

                if(localStorage.userEmailAddress && localStorage.userId ){
                    crackleUser.email = localStorage.userEmailAddress
                    crackleUser.id =   localStorage.userId
                    ApplicationController.getUserPauseResumeList(function(success){
                        if (success){
                            progressList = true;
                        }
                    });
                }
                //AnalyticsManagerInstance.firePageViewEvent({cc0:'home', cc1:'home'})
                // No longer needed
                // if( ! m_startup_events_fired ){
                //     m_startup_events_fired = true;
                //     AnalyticsManagerInstance.fireInstallationEvent();
                // }
            }
            else{

               loadingError()
            }

        });
        geo_request.startRequest();
    };
    function loadingError(){
        unsetFocusAllControllers()
        closeAllVisibleControllers();
        var text =""
        switch (engine.stats.locale){
            case 'fr_FR':
                text = "Une erreur réseau s'est produite. Vérifiez votre connexion Internet et réessayez."
                break;
            case 'es_ES':
            case 'es_LA':
                text = 'Se ha producido un error en la red. Por favor verifica tu conexión a internet e intenta nuevamente.'
                break
            case 'pt_BR':
            case 'pt_PT':
                text = 'Ocorreu um erro em a rede. Por favor verifique sua conexão a internet e tente novamente.'
                break;
            default:
                text = 'A network error has occurred. Please check your internet connection and try again.'
                break;
        }

        var container = engine.createContainer();
        var message = engine.createTextBlock(text, {font: "Fonts/arial.ttf", size: 41, color: [1,1,1, 1.0], preserveSpaces: true, alignment: 'center'}, 800)
        var bg = engine.loadImage("Artwork/concrete_bg.png", function(img){
            img.width = 1920;
            img.height = 1080;
            img.x = 0;
            img.y = 0;

            message.y = 1080/2 - 80;
            message.x = 1920/2 - 400

            container.addChild(img)
            container.addChild(message)
            screenObj.addChild(container)

        })
    }
    this.notifyPreparationStatus = function( unique_controller_id, Controller_PREPARATION_STATUS ){
        var controller = getControllerByUniqueID( unique_controller_id );

        if( m_abort_execution ) return;

        Logger.log( '###################################' );
        Logger.log( '##### NOTIFY PREPARATION STATUS ###' );
        Logger.log( '###################################' );
        Logger.log( 'controller id = ' + unique_controller_id );
        Logger.log( 'Controller_PREPARATION_STATUS = ' + Controller_PREPARATION_STATUS );
        if( controller ){
            Logger.log( 'Controller name = ' + controller.getControllerName() );
        }

        if ( controller && controller.hasOwnProperty( 'getControllerName' ) ){
            Logger.log( 'Name = ' + controller.getControllerName() );
        }

        Logger.log( '###################################' );
        Logger.log( '###################################' );
        Logger.log( '###################################' );

        // If we have a loading widget enabled and the controller notifying us
        // is the controller who requested the loading widget, remove the loading
        // widget from the screen
        if ( m_loading_caller_controller && unique_controller_id == m_loading_caller_controller.getUniqueID() && isLoadingScreenVisible() ){
            closeLoadingScreen();
            m_loading_caller_controller = null;
        }

        if ( !m_startup_controllers_ready &&
            m_startup_controllers.indexOf( unique_controller_id ) >= 0 &&
            Controller_PREPARATION_STATUS == Controller.PREPARATION_STATUS.STATUS_READY ){
                var ix = m_startup_controllers.indexOf( unique_controller_id );
                var all_null = true;

                m_startup_controllers[ ix ] = null;

                for ( var i in m_startup_controllers ){
                    if ( m_startup_controllers[ i ] ) all_null = false;
                }

                // Did we finish loading all the controllers?
                if ( all_null ) {
                    Logger.log( 'FINISHED LOADING STARTUP CONTROLLERS' );
                    m_startup_controllers_ready = true;
                    if( screenObj.contains( m_loading_screen_controller.getDisplayNode() ) ){
                        screenObj.removeChild( m_loading_screen_controller.getDisplayNode() );
                    }
                    removeControllerFromPresentControllers( m_loading_screen_controller );
                    m_loading_screen_controller.close();
                    m_loading_screen_controller = null;


                    onAppStartupReady();
                }
            }


        // Open error dialog if an error occurred
        if ( Controller_PREPARATION_STATUS == Controller.PREPARATION_STATUS.STATUS_ERROR ){
            if ( !m_startup_controllers_ready ){
                // Handle cases when app fails ON STARTUP

                m_abort_execution = true;

                openErrorDialog( Dictionary.getText( Dictionary.TEXT.ERROR_OCCURRED ), function(){
//                    This.requestingParentAction(
//                        {action: ApplicationController.OPERATIONS.CLOSE_ERROR_CONTROLLER, calling_controller: controller}
//                    );
                }, true, ErrorWidget.BUTTON_CAPTION.OK );
            } else{
                openErrorDialog( Dictionary.getText( Dictionary.TEXT.ERROR_OCCURRED ), function(){
                    This.requestingParentAction(
                        {action: ApplicationController.OPERATIONS.CLOSE_ERROR_CONTROLLER, calling_controller: controller}
                    );
                }, false, ErrorWidget.BUTTON_CAPTION.CONTINUE );
                if ( controller ){
                    controller.close();
                    removeControllerFromPresentControllers( controller );
                    if( controller.hasOwnProperty( 'getDisplayNode' ) && screenObj.contains( controller.getDisplayNode() ) ){
                        screenObj.removeChild( controller.getDisplayNode() );
                    }else if( controller.hasOwnProperty( 'getDisplayNode' ) && m_content_container && m_content_container.contains( controller.getDisplayNode() ) ){
                        m_content_container.removeChild( controller.getDisplayNode() );
                    }
                    if( controller == m_recommended_watchlist_controller ){
                        m_recommended_watchlist_controller = null;
                    }else{
                        for( var i in m_movies_list_controllers ){
                            if( m_movies_list_controllers[ i ] == controller ){
                                m_movies_list_controllers[ i ] = null;
                                break;
                            }
                        }
                    }

                    if( controller & controller.hasOwnProperty( 'destroy' ) ){
                        controller.destroy();
                    }
                }
            }
        }


        // If we are done with the Geo code request, continue execution of the app
        if ( m_geo_country_controller && unique_controller_id == m_geo_country_controller.getUniqueID() ){
            this.continueExecution();
            removeControllerFromPresentControllers( m_geo_country_controller );
//            m_geo_country_controller = null;
        }


        // HANDLE OPENING CONTROLLERS WHEN WE RECEIVE A SUCCESSFUL PREPARATION STATUS
        if ( m_startup_controllers_ready &&
            Controller_PREPARATION_STATUS == Controller.PREPARATION_STATUS.STATUS_READY ){

            var i;
            var found = false;

            if( !found && m_movie_details_controller && m_movie_details_controller.getUniqueID() == unique_controller_id ){
                m_movie_details_controller.open();
                if( m_pending_focused_controller == m_movie_details_controller ){
                    m_movie_details_controller.setFocus();
                    m_focused_controller = m_movie_details_controller;
                    m_pending_focused_controller = null;
                }
                found = true;
            }
            if( !found && myWatchlistController && myWatchlistController.getUniqueID() == unique_controller_id ){
                myWatchlistController.open();
                if( m_pending_focused_controller == myWatchlistController ){
                    myWatchlistController.setFocus();
                    m_focused_controller = myWatchlistController;
                    m_pending_focused_controller = null;
                    closeLoadingScreen()
                }
                found = true;
            }
            if( !found && m_show_details_controller && m_show_details_controller.getUniqueID() == unique_controller_id ){
                m_show_details_controller.open();
                if( m_pending_focused_controller == m_show_details_controller ){
                    m_show_details_controller.setFocus();
                    m_focused_controller = m_show_details_controller;
                    m_pending_focused_controller = null;
                }
                found = true;
            }
            if( !found && m_slide_show_controller && m_slide_show_controller.getUniqueID() == unique_controller_id ){
                m_slide_show_controller.open();
                if( m_pending_focused_controller == m_slide_show_controller ){
                    m_slide_show_controller.setFocus();
                    m_focused_controller = m_slide_show_controller;
                    m_pending_focused_controller = null;
                }
                found = true;
            }
            if( !found && m_media_info_controller && m_media_info_controller.getUniqueID() == unique_controller_id ){
                m_media_info_controller.open();
                if( m_pending_focused_controller == m_media_info_controller ){
                    m_media_info_controller.setFocus();
                    m_focused_controller = m_media_info_controller;
                    m_pending_focused_controller = null;
                }
                found = true;
            }
            // if( !found && m_history_controller && m_history_controller.getUniqueID() == unique_controller_id ){
            //     m_history_controller.open();
            //     if( m_pending_focused_controller == m_history_controller ){
            //         m_history_controller.setFocus();
            //         m_focused_controller = m_history_controller;
            //         m_pending_focused_controller = null;
            //     }
            //     found = true;
            // }
            if( !found && m_subtitle_chooser_controller && m_subtitle_chooser_controller.getUniqueID() == unique_controller_id ){
                m_subtitle_chooser_controller.open();
                m_subtitle_chooser_controller.getDisplayNode().x = 0//1920 / 2 - ( m_subtitle_chooser_controller.getWidth() / 2 );
                m_subtitle_chooser_controller.getDisplayNode().y = 0//1080 / 2 - ( m_subtitle_chooser_controller.getHeight() / 2 );
                if( m_pending_focused_controller == m_subtitle_chooser_controller ){
                    m_subtitle_chooser_controller.setFocus();
                    m_focused_controller = m_subtitle_chooser_controller;
                    m_pending_focused_controller = null;
                }
            }
            if( !found ){
                for( i in m_movies_list_controllers ){
                    if( m_movies_list_controllers[ i ] && m_movies_list_controllers[ i ].getUniqueID() == unique_controller_id ){
                        m_movies_list_controllers[ i ].open();
                        if( m_pending_focused_controller == m_movies_list_controllers[ i ] ){
                            m_movies_list_controllers[ i ].setFocus();
                            m_focused_controller = m_movies_list_controllers[ i ];
                            m_pending_focused_controller = null;
                        }
                        found = true;
                        break;
                    }
                }
            }
            if( !found && m_recommended_watchlist_controller && m_recommended_watchlist_controller.getUniqueID() == unique_controller_id ){
                m_recommended_watchlist_controller.open();
                if( m_pending_focused_controller == m_recommended_watchlist_controller ){
                    m_recommended_watchlist_controller.setFocus();
                    m_focused_controller = m_recommended_watchlist_controller;
                    m_pending_focused_controller = null;
                }
            }
        }
    };

    this.continueExecution = function(){
        if ( LoggerConfig.CONFIG.UNIT_TESTS ){
            //m_junk_tests =  new JunkTests();
            //Logger.log( 'junktests runtests()' );
            //m_junk_tests.runTests();
        }
        Logger.log("everything is loaded, will create bgcontrol now");

        m_background_widget                 = new BackgroundWidget();
        m_about_controller                  = new AboutController( this );
        m_login_controller                  = new LoginController( this );
        m_history_controller                = new HistoryController( this );
        m_loading_controller                = new LoadingController( this );
        m_main_menu_controller              = new MainMenuController( this );
        m_movies_menu_controller            = new MoviesMenuController( this );
        m_my_crackle_menu_controller        = new MyCrackleMenuController( this );
        myWatchlistController               = new MyWatchlistController( this );
        m_shows_menu_controller             = new ShowsMenuController( this );
        m_watchlist_menu_controller         = new WatchlistMenuController( this );
        m_disclaimer_controller             = new DisclaimerController( this );
        m_video_controller                  = new VideoController( this );
        m_slide_show_controller             = new SlideShowController( this );
//        m_recommended_watchlist_controller  = new RecommendedWatchlistController( this );

        m_logo_widget                       = new LogoWidget();

        m_navigation_control_widget = new NavigationControlWidget(
            [
                {control: NavigationControlWidget.CONTROLS.CIRCLE, caption: Dictionary.getText( Dictionary.TEXT.BACK )}
            ] );

        m_navigation_control_widget.getDisplayNode().x = 54;
        m_navigation_control_widget.getDisplayNode().y = 975;

        // Add main menu controller instance to our array of present menu controllers
        m_present_menu_controllers = [ m_main_menu_controller ];

        m_logo_widget.getDisplayNode().x = 112;
        m_logo_widget.getDisplayNode().y = 51;

        m_startup_controllers.push( m_main_menu_controller.getUniqueID() );
        m_startup_controllers.push( m_movies_menu_controller.getUniqueID() );
        m_startup_controllers.push( m_shows_menu_controller.getUniqueID() );
        m_startup_controllers.push( m_watchlist_menu_controller.getUniqueID() );
        m_startup_controllers.push( m_my_crackle_menu_controller.getUniqueID() );
        m_startup_controllers.push( m_slide_show_controller.getUniqueID() );
//        m_startup_controllers.push( m_disclaimer_controller.getUniqueID() );

        // MENU CONTROLLERS
        m_main_menu_controller.prepareToOpen( );
        m_main_menu_controller.getDisplayNode().x = 96;
        m_main_menu_controller.getDisplayNode().y = 150;
        m_main_menu_controller.setFocus();
        m_main_menu_controller.open();

        m_movies_menu_controller.getDisplayNode().x = 0;
        m_movies_menu_controller.getDisplayNode().y = 0;
        m_movies_menu_controller.prepareToOpen( );

        m_shows_menu_controller.getDisplayNode().x = 0;
        m_shows_menu_controller.getDisplayNode().y = 0;
        m_shows_menu_controller.prepareToOpen( );

        m_watchlist_menu_controller.getDisplayNode().x = 0;
        m_watchlist_menu_controller.getDisplayNode().y = 0;
        m_watchlist_menu_controller.prepareToOpen( );

        m_my_crackle_menu_controller.getDisplayNode().x = 0;
        m_my_crackle_menu_controller.getDisplayNode().y = 0;
        m_my_crackle_menu_controller.prepareToOpen( );

        // CONTENT CONTROLLERS
//        m_movies_list_controller.getDisplayNode().x = 96+374+120;
//        m_movies_list_controller.getDisplayNode().y = 54;

        m_slide_show_controller.getDisplayNode().x = 96+314;
        m_slide_show_controller.getDisplayNode().y = 0;
        m_slide_show_controller.prepareToOpen();

        m_present_controllers.push( m_about_controller );
        m_present_controllers.push( m_login_controller );
        m_present_controllers.push( m_history_controller );
        m_present_controllers.push( m_main_menu_controller );
        m_present_controllers.push( m_movies_menu_controller );
        m_present_controllers.push( m_shows_menu_controller );
        m_present_controllers.push( m_watchlist_menu_controller );
        m_present_controllers.push( m_my_crackle_menu_controller );
//        m_present_controllers.push( m_movies_list_controller );
        m_present_controllers.push( m_video_controller );
//
//        var freeWheelSmartXMLRequest = new FreeWheel_SmartXMLRequest( 2482483, 6444, function( adResponseObj, status ){
//            Logger.log( 'Freewheel response' );
//        } );
//        freeWheelSmartXMLRequest.startRequest();

        // TL 1.3.2 UPDATE
        if( LoggerConfig.CONFIG.PSN_CHECK ){
            m_psn.getNPPlugin().onNpEvent = onChangePSNStatus;
        }


    };

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ApplicationController update() ' + engine_timer );


        // START THE APP IF NOT STARTED ALREADY
        if( m_app_started == false ) this.startApp();

        if( m_last_psn_check !== undefined && m_last_psn_check + PSN_CHECK_INTERVALS < engine.getTimer() ){
            m_last_psn_check = engine.getTimer();
        }

        try{
            // HANDLE KEY INPUTS
            //handleKeyInput();
            handleSubmenuAnimation( engine_timer );

            // UPDATE ONSCREEN CONTROLLERS
            updateOnscreenControllers( engine_timer );
            updateManagers( engine_timer );

        }catch( e ){
            Logger.log( '!!! EXCEPTION ApplicationController update()' );
            Logger.logObj( e );
            unsetFocusAllControllers();
            closeAllVisibleControllers();

            onException();
        }
    };


    /**
     * Child controllers call this method to invoke operations at the Application
     * Controller level
     */
    this.requestingParentAction = function( json_data_args ){
        Logger.log( 'action = ' + json_data_args.action );

        switch( json_data_args.action ) {
            case ApplicationController.OPERATIONS.SELECT_PREVIOUS_MENU:
                unsetFocusAllControllers();
                setFocusPreviousMenuController();
                m_pending_focused_controller = null;
                break;
            case ApplicationController.OPERATIONS.CLOSE_AND_SELECT_PREVIOUS_MENU:
                endOpeningAnimation();

                console.log('CLOSE_AND_SELECT_PREVIOUS_MENU')

                // Enable animation and set animation variables
                m_animation_close_submenu = true;
                m_animation_close_submenu_controller = m_focused_controller;
                m_animation_close_submenu_direction = ApplicationController.ANIMATION_DIRECTION.RIGHT;
                m_animation_close_submenu_initial_x = m_focused_controller.getDisplayNode().x;

                // Remove controller from the list of present menu controllers
                if ( m_focused_controller == m_present_menu_controllers[ m_present_menu_controllers.length - 1 ] ){
                    m_present_menu_controllers.pop();
                }

                unsetFocusAllControllers();

                setFocusPreviousMenuController();
                break;
            case ApplicationController.OPERATIONS.OPEN_SLIDESHOW:
                closeAllVisibleControllers();
                unsetFocusAllControllers();

                openSlideshowController();

//                showNavigation();
                destroyMovieListControllers( null );
                destroyRecommendedWatchlistController( null );
                break;
            case ApplicationController.OPERATIONS.OPEN_FEATURED:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                openMovieListController( json_data_args.category, MoviesOrShowsListController.TYPE.FEATURED, null, null );
                break;
            case ApplicationController.OPERATIONS.OPEN_BROWSEALL:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                openMovieListController( json_data_args.category, MoviesOrShowsListController.TYPE.BROWSEALL, null, null );
                break;
            case ApplicationController.OPERATIONS.OPEN_POPULAR:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                openMovieListController( json_data_args.category, MoviesOrShowsListController.TYPE.POPULAR, null, null );
                break;
            case ApplicationController.OPERATIONS.OPEN_RECENT:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                openMovieListController( json_data_args.category, MoviesOrShowsListController.TYPE.RECENT, null, null );
                break;
            case ApplicationController.OPERATIONS.OPEN_GENRE:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                openMovieListController( json_data_args.category, MoviesOrShowsListController.TYPE.GENRE, json_data_args.genre, null );
                break;
            case ApplicationController.OPERATIONS.OPEN_COLLECTION:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                openCollectionsController( json_data_args.collection_id );
                break;
            case ApplicationController.OPERATIONS.OPEN_ABOUT:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                openAboutController();

                break;
            case ApplicationController.OPERATIONS.OPEN_LOGIN:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                //m_present_menu_controllers.push( m_login_controller );
                openLoginController(json_data_args);
                

                break;
            case ApplicationController.OPERATIONS.OPEN_HISTORY:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
//                showNavigation();
                openHistoryController();

                break;
            case ApplicationController.OPERATIONS.OPEN_MOVIES_MENU:
                unsetFocusAllControllers();
                //destroyMyWatchlistController()
                m_focused_controller = m_movies_menu_controller;
                m_movies_menu_controller.getDisplayNode().x = 0;
//                showNavigation();

                endOpeningAnimation();

                // Enable animation
                m_animation_open_submenu = true;
                m_animation_open_submenu_direction = ApplicationController.ANIMATION_DIRECTION.RIGHT;
                m_animation_open_submenu_controller = m_movies_menu_controller;

                m_movies_menu_controller.open();
                m_movies_menu_controller.setFocus();
                m_present_menu_controllers.push( m_movies_menu_controller );
                break;
            case ApplicationController.OPERATIONS.OPEN_WATCHLIST_MENU:
                unsetFocusAllControllers();
                m_focused_controller = m_watchlist_menu_controller;
                m_watchlist_menu_controller.getDisplayNode().x = 0;
//                showNavigation();

                endOpeningAnimation();

                // Enable animation
                m_animation_open_submenu = true;
                m_animation_open_submenu_direction = ApplicationController.ANIMATION_DIRECTION.RIGHT;
                m_animation_open_submenu_controller = m_watchlist_menu_controller;

                m_watchlist_menu_controller.open();
                m_watchlist_menu_controller.setFocus();
                m_present_menu_controllers.push( m_watchlist_menu_controller );
                break;
            case ApplicationController.OPERATIONS.OPEN_MYCRACKLE_MENU:
                unsetFocusAllControllers();
                m_focused_controller = m_my_crackle_menu_controller;
                m_my_crackle_menu_controller.getDisplayNode().x = 0;
//                showNavigation();

                endOpeningAnimation();

                // Enable animation
                m_animation_open_submenu = true;
                m_animation_open_submenu_direction = ApplicationController.ANIMATION_DIRECTION.RIGHT;
                m_animation_open_submenu_controller = m_my_crackle_menu_controller;

                m_my_crackle_menu_controller.open();
                m_my_crackle_menu_controller.setFocus();
                m_present_menu_controllers.push( m_my_crackle_menu_controller );
                break;
            case ApplicationController.OPERATIONS.OPEN_SHOWS_MENU:
                unsetFocusAllControllers();
                //destroyMyWatchlistController()
                m_focused_controller = m_shows_menu_controller;
                m_shows_menu_controller.getDisplayNode().x = 0;
//                showNavigation();

                endOpeningAnimation();

                // Enable animation
                m_animation_open_submenu = true;
                m_animation_open_submenu_direction = ApplicationController.ANIMATION_DIRECTION.RIGHT;
                m_animation_open_submenu_controller = m_shows_menu_controller;

                m_shows_menu_controller.open();
                m_shows_menu_controller.setFocus();
                m_present_menu_controllers.push( m_shows_menu_controller );
                break;
            case ApplicationController.OPERATIONS.OPEN_MOVIE_DETAILS:
                closeAllVisibleControllers();
                unsetFocusAllControllers();
                m_focused_controller.close();
    //                showNavigation();
                //ConvivaIntegration.cleanUpSession()
                destroyDetailsControllers();
                m_movie_details_controller = new MovieDetailsController( this );
                m_movie_details_controller.getDisplayNode().x = 96+374+52;
                m_movie_details_controller.getDisplayNode().y = 54;

                m_movie_details_controller.setCallingController( json_data_args.calling_controller );

                openLoadingScreen( m_movie_details_controller );

                //if ( json_data_args.channel_id && json_data_args.media_id ){
                m_movie_details_controller.prepareToOpen( json_data_args.channel_id, json_data_args.media_id );
               // }else if ( json_data_args.channel_id ){
                 //   m_movie_details_controller.prepareToOpen( json_data_args.channel_id, json_data_args.channel_id );
                //}

                m_pending_focused_controller = m_movie_details_controller;

                m_content_container.addChild( m_movie_details_controller.getDisplayNode() );
                m_present_controllers.push( m_movie_details_controller );
                
//                m_focused_controller = m_movie_details_controller;

                break;
            case ApplicationController.OPERATIONS.OPEN_SHOW_DETAILS:
                    closeAllVisibleControllers();
                    unsetFocusAllControllers();
                    m_focused_controller.close();
    //                showNavigation();

                    destroyDetailsControllers();

                    m_show_details_controller  = new ShowDetailsController( this );
                    m_show_details_controller.getDisplayNode().x = 96+374+52;
                    m_show_details_controller.getDisplayNode().y = 54;

                    m_show_details_controller.setCallingController( json_data_args.calling_controller );

    //                m_focused_controller = m_show_details_controller;

                    openLoadingScreen( m_show_details_controller );

                    if ( json_data_args.channel_id ){
                        m_show_details_controller.prepareToOpen( json_data_args.channel_id, json_data_args.media_id  );
                    }

                
                    m_pending_focused_controller = m_show_details_controller;
                    m_content_container.addChild( m_show_details_controller.getDisplayNode() );
                    m_present_controllers.push( m_show_details_controller );
            
                break;
            case ApplicationController.OPERATIONS.CLOSE_DETAILS_PAGE:
                closeAllVisibleControllers();
                unsetFocusAllControllers();

                m_pending_focused_controller = null;

                closeLoadingScreen();

                if( m_content_container.contains( json_data_args.calling_controller.getDisplayNode() ) ){
                    m_content_container.removeChild( json_data_args.calling_controller.getDisplayNode() );
                }

                destroyDetailsControllers();

                var details_calling_controller = json_data_args.details_calling_controller;

                Logger.log( 'details_calling_controller.getControllerName() = ' + details_calling_controller.getControllerName() );

                if( details_calling_controller ){
                    if( !m_content_container.contains( details_calling_controller.getDisplayNode() ) ){
                        details_calling_controller.getDisplayNode().controllerName = json_data_args.details_calling_controller.getControllerName();
                        m_content_container.addChild( details_calling_controller.getDisplayNode() );
                    }
                    if(details_calling_controller.getControllerName() == "MyWatchlistController"){
                        details_calling_controller.prepareToOpen();
                    }
                    details_calling_controller.open();
                    details_calling_controller.setFocus();
                    m_focused_controller = details_calling_controller;
                }
                break;

            case ApplicationController.OPERATIONS.OPEN_MEDIA_INFO:
                unsetFocusAllControllers();

                m_calling_controller = json_data_args.calling_controller;

                m_media_info_controller = new MediaInfoController( this );
                screenObj.addChild( m_media_info_controller.getDisplayNode() );
                m_media_info_controller.prepareToOpen( json_data_args.media_id );

                m_pending_focused_controller = m_media_info_controller;

                openLoadingScreen( m_media_info_controller );

                m_present_controllers.push( m_media_info_controller );

//                showNavigation();
//                m_media_info_controller.open();
//                m_media_info_controller.setFocus();
                break;
            case ApplicationController.OPERATIONS.OPEN_SUBTITLE_CHOOSER:
                //console.log("OPEN_SUBTITLE_CHOOSER");
                openSubtitleChooser( json_data_args);


            break;
            case ApplicationController.OPERATIONS.CLOSE_SUBTITLE_CHOOSER:
                screenObj.removeChild( m_subtitle_chooser_controller.getDisplayNode() );
                closeSubtitleChooser();
                m_focused_controller = m_video_controller;
                m_video_controller.setFocus();
                //m_video_controller.refresh(json_data_args.MediaDetailsObj, json_data_args.avFile, json_data_args.ccFile);
                m_video_controller.prepareToOpen(json_data_args.MediaDetailsObj, json_data_args.avFile, json_data_args.ccFile);
                break;
            case ApplicationController.OPERATIONS.CLOSE_MEDIA_INFO:
                m_media_info_controller.close();
                unsetFocusAllControllers();

                if( m_media_info_controller ){
                    if ( screenObj.contains( m_media_info_controller.getDisplayNode() ) ){
                        screenObj.removeChild( m_media_info_controller.getDisplayNode() );
                    }
                    removeControllerFromPresentControllers( m_media_info_controller );
                    m_media_info_controller.destroy();
                    m_media_info_controller = null;
                }

                closeLoadingScreen();

//                showNavigation();

                m_pending_focused_controller = null;

                m_calling_controller.setFocus();
                m_focused_controller = m_calling_controller;

                UtilLibraryInstance.garbageCollect();
                break;
            case ApplicationController.OPERATIONS.OPEN_LOADING_SCREEN:
                Logger.log( 'open load screen' );
                openLoadingScreen( json_data_args.calling_controller );
                break;

            case ApplicationController.OPERATIONS.START_VIDEO_PLAYBACK:
                Logger.log( 'ApplicationController.OPERATIONS.START_VIDEO_PLAYBACK' );

                closeAllVisibleControllers();
                unsetFocusAllControllers();
                hideNavigation();

                //closeSubtitleChooser();
                m_psn.setNpListener( function(){} );

                
                repeatPSNCheck( function(){
                    m_controller_before_video_started = m_focused_controller;
                    var videoContextList = []
                    //Keep the context if coming from a list so we can next video
                    if(m_controller_before_video_started.getControllerName() =='RecommendedWatchlistController' ||
                        m_controller_before_video_started.getControllerName() == "ShowDetailsController"||
                        m_controller_before_video_started.getCallingController().getControllerName() == "MyWatchlistController"){
                        //Because the data model in these objects arew just slightly different
                        if(m_controller_before_video_started.getCallingController && m_controller_before_video_started.getCallingController().getControllerName() == "MyWatchlistController"){
                            videoContextList= m_controller_before_video_started.getCallingController().getItemList().m_data
                        }else{
                            // Folderlist> playlist> medialist
                            videoContextList = m_controller_before_video_started.getItemList();
                        }
                        //Add it to the object we are passing videoController
                        json_data_args.MediaDetailsObj.videoContextList = videoContextList

                                            // Wey: This fixes timeline bug where pending focused controller
                        // would still be set causing abnormal behaviors
                        m_pending_focused_controller = null;

                        m_focused_controller = m_video_controller;
                        m_video_controller.setFocus();

                        // NOTE: CALLING OPEN BEFORE PREPARE. WHY? FOR THE DISPLAY NODE? SHOULDN'T BE NEEDED THEORETICALLY
                        m_video_controller.open();
                        screenObj.addChild( m_video_controller.getDisplayNode() );

                        // NOTE: CALLING PREPARE AFTER OPEN, WHY?
                        m_video_controller.prepareToOpen( json_data_args.MediaDetailsObj, null, null);


                    }
                    else{ //get featured of MediaDetailsObj type
                        var request = new FeaturedRequest( FeaturedRequest.CATEGORY.MOVIES, 
                                                        FeaturedRequest.FILTER_TYPE.ALL, 
                                                        StorageManagerInstance.get( 'geocode' ), 
                                                        10, 
                                                        function( FeaturedObj, status ){

                            if ( status != 200 ){
                                //something broke- just play the movie

                            }
                            else{
                                //SAMPLE URL
                                //http://api.crackle.com/Service.svc/featured/movies/all/us/30?format=json
                                    var boo = FeaturedObj;

                                         // Folderlist> playlist> medialist
                                    videoContextList = FeaturedObj.m_data.Items
                                    videoContextList.splice(0,0,json_data_args.MediaDetailsObj)
                                    //Add it to the object we are passing videoController
                                    json_data_args.MediaDetailsObj.videoContextList = videoContextList

                            }
                            // Wey: This fixes timeline bug where pending focused controller
                            // would still be set causing abnormal behaviors
                            m_pending_focused_controller = null;

                            m_focused_controller = m_video_controller;
                            m_video_controller.setFocus();

                            // NOTE: CALLING OPEN BEFORE PREPARE. WHY? FOR THE DISPLAY NODE? SHOULDN'T BE NEEDED THEORETICALLY
                            m_video_controller.open();
                            screenObj.addChild( m_video_controller.getDisplayNode() );

                            // NOTE: CALLING PREPARE AFTER OPEN, WHY?
                            m_video_controller.prepareToOpen( json_data_args.MediaDetailsObj, null, null);
                        })
                        
                        request.startRequest();
                    }
                })

                break;
            case ApplicationController.OPERATIONS.VIDEO_PLAYBACK_STOPPED:
            //console.log("****STOPPPPINGINGNGINGINGNG")
                closeAllVisibleControllers();
                unsetFocusAllControllers();
                //ConvivaIntegration.cleanUpSession();
//                showNavigation();

                m_video_controller.unsetFocus();
                m_video_controller.close();

                if( screenObj.contains( m_video_controller.getDisplayNode() ) ){
                    screenObj.removeChild( m_video_controller.getDisplayNode() ) ;
                }

                m_psn.setNpListener( function(){} );

                
                repeatPSNCheck( function(){
                    Logger.log( 'after video playback stopped psn check' );
                    m_psn.setNpListener( onChangePSNStatus );

                    m_controller_before_video_started.setFocus();
                    m_controller_before_video_started.open();

                    if( !m_content_container.contains( m_controller_before_video_started.getDisplayNode() ) ){
                        m_content_container.addChild( m_controller_before_video_started.getDisplayNode() );
                    }

                    m_focused_controller = m_controller_before_video_started;
                });

                break;
            case ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR:
                Logger.log( 'ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR' );
                closeAllVisibleControllers();
                unsetFocusAllControllers();

                //ConvivaIntegration.cleanUpSession();
//                showNavigation();

                try{
                    if( m_video_controller ){
                        m_video_controller.unsetFocus();
                        m_video_controller.close();
                        if( screenObj.contains( m_video_controller.getDisplayNode() ) ){
                            screenObj.removeChild( m_video_controller.getDisplayNode() );
                        }
                    }
                }catch( e ){
                    Logger.log("catch in ApplicationController: VIDEO_PLAYBACK_ERROR");
                }finally{

                    removeControllerFromPresentControllers( m_video_controller );
                    m_video_controller = new VideoController( this );
                    m_present_controllers.push( m_video_controller );
                }

                openErrorDialog( Dictionary.getText( Dictionary.TEXT.ERROR_OCCURRED ), function(){
                    if( m_error_controller ){
                        m_error_controller.close();
                        if( screenObj.contains( m_error_controller.getDisplayNode() ) ){
                            screenObj.removeChild( m_error_controller.getDisplayNode() );
                        }
                        unsetFocusAllControllers();
                    }

                    m_psn.setNpListener( function(){} );

                    repeatPSNCheck( function(){
                        Logger.log( 'after video playback stopped psn check' );
                        m_psn.setNpListener( onChangePSNStatus );

                        var previous_menu_controller = m_present_menu_controllers[ m_present_menu_controllers.length - 1 ];

    //                    This.requestingParentAction(
    //                        {action: ApplicationController.OPERATIONS.CLOSE_ERROR_CONTROLLER, calling_controller: m_error_controller}
    //                    );
                        try{
                            if( m_controller_before_video_started ){
                                m_controller_before_video_started.setFocus();
                                m_controller_before_video_started.open();
                                m_focused_controller = m_controller_before_video_started;
                                previous_menu_controller.unsetFocus();
                                if( !m_content_container.contains( m_controller_before_video_started.getDisplayNode() ) ){
                                    m_content_container.addChild( m_controller_before_video_started.getDisplayNode() )
                                }
                            }else{
                                setFocusPreviousMenuController();
                            }
                        }catch( e ){
                            Logger.log( '!!! EXCEPTION VIDEO_PLAYBACK_ERROR AppController !!!' );
                            Logger.logObj( e );
                            while( m_content_container.numChildren > 0 ){
                                m_content_container.removeChildAt( 0 );
                            }
                            onException();
                        }
                    });

                }, false, ErrorWidget.BUTTON_CAPTION.CONTINUE );
                break;
            case ApplicationController.OPERATIONS.CLOSE_ERROR_CONTROLLER:
                Logger.log( 'CLOSE ERROR CONTROLLER' );
                if( m_error_controller ){
                    m_error_controller.close();
                    if( screenObj.contains( m_error_controller.getDisplayNode() ) ){
                        screenObj.removeChild( m_error_controller.getDisplayNode() );
                    }

                    // Remove Video Controller if on screen
                    if( m_video_controller && screenObj.contains( m_video_controller.getDisplayNode() ) ){
                        try{
                            screenObj.removeChild( m_video_controller.getDisplayNode() );
                            m_video_controller.stop();
                            m_video_controller.close();
                            //ConvivaIntegration.cleanUpSession();
                        }catch( e ){
                            Logger.log( '!!! EXCEPTION CLOSE_ERROR_CONTROLLER' );
                            Logger.logObj( e );
                        }
                    }
                    unsetFocusAllControllers();
                    setFocusPreviousMenuController();
                }
                break;

            case ApplicationController.OPERATIONS.CLOSE_DISCLAIMER:
                unsetFocusAllControllers();

                onDisclaimerClosed();

                break;
            case ApplicationController.OPERATIONS.SHOW_NAVIGATION:
//                showNavigation();
                break;
            case ApplicationController.OPERATIONS.HIDE_NAVIGATION:
                hideNavigation();
                break;
            case ApplicationController.OPERATIONS.INVALID_REGION:
                Logger.log( 'INVALID REGION' );
                m_loading_screen_controller.closeLoadingWidget();
                openInvalidRegionError();
                break;
            case ApplicationController.OPERATIONS.LOGIN_ERROR:
                Logger.log( 'ApplicationController.OPERATIONS.LOGIN_ERROR' );
                openLoginError(json_data_args);
                break;
            case ApplicationController.OPERATIONS.OPEN_MY_WATCHLIST:
                closeAllVisibleControllers();
                unsetFocusAllControllers();

                removeControllerFromPresentControllers(myWatchlistController)
                Logger.log( 'ApplicationController.OPEN_MY_WATCHLIST' );
                CrackleApi.User.watchlist(crackleUser, function(data, status){
                    openMyWatchlistController(json_data_args);
                })
                break
            case ApplicationController.OPERATIONS.OPEN_PREVIOUS_CONTROLLER:
                Logger.log( 'ApplicationController.OPEN_PREVIOUS_CONTROLLERT' );
                openPreviousController(json_data_args);
                break

        }
    }
    var currentVideoSeekTime = 0;
    function openSubtitleChooser( json ){
        m_subtitle_chooser_controller = new SubtitleChooserController( This );
        screenObj.addChild( m_subtitle_chooser_controller.getDisplayNode() );
        m_present_controllers.push( m_subtitle_chooser_controller );

        m_pending_focused_controller = m_subtitle_chooser_controller;

        m_subtitle_chooser_controller.prepareToOpen( json.MediaDetailsObj, json.currentAV, json.currentCC );
    }
    function closeSubtitleChooser(){

        m_subtitle_chooser_controller.close();
        if( m_subtitle_chooser_controller.getDisplayNode() && m_content_container.contains( m_subtitle_chooser_controller.getDisplayNode() ) )
            m_content_container.removeChild( m_subtitle_chooser_controller.getDisplayNode() );
        m_subtitle_chooser_controller.destroy();
        removeControllerFromPresentControllers( m_subtitle_chooser_controller );
    }
    function openInvalidRegionError(){
        openErrorDialog( 'This content is not available from your current region.', function(){
            openInvalidRegionError();
        }, true, ErrorWidget.BUTTON_CAPTION.OK );

    }
    function openLoginError(data){
        openErrorDialog( data.message, function(){
                        m_error_controller.close();
                        setFocusPreviousMenuController();

                    }, 
                    true, 
                    ErrorWidget.BUTTON_CAPTION.OK
                );
                
    }
    function showNavigation(){
        if( m_navigation_control_widget && !screenObj.contains( m_navigation_control_widget.getDisplayNode() ) ){
            screenObj.addChild( m_navigation_control_widget.getDisplayNode() );
        }else if( m_navigation_control_widget && screenObj.getChildIndex( m_navigation_control_widget.getDisplayNode() ) <  screenObj.numChildren - 1 ){
            screenObj.removeChild( m_navigation_control_widget.getDisplayNode() );
            screenObj.addChild( m_navigation_control_widget.getDisplayNode() );
        }

    }
    function hideNavigation(){
        if( m_navigation_control_widget && screenObj.contains( m_navigation_control_widget.getDisplayNode() ) ){
            screenObj.removeChild( m_navigation_control_widget.getDisplayNode() );
        }
    }

    function openLoadingScreen( calling_controller ){
        m_loading_caller_controller = calling_controller;
        if( !screenObj.contains( m_loading_controller.getDisplayNode() ) ){
            screenObj.addChild( m_loading_controller.getDisplayNode() );
            m_loading_controller.getDisplayNode().x = 1200;
            m_loading_controller.getDisplayNode().y = 550;
            m_loading_controller.prepareToOpen();
            m_loading_controller.open();
            m_present_controllers.push( m_loading_controller );
            closeLoadingScreen();
        }
    }
    function isLoadingScreenVisible(){
        if( m_loading_controller && screenObj.contains( m_loading_controller.getDisplayNode() ) ){
            return true;
        }else{
            return false;
        }
    }
    function closeLoadingScreen(){
        Logger.log( 'close load screen' );

        if( m_loading_controller ){
            m_loading_controller.close();

            if( screenObj.contains( m_loading_controller.getDisplayNode() ) )
                screenObj.removeChild( m_loading_controller.getDisplayNode() );
            removeControllerFromPresentControllers( m_loading_controller );
        }
    }

    function destroyDetailsControllers(){
        if( m_movie_details_controller ){
            if( m_content_container.contains( m_movie_details_controller.getDisplayNode() ) ){
                m_content_container.removeChild( m_movie_details_controller.getDisplayNode() );
            }
            removeControllerFromPresentControllers( m_movie_details_controller );
            m_movie_details_controller.setCallingController( null );
            m_movie_details_controller.close();
            m_movie_details_controller.destroy();
            m_movie_details_controller = null;
        }
        if( m_show_details_controller ){
            if( m_content_container.contains( m_show_details_controller.getDisplayNode() ) ){
                m_content_container.removeChild( m_show_details_controller.getDisplayNode() );
            }
            removeControllerFromPresentControllers( m_show_details_controller );
            m_show_details_controller.setCallingController( null );
            m_show_details_controller.close();
            m_show_details_controller.destroy();
            m_show_details_controller = null;
        }
        UtilLibraryInstance.garbageCollect();
    }
    function destroyMovieListControllers ( exclude_controller ){
        for( var i in m_movies_list_controllers ){
            if( m_movies_list_controllers[ i ] && m_movies_list_controllers[ i ] != exclude_controller ){
                removeControllerFromPresentControllers( m_movies_list_controllers[ i ] );
                if( m_content_container.contains( m_movies_list_controllers[ i ].getDisplayNode() ) ){
                    m_content_container.removeChild( m_movies_list_controllers[ i ].getDisplayNode() );
                }
                if( m_movie_details_controller ) m_movie_details_controller.setCallingController( null );
                if( m_show_details_controller ) m_show_details_controller.setCallingController( null );
                m_movies_list_controllers[ i ].destroy();
                m_movies_list_controllers[ i ] = null;
                Logger.log("set to null");
            }
        }

        UtilLibraryInstance.garbageCollect();
    }
    function destroyRecommendedWatchlistController(){
        if( m_recommended_watchlist_controller ){
            if( m_content_container.contains( m_recommended_watchlist_controller.getDisplayNode() ) ){
                m_content_container.removeChild( m_recommended_watchlist_controller.getDisplayNode() );
            }
            removeControllerFromPresentControllers( m_recommended_watchlist_controller );
            m_recommended_watchlist_controller.destroy();
            m_recommended_watchlist_controller = null;
            UtilLibraryInstance.garbageCollect();
        }
    }
    // function destroyHistoryController(){
    //     if( m_history_controller ){
    //         if( m_content_container.contains( m_history_controller.getDisplayNode() ) ){
    //             m_content_container.removeChild( m_history_controller.getDisplayNode() );
    //         }
    //         removeControllerFromPresentControllers( m_history_controller );
    //         m_history_controller.destroy();
    //         m_history_controller = null;
    //         UtilLibraryInstance.garbageCollect();
    //     }
    // }
    function destroyMyWatchlistController(){
        if( myWatchlistController ){
            if( m_content_container.contains( myWatchlistController.getDisplayNode() ) ){
                m_content_container.removeChild( myWatchlistController.getDisplayNode() );
            }
            removeControllerFromPresentControllers( myWatchlistController );
            myWatchlistController.destroy();
            myWatchlistController = null;
            UtilLibraryInstance.garbageCollect();
        }
    }
    function destroyLoginController(){
        if( m_login_controller ){
            if( m_content_container.contains( m_login_controller.getDisplayNode() ) ){
                m_content_container.removeChild( m_login_controller.getDisplayNode() );
            }

            removeControllerFromPresentControllers( m_login_controller );
            m_login_controller.close()
            m_login_controller.destroy();
            m_login_controller = null;
            UtilLibraryInstance.garbageCollect();
        }
    }
    function destroySlideShowController(){
        if( m_slide_show_controller ){
            if( m_content_container.contains( m_slide_show_controller.getDisplayNode() ) ){
                m_content_container.removeChild( m_slide_show_controller.getDisplayNode() )
            }

            removeControllerFromPresentControllers( m_slide_show_controller );
            m_slide_show_controller = null;
            UtilLibraryInstance.garbageCollect();
        }
    }
    function onException(){
        Logger.log( 'onException' );
        if( m_video_controller ){
            m_video_controller.close();
            if( screenObj.contains( m_video_controller.getDisplayNode() ) ){
                screenObj.removeChild( m_video_controller.getDisplayNode() );
            }

            removeControllerFromPresentControllers( m_video_controller );
        }

        m_video_controller = new VideoController( This );

        m_present_controllers.push( m_video_controller );

        for( var i = 1; i < m_present_menu_controllers.length - 1; i++ ){
            if( m_menu_container.contains( m_present_menu_controllers[ i ].getDisplayNode() ) ){
                m_menu_container.removeChild( m_present_menu_controllers[ i ].getDisplayNode() );
                m_present_menu_controllers[ i ].close();
            }
        }

        // TL 1.3.2 UPDATE
        if( LoggerConfig.CONFIG.PSN_CHECK ){
            m_psn.getNPPlugin().onNpEvent = onChangePSNStatus;
        }
//        if( LoggerConfig.CONFIG.PSN_CHECK ){
//            engine.np.onNpEvent = onChangePSNStatus;
//        }

        openSlideshowController();
    }
    function onDisclaimerClosed(){
        if( m_geo_country_controller.isInvalidRegion() ){
            m_disclaimer_controller.close();
            openErrorDialog( Dictionary.getText( Dictionary.TEXT.INVALID_REGION ), function(){
                m_disclaimer_controller.open();
                m_error_controller.close();
                m_focused_controller = m_disclaimer_controller;
            }, true, ErrorWidget.BUTTON_CAPTION.CONTINUE );
        }else{
            m_disclaimer_controller.close();


            if( screenObj.contains( m_disclaimer_controller.getDisplayNode() ) )
                screenObj.removeChild( m_disclaimer_controller.getDisplayNode() );

            m_disclaimer_controller = null;

            AnalyticsManagerInstance.fireHomePageViewEvent();
            AnalyticsManagerInstance.firePageViewEvent( AnalyticsManager.PAGENAME.HOME );

            screenObj.addChild( m_background_widget.getDisplayNode() );
            screenObj.addChild( m_content_container );
            screenObj.addChild( m_menu_container );
            screenObj.addChild( m_logo_widget.getDisplayNode() );

            var usrid = localStorage.userId
            var deviceAuth = localStorage.deviceAuth            
                //if(deviceAuth == "" || deviceAuth == undefined){ 
            
            CrackleApi.User.sso(function(data){
                if(data && (data.ActivationCode !=null || data.ActivationCode !=undefined)){
                    ApplicationController.setUserInfo(null)
                    if(PlaystationConfig.forcedRegistration == true){
                        openAuthorization()
                    }
                    else{
                        m_focused_controller = m_main_menu_controller;
                        m_main_menu_controller.setFocus();
                    }
                    
                }
                else if (data && data.CrackleUserName){
                    //if(localStorage.age && localStorage.age !== ''){
                      //  ApplicationController.setCrackleUser(localStorage)
                       // m_focused_controller = m_main_menu_controller;
                       // m_main_menu_controller.setFocus();
                   // }
                   // else{
                        CrackleApi.User.moreUserInfo(data, function(fullUserData){
                            ApplicationController.setUserInfo(fullUserData)
                            StorageManagerInstance.set('deviceAuth', 'true')
                            m_focused_controller = m_main_menu_controller;
                            m_main_menu_controller.setFocus();
                        })
                  //  }
                }
                else{
                    m_focused_controller = m_main_menu_controller;
                    m_main_menu_controller.setFocus();
                }

            })
        }
    }

    function openAuthorization(){
        AuthScreen.startAuth(authComplete)
        screenObj.addChild( AuthScreen.rootNode, 0 );
    }


    function authComplete(status, data){

        if(status == true && data.CrackleUserId){
            StorageManagerInstance.set('deviceAuth', 'true')
            ApplicationController.setUserInfo(data, function(sucessGettingWatchlist){


                AnalyticsManagerInstance.loginEvent(  );
                //remove child auth
                screenObj.removeChild( AuthScreen.rootNode );
                m_focused_controller = m_main_menu_controller;
                m_main_menu_controller.setFocus();
            });
        }
        else{
            m_focused_controller = m_main_menu_controller;
            m_main_menu_controller.setFocus();
            openErrorDialog(Dictionary.getText( Dictionary.TEXT.ERROR_OCCURRED ), function(){}, true,  ErrorWidget.BUTTON_CAPTION.OK)
        }

    }


    function onAppStartupReady(){
        Logger.log( 'onAppStartupReady' );

        m_slide_show_controller.open();
        // set the slideshow controller as the focused controller
        m_focused_controller = m_slide_show_controller;

        m_menu_container.addChild( m_main_menu_controller.getDisplayNode() );
        m_menu_container.addChild( m_shows_menu_controller.getDisplayNode() );
        m_menu_container.addChild( m_watchlist_menu_controller.getDisplayNode() );
        m_menu_container.addChild( m_movies_menu_controller.getDisplayNode() );

        m_content_container.addChild( m_slide_show_controller.getDisplayNode() );

        BubbleWidgetInstance = new BubbleWidget( null );


        if ( LoggerConfig.CONFIG.PLAY_VIDEOS ){
            screenObj.addChild( VideoManagerInstance.getDisplayNode() );

        }

        m_disclaimer_controller.prepareToOpen();
        m_disclaimer_controller.open();
        screenObj.addChild( m_disclaimer_controller.getDisplayNode(), 0 );
        m_focused_controller = m_disclaimer_controller;

        m_app_ready = true;
    }

    function getControllerByUniqueID( unique_id ){
        for ( var i in m_present_controllers ){
            if( m_present_controllers[ i ].hasOwnProperty( 'getUniqueID' ) && m_present_controllers[ i ].getUniqueID() == unique_id ){
                return m_present_controllers[ i ];
            }
        }

        return null;
    }

    function openErrorDialog( message, callback_func, center_on_screen, ErrorWidget_BUTTON_CAPTION ){
        if( m_loading_screen_controller&&screenObj.contains( m_loading_screen_controller.getDisplayNode() ) ){
                        screenObj.removeChild( m_loading_screen_controller.getDisplayNode() );
                    }
        if( !m_error_controller ){
            m_error_controller = new ErrorController( this );
            m_present_controllers.push( m_error_controller );
        }


        if( center_on_screen ){
            m_error_controller.getDisplayNode().x = 400;
            m_error_controller.getDisplayNode().y = 400;
        }else{
            m_error_controller.getDisplayNode().x = 600;
            m_error_controller.getDisplayNode().y = 400;
        }

        if ( !screenObj.contains( m_error_controller.getDisplayNode() ) ){
            screenObj.addChild( m_error_controller.getDisplayNode() );
        }

        m_pending_focused_controller = null;

        m_error_controller.prepareToOpen( message, callback_func, ErrorWidget_BUTTON_CAPTION );
        m_error_controller.open();

        m_focused_controller = m_error_controller;
    }

    function unsetFocusAllControllers(){
        for ( var i in m_present_controllers ){
            if( m_present_controllers[ i ] && m_present_controllers[ i ].hasOwnProperty( 'unsetFocus' ) ){
                m_present_controllers[ i ].unsetFocus();
            }
        }
    }
    function removeControllerFromPresentControllers( controller ){
        var tmp_controllers = [];

        for ( var i in m_present_controllers ){
            if( m_present_controllers[ i ] != controller ){
                tmp_controllers.push( m_present_controllers[ i ] );
            }
        }
        m_present_controllers = tmp_controllers;

        return m_present_controllers;
    }

    function openSlideshowController(){
        destroyLoginController();
        
        if( !m_slide_show_controller ){
            Logger.warn("openSlideshowController Does this get called?")
            m_slide_show_controller = new SlideShowController( This );
            m_slide_show_controller.getDisplayNode().x = 96+314;
            m_slide_show_controller.getDisplayNode().y = 0;
            m_slide_show_controller.prepareToOpen();
            m_present_controllers.push( m_slide_show_controller );
            m_pending_focused_controller = m_slide_show_controller;
            openLoadingScreen( m_slide_show_controller );

        }else{
            if( InputManager.getLastPressedKey() == engine.keymap.controllerPS3.CROSS ||
                InputManager.getLastPressedKey() == "ENTER" ||
                m_content_container.contains( m_slide_show_controller.getDisplayNode() ) ){

                destroyDetailsControllers();


                m_slide_show_controller.open();
                m_pending_focused_controller = null;
            
                m_focused_controller = m_slide_show_controller;
                m_slide_show_controller.setFocus();
                
            }
        }

        if( !m_content_container.contains( m_slide_show_controller.getDisplayNode() ) ){
            m_content_container.addChild( m_slide_show_controller.getDisplayNode() );
        }

    }

    /**
     * Prepare to open a movie list controller or open it if we already have
     * prepared it before.
     */
    function openMovieListController( category, filter, genre, collection_id, enter_pressed ){
        var array_key = category + filter + genre + collection_id;
        var found_controller = null;
        destroyRecommendedWatchlistController();
        destroySlideShowController();
        destroyMyWatchlistController()
        destroyLoginController();

        for( var i in m_movies_list_controllers ){
            if( i == array_key && m_movies_list_controllers[ i ] ){
                found_controller = m_movies_list_controllers[ i ];
                break;
            }
        }


        if( found_controller ){
        destroyMovieListControllers( found_controller );
            if( InputManager.getLastPressedKey() == engine.keymap.controllerPS3.CROSS ||
                InputManager.getLastPressedKey() == "ENTER" ||
                !openDetailsIfExists( found_controller ) ){

                destroyDetailsControllers();

                m_movies_list_controllers[ array_key ].open();
                m_movies_list_controllers[ array_key ].setFocus();

                m_pending_focused_controller = null;
                m_focused_controller = m_movies_list_controllers[ array_key ];
                m_movies_list_controllers[ array_key ].getDisplayNode().controllerName = 'movielist';
                m_content_container.addChild( m_movies_list_controllers[ array_key ].getDisplayNode() );
            }
        }else{
            m_movies_list_controllers[ array_key ] = new MoviesOrShowsListController( This );

            m_present_controllers.push( m_movies_list_controllers[ array_key ] );

            m_movies_list_controllers[ array_key ].getDisplayNode().x = 96+374+120;
            m_movies_list_controllers[ array_key ].getDisplayNode().y = 0;
            m_pending_focused_controller = m_movies_list_controllers[ array_key ];
            m_movies_list_controllers[ array_key ].prepareToOpen( category, filter, genre, collection_id );
            openLoadingScreen( m_movies_list_controllers[ array_key ] );
//            m_movies_list_controllers[ array_key ].open();
//            m_movies_list_controllers[ array_key ].setFocus();

//            m_focused_controller = m_movies_list_controllers[ array_key ];
            m_movies_list_controllers[ array_key ].getDisplayNode().controllerName = 'movielist';
            m_content_container.addChild( m_movies_list_controllers[ array_key ].getDisplayNode() );
        }
    }
    function openAboutController(){
        destroyMovieListControllers();
        destroyRecommendedWatchlistController();
        destroySlideShowController();
        destroyLoginController();

        m_pending_focused_controller = null;

        m_about_controller.getDisplayNode().controllerName = 'about';
        m_content_container.addChild( m_about_controller.getDisplayNode() );
        m_about_controller.getDisplayNode().x = 96+374+120;
        m_about_controller.getDisplayNode().y = 100;
        m_about_controller.prepareToOpen();
        m_about_controller.open();
        m_about_controller.setFocus();
    }
    function openLoginController(json){
        //destroyMovieListControllers();
        //destroyRecommendedWatchlistController();
        destroySlideShowController();
        destroyLoginController();
        destroyMyWatchlistController();

        var previousAction = json.previousAction;
        if(!previousAction){
            destroySlideShowController(); 
        }

        if( !m_login_controller ){
            m_login_controller = new LoginController( This );
        }
        m_login_controller.getDisplayNode().controllerName = 'login';
        m_content_container.addChild( m_login_controller.getDisplayNode() );
        m_login_controller.prepareToOpen();
        m_login_controller.getDisplayNode().x = 96+374+120;
        m_login_controller.getDisplayNode().y = 100;
        m_login_controller.open(previousAction);
        m_login_controller.setFocus();
        m_pending_focused_controller = null;
        m_focused_controller = m_login_controller;

    }
    // function openHistoryController(){
    //     destroyMovieListControllers();
    //     destroyRecommendedWatchlistController();
    //     destroySlideShowController();
    //     destroyLoginController();

    //     UtilLibraryInstance.garbageCollect();

    //     if( m_history_controller &&
    //         InputManager.getLastPressedKey() != engine.keymap.controllerPS3.CROSS &&
    //         InputManager.getLastPressedKey() != "ENTER")
    //     {
    //         UtilLibraryInstance.garbageCollect();

    //         m_pending_focused_controller = null;
    //         Logger.log( 'ApplicationController - openHistoryController' );
    //         if( !m_content_container.contains( m_history_controller.getDisplayNode() ) ){
    //             m_content_container.addChild( m_history_controller.getDisplayNode() );
    //         }
    //         m_history_controller.prepareToOpen();
    //         m_history_controller.open();
    //         m_history_controller.setFocus();
            

    //         m_focused_controller = m_history_controller;
    //     }else{
    //         destroyHistoryController();
    //         Logger.log( 'ApplicationController - openHistoryController1' );
    //         UtilLibraryInstance.garbageCollect();

    //         m_history_controller = new HistoryController( This );
    //         m_history_controller.prepareToOpen( );
    //         m_pending_focused_controller = m_history_controller;
            
    //         if(crackleUser.id != ""){
    //             openLoadingScreen( m_history_controller );
    //         }
    //         else{
                
    //             m_history_controller.prepareToOpen();
    //             m_history_controller.open();
    //             m_history_controller.setFocus();
    //             m_focused_controller = m_history_controller;
    //         }

    //         m_history_controller.getDisplayNode().x = 96+374+52;
    //         m_history_controller.getDisplayNode().y = 54;
    //         m_present_controllers.push( m_history_controller );
    //         m_history_controller.getDisplayNode().controllerName = 'history';
    //         m_content_container.addChild( m_history_controller.getDisplayNode() );
    //     }
    // }
    function openCollectionsController( collection_id ){
        destroyMovieListControllers();
        destroySlideShowController();
       //destroyMyWatchlistController ()
        destroyLoginController();

        if( m_recommended_watchlist_controller && m_recommended_watchlist_controller.getCollectionId() == collection_id &&
            InputManager.getLastPressedKey() != engine.keymap.controllerPS3.CROSS &&
            InputManager.getLastPressedKey() != "ENTER"
        ){
            UtilLibraryInstance.garbageCollect();

            m_pending_focused_controller = null;
            Logger.log( 'm_recommended_watchlist_controller.getCollectionId() = ' + m_recommended_watchlist_controller.getCollectionId() );
            Logger.log( 'collection_id = ' + collection_id );
            if( !m_content_container.contains( m_recommended_watchlist_controller.getDisplayNode() ) ){
                m_content_container.addChild( m_recommended_watchlist_controller.getDisplayNode() );
            }
            m_recommended_watchlist_controller.open();
            m_recommended_watchlist_controller.setFocus();

            m_focused_controller = m_recommended_watchlist_controller;
        }else{
            destroyRecommendedWatchlistController();
            UtilLibraryInstance.garbageCollect();

            m_recommended_watchlist_controller = new RecommendedWatchlistController( This );
            m_recommended_watchlist_controller.prepareToOpen( collection_id );
            m_pending_focused_controller = m_recommended_watchlist_controller;
            openLoadingScreen( m_recommended_watchlist_controller );

            m_recommended_watchlist_controller.getDisplayNode().x = 96+374+52;
            m_recommended_watchlist_controller.getDisplayNode().y = 54;
            m_present_controllers.push( m_recommended_watchlist_controller );
            m_recommended_watchlist_controller.getDisplayNode().controllerName = 'recommended';
            m_content_container.addChild( m_recommended_watchlist_controller.getDisplayNode() );

//            m_focused_controller = m_recommended_watchlist_controller;
//            m_recommended_watchlist_controller.open();
//            m_recommended_watchlist_controller.setFocus();
        }
    }
    function openMyWatchlistController( ){
    
        destroyRecommendedWatchlistController();
        destroySlideShowController();
        destroyLoginController();

        UtilLibraryInstance.garbageCollect();

        if( myWatchlistController &&
            InputManager.getLastPressedKey() != engine.keymap.controllerPS3.CROSS &&
            InputManager.getLastPressedKey() != "ENTER" &&
            InputManager.getLastPressedKey() != engine.keymap.controllerPS3.RIGHT)
        {
            UtilLibraryInstance.garbageCollect();

            m_pending_focused_controller = null;
            Logger.log( 'myWatchlistController because it exists.' );
            if( !m_content_container.contains( myWatchlistController.getDisplayNode() ) ){
                m_content_container.addChild( myWatchlistController.getDisplayNode() );
            }
            myWatchlistController.prepareToOpen( );
            //m_present_controllers.push( myWatchlistController );    
            myWatchlistController.open();
            myWatchlistController.setFocus();

            m_focused_controller = myWatchlistController;
        }else{
            Logger.log( 'myWatchlistController because it does not.' );

            UtilLibraryInstance.garbageCollect();

            myWatchlistController = new MyWatchlistController( This );
            m_pending_focused_controller = myWatchlistController;
            myWatchlistController.prepareToOpen( );
            myWatchlistController.open();
            myWatchlistController.setFocus();
            m_focused_controller = myWatchlistController;
            
            if(crackleUser.id != null){
                openLoadingScreen( myWatchlistController );
            }

        }
            m_present_controllers.push( myWatchlistController );
            myWatchlistController.getDisplayNode().x = 96+374+52;
            myWatchlistController.getDisplayNode().y = 54;
            myWatchlistController.getDisplayNode().controllerName = 'myWatchlist';
            m_content_container.addChild( myWatchlistController.getDisplayNode() );

    }

    function openPreviousController(json){
        destroyLoginController();
        m_focused_controller = m_present_controllers[m_present_controllers.length -1]
        m_focused_controller.open();
        m_focused_controller.setFocus()


    }

    function openDetailsIfExists( calling_controller ){
        Logger.log( 'openDetailsIfExists' );
        Logger.log( 'm_movies_details_controller' );
        Logger.logObj( m_movie_details_controller );

//        if( m_movie_details_controller ){
//            Logger.log( 'm_content_container.contains( m_movie_details_controller.getDisplayNode() = ' + m_content_container.contains( m_movie_details_controller.getDisplayNode() ) );
//            Logger.log( 'm_movie_details_controller.getCallingController().getControllerName() = ' + m_movie_details_controller.getCallingController().getControllerName() );
//            Logger.log( 'calling_controller.getControllerName() = ' + calling_controller.getControllerName() );
//            Logger.log( 'm_movie_details_controller.getCallingController() == calling_controller = ' + ( m_movie_details_controller.getCallingController() == calling_controller ) );
//        }

        if( m_movie_details_controller && m_content_container.contains( m_movie_details_controller.getDisplayNode() ) && m_movie_details_controller.getCallingController() == calling_controller ){
            m_movie_details_controller.open();
            m_movie_details_controller.setFocus();
            m_focused_controller = m_movie_details_controller;
            m_pending_focused_controller = m_movie_details_controller;
            Logger.log( 'openDetailsIfExists = true ');
            return true;
        }else if( m_show_details_controller && m_content_container.contains( m_show_details_controller.getDisplayNode() ) && m_show_details_controller.getCallingController() == calling_controller ){
            m_show_details_controller.open();
            m_show_details_controller.setFocus();
            m_focused_controller = m_show_details_controller;
            m_pending_focused_controller = m_show_details_controller;
            Logger.log( 'openDetailsIfExists = true' );
            return true;
        }else{
            Logger.log( 'openDetailsIfExists = false' );
            return false;
        }
    }

    function handleSubmenuAnimation( engine_timer ){
        var ci;

        // OPEN animation
        if ( m_animation_open_submenu ){

            // Starting animation?
            if ( m_animation_open_submenu_last_update_timer == -1 ){
                m_animation_open_time_start = engine_timer;
                if ( m_menu_container.contains( m_animation_open_submenu_controller.getDisplayNode() ) ){
                    m_menu_container.removeChild( m_animation_open_submenu_controller.getDisplayNode() );
                }
                ci = m_menu_container.getChildIndex( m_main_menu_controller.getDisplayNode() );
                m_menu_container.addChildAt( m_animation_open_submenu_controller.getDisplayNode(), ci );
            }

            var animation_open_time_elapsed;

            if ( m_animation_open_submenu_direction == ApplicationController.ANIMATION_DIRECTION.RIGHT ){
                m_animation_open_submenu_last_update_timer = engine_timer;
                animation_open_time_elapsed = engine_timer - m_animation_open_time_start;
                m_animation_open_submenu_controller.getDisplayNode().x = AnimationUtilitiesInstance.getXSinePosition( 0, ANIMATION_OPEN_SUBMENU_FINAL_RIGHT, animation_open_time_elapsed, ANIMATION_OPEN_SUBMENU_DURATION );

                // Has time elapsed reached?
                if ( animation_open_time_elapsed >= ANIMATION_OPEN_SUBMENU_DURATION ){
                    m_animation_open_time_start = engine_timer;
                    m_animation_open_submenu_direction = ApplicationController.ANIMATION_DIRECTION.LEFT;
                    if ( m_menu_container.contains( m_animation_open_submenu_controller.getDisplayNode() ) ){
                        m_menu_container.removeChild( m_animation_open_submenu_controller.getDisplayNode() );
                    }
                    ci = m_menu_container.getChildIndex( m_main_menu_controller.getDisplayNode() );
                    m_menu_container.addChildAt( m_animation_open_submenu_controller.getDisplayNode(), ci + 1 );
                }
            } else if ( m_animation_open_submenu_direction == ApplicationController.ANIMATION_DIRECTION.LEFT ){
                m_animation_open_submenu_last_update_timer = engine_timer;
                animation_open_time_elapsed = engine_timer - m_animation_open_time_start;
                m_animation_open_submenu_controller.getDisplayNode().x = AnimationUtilitiesInstance.getXSinePosition( ANIMATION_OPEN_SUBMENU_FINAL_RIGHT, ANIMATION_OPEN_SUBMENU_FINAL_LEFT, animation_open_time_elapsed, ANIMATION_OPEN_SUBMENU_DURATION );
                if ( animation_open_time_elapsed >= ANIMATION_OPEN_SUBMENU_DURATION ){
                    m_animation_open_submenu_controller.getDisplayNode().x = ANIMATION_OPEN_SUBMENU_FINAL_LEFT;

                    // End animation
                    m_animation_open_submenu = false;
                    m_animation_open_submenu_last_update_timer = -1;
                }
            }
        }

        // CLOSE animation
        if ( m_animation_close_submenu ){

            // Starting animation?
            if ( m_animation_close_submenu_last_update_timer == -1 ){
                m_animation_close_time_start = engine_timer;
                if ( m_menu_container.contains( m_animation_close_submenu_controller.getDisplayNode() ) ){
                    m_menu_container.removeChild( m_animation_close_submenu_controller.getDisplayNode() );
                }
                ci = m_menu_container.getChildIndex( m_main_menu_controller.getDisplayNode() );
                m_menu_container.addChildAt( m_animation_close_submenu_controller.getDisplayNode(), ci + 1 );
            }

            var animation_close_time_elapsed;

            if ( m_animation_close_submenu_direction == ApplicationController.ANIMATION_DIRECTION.RIGHT ){
                m_animation_close_submenu_last_update_timer = engine_timer;
                animation_close_time_elapsed = engine_timer - m_animation_close_time_start;
                m_animation_close_submenu_controller.getDisplayNode().x = AnimationUtilitiesInstance.getXSinePosition( m_animation_close_submenu_initial_x, ANIMATION_CLOSE_SUBMENU_FINAL_RIGHT, animation_close_time_elapsed, ANIMATION_CLOSE_SUBMENU_DURATION );
                if ( animation_close_time_elapsed >= ANIMATION_CLOSE_SUBMENU_DURATION ){
                    m_animation_close_time_start = engine_timer;
                    m_animation_close_submenu_direction = ApplicationController.ANIMATION_DIRECTION.LEFT;
                    if ( m_menu_container.contains( m_animation_close_submenu_controller.getDisplayNode() ) ){
                        m_menu_container.removeChild( m_animation_close_submenu_controller.getDisplayNode() );
                    }
                    ci = m_menu_container.getChildIndex( m_main_menu_controller.getDisplayNode() );
                    m_menu_container.addChildAt( m_animation_close_submenu_controller.getDisplayNode(), ci  );
                }
            } else if ( m_animation_close_submenu_direction == ApplicationController.ANIMATION_DIRECTION.LEFT ){
                m_animation_close_submenu_last_update_timer = engine_timer;
                animation_close_time_elapsed = engine_timer - m_animation_close_time_start;
                m_animation_close_submenu_controller.getDisplayNode().x = AnimationUtilitiesInstance.getXSinePosition( ANIMATION_CLOSE_SUBMENU_FINAL_RIGHT, ANIMATION_CLOSE_SUBMENU_FINAL_LEFT, animation_close_time_elapsed, ANIMATION_CLOSE_SUBMENU_DURATION );
                if ( animation_close_time_elapsed >= ANIMATION_CLOSE_SUBMENU_DURATION ){
                    m_animation_close_submenu_controller.getDisplayNode().x = ANIMATION_CLOSE_SUBMENU_FINAL_LEFT;

                    // End animation
                    m_animation_close_submenu = false;
                    m_animation_close_submenu_last_update_timer = -1;
                }
            }
        }

    }

    function endOpeningAnimation(){
        if ( m_animation_open_submenu_controller && m_menu_container.contains( m_animation_open_submenu_controller.getDisplayNode() ) ){
            m_menu_container.removeChild( m_animation_open_submenu_controller.getDisplayNode() );
        }
        if ( m_animation_close_submenu_controller && m_menu_container.contains( m_animation_close_submenu_controller.getDisplayNode() ) ){
            m_menu_container.removeChild( m_animation_close_submenu_controller.getDisplayNode() );
        }
        m_animation_open_submenu = false;
        m_animation_open_submenu_last_update_timer = -1;
        m_animation_open_time_start = -1;
    }

    /**
     * Loop through the array of focused controller and invoke close()
     *
     * TODO: We must have a way to add exceptions to the list based on the user flow
     *
     */
    function closeAllVisibleControllers( ){
        try{
            for( var i in m_present_controllers ){
                if( m_content_container.contains( m_present_controllers[ i ].getDisplayNode() ) ){
                    m_present_controllers[ i ].close();
                }
            }
        }catch( e ){
            Logger.logObj( e );
            Logger.log( '!!! EXCEPTION ON closeAllVisibleControllers()' );
        }
    }

    function setFocusPreviousMenuController(){
        var previous_menu_controller = m_present_menu_controllers[ m_present_menu_controllers.length - 1 ];

        m_focused_controller = previous_menu_controller;
        
        Logger.log( 'm_focused_controller == m_main_menu_controller = ' + ( m_focused_controller == m_main_menu_controller ) );
        if( m_focused_controller == m_main_menu_controller ){
            hideNavigation();
        }

        previous_menu_controller.setFocus();
    }

    function updateOnscreenControllers( engine_timer ){
        if( m_focused_controller ){
            m_focused_controller.update( engine_timer );
        }

        if( !m_startup_controllers_ready && m_loading_screen_controller && screenObj.contains( m_loading_screen_controller.getDisplayNode() ) ) {
            m_loading_screen_controller.update( engine_timer );
        }

        if( m_loading_controller && screenObj.contains( m_loading_controller.getDisplayNode() ) ){
            m_loading_controller.update( engine_timer );
        }
//        for (var i in m_present_controllers ){
//            m_present_controllers[ i ].update( engine_timer );
//        }
    }

    function updateManagers( engine_timer ){
        ImageManagerInstance.update( engine_timer );
        VideoManagerInstance.update( engine_timer );
    }
    var m_currently_pressed_key = null
    this.onKeyEnd = function(){
        m_currently_pressed_key = null;
        currentKey = null;
        //isKeyPressed=false
    }
    this.frameEnded = function(){
        currentKey = null;
        //isKeyPressed=false
    }
    
    ApplicationController.onKey = function( keyObj ){
        if( !m_focused_controller ) return;
        
        keyObj.onEnd = This.onKeyEnd;
        Logger.log( "onkey: " + keyObj.name );

        if( keyObj.name == undefined )
            This.currentKey = null;
        else{
            m_currently_pressed_key = keyObj.name;
            This.currentKey = keyObj;
            //isKeyPressed=true
        }
        if( This.currentKey && !This.m_currently_pressed_key){
            if(keyObj.deviceType == 'controller'){
                switch(keyObj.name){
                     case engine.keymap.controllerPS3.L1:
                        handleKeyPress_L1();
                        break;
                    case engine.keymap.controllerPS3.R1:
                        handleKeyPress_R1();
                        break;
                    case engine.keymap.controllerPS3.L2:
                        handleKeyPress_L2();
                        break;
                    case engine.keymap.controllerPS3.R2:
                        handleKeyPress_R2();
                        break;
                    case engine.keymap.controllerPS3.UP:
                        handleKeyPress_UP();
                        break;
                    case engine.keymap.controllerPS3.DOWN:
                        handleKeyPress_DOWN();
                        break;
                    case engine.keymap.controllerPS3.LEFT:
                    case engine.keymap.controllerPS3.MEDIA_SCAN_REV:
                        handleKeyPress_LEFT();
                        break;
                    case engine.keymap.controllerPS3.RIGHT:
                    case engine.keymap.controllerPS3.MEDIA_SCAN_FWD:
                        handleKeyPress_RIGHT();
                        break;
                    case engine.keymap.controllerPS3.SQUARE:
                       if( LoggerConfig.CONFIG.EXTRA_KEYINPUTS ){
                           UtilLibraryInstance.garbageCollect();
                        }
                        break;
                    case engine.keymap.controllerPS3.TRIANGLE:
                    case engine.keymap.controllerPS3.SUBTITLE:
                        handleKeyPress_TRIANGLE();
                        break;
                    case engine.keymap.controllerPS3.CROSS:
                    case engine.keymap.controllerPS3.ENTER:
                    case engine.keymap.controllerPS3.MEDIA_PLAY:
                        handleKeyPress_ENTER();
                        break;
                    case engine.keymap.controllerPS3.START:
                    case engine.keymap.controllerPS3.MEDIA_PAUSE:
                        handleKeyPress_START();
                        break;
                    case engine.keymap.controllerPS3.CIRCLE:
                    case engine.keymap.controllerPS3.MEDIA_STOP:
                        handleKeyPress_CIRCLE();
                        break;
                }
            }
            if(keyObj.deviceType == 'keyboard'){
                switch(keyObj.name){
                    case engine.keymap.keyboardUS.P:
                         handleKeyPress_P();
                         break;
                    case engine.keymap.keyboardUS.A:
                        handleKeyPress_L1();
                        break;
                    case engine.keymap.keyboardUS.D:
                        handleKeyPress_R1();
                        break;
                    case engine.keymap.keyboardUS.Z:
                        handleKeyPress_L2();
                        break;
                    case engine.keymap.keyboardUS.C:
                        handleKeyPress_R2();
                        break;
                    case engine.keymap.keyboardUS.UP:
                        handleKeyPress_UP();
                        break;
                    case engine.keymap.keyboardUS.DOWN:
                        handleKeyPress_DOWN();
                        break;
                    case engine.keymap.keyboardUS.LEFT:
                        handleKeyPress_LEFT();
                        break;
                    case engine.keymap.keyboardUS.RIGHT:
                        handleKeyPress_RIGHT();
                        break;
                    case engine.keymap.keyboardUS.Q:
                       if( LoggerConfig.CONFIG.EXTRA_KEYINPUTS ){
                           UtilLibraryInstance.garbageCollect();
                        }
                        break;
                    case engine.keymap.keyboardUS.T:
                        handleKeyPress_TRIANGLE();
                        break;
                    case engine.keymap.keyboardUS.SPACE:
                        handleKeyPress_SPACE();
                        if( LoggerConfig.CONFIG.EXTRA_KEYINPUTS ){
                            Logger.log( 'm_content_container.numChildren = ' + m_content_container.numChildren );
        //                    try{
        //                        for( var i in m_presents ){
        //                            Logger.log( m_presents[ i ].geName() );
        //                        }
        //                    }catch( e ){}
                            Logger.log( 'm_focused.geName() = ' + m_focused.geName() );
                            Logger.logObj( engine.stats.bindings );
                            Logger.logObj( engine.stats.memory );
                        }
                        break;
                    case engine.keymap.keyboardUS.ENTER:
                        handleKeyPress_ENTER();
                        break;

                    case engine.keymap.keyboardUS.S:
                        handleKeyPress_START();
                        break;

                    case engine.keymap.keyboardUS.ESCAPE:
                        handleKeyPress_CIRCLE();
                        break;
                }
            }
        }
    }

    function handleKeyPress_P(){
//        if( isAvailable( m_mlb_background_controller ) )
//            m_mlb_background_controller.setPaused( ! m_mlb_background_controller.getIsPaused() );
//        toggleVideoPause();
    }

    function handleKeyPress_CIRCLE(){
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'circlePressed' ) ){
            m_pending_focused_controller.circlePressed();
        }else if ( m_focused_controller.hasOwnProperty( 'circlePressed' ) ){
            m_focused_controller.circlePressed();
        }
    }
    function handleKeyPress_TRIANGLE(){
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'trianglePressed' ) ){
            m_pending_focused_controller.trianglePressed();
        }else if ( m_focused_controller.hasOwnProperty( 'trianglePressed' ) ){
            m_focused_controller.trianglePressed();
        }
    }

    function handleKeyPress_UP(){
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'navUp' ) ){
            m_pending_focused_controller.navUp();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'navUp' ) ){
            m_focused_controller.navUp();
        }
    }

    function handleKeyPress_DOWN(){
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'navDown' ) ){
            m_pending_focused_controller.navDown();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'navDown' ) ){
            m_focused_controller.navDown();
        }
    }

    function handleKeyPress_LEFT(){

        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'navLeft' ) ){
            m_pending_focused_controller.navLeft();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'navLeft' ) ){
            m_focused_controller.navLeft();
        }
    }

    function handleKeyPress_RIGHT(){
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'navRight' ) ){
            m_pending_focused_controller.navRight();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'navRight' ) ){
            m_focused_controller.navRight();
        }
    }

    function handleKeyPress_L1(){
        if( LoggerConfig.CONFIG.EXTRA_KEYINPUTS ){
            Logger.log( 'm_pending_focused_controller = ' + m_pending_focused_controller );
            if( m_pending_focused_controller && m_pending_focused_controller.getControllerName ){
                Logger.log( 'm_pending_focused_controller name = ' + m_pending_focused_controller.getControllerName() );
            }
            Logger.log( 'm_focused_controller = ' );
            Logger.logObj( m_focused_controller );
            if( m_focused_controller && m_focused_controller.getControllerName ){
                Logger.log( 'm_focused_controller name = ' + m_focused_controller.getControllerName() );
            }
        }

        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'navL1' ) ){
            m_pending_focused_controller.navL1();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'navL1' ) ){
            m_focused_controller.navL1();
        }
    }

    function handleKeyPress_R1(){
        if( LoggerConfig.CONFIG.EXTRA_KEYINPUTS ){
            Logger.log( 'm_content_container.numChildren = ' + m_content_container.numChildren );
            for( var i = 0; i < m_content_container.numChildren; i++ ){
                var display_node = m_content_container.getChildAt( i );

                for( var ii in m_present_controllers ){
                    if( m_present_controllers[ ii ].getDisplayNode() == display_node ){
                        Logger.log( 'found controller!' );
                        Logger.log( 'controller name = ' + m_present_controllers[ ii ].getControllerName() );
                        break;
                    }
                }

            }
        }
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'navR1' ) ){
            m_pending_focused_controller.navR1();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'navR1' ) ){
            m_focused_controller.navR1();
        }
    }
    function handleKeyPress_L2(){
        if( LoggerConfig.CONFIG.EXTRA_KEYINPUTS ){
            Logger.log( 'Firing video playback error' );
//            VideoManagerInstance.stop();
//            VideoManagerInstance.close();
//            m_controller_before_video_started = m_focused_controller;
//            This.requestingParentAction( { action: ApplicationController.OPERATIONS.VIDEO_PLAYBACK_ERROR } );
        }

        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'navL2' ) ){
            m_pending_focused_controller.navL2();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'navL2' ) ){
            m_focused_controller.navL2();
        }
    }

    function handleKeyPress_R2(){
        if( LoggerConfig.CONFIG.EXTRA_KEYINPUTS ){
            for( var i in m_present_controllers ){
                if( m_present_controllers[ i ] ){
                    Logger.log( 'controller name = ' + m_present_controllers[ i ].getControllerName() );
                }
            }
        }
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'navR2' ) ){
            m_pending_focused_controller.navR2();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'navR2' ) ){
            m_focused_controller.navR2();
        }
    }
    function handleKeyPress_SPACE(){
//        m_main_menu_controller.open();
    }

    function handleKeyPress_ENTER(){
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'enterPressed' ) ){
            m_pending_focused_controller.enterPressed();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'enterPressed' ) ){
            m_focused_controller.enterPressed();
        }
    }
    function handleKeyPress_START(){
        if( m_pending_focused_controller && m_pending_focused_controller.hasOwnProperty( 'startPressed' ) ){
            m_pending_focused_controller.startPressed();
        }else if (m_focused_controller && m_focused_controller.hasOwnProperty( 'startPressed' ) ){
            m_focused_controller.startPressed();
        }
    }

    function doPSNCheck( callback ){
        if( LoggerConfig.CONFIG.PSN_CHECK ){

            if( ! m_psn.userHasAccount() ){
                // User doesn't have a PSN account
                var psnSignupController = new PSNSignupController( this );
                screenObj.addChild( psnSignupController.getDisplayNode() );
                psnSignupController.prepareToOpen();
                psnSignupController.open();
                return false;
            }else{
                // User has a PSN account, invoke ticket request
                m_psn.requestTicketCallback( callback );

                return true;
            }
        }else{
            callback( true );
            return true;
        }
    }

    /**
     * Helper PSN function that forces user to see the login screen
     * even if the user aborted or an error occurred on the ticket request
     */
    function repeatPSNCheck( callback ){
//        m_repeat_psn_check_callback = callback;

        Logger.log( 'repeatPSNCheck' );
        Logger.logObj( callback );

        doPSNCheck( function( gotNpTicket ){
            if( gotNpTicket ){
                Logger.log( 'repeatPSNCheck gotNpTicket TRUE' );
                Logger.logObj( callback );
                callback();
                return;
            }else{
                repeatPSNCheck( callback );
            }
        });
    }

    function onChangePSNStatus( isOnline ){
        if( m_video_controller && screenObj.contains( m_video_controller.getDisplayNode() ) ){
        }else{
            // If video isn't playing
            repeatPSNCheck( function() {
                Logger.log( 'back on appcontroller' );
            } );
        }
    }
    // ApplicationController.getUserHistoryList = function(callback){
    //     if(crackleUser.id != ""){
    //         var url = ModelConfig.getServerURLRoot() + "queue/history/list/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' );
    //         HttpRequest.request(url, "GET", function(data, status){
    //                 if(data != null && status == 200){
    //                     if(callback){
    //                         callback(data, status)
    //                     }
    //                 }
    //                 else{
    //                     if(callback){
    //                         callback(null, status)
    //                     }
    //                 }
    //             })
    //         HttpRequest.startRequest()
    //     }
    // }

    ApplicationController.getUserInfo = function(){
        return crackleUser;
    }

    ApplicationController.setUserInfo= function(user, cb){
        if(user == null){
            crackleUser.id = null
            crackleUser.name = null;
            crackleUser.watchlist = [];
            //would be better to delete key
            localStorage.age = "";
            localStorage.gender = "";
            localStorage.userId = ""
            localStorage.deviceAuth = ""
            return;
        }

        localStorage.age = (user.userAge)?user.userAge:user.age;
        localStorage.gender = (user.userGender)?user.userGender:user.gender;
        localStorage.userId = (user.CrackleUserId)?user.CrackleUserId:user.id;
        localStorage.name = (user.CrackleUserName)?user.CrackleUserName:user.name;
        ApplicationController.setCrackleUser(user, cb)

    }

    ApplicationController.setCrackleUser = function(userData, cb){
        
        console.log("SETTING USER INFO")
        console.dir(userData)
        crackleUser.id = (userData.CrackleUserId)?userData.CrackleUserId:userData.userId;
        crackleUser.name = (userData.CrackleUserName)?userData.CrackleUserName:userData.name
        crackleUser.watchlist = [];
        CrackleApi.User.watchlist(crackleUser, function(data, status){
            if(data != null && status == 200){
                console.log("CrackleUser after watchlist")
                console.dir(crackleUser)

                cb && cb(true)
            }
        });
    }

    //Watchlist stuff here because it can be called from many different places.

    ApplicationController.isInUserWatchlist = function(id){

        //return false if not logged
        if(crackleUser.id == null){
            return false;
        }
        var items = crackleUser.watchlist
        
        for (item = 0; item< items.length; item++){
            if(items[item].ID == id){
                return true;
                break;
            }
        }

        return false;
    }

    // ApplicationController.getUserWatchList = function(callback){
    //     if(crackleUser.id != null){
    //         var d = new Date();
    //         var ord = "&ord=" + (d.getTime() + Math.floor((Math.random()*100)+1)).toString();
    //         var url = ModelConfig.getServerURLRoot() + "queue/queue/list/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' )+"?format=json"+ord;
    //         Http.requestJSON(url, "GET", null, null, function(data, status){
    //             if(data != null && status == 200){
    //                 crackleUser.watchlist = [];
    //                 var items = data.Items;
    //                 crackleUser.watchlist = items.slice(0);

    //                 callback && callback(data, status)
    //             }
    //             else{
    //                 callback && callback(null, status)
    //             }
    //         })
    //         //HttpRequest.startRequest()
    //     }
    // }

    ApplicationController.addToUserWatchlist = function (id, type, callback){
        if(id){
            var url =  ModelConfig.getServerURLRoot() + "queue/queue/add/member/"+ crackleUser.id +"/"+type+"/"+id+"?format=json";;
            Http.request(url, "GET", null, null,function(data, status){
                if(data != null && status ==200){
                    CrackleApi.User.watchlist(crackleUser, function(data, status){
                        callback && callback(true)
                    })
                }
                else{
                    callback && callback(false, status)
                }
            })
            //HttpRequest.startRequest()
        }


    }
    ApplicationController.removeFromUserWatchlist = function(id, type, callback){
        if(id){
            var url =  ModelConfig.getServerURLRoot() + "queue/queue/remove/member/"+ crackleUser.id +"/"+type+"/"+id+"?format=json";
            Http.requestJSON(url, "GET", null, null, function(data, status){
                if(data != null && status ==200){
                     CrackleApi.User.watchlist(crackleUser, function(data, status){
                        callback && callback(true)
                    })
                }
                else{
                    callback && callback(false, status)
                }
            })
            //HttpRequest.startRequest()
        }
    }

    var progressList= false;
    //This should be processed after login.
    ApplicationController.getUserPauseResumeList = function(callback){
        if(crackleUser.id != null){
            var d = new Date();
            var ord = "&ord=" + (d.getTime() + Math.floor((Math.random()*100)+1)).toString();
            var url =  ModelConfig.getServerURLRoot() + "pauseresume/list/member/"+ crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' )+"?format=json"+ord;
            Http.requestJSON(url, "GET", null, null, function(pauseResumeData, status){
                if(pauseResumeData != null && status ==200){
                    if(pauseResumeData.Progress && pauseResumeData.Progress.length>0){
                        for(var i=0; i<pauseResumeData.Progress.length; ++i){
                            var item = pauseResumeData.Progress[i];
                            StorageManagerInstance.set( 'video_progress_' + item.MediaId, item.DurationInSeconds );
                        }
                        callback&&callback(true)
                    }
                    else{
                        callback&&callback(false, status)    
                    }
                }
                else{
                    callback&&callback(false, status)
                }
            })
            //HttpRequest.startRequest()
        }
        else{
            callback&&callback(true)
        }
    }
    
    ApplicationController.getMediaPauseResume = function(id, callback){
        if(crackleUser.id != null){
            var url =  ModelConfig.getServerURLRoot() + "pauseresume/media/"+ id+ "/list/member"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' )+"?format=json";
            Http.request(url, "GET", null, null, function(data, status){
                if(data != null && status ==200 && data.Progress && data.Progress.length>0){
                    var item = data.Progress;
                    StorageManagerInstance.set( 'video_progress_' + item.MediaId, item.DurationInSeconds );
                    callback&&callback(true)
                }
                else{
                    callback&&callback(false, status)
                }
            })
            //HttpRequest.startRequest()
        }
    }

    ApplicationController.setPauseResumePoint = function(id, duration){
        if(crackleUser.id){
            var d  = parseInt(duration)
            var url =  ModelConfig.getServerURLRoot() + "pauseresume/media/"+id+"/set/"+ d+"/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' )+"?format=json";
            Http.request(url, "GET", null, null, function(data, status){
                Logger.log("setPauseResumePoint returned status - " + status)
            })
        //HttpRequest.startRequest()
        }
    }


    function onExit( complete, exception ){
        Logger.log( 'onExit' );
        if( engine.stats.device.platform != 'html' && VideoManagerInstance ){
            VideoManagerInstance.stop();
            VideoManagerInstance.close();
        }
        complete();
    }
    //Initialize all the tracking.
    //Conviva.LivePass.toggleTraces(true)
    //Conviva.LivePass.init( ConvivaIntegration.customerKey );

    //var settings = {}
    //settings.gatewayUrl = "https://testonly.conviva.com"
    //Conviva.LivePass.init( ConvivaIntegration.customerKey, settings )


    Comscore.sendStartup();
}

ApplicationController.OPERATIONS = {
    SELECT_PREVIOUS_MENU: 1,
    CLOSE_AND_SELECT_PREVIOUS_MENU: 2,
    OPEN_SLIDESHOW: 3,
    OPEN_FEATURED: 4,
    OPEN_POPULAR: 5,
    OPEN_RECENT: 6,
    OPEN_GENRE: 7,
    OPEN_MOVIES_MENU: 8,
    OPEN_SHOWS_MENU: 9,
    OPEN_MOVIE_DETAILS: 10,
    OPEN_SHOW_DETAILS: 11,
    OPEN_BROWSEALL: 12,
    START_VIDEO_PLAYBACK: 13,
    OPEN_WATCHLIST_MENU: 14,
    OPEN_COLLECTION: 15,
    OPEN_LOADING_SCREEN: 16,
    CLOSE_ERROR_CONTROLLER: 17,
    OPEN_MYCRACKLE_MENU: 18,
    OPEN_MEDIA_INFO: 20,
    CLOSE_MEDIA_INFO: 21,
    OPEN_ABOUT: 22,
    OPEN_LOGIN: 23,
    OPEN_HISTORY: 24,
    ADD_TO_WATCHLIST: 25,
    REMOVE_FROM_WATCHLIST: 26,
    OPEN_PREVIOUS_CONTROLLER: 27,
    OPEN_MY_WATCHLIST: 28,
    CLOSE_DISCLAIMER: 30,
    VIDEO_PLAYBACK_STOPPED: 31,
    VIDEO_PLAYBACK_ERROR: 32,
    CLOSE_DETAILS_PAGE: 34,
    SHOW_NAVIGATION: 35,
    HIDE_NAVIGATION: 36,
    INVALID_REGION: 50,
    OPEN_SUBTITLE_CHOOSER: 51,
    CLOSE_SUBTITLE_CHOOSER: 52
};

ApplicationController.ANIMATION_DIRECTION = {
    LEFT: 1,
    RIGHT: 2
}

var VideoManagerInstance = null;
