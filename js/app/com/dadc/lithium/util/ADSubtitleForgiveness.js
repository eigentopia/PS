// MILAN: ON CHANGE SUBTITLE AD FORGIVENESS
var ADSubtitleForgiveness = function(){
    var m_timer = null;
    var m_media_details_id = null;
    
    this.startTimer = function(media_details_id){
        m_timer = engine.getTimer();
        m_media_details_id = media_details_id;
        Logger.log( 'startTimer called in ADSubtitleForgiveness' );
        Logger.log( 'm_timer = ' + m_timer );
        Logger.log( 'm_media_details_id = ' + m_media_details_id );
    }
    
    this.shouldPlayAds = function( forgiveness_in_seconds, media_details_id ){
        return false

        // if(engine.storage.local.userEmailAddress && engine.storage.local.userEmailAddress == "eigenstates@yahoo.com" ){
        //     return false
        // }
        var current_timer = engine.getTimer();
        
        Logger.log( 'shouldPlayAds called in ADSubtitleForgiveness' );
        Logger.log( 'current_timer = ' + current_timer );
        Logger.log( 'm_timer = ' + m_timer );
        Logger.log( 'm_media_details_id = ' + m_media_details_id );
        
        if( m_timer == null || m_media_details_id == null || m_media_details_id != media_details_id || (m_media_details_id == media_details_id && current_timer > m_timer + forgiveness_in_seconds) ){
            m_timer == null
            return true;
        }else{
            return false;
        }
    }
}

var ADSubtitleForgivenessInstance = new ADSubtitleForgiveness();