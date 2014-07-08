
include( "js/app/com/dadc/lithium/Engine.js" );

engine.onLoad = EngineInstance.init;

//engine.onLoad = function(screen){
////    var mp4cfg = {
////        "content-type":"video/mp4",
////        "transfer-type":"progressive-download",
////        "encryption-type":"none"
////    };
////   var thisVideo = "temp.mp4";
////   var thisVideo = "http://media-br-am.crackle.com/1/h/r6/6evlf_360p.mp4";
////   var thisVideo = "http://http.tidaltv.com/DSPMedia/10/1121/HVNATW30000H_HusqvarnaTamingTheWild_30_Roku_MP4.mp4";
////   
//
////   var thisVideo = "http://mediacrackle3-i.akamaihd.net/i/1/z/al/hd3wb_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8";    // US
////   var thisVideo = "http://crk_es_am_ios-i.akamaihd.net/i/1/i/x0/ctgyk_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8";    // MX
////   var thisVideo = "http://crk_br_am_ios-i.akamaihd.net/i/1/t/n6/85ulf_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8";    // BR
//
//   var thisVideo = "http://mediacrackle3-i.akamaihd.net/i/1/z/al/hd3wb_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8?__b__=100&__a__=off";    // US
////   var thisVideo = "http://crk_es_am_ios-i.akamaihd.net/i/1/i/x0/ctgyk_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8?__b__=100&__a__=off";    // MX
////   var thisVideo = "http://crk_br_am_ios-i.akamaihd.net/i/1/t/n6/85ulf_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8?__b__=100&__a__=off";    // BR
//
////   var thisVideo = "http://mediacrackle3-i.akamaihd.net/i/1/z/al/hd3wb_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8?__b__=500&__a__=off";    // US
////   var thisVideo = "http://crk_es_am_ios-i.akamaihd.net/i/1/i/x0/ctgyk_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8?__b__=500&__a__=off";    // MX
////   var thisVideo = "http://crk_br_am_ios-i.akamaihd.net/i/1/t/n6/85ulf_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8?__b__=500&__a__=off";    // BR
//
////    var videos = {
////        US: "http://mediacrackle3-i.akamaihd.net/i/1/z/al/hd3wb_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8",
////        MX: "http://crk_es_am_ios-i.akamaihd.net/i/1/i/x0/ctgyk_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8",
////        BR: "http://crk_br_am_ios-i.akamaihd.net/i/1/t/n6/85ulf_H264_IOS_,100BR,200BR,350BR,500BR,650BR,800BR,900BR,.mp4.csmil/master.m3u8"    
////    }
//    
//    
//    var video = engine.createVideo({});
//
//    for (i = 0; i < 10; i++) {
//        var opened = video.open(thisVideo);
//        console.log((i + 1) + ". is open: " + opened);
//        if(opened) break;
//    }
//
//    screen.addChild(video);
//
//    video.width = 1920;
//    video.height = 1080;
//
//    video.onTimeUpdate = function(){
//        console.log("onTimeUpdate");
//    };
//    video.onPlaying = function(){
//        console.log("onPlaying");
//    };
//    video.onStalled = function(){
//        console.log("onStalled");
//    };
//    video.onError = function(){
//        console.log("onError");
//    };
//    video.onEnded = function(){
//        console.log("onEnded");
//    };
//    video.onBitrate = function(){
//        console.log("onBitrate");
//    };
//
//    video.play();
//    
//    console.log("END");
//};