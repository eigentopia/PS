 var VideoProgressManager = function( storage_manger_instance_obj ){
    var m_storage_manger_instance_obj = storage_manger_instance_obj;
    
    this.getProgress = function( media_id ){
        Logger.log( 'GETTING MEDIA ID ' + media_id + ' PROGRESS: ' + m_storage_manger_instance_obj.get( 'video_progress_' + media_id ) );
        
        return m_storage_manger_instance_obj.get( 'video_progress_' + media_id );
    }
    this.setProgress = function( media_id, progress){
        Logger.log( 'SETTING MEDIA ID ' + media_id + ' PROGRESS TO ' + VideoManagerInstance.getCurrentVideoTime() );
        
        
        m_storage_manger_instance_obj.set( 'video_progress_' + media_id, progress );
        ApplicationController.setPauseResumePoint(media_id, progress);
    }
}

VideoProgressManagerInstance = new VideoProgressManager( StorageManagerInstance );