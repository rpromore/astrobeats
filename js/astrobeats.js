Array.prototype.shuffle = function() {
	var s = [];
	while (this.length) s.push(this.splice(Math.random() * this.length, 1));
	while (s.length) this.push(s.pop());
	return this;
}
$(document).ready(function(){
	if( $.address.value() == '/astrobeats/' )
		$.address.value("explore");
	else {
		var addr = $.address.value().replace("/astrobeats/#/", "");
		$("#"+addr).addClass("active").siblings("li").removeClass("active");
	}
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
		$("#loadhere").attr("class", "list").find(".item").css("width", "100%").find(".desc, .desc2").width($(this).parent(".item").width() - $(this).prev().width());
	});
	$("#display-style").buttonset();
	
	$("button#resources, button#genres").button({
		icons: {
			secondary: "ui-icon-triangle-1-s"
		}
	}).click(function(){
		$(this).next().toggle();
	});
	
	$("#seekbar").click(function(e){
		var x = e.offsetX;
		window.player.seekPercent(x);
	});
	$("button#play").button({
		text: false,
		icons: {
			primary: "ui-icon-play"
		}
	}).click(function(){
		window.player.play();
	});
	$("button#pause").button({
		text: false,
		icons: {
			primary: "ui-icon-pause"
		}
	}).click(function(){
		window.player.pause();
	});
	$("button#prev").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-prev"
		}
	}).click(function(){
		$(".item.playing").prev(".item").trigger("click");
	});
	$("button#next").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-next"
		}
	}).click(function(){
		$(".item.playing").next(".item").trigger("click");
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
	
	$("button#volumeon").button({
		text: false,
		icons: {
			primary: "ui-icon-volume-on"
		}
	}).click(function(){
		$("#volumebar").slider("value", 0);
	});
	$("button#volumeoff").button({
		text: false,
		icons: {
			primary: "ui-icon-volume-off"
		}
	}).click(function(){
		$("#volumebar").slider("value", 100);
	});
	$("#volumebar").slider({
		min: 0,
		max: 100,
		value: 100,
		change: function(evt, ui){
			window.player.setVolume(ui.value);
		},
		slide: function(evt, ui){
			window.player.setVolume(ui.value);
		}
	});
	
	$("#thumbnail-size").slider({
		min: 126,
		max: 182,
		change: function(){
			v = $("#thumbnail-size").slider("value");
			$("#loadhere.wall").find(".item").css({ width: v, height: v }).find(".thumb, .thumb > img").css({ width: v, height: v });
			$("#loadhere.list").find(".item").css({ height: v }).find(".thumb, .thumb > img").css({ width: v, height: v });
			$("#loadhere.wall").find(".desc, .desc2").css({ width: v, height: v });
			$("#loadhere.list").find(".desc, .desc2").css({ width: $(this).parent(".item").width()-$(this).prev().width(), height: v });
			lastItemWidth = v;
		},
		slide: function(){
			v = $("#thumbnail-size").slider("value");
			$("#loadhere.wall").find(".item").css({ width: v, height: v }).find(".thumb, .thumb > img").css({ width: v, height: v });
			$("#loadhere.list").find(".item").css({ height: v }).find(".thumb, .thumb > img").css({ width: v, height: v });
			$("#loadhere.wall").find(".desc, .desc2").css({ width: v, height: v });
			$("#loadhere.list").find(".desc, .desc2").css({ width: $(this).parent(".item").width()-$(this).prev().width(), height: v });
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
	
	function display(page) {
		$container = $("#loadhere");
		switch(page) {
			case "/artists":
				$("#loadhere").html("artists");
				break;
			case "/explore":
				$.getJSON("lib/explore.php", function(data){
					var items = [];
					$.each(data, function(k, v) {
						item = '<div class="item" data-provider="'+ v["provider"] +'" data-url="'+ v["url"] +'">'+v["output"]+'<div class="more"><img class="play" src="img/play.png" /><img class="info" src="img/info.png" /><img class="download" src="img/download.png" /><img class="heart" src="img/heart.png" /><img class="buy" src="img/cart.png" /></div></div>';
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
									$(this).addClass("playing").siblings(".item").removeClass("playing");
									$(this).die("mouseleave");
									if( $(this).attr("data-provider") == "youtube.com" ) {
										embed("youtube", $(this).attr("data-url"));
									}
									else if( $(this).attr("data-provider") == "soundcloud.com" ) {
										embed("soundcloud", $(this).attr("data-url"));
									}
									else {
										console.log("Unable to load provider. Provider: "+$(this).attr("data-provider"));
									}
								}
							})
						;
						$("#loadhere.wall")
							.find(".item")
							.live(
								{ 
									mouseenter: function(){
										$(this).children(".desc").stop().animate({ left: "0px" }, {duration: 400, easing: "easeOutExpo"});
										$(this).children(".more").stop().animate({ bottom: "0px" }, {duration: 500, easing: "easeOutExpo"});
									}, 
									mouseleave: function(){
										$(this).children(".desc").stop().animate({ left: "187px" }, {duration: 700, easing: "easeOutBounce"});
										$(this).children(".more").stop().animate({ bottom: "-26px" }, {duration: 800, easing: "easeOutExpo"});
									}
								}
							);
						// $items.animate({ opacity: 1 }, 1000);
					// });
					/*
					$("img.lazy").lazyload({
						container: $("#loadhere")
					});
					*/
				});	
		}
	}
	
	$("#modal > #close").live("click", function(){
		$("#modal-cover, #modal").hide().remove();
	});
});
