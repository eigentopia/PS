include( "js/app/com/dadc/lithium/media/FreewheelAdVideo.js" );
include( "js/app/com/dadc/lithium/media/InnovidVideo.js" );

var FreewheelAdFactory = function(){
    
    this.createPlayableAd = function( ADHeaderObj, FreewheelEventCallbackHelperObj, FreewheelPlaylistObj, creativeID, renditionID, mediaObj )
    {
        Logger.log("FreewheelAdFactory.createPlayableAd()");
        Logger.log("creativeID: " + creativeID);
        Logger.log("renditionID: " + renditionID);
        
        if( ADHeaderObj.isInnovid() )
        {
            Logger.log("FreewheelAdFactory::createPlayableAd() - creating innovid video");
            return new InnovidVideo( ADHeaderObj, FreewheelEventCallbackHelperObj, FreewheelPlaylistObj, creativeID, renditionID, mediaObj );
        }

        Logger.log("FreewheelAdFactory::createPlayableAd() - creating Freewheelvideo video");
        return new FreewheelVideo( ADHeaderObj, FreewheelEventCallbackHelperObj, FreewheelPlaylistObj, creativeID, renditionID, mediaObj );

    }
}

var FreewheelAdFactoryInstance = new FreewheelAdFactory();
