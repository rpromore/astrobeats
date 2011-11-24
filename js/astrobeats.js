Array.prototype.shuffle = function() {
	var s = [];
	while (this.length) s.push(this.splice(Math.random() * this.length, 1));
	while (s.length) this.push(s.pop());
	return this;
}
$(document).ready(function(){
	if( $.address.value() == '/astrobeats/' )
		$.address.value("explore");
	$.address.change(function(event) {
		display(event.value.replace("/astrobeats/#", ""));
	});
	$.address.history(true);
	
	$("ul#places > li").click(function(){
		$(this).addClass("active").siblings("li").removeClass("active");
		$.address.value($(this).find("a").attr("href"));
	}).find("a").click(function(){
		$(this).parent("li").addClass("active").siblings("li").removeClass("active");
		$.address.value($(this).attr("href"));
		return false;
	});
	
	var lastItemWidth = 182;
	var lastVideo = "";
	
	$("#player").tubeplayer({
		width: 10, // the width of the player
		height: 10, // the height of the player
		allowFullScreen: "false", // true by default, allow user to go full screen
		initialVideo: "", // the video that is loaded into the player
		preferredQuality: "small",// preferred quality: default, small, medium, large, hd720
		showinfo: false,
		iframed: true,
		onPlay: function(id){
			$("button#play").hide();
			$("button#pause").show();
			setInterval(function(){
				var data = $("#player").tubeplayer("data");
				$("#seek-loading").width(((data.bytesLoaded)/(data.bytesTotal))*100);
				$("#seek-loaded").width(((data.currentTime)/(data.duration))*100);
				
				if( data.currentTime == data.duration ) {}
					// go to next song if option enabled
			}, 1000);
		}, // after the play method is called
		onPause: function(){
			$("button#pause").hide();
			$("button#play").show();
		}, // after the pause method is called
		onStop: function(){}, // after the player is stopped
		onSeek: function(time){}, // after the video has been seeked to a defined point
		onMute: function(){}, // after the player is muted
		onUnMute: function(){} // after the player is unmuted
	});
	
	$("#displaystyle-wall").button({
		text: "Wall",
		icons: {
			primary: "ui-display-wall"
		}
	}).click(function(){
		$("#loadhere").attr("class", "wall").find(".item, .item img").css({ width: lastItemWidth, height: lastItemWidth });
		lastItemWidth = $("#loadhere").find(".item").eq(0).css("width");
	});
	$("#displaystyle-list").button({
		text: "List",
		icons: {
			primary: "ui-display-list"
		}
	}).click(function(){
		lastItemWidth = $("#loadhere").find(".item").eq(0).css("width");
		$("#loadhere").attr("class", "list").find(".item").css("width", "100%").find(".desc, .desc2").width($(this).parent().width() - $(this).prev(".thumb").width());
	});
	$("#display-style").buttonset();
	
	$("#seekbar").click(function(e){
		var data = $("#player").tubeplayer("data");
		$("#player").tubeplayer("seek", e.offsetX*(data.duration/100));
	});
	
	$("button#resources, button#genres").button({
		icons: {
			secondary: "ui-icon-triangle-1-s"
		}
	}).click(function(){
		$(this).next().toggle();
	});
	$("button#play").button({
		text: false,
		icons: {
			primary: "ui-icon-play"
		}
	}).click(function(){
		$(this).hide();
		$("button#pause").show();
		$("#player").tubeplayer("play");
	});
	$("button#pause").button({
		text: false,
		icons: {
			primary: "ui-icon-pause"
		}
	}).click(function(){
		$(this).hide();
		$("button#play").show();
		$("#player").tubeplayer("pause");
	});
	$("button#prev").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-prev"
		}
	});
	$("button#next").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-next"
		}
	});
	$("button#heart").button({
		text: false,
		icons: {
			primary: "ui-icon-heart"
		}
	});
	$("button#download").button({
		text: false,
		icons: {
			primary: "ui-icon-arrowthickstop-1-s"
		}
	});
	var lastVolume = 50;
	$("button#volumeon").button({
		text: false,
		icons: {
			primary: "ui-icon-volume-on"
		}
	}).click(function(){
		$(this).hide();
		$("button#volumeoff").show();
		// lastVolume = $("#volumebar").children(".bar").css("width").replace("px", "");
		lastVolume = $("#volumebar").slider("value");
		// $("#volumebar").children(".bar").css("width", "0px");
		$("#volumebar").slider("value", 0);
		$("#player").tubeplayer("mute");
	});
	$("button#volumeoff").button({
		text: false,
		icons: {
			primary: "ui-icon-volume-off"
		}
	}).click(function(){
		$(this).hide();
		$("button#volumeon").show();
		// $("#volumebar").children(".bar").css("width", lastVolume);
		$("#volumebar").slider("value", lastVolume);
		$("#player").tubeplayer("unmute");
	});
	$("#thumbnail-size").slider({
		min: 126,
		max: 182,
		change: function(){
			v = $("#thumbnail-size").slider("value");
			$("#loadhere.wall").find(".item").css({ width: v, height: v }).find(".thumb, img").css({ width: v, height: v });
			$("#loadhere.list").find(".item").css({ height: v }).find(".thumb, img").css({ width: v, height: v });
			$("#loadhere.wall").find(".desc, .desc2").css({ width: v, height: v });
			$("#loadhere.list").find(".desc, .desc2").css({ width: $(this).parent().width()-$(this).prev(".thumb").width(), height: v });
			lastItemWidth = v;
		},
		slide: function(){
			v = $("#thumbnail-size").slider("value");
			$("#loadhere.wall").find(".item").css({ width: v, height: v }).find(".thumb, img").css({ width: v, height: v });
			$("#loadhere.list").find(".item").css({ height: v }).find(".thumb, img").css({ width: v, height: v });
			$("#loadhere.wall").find(".desc, .desc2").css({ width: v, height: v });
			$("#loadhere.list").find(".desc, .desc2").css({ width: $(this).parent().width()-$(this).prev(".thumb").width(), height: v });
			lastItemWidth = v;
		}
	}).slider("value", 182);
	
	$(document).bind("ajaxStart.main", function(){
		$("#loading").show();
		$("#loadhere").hide();
	}).bind("ajaxStop.main", function(){
		$("#loading").hide();
		$("#loadhere").show();
	});
	
	$("#volumebar").slider({
		min: 0,
		max: 100,
		change: function(){
			v = $(this).slider("value");
			if( v == 0 ) {
				$("button#volumeon").hide();
				$("button#volumeoff").show();
			}
			else {
				$("button#volumeon").show();
				$("button#volumeoff").hide();
			}
			$("#player").tubeplayer("volume", v);
		},
		slide: function(){
			v = $(this).slider("value");
			if( v == 0 ) {
				$("button#volumeon").hide();
				$("button#volumeoff").show();
			}
			else {
				$("button#volumeon").show();
				$("button#volumeoff").hide();
			}
			$("#player").tubeplayer("volume", v);
		}
	}).slider("value", 100);
	
	var flashvars = {
		enable_api: true, 
		object_id: "player",
		url: "",
		enablejsapi: '1'
	};
	var params = {
		allowscriptaccess: "always"
	};
	var attributes = {
		id: "myytplayer",
		name: "myytplayer"
	};
	
	function display(page) {
		$container = $("#loadhere");
		switch(page) {
			case "/artists":
				$("#loadhere").html("artists");
				break;
			case "/explore":
				$.getJSON("lib/services.php", function(data){
					var items = [];
					$.each(data, function(k, v) {
						item = '<div class="item" data-provider="'+ v["provider"] +'" data-url="'+ v["url"] +'">'+v["output"]+'</div>';
						items.push(item);
					});
					items.shuffle();
					// $items = $(items.join('')).css("opacity", "0");
					$items = $(items.join(''));
					// $items.imagesLoaded(function(){
						$("#loadhere")
							.html($items)
							.find(".item")
							.live({
								click: function(){
									if( $(this).attr("data-provider") == "youtube.com" ) {
										$("#player").tubeplayer("play", $(this).attr("data-url"));
										lastVideo = $(this).attr("data-url");
									}
									else
										console.log("Unable to load provider. Provider: "+$(this).attr("data-provider"));
								}
							})
						;
						$("#loadhere.wall")
							.find(".item")
							.live(
								{ 
									mouseenter: function(){ $(this).children(".desc").stop().animate({ left: "0px" }, {duration: 400, easing: "easeOutExpo"}); }, 
									mouseleave: function(){ $(this).children(".desc").stop().animate({ left: "187px" }, {duration: 700, easing: "easeOutBounce"}); }
								}
							);
						// $items.animate({ opacity: 1 }, 1000);
					// });
					
					$("img.lazy").lazyload({
						container: $("#loadhere")
					});
				});	
		}
	}
	
	$("#modal > #close").live("click", function(){
		$("#modal-cover, #modal").hide().remove();
	});
});
