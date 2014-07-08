var Logger = function()
{
    this.signature = "::CRACKLE:: ";

    this.log = function( message )
    {
        if( LoggerConfig.CONFIG.DISABLE_LOGS )
            return;
        
        console.log( this.signature + message );
    };
    
    this.shout = function( message )
    {
        this.log("* * * * * * * * * * * * * * * * * * * * * * *");
        this.log("* * * * * * * * * * * * * * * * * * * * * * *");
        this.log(message);
        this.log("* * * * * * * * * * * * * * * * * * * * * * *");
        this.log("* * * * * * * * * * * * * * * * * * * * * * *");
    };
    
    this.warn = function( msg )
    {
        this.log("WARN | " + msg);
    };
    
    this.critical = function( msg )
    {
        this.log("CRITICAL | " + msg);
    };
    
    this.logObj = function( obj )
    {
        if( LoggerConfig.CONFIG.DISABLE_LOGS ) return;

        if ( obj ) 
        {
            this.log( " :::::::::::::: START " + getObjectClass( obj ) + " :::::::::: "  );
            console.dir( obj );
            this.log( " :::::::::::::: END " + getObjectClass( obj ) + " :::::::::: " );
        }
        else
        {
            this.log( ' !!!!! NULL OBJECT !!!!! ');
        }
    };
    
    function getObjectClass(obj)
    {
        if (obj && obj.constructor && obj.constructor.toString)
        {
            var arr = obj.constructor.toString().match(/function\s*(\w+)/);

            if (arr && arr.length == 2)
            {
                return arr[1];
            }
        }

        return undefined;
    }    
};

// create a static instance of Logger
var Logger = new Logger();