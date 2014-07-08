// TTMLSubtitle namespace
var TTMLSubtitle = function(){}

/**
 * Parse a TTML subtitle and returns a Subtitles object
 * 
 * @params data XML parsed TTML data
 */
TTMLSubtitle.createSubtitles = function( data ){
    var body_node;
    var tmp = data.getElementsByTagName( 'body' );
    var m_subtitles = new TTMLSubtitle.Subtitles();

    function parseTime( time ){
        return time;
    }

    function getText( node ){
        var text = "";

        if ( node.nodeType == 3 ){
            text += node.nodeValue;
        }
        if ( node.nodeName == 'br' ){
            text += TTMLSubtitle.CONFIG.BREAK_LINES;
        }
        
        for( var i = 0; i < node.childNodes.length; i++ ){
            text += getText( node.childNodes[ i ] );
        }

        return text;
    }

    // we should have only one body
    if ( tmp.length == 1 ){
        body_node = tmp[ 0 ];
    }

    // get all Ps
    var ps = body_node.getElementsByTagName( 'p' );

    // loop through all Ps
    for( var i in ps ){
        var p = ps[ i ];
        var p_begin;
        var p_end;
        var p_text = "";

        if ( p.attributes.begin && p.attributes.end ){
            p_begin = parseTime( p.attributes.begin );
            p_end = parseTime( p.attributes.end );

            for ( var n = 0; n < p.childNodes.length; n++ ){
                p_text += getText( p.childNodes[ n ] );
            }
            m_subtitles.addLine( TTMLSubtitle.parseTime( p_begin ), TTMLSubtitle.parseTime( p_end ), p_text );
        }
    }
    
    return m_subtitles;
}    

TTMLSubtitle.createSubtitlesM4T = function( dataArray ){
    var m_subtitles = new TTMLSubtitle.Subtitles();
    
    function getText( node ){
        var text = "";

        if ( node.nodeType == 3 ){
            text += node.nodeValue;
        }
        if ( node.nodeName == 'br' ){
            text += TTMLSubtitle.CONFIG.BREAK_LINES;
        }
        
        for( var i = 0; i < node.childNodes.length; i++ ){
            text += getText( node.childNodes[ i ] );
        }

        return text;
    }
    
    for (var j = 0; j < dataArray.length; j++) {
        var data = dataArray[j];
        var body_node_array = data.getElementsByTagName( 'body' );
        var body_node = body_node_array[0];
        var ps = body_node.getElementsByTagName( 'p' );
        
        var begin = "00:00:00:00";
        var end = "00:00:00:00";
        var text = "";
        
        for( var i in ps ){
            var p = ps[ i ];
            var p_begin;
            var p_end;
            var p_region;

            if ( p.attributes.begin && p.attributes.end && p.attributes.region ){
                p_begin = p.attributes.begin;
                p_end = p.attributes.end;
                p_region = p.attributes.region;
                p_text = getText(p);
                
                if (p_region == "pop1") {
                    m_subtitles.addLine( TTMLSubtitle.parseTime( begin ), TTMLSubtitle.parseTime( end ), text );
                    begin = p_begin;
                    end = p_end;
                    text = p_text; 
                }
                else text += "<br>" + p_text;  
            }
        }
        
        m_subtitles.addLine( TTMLSubtitle.parseTime( begin ), TTMLSubtitle.parseTime( end ), text );
        
    }

    return m_subtitles;
}    
TTMLSubtitle.parseTime = function( time ){
    var time_split = time.split(':');
    
    var hour    = parseFloat( time_split[ 0 ] );
    var minute  = parseFloat( time_split[ 1 ] );
    var second  = parseFloat( time_split[ 2 ] );
    var frame;
    
    if ( time_split.length > 3 ){
        frame   = parseFloat( time_split[ 3 ] );
    }else{
        frame = 0;
    }
    
    var seconds = hour * 3600 + minute * 60 + second;
    
    return {hour: hour, minute: minute, second: second, seconds: seconds, frame: frame};
}

/**
 * Subtitles Class
 */
TTMLSubtitle.Subtitles = function(){
    var m_subtitle_lines = [];

    this.getSubtitleLines = function(){return m_subtitle_lines;}
    
    this.getSubtitleBetween = function( start_seconds, end_seconds ){
        for ( var i in m_subtitle_lines ){
            var sec_begin = m_subtitle_lines[ i ].getBegin().seconds;
            var sec_end = m_subtitle_lines[ i ].getEnd().seconds;
            
            if ( sec_begin <= start_seconds && sec_end >= end_seconds ){
                return m_subtitle_lines[ i ];
            }
        }
        
        return null;
    }
    

    this.addLine = function( begin, end, text ){
        var subtitle_line = new TTMLSubtitle.SubtitleLine( begin, end, text );
        m_subtitle_lines.push( subtitle_line );
    }
}

/**
 * SubtitleLine class
 */
TTMLSubtitle.SubtitleLine = function( begin, end, text ){
    var m_begin = begin;
    var m_end = end;
    var m_text = text;

    this.getBegin = function(){return m_begin;}
    this.getEnd = function(){return m_end;}
    this.getText = function(){return m_text;}
}
    
TTMLSubtitle.SubtitleText = function( text, style, alignment ){

}

TTMLSubtitle.CONFIG = {
    BREAK_LINES: '<br>'
}