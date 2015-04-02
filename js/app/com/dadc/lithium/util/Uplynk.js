var Uplynk = (function(){

	var self = {}
	self.adsData;
	self.receivedAds = false

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

    	for (var i = 0; i < ads.length; i++) {
    	    var ad = ads[i];
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

        // var qs = urlToJson.substring(urlToJson.indexOf("?")+1).split('&');
        // var newQs ="" ; 
        // var pair;
        // for (var i = qs.length - 1; i >= 0; i--) {
        //     pair = qs[i].split('=');
        //     if(pair[0] == "ad"){
        //         pair[1] = "crackle_live"
        //     }
        //     else if (pair[0] == "ad.locationDesc"){
        //         pair[1] = "crackle_apple_tv"+pair[1]
        //     }

        //     if(i==0){
        //         newQs += pair[0]+"="+pair[1]
        //     }
        //     else{
        //         newQs += pair[0]+"="+pair[1]+"&"
        //     }
        //     //qsParams[d(pair[0])] = d(pair[1]);
        // }

		//newUrl += idJson + newQs;
        newUrl += urlToJson

    	return "http://" + newUrl

        //return __url;

        //return "http://content.uplynk.com/preplay/ext/e8773f7770a44dbd886eee4fca16a66b/2493775.json?ad=crackle_live&ad.locationDesc=crackle_apple_tv_us_shows&ad.bumper=&ad.preroll=1&extsid=1&ad.metr=7&euid="
    }

    return self
}())
/*
///////////////////////
    // ad events
    	var ads = this.adsData.ads;
    	var inAd = false;
    	for (var i = 0; i < ads.length; i++) {
    	    var ad = ads[i];
    		if (timeIntervalSec >= ad.start_time && ad["event_sent"] !== true) {
    			this.trackEvent({
    				EventName: "VideoAdStart",
    				MediaID: crackle.getMediaID(),
    				ProgressInSeconds: timeIntervalSec,
    				AdID: ad.ad_id,
    				AdSlot: ad.slot,
                    AdIndex:ad.slotIndex
    			});
    			ad["event_sent"] = true;
    		}

    		if (this.lastFFwdStart === null && timeIntervalSec >= ad.start_time && timeIntervalSec <= ad.end_time) {
				// Not showing ad timer for now while Uplynk fixes timing issues
    			//this.setTimerOverlay(ad, timeIntervalSec);
    			inAd = true;
    			this.showingAdTimer = true;
    		}
    	}
    	//console.log("AFTER AD " + inAd +" " + this.showingAdTimer)
    	if (!inAd && this.showingAdTimer) {
    	    

    	    this.setCrackleBugOverlay();
    		this.showingAdTimer = false;
    		this.playerResumeAfterAd()
			// set playhead to desired position after ads are over
    		if (this.positionAfterAd !== null) {
                
    			atv.player.playerSeekToTime(this.positionAfterAd);
    			this.positionAfterAd = null;
    			
    		}
    	}
/////////////////////////

/////////////////
    	    		var slots = this.adsData.slots;
    		for (var i = 0; i < slots.length; i++) {
    			var slot = slots[i];
    			if (timeIntervalSec >= (slot.startTime - 2) && timeIntervalSec <= slot.endTime) {
    				crackle.log("Action denied");
    				return false;
    			}
    		}

///////////

///////////////////////////////// this may be taken care of on the Uplynk side

    		    	if (this.lastFFwdStart !== null) {
    		var slots = this.adsData.slots;

			// iterate backwards so we pick the last ad the user skipped instead of the first
    		for (var i = slots.length - 1; i >= 0; i--) {
    			var slot = slots[i];

				// for now just rewinding if user stops right in the middle of an ad
    			if (timeIntervalSec >= slot.startTime && timeIntervalSec <= slot.endTime) {
    				this.lastFFwdStart = null;
    				crackle.log("FFwd through ad, resetting play head to: " + slot.startTime);
    				return slot.startTime;
    			}
    		}
    	}

    	this.lastFFwdStart = null;
    	return timeIntervalSec;	
//////////////
}

{
prefix: "http://content-ause4.uplynk.com",
interstitialURL: "http://content-ause4.uplynk.com/session/appletvints/1cff092816fb47c18241aca3164b481a.xml",
ad_info: {
duration: 9401.69,
slots: [
{
start_time: 0,
endTime: 30.05866666666666,
id: "pre",
startTime: 0,
end_time: 30.05866666666666
},
{
start_time: 948.8515416666692,
endTime: 1024.0467291666694,
id: "mid0",
startTime: 948.8515416666692,
end_time: 1024.0467291666694
},
{
start_time: 1731.2165208333183,
endTime: 1806.6182708333165,
id: "mid1",
startTime: 1731.2165208333183,
end_time: 1806.6182708333165
},
{
start_time: 2347.5889374999697,
endTime: 2422.960312499968,
id: "mid2",
startTime: 2347.5889374999697,
end_time: 2422.960312499968
},
{
start_time: 3148.165645833283,
endTime: 3269.6573749999466,
id: "mid3",
startTime: 3148.165645833283,
end_time: 3269.6573749999466
},
{
start_time: 3698.3720416666024,
endTime: 3773.5672291666006,
id: "mid4",
startTime: 3698.3720416666024,
end_time: 3773.5672291666006
},
{
start_time: 4372.927229166617,
endTime: 4448.328979166623,
id: "mid5",
startTime: 4372.927229166617,
end_time: 4448.328979166623
},
{
start_time: 4869.61947916666,
endTime: 4959.768916666669,
id: "mid6",
startTime: 4869.61947916666,
end_time: 4959.768916666669
},
{
start_time: 5583.22508333339,
endTime: 5704.862875000067,
id: "mid7",
startTime: 5583.22508333339,
end_time: 5704.862875000067
},
{
start_time: 6346.366875000123,
endTime: 6421.719500000129,
id: "mid8",
startTime: 6346.366875000123,
end_time: 6421.719500000129
},
{
start_time: 7167.976875000195,
endTime: 7258.4644375002035,
id: "mid9",
startTime: 7167.976875000195,
end_time: 7258.4644375002035
},
{
start_time: 7841.167062500255,
endTime: 7962.658791666932,
id: "mid10",
startTime: 7841.167062500255,
end_time: 7962.658791666932
},
{
start_time: 8681.442791666996,
endTime: 8771.777375000336,
id: "mid11",
startTime: 8681.442791666996,
end_time: 8771.777375000336
},
{
start_time: 9508.660416667068,
endTime: 9584.062166667072,
id: "mid12",
startTime: 9508.660416667068,
end_time: 9584.062166667072
}
],
ads: [
{
slot: "pre",
index: 0,
ad_id: "7017734",
start_time: 0,
asset_id: "f66692477a4440a091bbd4b87b797318",
end_time: 30.06,
duration: 30,
external_id: "7017734",
clicks: [
"http://log.adaptv.advertising.com/log?3a=click&d3=&25=208514&eb=&6c=&5=313819&14=&2=313820&37=2886510&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=horizonmediajackinthebox&5b=&18=56731&2e=crackle.com&2f=&30=crackle.com&31=&32=1&90=&86=&83=&82=&af=&80=1413727337217467955&42=false&8f=&41=&21=&1b=&76=&77=501062313&67=&d6=1be03834-56a2-497d-9502-2232f7f802ca&bf=0&74=ah&ed=&d5=1&d8=ip-10-49-136-155&ae=&8e=-1&f0=-1&68=-1&d7=&c0=&c4=0&c5=0&92=&93=&ef=&91=ONLINE_VIDEO&45=54.164.79.115&ee=Windows+7&b5=-1&33=98061209&a.pub_id=&f3=&f1=&f2=&a.cv=1&rUrl=http%3A%2F%2Fad.doubleclick.net%2Fddm%2Fclk%2F284587509%3B111572917%3Br",
"http://conversions.adaptv.advertising.com/conversion/wc?adSourceId=313819&bidId=&afppId=313820&creativeId=208514&exSId=2886510&marketplaceId=&key=horizonmediajackinthebox&a.pvt=0&a.rid=1be03834-56a2-497d-9502-2232f7f802ca&a.pub_id=&eov=98061209&a.click=true",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7017734&reid=3389436&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=0&cr="
]
},
{
slot: "mid0",
index: 0,
ad_id: "7017736",
start_time: 948.85,
asset_id: "f66692477a4440a091bbd4b87b797318",
end_time: 978.91,
duration: 30,
external_id: "7017736",
clicks: [
"http://log.adaptv.advertising.com/log?3a=click&d3=&25=208514&eb=&6c=&5=313819&14=&2=313820&37=2886510&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=horizonmediajackinthebox&5b=&18=56731&2e=crackle.com&2f=&30=crackle.com&31=&32=1&90=&86=&83=&82=&af=&80=1413727337217467955&42=false&8f=&41=&21=&1b=&76=&77=501062313&67=&d6=b3cf22de-a23a-4a27-9800-f99e63f97cd3&bf=0&74=ah&ed=&d5=1&d8=ip-10-49-138-250&ae=&8e=-1&f0=-1&68=-1&d7=&c0=&c4=0&c5=0&92=&93=&ef=&91=ONLINE_VIDEO&45=54.164.79.115&ee=Windows+7&b5=-1&33=61453014&a.pub_id=&f3=&f1=&f2=&a.cv=1&rUrl=http%3A%2F%2Fad.doubleclick.net%2Fddm%2Fclk%2F284587509%3B111572917%3Br",
"http://conversions.adaptv.advertising.com/conversion/wc?adSourceId=313819&bidId=&afppId=313820&creativeId=208514&exSId=2886510&marketplaceId=&key=horizonmediajackinthebox&a.pvt=0&a.rid=b3cf22de-a23a-4a27-9800-f99e63f97cd3&a.pub_id=&eov=61453014&a.click=true",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7017736&reid=3389436&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=918&cr="
]
},
{
slot: "mid0",
index: 1,
ad_id: "7653774",
start_time: 978.91,
asset_id: "00606b03f368439bbf71a0104f950407",
end_time: 993.93,
duration: 15,
external_id: "7653774",
clicks: [
"http://adclick.g.doubleclick.net/pcs/click?xai=AKAOjsuV_tP2lpUmXyXSbqI9XMQkNdN00EfIR-r7q1aG6TWp_CAT3hEgXxZKIKerCdLMKisOWxYpkYlKHJqYJo9skAfw6eC7_Tj5Qqn9ww5ZsQglmb5awtxX&sig=Cg0ArKJSzKgGWAjy_2QAEAE&adurl=http://www.geico.com/landingpage/r/go1/%3Fsoa%3D01366%26zip%3D%26dclid%3D%25edclid!",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7653774&reid=3578210&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=918&cr="
]
},
{
slot: "mid0",
index: 2,
ad_id: "7097007",
start_time: 993.93,
asset_id: "6d75320b31e04d52ba139e1d4022896c",
end_time: 1024.05,
duration: 30,
external_id: "7097007",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7097007&reid=3350811&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=918&cr="
]
},
{
slot: "mid1",
index: 0,
ad_id: "8449837",
start_time: 1731.22,
asset_id: "ca3811286dfb4fe29436621032041714",
end_time: 1761.38,
duration: 30,
external_id: "8449837",
clicks: [
"http://analytics.bluekai.com/site/16411?phint=event%3Dclick&phint=aid%3D600027&phint=pid%3D157115&phint=vid%3D900822&phint=cid%3D421369&phint=crid%3D510288]&phint=coid%3D404863&done=https://ad.doubleclick.net/ddm/trackclk/N2998.crackle/B8431518.113997192;dc_trk_aid=287187504;dc_trk_cid=61066851",
"http://spc--cebeggpgafegfffepejfcghg--vast2lin.telemetryverification.net/ps3/SOURCEID_102__TV2NSPID_pse1BAfoPdUEOYbg__TAGTIM_1420953257__ADCGUID_pse1Bx7aAkAPpoZAXs__SID_4104564298223275237__TV2NCURL_pse1httpx3ax2fx2fanalx79ticsx2ebluekaix2ecomx2fsitex2f16411x3fphintx3deventx253Dclickx26phintx3daidx253D600027x26phintx3dpidx253D157115x26phintx3dvidx253D900822x26phintx3dcidx253D421369x26phintx3dcridx253D510288x5dx26phintx3dcoidx253D404863x26donex3dhttpsx3ax2fx2fadx2edoubleclickx2enetx2fddmx2ftrackclkx2fN2998x2ecracklex2fB8431518x2e113997192x3bdcx5ftrkx5faidx3d287187504x3bdcx5ftrkx5fcidx3d61066851__ITM_3/pse1/blank.gif?cb=[timestamp]",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8449837&reid=3595634&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=1625&cr="
]
},
{
slot: "mid1",
index: 1,
ad_id: "8601675",
start_time: 1761.38,
asset_id: "9c55a6708c2b49ea8246163c2b44d8c4",
end_time: 1776.46,
duration: 15,
external_id: "8601675",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8601675&reid=3578200&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=1625&cr=http%3A//www.attinnovators.com/"
]
},
{
slot: "mid1",
index: 2,
ad_id: "3513287",
start_time: 1776.46,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 1806.62,
duration: 30,
external_id: "3513287",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=73e32b56-65eb-4cd8-bef7-6c23d19e57a0&rand=1564318215&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=3513287&reid=2418836&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=1625&cr="
]
},
{
slot: "mid2",
index: 0,
ad_id: "7258739",
start_time: 2347.59,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 2377.75,
duration: 30,
external_id: "7258739",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=8897668f-f556-4d24-a777-7f75c211be1e&rand=2041467652&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7258739&reid=3265501&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=2166&cr="
]
},
{
slot: "mid2",
index: 1,
ad_id: "3761759",
start_time: 2377.75,
asset_id: "4fdab7b245da45f9a986fe46c0f6a556",
end_time: 2392.8,
duration: 15,
external_id: "3761759",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=3761759&reid=3267825&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=2166&cr=http%3A//www.crackle.com/c/sports-jeopardy"
]
},
{
slot: "mid2",
index: 2,
ad_id: "7258658",
start_time: 2392.8,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 2422.96,
duration: 30,
external_id: "7258658",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=68038470-576d-424f-8216-e2b4eaab2a39&rand=1369598896&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7258658&reid=3265464&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=2166&cr="
]
},
{
slot: "mid3",
index: 0,
ad_id: "8341821",
start_time: 3148.17,
asset_id: "a7ca2c6038fa4229b33576e829b9d073",
end_time: 3178.08,
duration: 30,
external_id: "8341821",
clicks: [
"http://service.innovid.com/vclk/index.php?project_hash=1hjil1&client_id=81&video_id=49315&channel_id=53499&publisher_id=25&placement_tag_id=0&project_state=2&r=1421099232807&placement_hash=1hnho9&action=clktru&click=http%3A%2F%2Fad.doubleclick.net%2Fddm%2Fclk%2F285122873%3B113801433%3Bx",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8341821&reid=3580213&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=2892&cr="
]
},
{
slot: "mid3",
index: 1,
ad_id: "7155154",
start_time: 3178.08,
asset_id: "8aab1c898eef4be6b2412308b243434a",
end_time: 3223.87,
duration: 46,
external_id: "7155154",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7155154&reid=3597215&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=2892&cr=http%3A//ad.doubleclick.net/ddm/trackclk/N3271.131459CRACKLE.COM/B8264630.112121661%3Bdc_trk_aid%3D285169672%3Bdc_trk_cid%3D59774677"
]
},
{
slot: "mid3",
index: 2,
ad_id: "7155110",
start_time: 3223.87,
asset_id: "8aab1c898eef4be6b2412308b243434a",
end_time: 3269.66,
duration: 46,
external_id: "7155110",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7155110&reid=3597216&arid=0&auid=&cn=defaultClick&et=c&_cc=&tpos=2892&cr=http%3A//ad.doubleclick.net/ddm/trackclk/N3271.131459CRACKLE.COM/B8264630.112121404%3Bdc_trk_aid%3D285169672%3Bdc_trk_cid%3D59774677"
]
},
{
slot: "mid4",
index: 0,
ad_id: "7017736",
start_time: 3698.37,
asset_id: "f66692477a4440a091bbd4b87b797318",
end_time: 3728.43,
duration: 30,
external_id: "7017736",
clicks: [
"http://log.adaptv.advertising.com/log?3a=click&d3=&25=208514&eb=&6c=&5=313819&14=&2=313820&37=2886510&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=horizonmediajackinthebox&5b=&18=56731&2e=crackle.com&2f=&30=crackle.com&31=&32=1&90=&86=&83=&82=&af=&80=1413727337217467955&42=false&8f=&41=&21=&1b=&76=&77=501062313&67=&d6=c46f62db-5905-4d4b-81fd-74e0ebf2124c&bf=0&74=ah&ed=&d5=1&d8=ip-10-49-138-161&ae=&8e=-1&f0=-1&68=-1&d7=&c0=&c4=0&c5=0&92=&93=&ef=&91=ONLINE_VIDEO&45=54.164.79.115&ee=Windows+7&b5=-1&33=55723869&a.pub_id=&f3=&f1=&f2=&a.cv=1&rUrl=http%3A%2F%2Fad.doubleclick.net%2Fddm%2Fclk%2F284587509%3B111572917%3Br",
"http://conversions.adaptv.advertising.com/conversion/wc?adSourceId=313819&bidId=&afppId=313820&creativeId=208514&exSId=2886510&marketplaceId=&key=horizonmediajackinthebox&a.pvt=0&a.rid=c46f62db-5905-4d4b-81fd-74e0ebf2124c&a.pub_id=&eov=55723869&a.click=true",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7017736&reid=3389436&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=3320&cr="
]
},
{
slot: "mid4",
index: 1,
ad_id: "7653774",
start_time: 3728.43,
asset_id: "00606b03f368439bbf71a0104f950407",
end_time: 3743.45,
duration: 15,
external_id: "7653774",
clicks: [
"http://adclick.g.doubleclick.net/pcs/click?xai=AKAOjssEvv9U72hUo6qXc4P5ogVDXl5bblZoZwlXVoh0b6yUZ2GPiDlZe6J7X7jjcpNXWH8yY6GLqKqsM1bBLUILDFLU4z0WE7uRsDtXSZdT55v4RQtzz4Pk&sig=Cg0ArKJSzJqNohMx9yfuEAE&adurl=http://www.geico.com/landingpage/r/go1/%3Fsoa%3D01366%26zip%3D%26dclid%3D%25edclid!",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7653774&reid=3578210&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=3320&cr="
]
},
{
slot: "mid4",
index: 2,
ad_id: "7097007",
start_time: 3743.45,
asset_id: "6d75320b31e04d52ba139e1d4022896c",
end_time: 3773.57,
duration: 30,
external_id: "7097007",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7097007&reid=3516904&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=3320&cr="
]
},
{
slot: "mid5",
index: 0,
ad_id: "8449837",
start_time: 4372.93,
asset_id: "ca3811286dfb4fe29436621032041714",
end_time: 4403.09,
duration: 30,
external_id: "8449837",
clicks: [
"http://analytics.bluekai.com/site/16411?phint=event%3Dclick&phint=aid%3D600027&phint=pid%3D157115&phint=vid%3D900822&phint=cid%3D421369&phint=crid%3D510288]&phint=coid%3D404863&done=https://ad.doubleclick.net/ddm/trackclk/N2998.crackle/B8431518.113997192;dc_trk_aid=287187504;dc_trk_cid=61066851",
"http://spc--cebeggpgafegfffepejfcghg--vast2lin.telemetryverification.net/ps3/SOURCEID_102__TV2NSPID_pse1BAfoPdUEOYbg__TAGTIM_1420953257__ADCGUID_pse1Bx7aAkAPpoZAXs__SID_8070584919183695741__TV2NCURL_pse1httpx3ax2fx2fanalx79ticsx2ebluekaix2ecomx2fsitex2f16411x3fphintx3deventx253Dclickx26phintx3daidx253D600027x26phintx3dpidx253D157115x26phintx3dvidx253D900822x26phintx3dcidx253D421369x26phintx3dcridx253D510288x5dx26phintx3dcoidx253D404863x26donex3dhttpsx3ax2fx2fadx2edoubleclickx2enetx2fddmx2ftrackclkx2fN2998x2ecracklex2fB8431518x2e113997192x3bdcx5ftrkx5faidx3d287187504x3bdcx5ftrkx5fcidx3d61066851__ITM_3/pse1/blank.gif?cb=[timestamp]",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8449837&reid=3595634&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=3920&cr="
]
},
{
slot: "mid5",
index: 1,
ad_id: "8601675",
start_time: 4403.09,
asset_id: "9c55a6708c2b49ea8246163c2b44d8c4",
end_time: 4418.17,
duration: 15,
external_id: "8601675",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8601675&reid=3578199&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=3920&cr=http%3A//www.attinnovators.com/"
]
},
{
slot: "mid5",
index: 2,
ad_id: "3513287",
start_time: 4418.17,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 4448.33,
duration: 30,
external_id: "3513287",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=ca028716-7c23-49cd-800e-769f15075871&rand=1428633249&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=3513287&reid=2418836&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=3920&cr="
]
},
{
slot: "mid6",
index: 0,
ad_id: "7258658",
start_time: 4869.62,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 4899.78,
duration: 30,
external_id: "7258658",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=5e7eb26b-555e-4ce6-88d9-23571f9eb961&rand=1005513268&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7258658&reid=3265464&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=4341&cr="
]
},
{
slot: "mid6",
index: 1,
ad_id: "7258739",
start_time: 4899.78,
asset_id: "79fb251df3ba4ff680eee7c4cb3e811b",
end_time: 4929.9,
duration: 30,
external_id: "7258739",
clicks: [
"http://www.platosclosetchantilly.com",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=139183&mid=162953&adId=dee7b25f-8817-4cee-9921-1a32c0d25024&rand=2138404480&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7258739&reid=3265501&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=4341&cr="
]
},
{
slot: "mid6",
index: 2,
ad_id: "8341821",
start_time: 4929.9,
asset_id: "2217bc20159c46feb115b3c449130a8a",
end_time: 4959.77,
duration: 30,
external_id: "8341821",
clicks: [
"http://service.innovid.com/vclk/index.php?project_hash=1hjjm9&client_id=81&video_id=48279&channel_id=53499&publisher_id=25&placement_tag_id=0&project_state=2&r=1421099232979&placement_hash=1hnho8&action=clktru&click=http%3A%2F%2Fad.doubleclick.net%2Fddm%2Fclk%2F285122873%3B113801433%3Bx",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8341821&reid=3580213&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=4341&cr="
]
},
{
slot: "mid7",
index: 0,
ad_id: "7017736",
start_time: 5583.23,
asset_id: "f66692477a4440a091bbd4b87b797318",
end_time: 5613.28,
duration: 30,
external_id: "7017736",
clicks: [
"http://log.adaptv.advertising.com/log?3a=click&d3=&25=208514&eb=&6c=&5=313819&14=&2=313820&37=2886510&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=horizonmediajackinthebox&5b=&18=56731&2e=crackle.com&2f=&30=crackle.com&31=&32=1&90=&86=&83=&82=&af=&80=1413727337217467955&42=false&8f=&41=&21=&1b=&76=&77=501062313&67=&d6=2a6128bd-43d0-4978-baee-b2c174d02af5&bf=0&74=ah&ed=&d5=1&d8=ip-10-49-137-202&ae=&8e=-1&f0=-1&68=-1&d7=&c0=&c4=0&c5=0&92=&93=&ef=&91=ONLINE_VIDEO&45=54.164.79.115&ee=Windows+7&b5=-1&33=80884810&a.pub_id=&f3=&f1=&f2=&a.cv=1&rUrl=http%3A%2F%2Fad.doubleclick.net%2Fddm%2Fclk%2F284587509%3B111572917%3Br",
"http://conversions.adaptv.advertising.com/conversion/wc?adSourceId=313819&bidId=&afppId=313820&creativeId=208514&exSId=2886510&marketplaceId=&key=horizonmediajackinthebox&a.pvt=0&a.rid=2a6128bd-43d0-4978-baee-b2c174d02af5&a.pub_id=&eov=80884810&a.click=true",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7017736&reid=3389436&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=4964&cr="
]
},
{
slot: "mid7",
index: 1,
ad_id: "7155154",
start_time: 5613.28,
asset_id: "8aab1c898eef4be6b2412308b243434a",
end_time: 5659.07,
duration: 46,
external_id: "7155154",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7155154&reid=3597215&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=4964&cr=http%3A//ad.doubleclick.net/ddm/trackclk/N3271.131459CRACKLE.COM/B8264630.112121661%3Bdc_trk_aid%3D285169672%3Bdc_trk_cid%3D59774677"
]
},
{
slot: "mid7",
index: 2,
ad_id: "7155110",
start_time: 5659.07,
asset_id: "8aab1c898eef4be6b2412308b243434a",
end_time: 5704.86,
duration: 46,
external_id: "7155110",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7155110&reid=3597216&arid=1&auid=&cn=defaultClick&et=c&_cc=&tpos=4964&cr=http%3A//ad.doubleclick.net/ddm/trackclk/N3271.131459CRACKLE.COM/B8264630.112121404%3Bdc_trk_aid%3D285169672%3Bdc_trk_cid%3D59774677"
]
},
{
slot: "mid8",
index: 0,
ad_id: "7097007",
start_time: 6346.37,
asset_id: "6d75320b31e04d52ba139e1d4022896c",
end_time: 6376.48,
duration: 30,
external_id: "7097007",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7097007&reid=3350811&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=5606&cr="
]
},
{
slot: "mid8",
index: 1,
ad_id: "8449837",
start_time: 6376.48,
asset_id: "17f486ad8de341b7acd0433f8fe8783d",
end_time: 6406.64,
duration: 30,
external_id: "8449837",
clicks: [
"http://analytics.bluekai.com/site/16411?phint=event%3Dclick&phint=aid%3D600027&phint=pid%3D157115&phint=vid%3D900822&phint=cid%3D421369&phint=crid%3D510288]&phint=coid%3D404863&done=https://ad.doubleclick.net/ddm/trackclk/N2998.crackle/B8431518.113997192;dc_trk_aid=287187504;dc_trk_cid=61066851",
"http://spc--cebeggpgafegfffepejfcghg--vast2lin.telemetryverification.net/ps3/SOURCEID_102__TV2NSPID_pse1BAfoPdUEOYbg__TAGTIM_1420953257__ADCGUID_pse1Bx7aAkAPpoZAXs__SID_3899764515917829721__TV2NCURL_pse1httpx3ax2fx2fanalx79ticsx2ebluekaix2ecomx2fsitex2f16411x3fphintx3deventx253Dclickx26phintx3daidx253D600027x26phintx3dpidx253D157115x26phintx3dvidx253D900822x26phintx3dcidx253D421369x26phintx3dcridx253D510288x5dx26phintx3dcoidx253D404863x26donex3dhttpsx3ax2fx2fadx2edoubleclickx2enetx2fddmx2ftrackclkx2fN2998x2ecracklex2fB8431518x2e113997192x3bdcx5ftrkx5faidx3d287187504x3bdcx5ftrkx5fcidx3d61066851__ITM_3/pse1/blank.gif?cb=[timestamp]",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8449837&reid=3595634&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=5606&cr="
]
},
{
slot: "mid8",
index: 2,
ad_id: "8601675",
start_time: 6406.64,
asset_id: "9c55a6708c2b49ea8246163c2b44d8c4",
end_time: 6421.72,
duration: 15,
external_id: "8601675",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8601675&reid=3578200&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=5606&cr=http%3A//www.attinnovators.com/"
]
},
{
slot: "mid9",
index: 0,
ad_id: "7258658",
start_time: 7167.98,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 7198.14,
duration: 30,
external_id: "7258658",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=4135345e-987a-4faf-bd37-bda5fc1acfa9&rand=1562768176&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7258658&reid=3265464&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=6352&cr="
]
},
{
slot: "mid9",
index: 1,
ad_id: "7258739",
start_time: 7198.14,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 7228.3,
duration: 30,
external_id: "7258739",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=97147a04-953f-4095-830c-5d0a71988cd7&rand=1603930306&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7258739&reid=3265501&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=6352&cr="
]
},
{
slot: "mid9",
index: 2,
ad_id: "3513287",
start_time: 7228.3,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 7258.46,
duration: 30,
external_id: "3513287",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=cd9d917d-9482-4c1d-8a2d-1b3eb3182a25&rand=1374559798&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=3513287&reid=2418836&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=6352&cr="
]
},
{
slot: "mid10",
index: 0,
ad_id: "8341821",
start_time: 7841.17,
asset_id: "a7ca2c6038fa4229b33576e829b9d073",
end_time: 7871.08,
duration: 30,
external_id: "8341821",
clicks: [
"http://service.innovid.com/vclk/index.php?project_hash=1hjil1&client_id=81&video_id=49315&channel_id=53499&publisher_id=25&placement_tag_id=0&project_state=2&r=1421099233174&placement_hash=1hnho9&action=clktru&click=http%3A%2F%2Fad.doubleclick.net%2Fddm%2Fclk%2F285122873%3B113801433%3Bx",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8341821&reid=3580213&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=6935&cr="
]
},
{
slot: "mid10",
index: 1,
ad_id: "7155154",
start_time: 7871.08,
asset_id: "8aab1c898eef4be6b2412308b243434a",
end_time: 7916.87,
duration: 46,
external_id: "7155154",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7155154&reid=3597215&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=6935&cr=http%3A//ad.doubleclick.net/ddm/trackclk/N3271.131459CRACKLE.COM/B8264630.112121661%3Bdc_trk_aid%3D285169672%3Bdc_trk_cid%3D59774677"
]
},
{
slot: "mid10",
index: 2,
ad_id: "7155110",
start_time: 7916.87,
asset_id: "8aab1c898eef4be6b2412308b243434a",
end_time: 7962.66,
duration: 46,
external_id: "7155110",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7155110&reid=3597216&arid=2&auid=&cn=defaultClick&et=c&_cc=&tpos=6935&cr=http%3A//ad.doubleclick.net/ddm/trackclk/N3271.131459CRACKLE.COM/B8264630.112121404%3Bdc_trk_aid%3D285169672%3Bdc_trk_cid%3D59774677"
]
},
{
slot: "mid11",
index: 0,
ad_id: "7017736",
start_time: 8681.44,
asset_id: "f66692477a4440a091bbd4b87b797318",
end_time: 8711.5,
duration: 30,
external_id: "7017736",
clicks: [
"http://log.adaptv.advertising.com/log?3a=click&d3=&25=208514&eb=&6c=&5=313819&14=&2=313820&37=2886510&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=horizonmediajackinthebox&5b=&18=56731&2e=crackle.com&2f=&30=crackle.com&31=&32=1&90=&86=&83=&82=&af=&80=1413727337217467955&42=false&8f=&41=&21=&1b=&76=&77=501062313&67=&d6=4eabd191-ecd4-432c-a570-c48d975edc00&bf=0&74=ah&ed=&d5=1&d8=ip-10-49-136-170&ae=&8e=-1&f0=-1&68=-1&d7=&c0=&c4=0&c5=0&92=&93=&ef=&91=ONLINE_VIDEO&45=54.164.79.115&ee=Windows+7&b5=-1&33=10171039&a.pub_id=&f3=&f1=&f2=&a.cv=1&rUrl=http%3A%2F%2Fad.doubleclick.net%2Fddm%2Fclk%2F284587509%3B111572917%3Br",
"http://conversions.adaptv.advertising.com/conversion/wc?adSourceId=313819&bidId=&afppId=313820&creativeId=208514&exSId=2886510&marketplaceId=&key=horizonmediajackinthebox&a.pvt=0&a.rid=4eabd191-ecd4-432c-a570-c48d975edc00&a.pub_id=&eov=10171039&a.click=true",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7017736&reid=3389436&arid=3&auid=&cn=defaultClick&et=c&_cc=&tpos=7654&cr="
]
},
{
slot: "mid11",
index: 1,
ad_id: "7097007",
start_time: 8711.5,
asset_id: "6d75320b31e04d52ba139e1d4022896c",
end_time: 8741.61,
duration: 30,
external_id: "7097007",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7097007&reid=3516904&arid=3&auid=&cn=defaultClick&et=c&_cc=&tpos=7654&cr="
]
},
{
slot: "mid11",
index: 2,
ad_id: "8449837",
start_time: 8741.61,
asset_id: "17f486ad8de341b7acd0433f8fe8783d",
end_time: 8771.78,
duration: 30,
external_id: "8449837",
clicks: [
"http://analytics.bluekai.com/site/16411?phint=event%3Dclick&phint=aid%3D600027&phint=pid%3D157115&phint=vid%3D900822&phint=cid%3D421369&phint=crid%3D510288]&phint=coid%3D404863&done=https://ad.doubleclick.net/ddm/trackclk/N2998.crackle/B8431518.113997192;dc_trk_aid=287187504;dc_trk_cid=61066851",
"http://spc--cebeggpgafegfffepejfcghg--vast2lin.telemetryverification.net/ps3/SOURCEID_102__TV2NSPID_pse1BAfoPdUEOYbg__TAGTIM_1420953257__ADCGUID_pse1Bx7aAkAPpoZAXs__SID_6047623641745630279__TV2NCURL_pse1httpx3ax2fx2fanalx79ticsx2ebluekaix2ecomx2fsitex2f16411x3fphintx3deventx253Dclickx26phintx3daidx253D600027x26phintx3dpidx253D157115x26phintx3dvidx253D900822x26phintx3dcidx253D421369x26phintx3dcridx253D510288x5dx26phintx3dcoidx253D404863x26donex3dhttpsx3ax2fx2fadx2edoubleclickx2enetx2fddmx2ftrackclkx2fN2998x2ecracklex2fB8431518x2e113997192x3bdcx5ftrkx5faidx3d287187504x3bdcx5ftrkx5fcidx3d61066851__ITM_3/pse1/blank.gif?cb=[timestamp]",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8449837&reid=3595634&arid=3&auid=&cn=defaultClick&et=c&_cc=&tpos=7654&cr="
]
},
{
slot: "mid12",
index: 0,
ad_id: "8601675",
start_time: 9508.66,
asset_id: "9c55a6708c2b49ea8246163c2b44d8c4",
end_time: 9523.74,
duration: 15,
external_id: "8601675",
clicks: [
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=8601675&reid=3578200&arid=3&auid=&cn=defaultClick&et=c&_cc=&tpos=8391&cr=http%3A//www.attinnovators.com/"
]
},
{
slot: "mid12",
index: 1,
ad_id: "7258658",
start_time: 9523.74,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 9553.9,
duration: 30,
external_id: "7258658",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=6f7c5424-de66-4677-a29e-e686a1496bf4&rand=1551409128&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7258658&reid=3265464&arid=3&auid=&cn=defaultClick&et=c&_cc=&tpos=8391&cr="
]
},
{
slot: "mid12",
index: 2,
ad_id: "7258739",
start_time: 9553.9,
asset_id: "f10dbe8c115a4d0caa55fb7150387348",
end_time: 9584.06,
duration: 30,
external_id: "7258739",
clicks: [
"http://www.ecendantadvertising.com/?id=E6D8B96FFC212D98",
"http://trk-useast.tidaltv.com/ILogger.aspx?event=redir&pid=6308&fmid=150593&mid=181483&adId=aef0966c-787a-4091-bb98-ee744f1be7cf&rand=1949551595&xf=7&ssl=0&ttid=7abcd695-0215-47bd-8915-c5d5f5eefad7&cd=0,0,1__&pa=CgA=&dr=1",
"http://2517d.v.fwmrm.net/ad/l/1?s=a021&n=151933%3B151933%3B82125%3B187827%3B188286%3B193466%3B375524%3B375613%3B375617%3B375620%3B378491%3B379619%3B382283%3B382314%3B382315&t=1421099232326953008&f=&r=151933&adid=7258739&reid=3265501&arid=3&auid=&cn=defaultClick&et=c&_cc=&tpos=8391&cr="
]
}
],
offsets: [
918.79,
1625.96,
2166.93,
2892.14,
3320.85,
3920.21,
4341.5,
4964.96,
5606.46,
6352.72,
6935.42,
7654.21,
8391.09
]
},
playURL: "http://content-ause4.uplynk.com/preplay2/f93224fd60574b8cbfc3a3a850d127a0/a2a0c4e8f5bfdcfc1b4b49487670ecb8/3wHsm0yT95qIHpGv5ZRmLG7tb5U6LoihwYlXUvDr1Yby.m3u8?pbs=1cff092816fb47c18241aca3164b481a",
sid: "1cff092816fb47c18241aca3164b481a"
}

*/