
var ImageManager = function(){
    
    var m_images = {};
    var m_waiting_stack = new Array(); // VARIABLE SIZED STACK OF JSImage objects
    var m_queued_stack = new Array();
    var MAX_QUEUE_SIZE = 5;
    
    /** @returns JSImage */
    this.requestImage = function( image_url ){
        var image = new JSImage( image_url );
        m_waiting_stack.push( image );
        return image;
//        if( m_images[ image_url ] == null ){
//            m_images[ image_url ] = new JSImage( image_url );
//            m_waiting_stack.push( m_images[ image_url ] );
//        }
//        return m_images[ image_url ];
    }
    
    // FROM HERE WE WILL MANAGE THE QUEUE: CLEAN UP, APPENDING, IDLEING
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ImageManager update() ' + engine_timer );
        // IF NO IMAGES ARE WAITING TO BE PROCESSED, RETURN, THERE'S NO MORE STACK SHIFTING TO BE DONE AS OF NOW
        if( m_waiting_stack.length == 0 ){
            //Logger.log("* * * * * * * * * * * * NO MORE IMAGES WAITING TO BE QUEUED. * * * * * * * * * ");
            return;
        } 
        
        // CLEAN UP THE QUEUE STACK TO REMOVE IMAGES THAT ARE IN THE READY STATE (THOSE IMAGES WOULD HAVE NOTIFIED LISTENERS ALREADY)
        var still_queued_stack = new Array();
        while( m_queued_stack.length > 0 ){
            var tmp_js_image = m_queued_stack.pop();
            // IF IT IS STILL IN QUEUED STATE, KEEP IT IN THE STILL QUEUED STACK. READY/FAILED/DEAD IMAGES WILL ESSENTIALLY BE DROPPED
            if( tmp_js_image.getStatus() == ImageManager.IMAGESTATUS.QUEUED )
                still_queued_stack.push( tmp_js_image );
        }
        
        // MOVE THE STILL QUEUED IMAGES BACK INTO THE NORMRAL QUEUE STACK
        while( still_queued_stack.length > 0 )
            m_queued_stack.push( still_queued_stack.pop() );
        
        // IF THE QUEUED STACK IS STILL TOO FULL, RETURN AND WAIT FOR NEXT UPDATE CALL
        if( m_queued_stack.length >= MAX_QUEUE_SIZE ){
            //Logger.log("stack is still maxed out at " + m_queued_stack.length + ", will not add more items" );
            return;
        } 
        
        // IF NOT FULL, ADD MORE IMAGES TO THE QUEUE AND QUEUE 'EM UP
        var queue_size = m_queued_stack.length;
        Logger.log("queue is under-full, will add " + (MAX_QUEUE_SIZE - queue_size) + " more items:");
        for( var i = queue_size; i < MAX_QUEUE_SIZE; i++ ){
            var p_js_image = m_waiting_stack.shift();
            // IF NO JSImage WAS SHIFTED OFF, RETURN.
            if( p_js_image == undefined || p_js_image == null ) return;
            // IF A JSImage WAS SHIFTED OFF, QUEUE IT UP!
            p_js_image.queueImageRequest();
            m_queued_stack.push( p_js_image );
            //Logger.log("added image @ url: " + p_js_image.getImageURL() );
        }
    }
    
}

ImageManager.IMAGESTATUS = {
    WAITING: 2,
    QUEUED: 3,
    READY: 1,
    FAILED: -1
}

/** IMAGE LIFECYCLE: WAITING --> QUEUED --> READY --> DESTROYED :( */
var JSImage = function( image_url ){
    
    var This = this;
    var MAX_REQUEST_ATTEMPTS = 3;
    var m_status = ImageManager.IMAGESTATUS.WAITING;
    var m_image_ready_listeners = new Array();
    var m_image = null;
    var m_error_message;
    var m_request_attempts = 0;
    
    this.getStatus = function(){ return m_status; }
    this.getImageURL = function(){ return image_url; }
    this.getTexture = function(){ return ( m_image == null ) ? null : m_image.shader.texture; }
    this.getErrorMessage = function(){ return m_error_message; }
    this.getRawImage = function(){ return m_image; }
    this.queueImageRequest = function(){ 
        if(image_url == null){
            return
        }
        // UPDATE THE STATUS, INCREMENT OUR REQUEST ATTEMPTS
        m_status = ImageManager.IMAGESTATUS.QUEUED;
        m_request_attempts++;
                        
        // QUEUE THE IMAGE (REQUEST IT)
        engine.loadImage( 
            image_url, 
            function( ImageObj ){ // ON SUCCESS
                m_image = ImageObj;
                m_status = ImageManager.IMAGESTATUS.READY;
                notifyListeners();
            },
            function( error_msg ){ // ON FAILURE
                // TRY AGAIN
                Logger.log("* * * * * ERROR LOADING IMAGE! " + image_url );
                if( m_request_attempts < MAX_REQUEST_ATTEMPTS ){
                    This.queueImageRequest();
                // IF ALREADY TRIED ENOUGH, THEN KNOCK IT OFF
                }else{
                    m_error_message = error_msg;
                    m_status = ImageManager.IMAGESTATUS.FAILED;
                    notifyListeners();
                }
            }
        );
    }

    /** DEVELOPER NOTE: listeners must implement: ".notifyJSImageUpdated( JSImageObj )" in order to properly listen */
    this.addImageReadyListener = function( ImageReadyListenerObj ){
        m_image_ready_listeners.push( ImageReadyListenerObj );
    }
    
    function notifyListeners(){
        for( var i = 0; i < m_image_ready_listeners.length; i++ ){
            try{
                m_image_ready_listeners[ i ].notifyJSImageUpdated( This );
            }catch( e ){
                Logger.logObj( e );
            }
        }
    }
    
}

var ImageManagerInstance = new ImageManager();