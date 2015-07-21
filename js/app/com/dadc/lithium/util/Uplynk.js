var Uplynk = (function(){

	var self = {}
	self.adsData = {};
	self.receivedAds = false
    self.hasPreroll = false
    self.preRollDuration = 0;

	self.getAds = function(url, cb){
		//http://content.uplynk.com/preplay/ext/e8773f7770a44dbd886eee4fca16a66b/2448594.json?ad=&ad.locationDesc=_us_movies&ad.bumper=93731bf8cac142e4b99cf5844a9668dc&ad.preroll=1&extsid=1&ad.metr=7&euid=
		//http://content.uplynk.com/preplay/ext/e8773f7770a44dbd886eee4fca16a66b/2491595.json?ad=crackle_live&ad.locationDesc=crackle_apple_tv_us_movies&ad.bumper=&ad.preroll=1&extsid=1&ad.metr=7&euid="
       //http://content.uplynk.com/ext/e8773f7770a44dbd886eee4fca16a66b/2448594.m3u8?ad=&ad.locationDesc=_us_movies&ad.bumper=93731bf8cac142e4b99cf5844a9668dc&ad.preroll=1&extsid=1&ad.metr=7&euid=
        var preplayUrl = getUplynkUrl(url)
		Http.requestJSON(preplayUrl, "GET", null, {headers:""}, function(data, status){
            if(data != null && status == 200){                    
                self.adsData = data;
				preProcessAds();
                cb && cb(data, status)
            }
            else{
                cb && cb(null, status)
            }
        })
	}

    function preProcessAds() {
        var ads = self.adsData.ad_info.ads;
        
    	var adsInSlot = Array();
    	var slotIndex = 1;
    	var slot = null;
        self.preRollDuration = 0;

    	for (var i = 0; i < ads.length; i++) {
    	    var ad = ads[i];
            if(ad.slot = 'pre'){
                console.log('preSLot duration '+  ad.duration)
                self.hasPreroll = true;
                //weird condition- slot can be labeled as pre but have a later start time?
                if(ad.start_time == self.preRollDuration){
                    self.preRollDuration += ad.duration
                }
            }
    	    //console.log(JSON.stringify(ad))
    		if (slot != ad.slot) {
    			for (var j = 0; j < adsInSlot.length; j++) {
    				adsInSlot[j]["slotCount"] = adsInSlot.length;
    			}

    			slot = ad.slot;
    			slotIndex = 1;
    			adsInSlot = Array();
    		}

    		ad["slotIndex"] = slotIndex++;
    		adsInSlot.push(ad);
    	}

    	for (var j = 0; j < adsInSlot.length; j++) {
    		adsInSlot[j]["slotCount"] = adsInSlot.length;
    	}

    	self.receivedAds = true;
    }

    function getUplynkUrl(url){
    	var urlArray = url.split('/')

		var newUrl = urlArray[2] +"/preplay/"+ urlArray[3] +"/"+ urlArray[4]+"/"

		var urlToJson = urlArray[5].replace(".m3u8?", ".json?")

        var idJson = urlToJson.substring(0, urlToJson.indexOf("?")+1)

        newUrl += urlToJson

    	return "http://" + newUrl +"&hlsver=4"

    }

    return self
}())
