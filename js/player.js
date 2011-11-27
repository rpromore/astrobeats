window.player = {
	handler: null,
	type: null,
	url: null,
	options: {
		shuffle: false,
		continuous: true,
		autoplay: true
	},
	play: function(){
		if( window.player.handler != null && window.player.type != null ) {
			// UI
			jQuery("button#play").hide();
			jQuery("button#pause").show();
			var i = setInterval(function(){
				var x = (window.player.getTimeElapsed()/window.player.getDuration())*100;
				jQuery("#seek-loaded").width(x);
			}, 1000);
			if( window.player.getTimeElapsed() == window.player.getDuration() )
				clearInterval(i);
			
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
	},
	pause: function(){
		// UI
		jQuery("button#play").show();
		jQuery("button#pause").hide();
		
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
		}
	},
	setVolume: function(x){
		if( window.player.handler != null && window.player.type != null ) {
			// UI
			if( x == 0 ) {
				jQuery("button#volumeon").hide();
				jQuery("button#volumeoff").show();
			}
			else {
				jQuery("button#volumeon").show();
				jQuery("button#volumeoff").hide();
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
		window.player.seek((x/100)*window.player.getDuration());
	},
	load: function(url) {
		if( window.player.handler != null && window.player.type != null ) {
			if( window.player.type == "youtube" ) {
				//
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
				return false;
				console.log("Unsupported handler type.");
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
				return false;
				console.log("Unsupported handler type.");
			}
		}
	},
	buffering: function(x) {
		if( window.player.handler != null && window.player.type != null ) {
			jQuery("#seek-loading").width(x);
		}
	},
	onReady: function(playerId){
		window.player.handler = playerId;
		if( window.player.options.autoplay ) {
			window.player.play();
		}
		jQuery("#volumebar").slider("value", window.player.getVolume());
	}
};

window.player.parameters = { allowscriptaccess: "always" };
window.player.attributes = { id: "player", name: "theplayer" };
window.player.flashvars = { enable_api: true, object_id: "scPlayer", url: "http://soundcloud.com/forss/flickermood" };

function onYouTubePlayerReady(playerId) {
	var p = document.getElementById("player");
	p.addEventListener("onStateChange", "onytStateChange");
	window.player.type = "youtube";
	window.player.onReady(p);
}
function onytStateChange(newState) {
	var p = document.getElementById("player");
	var i = null;
	if( newState == 3 ) {
		// buffering
		i = setInterval(function(){
			var n = (p.getVideoBytesLoaded()/p.getVideoBytesTotal())*100;
			window.player.buffering(n);
			console.log(n);
		}, 1000);
	}
	else if( newState == 0 )
		clearInterval(i);
}
soundcloud.addEventListener("onPlayerReady", function(scPlayer, data) {
	window.player.type = "soundcloud";
	window.player.onReady(scPlayer);
});
soundcloud.addEventListener('onMediaBuffering', function(player, data) {
	window.player.buffering(data.percent);
});

function embed(type, url) {
	switch( type ) {
		case "youtube":
		case "youtu.be":
			window.player.type = "youtube";
			window.player.url = url;
			swfobject.embedSWF("http://www.youtube.com/v/"+url+"?enablejsapi=1&playerapiid=ytplayer&version=3", "player", "1", "1", "8", null, null, window.player.parameters, window.player.attributes);
			break;
		case "soundcloud":
			window.player.url = url;
			window.player.flashvars.url = url;
			if( window.player.type == "soundcloud" ) {
				window.player.load(url);
			}
			else {
				window.player.type = "soundcloud";
				swfobject.embedSWF("http://player.soundcloud.com/player.swf", "player", "1", "1", "9.0.0","expressInstall.swf", window.player.flashvars, window.player.parameters, window.player.attributes);
			}
			break;
	}
}
