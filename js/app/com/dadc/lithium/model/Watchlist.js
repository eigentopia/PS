// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var Watchlist = function( json_data ){
    this.m_data = json_data;
    //CREATING OBJECTS
    var itemListObj         = new WatchItemList( this.m_data );

    //GETTERS
    this.getItemList  = function(){return itemListObj;}
}


var WatchItemList = function( data ){
        var itemArray = [];

        this.getTotalItems          = function(){return itemArray.length;}
        this.getItem                = function( index ){return itemArray[ index ]};
        this.getNonClipsRow         = function( row_index, per_row ){
            var tmpArray = [];

            for( var i = row_index * per_row; i < itemArray.length && tmpArray.length < per_row; i++ ){
                tmpArray.push( itemArray[ i ] );
            }

            return tmpArray;
        }
        //GET ALL THE ITEMS
        for( var i = 0;i < data.length; i++ ){
            itemArray[ i ] = new WatchlistItem( data[ i ] );
        }

        var nonClipsItemListObj     = getNonClipsItemList();
        this.countNonClipsRows      = function( per_row ){
            return Math.ceil( nonClipsItemListObj.length / per_row );
        }

        function getNonClipsItemList(){
            var tmpArray = [];
            for( var i = 0; i < itemArray.length; i++ ){
                var item = itemArray[ i ];
                if( ! item.getClipsOnly() ){
                    console.log("**********NON CLIP " +i)
                    tmpArray.push( item );
                }
            }
            return itemArray;
        }
}

var WatchlistItem = function( data ){
    this.dataItem = data;
    this.getItemType            = function(){return data.ItemType;};
    this.getMediaType           = function(){return data.MediaType;};
    this.getID                  = function(){return data.ID;};
    this.getTitle               = function(){return data.Title;};
    this.getDescription         = function(){return data.Description;};
    this.getClipsOnly           = function(){return data.ClipsOnly;};
    this.getImageUrl1           = function(){return data.ImageUrl1;};
    this.getImageUrl2           = function(){return data.ImageUrl2;};
    this.getImageUrl3           = function(){return data.ImageUrl3;};
    this.getImageUrl4           = function(){return data.ImageUrl4;};
    this.getImageUrl5           = function(){return data.ImageUrl5;};
    this.getImageUrl6           = function(){return data.ImageUrl6;};
    this.getImageUrl7           = function(){return data.ImageUrl7;};
    this.getImageUrl8           = function(){return data.ImageUrl8;};
    this.getImageUrl9           = function(){return data.ImageUrl9;};
    this.getImageUrl10          = function(){return data.ImageUrl10;};
    this.getGenre               = function(){return data.Genre;};
    this.getRating              = function(){return data.Rating;};
    this.getDuration            = function(){return data.Duration;};
    this.getDurationInSeconds   = function(){return data.DurationInSeconds;};
    this.getUserRating          = function(){return data.UserRating;};
    this.getRootChannel         = function(){return data.RootChannel;};
    this.getRootChannelID       = function(){return data.RootChannelID; };
    this.getXItemId             = function(){return data.XItemId;};
    this.getParentChannelID     = function(){return data.ParentChannelID;};
    this.getParentChannelName   = function(){return data.ParentChannelName;};
    this.getWhyItCrackles       = function(){return data.WhyItCrackles;};
    this.getSeason              = function(){return (data.Season == "")?null:data.Season};
    this.getEpisode             = function(){return (data.Episode == "")?null:data.Episode};
}