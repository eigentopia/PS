/*
 * Wrap the functionality to send the ComScore Audience analytic.
 */

include( "js/app/com/dadc/lithium/util/md5.js" );
include( "js/app/com/dadc/lithium/util/HTTP.js" );
//include( "js/app/thirdparty/streamsense.trilithium.js");
//include( "js/app/thirdparty/streamsense.trilithium.js");

var Comscore = function(){
    var platform = engine.stats.device.platform
    var hashedDeviceID = platform+" TEST DEVICE"// CryptoJS.MD5( engine.stats.device.id );
    var comscoreId = '3000012';
    var streamsense;
    var contentPart = 0;
    var aggregatePart= 0;
    var currentTrackingObj ={};
    var baseUrl ='http://b.scorecardresearch.com/p?c1=1&c2=' + comscoreId +'&c3=crackle.com&ns_ap_device='+platform+'&ns_ap_pn=console&c12=' + hashedDeviceID;


    function sendComScoreUrl( url ){
        var headers = {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19'}}
        Http.request(url, "GET", null, headers, function(data, status){
            Logger.log("ComScore.sendComScoreUrl().onComplete() - status: " + status);
            Logger.log("ComScore.sendComScoreUrl().onComplete() - returned data:");
            Logger.logObj( data );
        })
    };

    //
    // this is the function ComScore provided, notice the changes I had to make,
    // instead of engine.loadImage(), we're calling a local function to use the httpClientObject instead
    // @param e {string} completed url with hashed device id
    // @return void
    //
    function sendComscore(e){

        console.log("COMSCORE : ComScore.udm_ url: " + e);
        var t="comScore=",n={location:{href:""},title:"",URL:"",referrer:"",cookie:""},r=n.cookie,i="",s="indexOf",o="substring",u="length",a=2048,f,l="&ns_",c="&",h,p,d,v,m=escape;
        if(r[s](t)+1)for(d=0,p=r.split(";"),v=p[u];d<v;d++)h=p[d][s](t),h+1&&(i=c+unescape(p[d][o](h+t[u])));e+=l+"_t="+ +(new Date)+l+"c="+(n.characterSet||n.defaultCharset||"")+"&c8="+m(n.title)+i+"&c7="+m(n.URL)+"&c9="+m(n.referrer),e[u]>a&&e[s](c)>0&&(f=e[o](0,a-8).lastIndexOf(c),e=(e[o](0,f)+l+"cut="+m(e[o](f+1)))[o](0,a)),
        sendComScoreUrl(e)
        ,typeof ns_p=="undefined"&&(ns_p={src:e})
    }
    // function udm_(e) {
    //     var t = "comScore=",
    //         n = {
    //             location: {
    //                 href: ""
    //             },
    //             title: "",
    //             URL: "",
    //             referrer: "",
    //             cookie: ""
    //         },
    //         r = n.cookie,
    //         i = "",
    //         s = "indexOf",
    //         o = "substring",
    //         u = "length",
    //         a = 2048,
    //         f, l = "&ns_",
    //         c = "&",
    //         h, p, d, v, m = escape;
    //     if (r[s](t) + 1)
    //         for (d = 0, p = r.split(";"), v = p[u]; d < v; d++) h = p[d][s](t), h + 1 && (i = c + unescape(p[d][o](h + t[u])));
    //     e += l + "_t=" + +(new Date) + l + "c=" + (n.characterSet || n.defaultCharset || "") + "&c8=" + m(n.title) + i + "&c7=" + m(n.URL) + "&c9=" + m(n.referrer), e[u] > a && e[s](c) > 0 && (f = e[o](0, a - 8).lastIndexOf(c), e = (e[o](0, f) + l + "cut=" + m(e[o](f + 1)))[o](0, a)), 
    //     sendComScoreUrl(e), 
//         typeof ns_p == "undefined" && (ns_p = {src: e})
    // };

    function comscoreObj (mediaDetails){
        function seFinder(){
            var seasonEpisode = ""
            if(mediaDetails.Season !== ""){
                seasonEpisode += "S" + mediaDetails.Season
            }
            if(mediaDetails.Episode !== ""){
                seasonEpisode +="E" + mediaDetails.Episode
            }

            return seasonEpisode;

        }
        var comObj =  {
            // The clip number- not set here. This is aggreate(for ads) and contentPart for content
            //ns_st_cn : "2",
            ns_st_ci : mediaDetails.ID.toString(), // Internal content id
            ns_st_pu : "Crackle", // Publisher brand name
            ns_st_pr : mediaDetails.Title, // Program title
            ns_st_ep : seFinder(), // Episode title
            // This is part number not set here- set in startPlaylist
            //ns_st_pn : "1", 
            ns_st_tp : (mediaDetails.Chapters)?mediaDetails.Chapters.length.toString():"0", // ... of 3 parts in total
            ns_st_cl : (parseInt(mediaDetails.DurationInSeconds)*1000).toString(), // Length of the stream (milliseconds) not here
            ns_st_cu : mediaDetails.PermaLink, // The clip URL
            ns_st_ct : (mediaDetails.Duration > 3600)?'vc12':'vc11', // Classification type
            c3 : "null", // Dictionary classification value
            c4 : "null", // Unused dictionary classification value
            c6 : "null" // Unused dictionary classification value
        }

        return comObj;
    }
    
    //
    // this is the called wrapper function which hashes the device ID, appends it to the url,
    // and calls the function ComScore provided us
    // @return void
    //
    function sendStartup(){
        console.log("COMSCORE : START")
        //streamsense = new ns_.StreamSense({}, "http://b.scorecardresearch.com/b?c1=19&c2=" + comscoreId + "&c4=crackle&c10=console&ns_ap_device="+ApplicationController.PLATFORM+"&c12=" + hashedDeviceID)

        Logger.log( "ComScoreModel.js - SendComScore() - called - hashed Device ID: " + hashedDeviceID );
        sendComscore( baseUrl+'&ns_st_ev=Start' );
    }

    var clips = [];

    function pickClip(time){ 

       var clip = clips.filter(function(obj, index){
            if(time >= obj.startTime && time <= obj.endTime){
                return obj
            }
        })
        
        return clip[0];
    }

    function startPlaylist(mediaObj){
        //Take the mediaDetails API JSON
        var mediaDetails = mediaObj.m_data;
        currentTrackingObj = comscoreObj(mediaDetails);

        //streamsense.setPlaylist();

        if(mediaDetails.Chapters && mediaDetails.Chapters.length){
            var chapters = mediaDetails.Chapters
            //for(var i= 0; i< chapters.length; i++){
            clips = chapters.map(function(c, i){
                var clip = Object.create(currentTrackingObj);
                clip.ns_st_pn = (i + 1).toString();
                clip.startTime = c.StartTimeInMilliSeconds
                clip.endTime = (chapters[i + 1] && chapters[i + 1].StartTimeInMilliSeconds)?chapters[i + 1].StartTimeInMilliSeconds:parseInt(mediaDetails.DurationInSeconds)*1000;
                //clips.push(clip)
                return clip;
            })

        console.log("COMSCORE : STARTING LIST CLIPS")
        console.dir(clips)
            
        }
    }

    function clearPlaylist(){
        currentMediaObj = null
        clips = [];
        contentPart = 0;
        aggregatePart = 0;
    }

    function sendClip(time){
        var clip;
        if(isNaN(time)){
            clip = Object.create(currentTrackingObj);
            clip.ns_st_ct = (time == "preroll")?"va11":"va12" //va11 - preroll, va12 - midroll, va13 - postroll.
        }
        else{
            var c = pickClip(time*1000);
            clip = Object.create(c)
        }
        
        aggregatePart += 1
        clip.ns_st_cn = (aggregatePart).toString();

        console.log("COMSCORE CLIP ******** TIME" + time*1000)
        console.dir(clip)
        console.log("******************")
        //streamsense.setClip(clip)
        var result = '';
        for(key in clip) {
            result += key + '=' + clip[key] + '&';
        }
        
        result = result.slice(0, result.length - 1); 
        
        sendComscore(baseUrl + result)

    }

    function sendPlay(pos){
        console.log("COMSCORE : Sending PLAY "+ pos)
        //streamsense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, pos)
        sendComscore(baseUrl + "&ns_st_ev=play&ns_st_pt="+pos)
    }
    function sendPause(pos){
        console.log("COMSCORE : Sending PAUSE "+ pos)
        //streamsense.notify(ns_.StreamSense.PlayerEvents.PAUSE, {}, pos)
        sendComscore(baseUrl + "&ns_st_ev=pause&ns_st_pt="+pos)
    }
    function sendEnd(pos){
        console.log("COMSCORE : Sending END "+ pos)
        //streamsense.notify(ns_.StreamSense.PlayerEvents.END, {}, pos)
        sendComscore(baseUrl + "&ns_st_ev=end&ns_st_pt="+pos)
    }

    return{
        sendStartup:sendStartup,
        startPlaylist:startPlaylist,
        sendClip:sendClip,
        clearPlaylist:clearPlaylist,
        sendPlay:sendPlay,
        sendPause:sendPause,
        sendEnd:sendEnd
    }
    
}()