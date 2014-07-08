/**
 * Browse.js - Crackle
 * @author unknown
 */

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var BrowseRequest = function( BrowseRequest_CHANNEL_NAME, BrowseRequest_FILTER_TYPE, genre_type, BrowseRequest_SORT_ORDER, geocode, callback )
{
    //SAMPLE URL http://api.crackle.com/Service.svc/browse/movies/all/Crime/date/us?format=json

    var url = ModelConfig.getServerURLRoot() + "browse/" + BrowseRequest_CHANNEL_NAME + "/" + BrowseRequest_FILTER_TYPE + "/" + genre_type + "/" + BrowseRequest_SORT_ORDER + "/" + geocode + "?format=json";
    Logger.log( "BrowseRequest URL: " + url );

    var This = this;
    var httpRequestObj;
    var apiRetries;
    var httpRetries;


    this.startRequest = function( )
    {
        httpRetries = 0;
        apiRetries = 0;
        initHttpRequest();
        httpRequestObj.start();
    }

    function initHttpRequest()
    {
        if( ModelConfig.CONFIG.DISABLE_CERT_VALIDATION )
            ModelConfig.httpClientObj.disableCertValidation( true );
        else if( ModelConfig.CONFIG.CERT_VALIDATION )
            ModelConfig.httpClientObj.setCertificateAuthority( ModelConfig.CONFIG.CERT_VALIDATION );

        // TL 1.3.3 UPDATE
        httpRequestObj = ModelConfig.httpClientObj.createRequest( "GET", url, { headers: AuthenticationInstance.getAuthorizationHeader( url ) }, null );
        httpRequestObj.onComplete = This.onRequestComplete;
    }

    this.onRequestComplete = function(  data, status )
    {
        Logger.log("Browse status = " + status );
        if ( status != 200 && httpRetries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY )
        {
            httpRetries++;
            initHttpRequest();
            httpRequestObj.start();
        }
        else if ( status != 200 && httpRetries >= ModelConfig.CONFIG.NETWORK_ERROR_RETRY )
        {
            callback( null, status );
        }
        else
        {
            try
            {
                var json_data = new Browse( JSON.parse( data ) );
                if ( json_data.getStatus().getMessageCode() != 0 && apiRetries < ModelConfig.CONFIG.API_ERROR_RETRY )
                {
                    Logger.log("in retry block");
                    apiRetries++;
                    initHttpRequest();
                    httpRequestObj.start();
                }
                else if ( json_data.getStatus().getMessageCode() != 0 && apiRetries >= ModelConfig.CONFIG.API_ERROR_RETRY )
                {
                    Logger.log("in null block");
                    callback( null, ModelConfig.API_ERROR );
                }
                else
                {
                    Logger.log("in success block");
                    callback( json_data, status );
                }
            }
            catch( e )
            {
                Logger.log( '!!! EXCEPTION !!!' );
                Logger.logObj( e );
                callback( null, ModelConfig.API_ERROR );
            }
        }
    }
}

//TESTING BATTING LEADERBOARD
var BrowseTests = function( )
{
    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var browseTests = new BrowseRequest( BrowseRequest.CHANNEL_NAME.MOVIES, 'all', 'Crime', BrowseRequest.SORT_ORDER.DATE, 'us', function( SlideShowObj ){
    // DO THE ASSERTIONS
        assertEquals( SlideShowObj.getItemList().getItem(0).getItemType(), "Channel");

    });
    browseTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var Browse = function( json_data )
{
    this.m_data = json_data;

    //CREATING OBJECTS
    var statusObj     = new BrowseStatus( this.m_data.status );
    var itemListObj   = new BrowseList( this.m_data.Entries );

    //GETTERS
    this.getStatus      = function(){return statusObj;};
    this.getItemList    = function(){return itemListObj;};
}

var BrowseStatus = function( data )
{
     this.getMessageCode                = function(){return data.messageCode;}
     this.getMessageCodeDescription     = function(){return data.messageCodeDescription;}
     this.getMessage                    = function(){return data.message;}
     this.getmessageSubCode             = function(){return data.messageSubCode;}
     this.getMessageSubCodeDescription  = function(){return data.messageSubCodeDescription;}
     this.getAdditionalInfo             = function(){return data.additionalInfo;}
}

var BrowseList = function( data )
{
    var m_browse_item_obj_array = new Array();

    var m_non_clips_item_list_obj;


    this.getTotalItems = function(){return m_browse_item_obj_array.length;}

    this.getItem = function( index ){return m_browse_item_obj_array[ index ]};

    this.getNonClipsRow = function( row_index, per_row )
    {
        var tmpArray = [];
        for( var i = row_index * per_row; i < m_non_clips_item_list_obj.length && tmpArray.length < per_row; i++ )
        {
            tmpArray.push( m_non_clips_item_list_obj[ i ] );
        }
        return tmpArray;
    }

    this.countNonClipsRows = function( per_row )
    {
        Logger.log("countNonClipsRows called");
        // BEN: THE BELOW CALL WOULD RETURN ZERO IF THERE WERE 4 ITEMS IN A ROW, THIS IS INCORRECT, SHOULD HAVE RETURNED 1. IE: "THERE IS 1 ROW OF 4 ITEMS"
        return Math.ceil( m_non_clips_item_list_obj.length / per_row );
    }

    function getNonClipsItemList()
    {
        var tmpArray = [];
        for( var i = 0; i < m_browse_item_obj_array.length; i++ )
        {
            var item = m_browse_item_obj_array[ i ];
            if( ! item.getClipsOnly() )
            {
                Logger.log("adding non-clip-item");
                tmpArray.push( item );
            }
        }
        return tmpArray;
    }

    function construct()
    {
        Logger.log("BrowseList construct() called");

        for( var i = 0;i < data.length; i++ )
            m_browse_item_obj_array[ i ] = new BrowseItem( data[ i ] );

        m_non_clips_item_list_obj = getNonClipsItemList();
    }

    construct();
}

var BrowseItem = function( data )
{
    this.getID                      = function(){return data.ID;};
    this.getItemType                = function(){return data.ItemType;};
    this.getName                    = function(){return data.Name;};
    this.getGenre                   = function(){return data.Genre;};
    this.getRating                  = function(){return data.Rating;};
    this.getReleaseYear             = function(){return data.ReleaseYear;};
    this.getDescription             = function(){return data.Description;};
    this.getClipsOnly               = function(){return data.ClipsOnly;};
    this.getChannelArtTileSmall     = function(){return data.ChannelArtTileSmall;};
    this.getChannelArtTileWide      = function(){return data.ChannelArtTileWide;};
    this.getChannelArtTileOneSheet  = function(){return data.ChannelArtTileOneSheet;};
    this.getChannelArtTileLarge     = function(){return data.ChannelArtTileLarge;};
    this.getChannelArtLandscape     = function(){return data.ChannelArtLandscape;};
    this.getChannelArt_156_156      = function(){return data.ChannelArt_156_156;};
    this.getChannelArt_208_156      = function(){return data.ChannelArt_208_156;};
    this.getChannelArt_315_236      = function(){return data.ChannelArt_315_236;};
    this.getChannelArt_185_277      = function(){return data.ChannelArt_185_277;};
    this.getDurationInSeconds       = function(){return data.DurationInSeconds;};
    this.getRootChannel             = function(){return data.RootChannel;};
    this.getRootChannelID           = function(){return data.RootChannelID;};
    this.getXItemId                 = function(){return data.XItemId;};
    this.getUserRating              = function(){return data.UserRating;};
    this.getWhyItCrackles           = function(){return data.WhyItCrackles;};
    this.getSeason              = function(){return data.Season;}
    this.getEpisode                     = function(){return data.Episode;};
}

BrowseRequest.CHANNEL_NAME =
{
    MOVIES: "movies",
    COLLECTIONS: "collections",
    TELEVISION: "television",
    ORIGINALS: "originals",
    SHOWS: "shows"
};

BrowseRequest.SORT_ORDER =
{
    DATE: 'date',
    ALPHA: 'alpha'
}

BrowseRequest.FILTER_TYPE =
{
    ALL: "all",
    FULL: "full",
    TRAILERS: "trailers",
    CLIPS: "clips",
    MINISODES: "minisodes"
};