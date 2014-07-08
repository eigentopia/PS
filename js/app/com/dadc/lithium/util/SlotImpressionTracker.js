/**
 * SlotImpressionTracker.js
 *
 * While a title is playing, this will keep track of slot Impressions which has already
 * fired.
 */
var SlotImpressionTracker = function()
{
    var _firedSlotImpressionList = [];
    
    // add a url to the fired impression list
    this.addFiredSlotImpression = function( url ) {
        if( typeof url === "string" )
            _firedSlotImpressionList.push( url );
        else Logger.warn("SlotImpressionTracker.addFiredSlotImpression(" + typeof url + ") invalid arg");
    };
    
    // determine if a url has been fired
    this.hasFired = function( url ) {
        if( typeof url === "string" ) {
            for( var i = 0; i < _firedSlotImpressionList.length; i++ ) {
                if( _firedSlotImpressionList[i] === url )
                    return true;
            }
            return false;
        }
        else {
            Logger.warn("SlotImpressionTracker.addFiredSlotImpression(" + typeof url + ") invalid arg");
            return false;
        }
    };
    
    // clear this tracker of all fired urls
    this.clear = function() {
        _firedSlotImpressionList.length = 0;
    };
};

SlotImpressionTracker = new SlotImpressionTracker();