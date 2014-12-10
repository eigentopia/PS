/**
 * ADForgiveness.js
 * (c) 2013 sony DADC
 *
 * @author unknown, modified by Daniel Cuccia
 *
 * singleton to manage logic for skipping advertisements
 */

var ADForgiveness = function()
{
    var m_timer = null;
    var m_adHasPlayed = false;
    var m_isCounting = false;
    var self = this;

    /** flag that an advertisement has played, startTimer() will now actually start the timer */
    this.flagAdvertisement = function()
    {
	   m_adHasPlayed = true;
    };

    /** get current time for future reference */
    this.startTimer = function()
    {

    	//DAN: now that crackleVideo calls this, don't actually start counting unless an advertisement has played
    	if( m_adHasPlayed === false ) return;
    	if( m_isCounting === true ) return;

        m_timer = engine.getTimer();
	    m_isCounting = true;
        Logger.log( "ADForgiveness.startTimer() | timer: " + m_timer );
    };

    this.podComplete = false;

    /**
     * determine if an ad may be skipped
     * @param forgiveness_in_seconds {number}
     * @return {boolean} true: play the ad, false: skip the ad
     */
    this.shouldPlayAds = function( forgiveness_in_seconds )
    {
        //return false;
        // if(engine.storage.local.userEmailAddress && engine.storage.local.userEmailAddress == "eigenstates@yahoo.com" ){
        //     return false
        // }
        var current_timer = engine.getTimer();
        Logger.log( "ADForgiveness | timer: " + m_timer + ", current time: " + current_timer + ", forgiveness_in_seconds: " + forgiveness_in_seconds);

        if(self.podComplete == true){
            console.log("*************~*~*~*~*~*~*~* podComplete " + self.podComplete)
            self.podComplete = false
            return false;
        }

        if( m_timer === null || current_timer > m_timer + forgiveness_in_seconds/*always 30*/ )
	    {
            m_timer = null;
	        m_adHasPlayed = true;
	        m_isCounting = false;
            return true;
        }
	    else
	    {
            return false;
        }
    };
}

var ADForgivenessInstance = new ADForgiveness();
