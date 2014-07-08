
include( "js/app/com/dadc/lithium/model/CallFuncTester.js" );
include( "js/app/com/dadc/lithium/model/Featured.js" );
include( "js/app/com/dadc/lithium/model/Popular.js" );
include( "js/app/com/dadc/lithium/model/Recent.js" );
include( "js/app/com/dadc/lithium/model/SlideShow.js" );
include( "js/app/com/dadc/lithium/model/BrowseFilters.js" );
include( "js/app/com/dadc/lithium/model/GenreFilters.js" );
include( "js/app/com/dadc/lithium/model/Browse.js" );
include( "js/app/com/dadc/lithium/model/SearchResults.js" );
include( "js/app/com/dadc/lithium/model/ChannelDetails.js" );
include( "js/app/com/dadc/lithium/model/ChannelFolderList.js" );
include( "js/app/com/dadc/lithium/model/TermsOfService.js" );
include( "js/app/com/dadc/lithium/model/MediaDetails.js" );
include( "js/app/com/dadc/lithium/model/FreeWheel_SmartXML.js" );
include( "js/app/com/dadc/lithium/model/GeoCountry.js" );
include( "js/app/com/dadc/lithium/model/Vast.js" );
include( "js/app/com/dadc/lithium/model/LocaleGenre.js" );
include( "js/app/com/dadc/lithium/model/AppConfig.js" );

include( "js/app/com/dadc/lithium/media/CrackleVideo.js" );

include( "js/app/com/dadc/lithium/util/ADManager.js" );


var UnitTests = function(){
    var m_ad_manager;
    var m_ads_ran = false;
    var m_ads_processed = false;
    var crackle_video;
    
    var This = this;
    
    this.runTests = function(){
        // SOME OBJ . RUN TESTS()
        Logger.log("i am in the tests");
        
        var featured = new FeaturedTests();
        featured.runTests();
//        var popular = new PopularTests();
//        popular.runTests();
//        var recent = new RecentTests();
//        recent.runTests();
//        var slideshow = new SlideShowTests();
//        slideshow.runTests();
//        var browse_filters = new BrowseFiltersTests();
//        browse_filters.runTests();
//        var genre_filters = new GenreFiltersTests();
//        genre_filters.runTests();
//        var browse = new BrowseTests();
//        browse.runTests();
//        var search = new SearchResultsTests();
//        search.runTests();
//        var channel_details = new ChannelDetailsTests();
//        channel_details.runTests();
//        var media_details = new MediaDetailsTests();
//        media_details.runTests();
//        var channel_folder_list = new ChannelFolderListTests();
//        channel_folder_list.runTests();
//        var terms_of_service = new TermsOfServiceTests();
//        terms_of_service.runTests();
//        var freeWheel_SmartXML = new FreeWheelModel.FreeWheel_SmartXMLRequestTests();
//        freeWheel_SmartXML.runTests();
//        var vast = new VastModel.VastTests();
//        vast.runTests();
//        var geocountry = new GeoCountryTests();
//        geocountry.runTests();
//        var localegenre = new LocaleGenreTests();
//        localegenre.runTests();

        var appConfigTests = new AppConfigTests();
        appConfigTests.runTests();

//        var media_details_request = new MediaDetailsRequest( 2485596, 'us', function( MediaDetailsObj, status){
//            m_ad_manager = new ADManager( MediaDetailsObj, null );
//            m_ad_manager.prepare();
            
////            m_ad_manager.addListener( this );
////            
//            Logger.log( 'media details request status = ' + status );
//            var video_manager_obj = new VideoManager();
//            
//            crackle_video = new CrackleVideo( MediaDetailsObj, This );
//            crackle_video.getVideoURL();
//        });
        
//        media_details_request.startRequest();
    }
    
//    this.notifyPlaybackReady = function(){
//        Logger.log( '!!!!!!!!!!! PLAYBACK READY !!!!!!!!!!!!' );
//        crackle_video.play();
//    }
//    
//    this.notifyAdReady = function(){
//        Logger.log ( '############################# AD PROCESSED #############################' );
//
//        for( var i = 0;i < m_ad_manager.getTotalAds(); i++ ){
//            Logger.log( '*** TRACKING URLS ***' );
//            if ( m_ad_manager.getAd( i ).getTrackingUrlObjs === undefined ){
//                Logger.log( 'adManager.getAd( ' + i + ' ).getTrackingUrlObjs() undefined' );
//            }else{
//                for( var x = 0; x < m_ad_manager.getAd( i ).getTrackingUrlObjs().length; x++ ){
//                    Logger.log( 'url = ' + m_ad_manager.getAd( i ).getTrackingUrlObjs()[ x ].getUrl() );
//                    Logger.log( 'type = ' + m_ad_manager.getAd( i ).getTrackingUrlObjs()[ x ].getType() );
//                    Logger.log( 'event = ' + m_ad_manager.getAd( i ).getTrackingUrlObjs()[ x ].getEvent() );
//                }
//            }
//            Logger.log( '*** IMPRESSION URLS ***' );
//            Logger.logObj( m_ad_manager.getAd( i ).getImpressionUrls() );
//            Logger.log( '*** VIDEO URL ***' );
//            Logger.log( m_ad_manager.getAd( i ).getVideoUrl() );
//        }
//    }
}
