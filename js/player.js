window.player = {
	handler: null,
	type: null,
	url: null,
	timer: null,
	options: {
		shuffle: false,
		continuous: true,
		autoplay: true,
		view_type: "wall"
	},
	play: function(){
		if( window.player.handler != null && window.player.type != null ) {
			// UI			
			jQuery(".button#play").hide();
			jQuery(".button#pause").show();
			jQuery(".playing").find(".more").find(".pause").show().siblings(".play").hide();
			
			window.player.timer = setInterval(function(){
				var x = (window.player.getTimeElapsed()/window.player.getDuration())*jQuery("#seekbar").width();
				jQuery("#seekbar #played").width(x);
				if( window.player.getTimeElapsed() == window.player.getDuration() ) {
					// window.player.stop();
					if( window.player.options.continuous )
						jQuery(".button#next").trigger("click");
					clearInterval(window.player.timer);
				}
			}, 1000);
			
			// Player
			if( window.player.type == "youtube" ) {
				window.player.handler.playVideo();
			}
			else if( window.player.type == "soundcloud" ) {
				window.player.handler.api_play();
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
		if( window.player.handler != null && window.player.type != null ) {
			if( window.player.type == "youtube" ) {
				window.player.handler.pauseVideo();
			}
			else if( window.player.type == "soundcloud" ) {
				window.player.handler.api_pause();
			}
			else
				console.log("Unsupported handler type.");
		}
	},
	stop: function(){
		if( window.player.handler != null && window.player.type != null ) {
			if( window.player.type == "youtube" ) {
				window.player.handler.stopVideo();
			}
			else if( window.player.type == "soundcloud" ) {
				window.player.handler.api_stop();
			}
			else
				console.log("Unsupported handler type.");
			
			clearInterval(window.player.timer);
			handler = null;
		}
	},
	setVolume: function(x){
		if( window.player.handler != null && window.player.type != null ) {
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
			if( window.player.type == "youtube" ) {
				window.player.handler.setVolume(x);
			}
			else if( window.player.type == "soundcloud" ) {
				window.player.handler.api_setVolume(x);
			}
			else
				console.log("Unsupported handler type.");
		}
	},
	getVolume: function(){
		if( window.player.handler != null && window.player.type != null ) {
			if( window.player.type == "youtube" ) {
				return window.player.handler.getVolume();
			}
			else if( window.player.type == "soundcloud" ) {
				return window.player.handler.api_getVolume();
			}
			else {
				console.log("Unsupported handler type.");
				return false;
			}
		}
	},
	seek: function(x) {
		if( window.player.handler != null && window.player.type != null ) {
			if( window.player.type == "youtube" ) {
				window.player.handler.seekTo(x);
			}
			else if( window.player.type == "soundcloud" ) {
				window.player.handler.api_seekTo(x);
			}
			else
				console.log("Unsupported handler type.");
		}
	},
	seekPercent: function(x) {
		window.player.seek((x/jQuery("#seekbar").width())*window.player.getDuration());
	},
	load: function(url) {
		if( window.player.handler != null && window.player.type != null ) {
			if( window.player.type == "youtube" ) {
				console.log(url);
				window.player.handler.loadVideoById(url);
			}
			else if( window.player.type == "soundcloud" ) {
				window.player.handler.api_load(url);
			}
			else {
				console.log("Unsupported handler type.");
			}
		}
	},
	getDuration: function() {
		if( window.player.handler != null && window.player.type != null ) {
			if( window.player.type == "youtube" ) {
				return window.player.handler.getDuration();
			}
			else if( window.player.type == "soundcloud" ) {
				return window.player.handler.api_getTrackDuration();
			}
			else {
				console.log("Unsupported handler type.");
				return false;
			}
		}
	},
	getTimeElapsed: function() {
		if( window.player.handler != null && window.player.type != null ) {
			if( window.player.type == "youtube" ) {
				return window.player.handler.getCurrentTime();
			}
			else if( window.player.type == "soundcloud" ) {
				return window.player.handler.api_getTrackPosition();
			}
			else {
				console.log("Unsupported handler type.");
				return false;
			}
		}
	},
	buffering: function(x) {
		if( window.player.handler != null && window.player.type != null ) {
			jQuery("#seekbar #buffered").width(x+"%");
		}
	},
	onReady: function(playerId){
		// stop any running videos
		window.player.stop();
		window.player.handler = playerId;
		if( window.player.options.autoplay ) {
			window.player.play();
		}
		jQuery("#volumebar").slider("value", window.player.getVolume());
	}
};

window.player.parameters = { allowscriptaccess: "always", wmode: "transparent" };
window.player.attributes = { id: "player", name: "theplayer", wmode: "transparent" };
window.player.flashvars = { enable_api: true, object_id: "scPlayer", url: "http://soundcloud.com/forss/flickermood" };

function onYouTubePlayerReady(playerId) {
	var p = document.getElementById("player");
	p.addEventListener("onStateChange", "onytStateChange");
	window.player.type = "youtube";
	window.player.onReady(p);
}
var buffer_timer = null;
function onytStateChange(newState) {
	clearInterval(buffer_timer);
	var p = document.getElementById("player");
	buffer_timer = setInterval(function(){
		var n = (p.getVideoBytesLoaded()/p.getVideoBytesTotal())*100;
		window.player.buffering(n);
	}, 1000);
	
	if( p.getVideoBytesLoaded() == p.getVideoBytesTotal() || newState == 0 || newState == -1 )
		clearInterval(buffer_timer);
}
soundcloud.addEventListener("onPlayerReady", function(scPlayer, data) {
	window.player.type = "soundcloud";
	window.player.onReady(scPlayer);
});
soundcloud.addEventListener('onMediaBuffering', function(player, data) {
	clearInterval(buffer_timer);
	window.player.buffering(data.percent);
});

function embed(type, url) {
	window.player.handler = null;
	window.player.type = null;
	switch( type ) {
		case "youtube":
			window.player.url = url;
			window.player.type = "youtube";
			swfobject.embedSWF("http://www.youtube.com/v/"+url+"?controls=0&enablejsapi=1&playerapiid=ytplayer&version=3&wmode=transparent", "player", "425", "256", "8", null, null, window.player.parameters, window.player.attributes);
			break;
		case "soundcloud":
			window.player.url = url;
			window.player.flashvars.url = url;
			window.player.type = "soundcloud";
			swfobject.embedSWF("http://player.soundcloud.com/player.swf", "player", "425", "256", "9.0.0","expressInstall.swf", window.player.flashvars, window.player.parameters, window.player.attributes);
			break;
	}
}
