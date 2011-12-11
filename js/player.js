function round(n,dec) {
	n = parseFloat(n);
	if(!isNaN(n)){
		if(!dec) var dec= 0;
		var factor= Math.pow(10,dec);
		return Math.floor(n*factor+((n*factor*10)%10>=5?1:0))/factor;
	}else{
		return n;
	}
}
function toMinutes(s) {
	var minutes = Math.floor(s/60);
	if( minutes.toString().length == 1 )
		minutes = '0'+minutes;
	else if( minutes.toString() == "NaN" )
		minutes = "00";
	var seconds = round(s - minutes * 60, 0);
	if( seconds.toString().length == 1 )
		seconds = '0'+seconds;
	else if( seconds.toString() == "NaN" )
		seconds = "00";
	return minutes+':'+seconds;
}
Astrobeats.player = {
	handler: null,
	type: null,
	url: null,
	timer: null,
	options: {
		shuffle: false,
		continuous: true,
		repeat: false,
		autoplay: true,
		view_type: "wall"
	},
	played_list: [],
	next: function(){
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			console.log("repeat");
			if( Astrobeats.player.options.repeat ) {
				Astrobeats.player.seek(0);
				Astrobeats.player.play();
			}
			else if( Astrobeats.player.options.shuffle ) {
				var r = Math.floor(Math.random()*jQuery(".item").length);
				while( jQuery(".item").eq(r).is(":hidden") ) {
					console.log("hidden");
					r = Math.floor(Math.random()*jQuery(".item").length);
				}
				var $r = jQuery(".item").eq(r);
				
				$("html:not(:animated), body:not(:animated)").animate({
					scrollTop: $r.offset().top-75
				}, 500);
				$r.trigger("click");
			}
			else {
				var $next = jQuery(".item.playing").next(".item");
				while( $next.is(":hidden") )
					$next = $next.next(".item");
				$next.trigger("click");
			}
		}
	},
	prev: function(){
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			/*
			if( Astrobeats.player.getTimeElapsed() < 10 ) {
				Astrobeats.player.stop();
				$r = $(Astrobeats.player.played_list.pop());
				$r.trigger("click").trigger("click");
			}
			else {
			*/
				Astrobeats.player.played_list.pop();
				$r = $(Astrobeats.player.played_list.pop())
				$r.trigger("click");
			// }
			$("html:not(:animated),body:not(:animated)").animate({
				scrollTop: $r.offset().top-75
			}, 500);
		}
	},
	play: function(){
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			// UI			
			jQuery(".button#play").hide();
			jQuery(".button#pause").show();
			jQuery(".playing").find(".more").find(".pause").show().siblings(".play").hide();
			
			if( $(Astrobeats.player.played_list).get(-1) != $(".item.playing") ) {
				// when repeat is on and we're not repeating a song
				Astrobeats.player.played_list.push(jQuery(".item.playing"));
			
				Astrobeats.player.timer = setInterval(function(){
					var x = (Astrobeats.player.getTimeElapsed()/Astrobeats.player.getDuration())*jQuery("#seekbar").width();
					jQuery("#seekbar #played").width(x);
					jQuery("#seekbar #time #played").html(toMinutes(Astrobeats.player.getTimeElapsed()));
					jQuery("#seekbar #time #total-time").html(toMinutes(Astrobeats.player.getDuration()));
					if( (Astrobeats.player.getTimeElapsed() != undefined && Astrobeats.player.getDuration() != undefined ) && (Astrobeats.player.getTimeElapsed() == Astrobeats.player.getDuration()) ) {
						if( Astrobeats.player.type == "soundcloud" )
							Astrobeats.player.stop();
							
						if( Astrobeats.player.options.continuous ) {
							Astrobeats.player.next();
						}
						else {
							Astrobeats.player.pause();
						}
						clearInterval(Astrobeats.player.timer);
					}
				}, 1000);
			
			}
			// Player
			if( Astrobeats.player.type == "youtube" ) {
				Astrobeats.player.handler.playVideo();
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				Astrobeats.player.handler.api_play();
			}
			else
				console.log("Unsupported handler type.");
		}
		else
			jQuery(".item:first-child").trigger("click");
	},
	pause: function(){
		// UI
		jQuery(".button#play").show();
		jQuery(".button#pause").hide();
		jQuery(".playing").find(".more").find(".pause").hide().siblings(".play").show();
		
		// Player
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			if( Astrobeats.player.type == "youtube" ) {
				Astrobeats.player.handler.pauseVideo();
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				Astrobeats.player.handler.api_pause();
			}
			else
				console.log("Unsupported handler type.");
		}
	},
	stop: function(){
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			if( Astrobeats.player.type == "youtube" ) {
				Astrobeats.player.handler.stopVideo();
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				Astrobeats.player.handler.api_stop();
			}
			else
				console.log("Unsupported handler type.");
			
			clearInterval(Astrobeats.player.timer);
			handler = null;
		}
	},
	setVolume: function(x){
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			// UI
			if( x == 0 ) {
				jQuery(".button#volumelow, .button#volumehigh").hide();
				jQuery(".button#muted").show();
			}
			else if( x > 0 && x < 50 ) {
				jQuery(".button#volumehigh, .button#muted").hide();
				jQuery(".button#volumelow").show();
			}
			else {
				jQuery(".button#volumelow, .button#muted").hide();
				jQuery(".button#volumehigh").show();
			}
			
			// Player
			if( Astrobeats.player.type == "youtube" ) {
				Astrobeats.player.handler.setVolume(x);
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				Astrobeats.player.handler.api_setVolume(x);
			}
			else
				console.log("Unsupported handler type.");
		}
	},
	getVolume: function(){
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			if( Astrobeats.player.type == "youtube" ) {
				return Astrobeats.player.handler.getVolume();
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				return Astrobeats.player.handler.api_getVolume();
			}
			else {
				console.log("Unsupported handler type.");
				return false;
			}
		}
	},
	seek: function(x) {
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			if( Astrobeats.player.type == "youtube" ) {
				Astrobeats.player.handler.seekTo(x);
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				Astrobeats.player.handler.api_seekTo(x);
			}
			else
				console.log("Unsupported handler type.");
		}
	},
	seekPercent: function(x) {
		Astrobeats.player.seek((x/jQuery("#seekbar").width())*Astrobeats.player.getDuration());
	},
	load: function(url) {
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			if( Astrobeats.player.type == "youtube" ) {
				console.log(url);
				Astrobeats.player.handler.loadVideoById(url);
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				Astrobeats.player.handler.api_load(url);
			}
			else {
				console.log("Unsupported handler type.");
			}
		}
	},
	getDuration: function() {
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			if( Astrobeats.player.type == "youtube" ) {
				return Astrobeats.player.handler.getDuration();
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				return Astrobeats.player.handler.api_getTrackDuration();
			}
			else {
				console.log("Unsupported handler type.");
				return false;
			}
		}
	},
	getTimeElapsed: function() {
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			if( Astrobeats.player.type == "youtube" ) {
				return Astrobeats.player.handler.getCurrentTime();
			}
			else if( Astrobeats.player.type == "soundcloud" ) {
				return Astrobeats.player.handler.api_getTrackPosition();
			}
			else {
				console.log("Unsupported handler type.");
				return false;
			}
		}
	},
	buffering: function(x) {
		if( Astrobeats.player.handler != null && Astrobeats.player.type != null ) {
			jQuery("#seekbar #buffered").width(x+"%");
		}
	},
	onReady: function(playerId){
		// stop any running videos
		Astrobeats.player.stop();
		Astrobeats.player.handler = playerId;
		if( Astrobeats.player.options.autoplay ) {
			Astrobeats.player.play();
		}
		// jQuery("#volumebar").slider("value", Astrobeats.player.getVolume());
	}
};

// make sure active buttons are set
if( Astrobeats.player.options.shuffle )
	jQuery(".button#shuffle").addClass("active").find("img").attr("src", "img/musicplayer/shuffle-active.png");
if( Astrobeats.player.options.repeat ) {
	console.log("true");
	console.log(jQuery(".button#repeat").length);
	jQuery(".button#repeat").addClass("active").find("img").attr("src", "img/musicplayer/repeat-active.png");
}

Astrobeats.player.parameters = { allowscriptaccess: "always", wmode: "transparent" };
Astrobeats.player.attributes = { id: "player", name: "theplayer", wmode: "transparent" };
Astrobeats.player.flashvars = { enable_api: true, object_id: "scPlayer", url: "http://soundcloud.com/forss/flickermood" };

function onYouTubePlayerReady(playerId) {
	var p = document.getElementById("player");
	p.addEventListener("onStateChange", "onytStateChange");
	Astrobeats.player.type = "youtube";
	Astrobeats.player.onReady(p);
}
var buffer_timer = null;
function onytStateChange(newState) {
	clearInterval(buffer_timer);
	var p = document.getElementById("player");
	buffer_timer = setInterval(function(){
		var n = (p.getVideoBytesLoaded()/p.getVideoBytesTotal())*100;
		Astrobeats.player.buffering(n);
	}, 1000);
	
	if( p.getVideoBytesLoaded() == p.getVideoBytesTotal() || newState == 0 || newState == -1 )
		clearInterval(buffer_timer);
}
soundcloud.addEventListener("onPlayerReady", function(scPlayer, data) {
	Astrobeats.player.type = "soundcloud";
	Astrobeats.player.onReady(scPlayer);
});
soundcloud.addEventListener('onMediaBuffering', function(player, data) {
	clearInterval(buffer_timer);
	Astrobeats.player.buffering(data.percent);
});

function embed(type, url) {
	Astrobeats.player.handler = null;
	Astrobeats.player.type = null;
	switch( type ) {
		case "youtube":
			Astrobeats.player.url = url;
			Astrobeats.player.type = "youtube";
			swfobject.embedSWF("http://www.youtube.com/v/"+url+"?controls=0&enablejsapi=1&playerapiid=ytplayer&version=3&wmode=transparent", "player", "425", "256", "8", null, null, Astrobeats.player.parameters, Astrobeats.player.attributes);
			jQuery("#player, #coverart").height(256);
			break;
		case "soundcloud":
			Astrobeats.player.url = url;
			Astrobeats.player.flashvars.url = url;
			Astrobeats.player.type = "soundcloud";
			swfobject.embedSWF("http://player.soundcloud.com/player.swf", "player", "425", "80", "9.0.0","expressInstall.swf", Astrobeats.player.flashvars, Astrobeats.player.parameters, Astrobeats.player.attributes);
			jQuery("#player, #coverart").height(80);
			break;
	}
}
