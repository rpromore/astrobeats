$(document).ready(function(){
	$("#artist_info").click(function(){
		if( $("#loadhere").children("#tracks").not(":hidden") ) {
			$("html:not(:animated),body:not(:animated)").animate({
				scrollTop: $(".item.playing").offset().top-75
			}, 500);
		}
	}).resizable({ handles: 'e', maxWidth: 350, minWidth: 0 });
	
	$("#seekbar").click(function(e){
		var x = e.offsetX;
		Astrobeats.player.seekPercent(x);
	});

	$(".button#info").click(function(){
		if( !$(this).hasClass("disabled") ) {
			$.address.path("artists/"+$(".item.playing").attr("data-artist").replace(/ /g, '+'));
		}
	});
	$(".button#eye").click(function(){
		if( !$(this).hasClass("disabled") ) {
			if( $(this).hasClass("active") ) {
				$("#coverart").animate({ bottom: -258 }, "easeInQuart").children("#player").css("z-index", 900);
				$(this).removeClass("active");
				$(this).find("img").attr("src", "img/musicplayer/eye.png");
			}
			else {
				$("#coverart").animate({ bottom: 60 }, "easeOutQuart").children("#player").css("z-index", -1);
				$(this).addClass("active");
				$(this).find("img").attr("src", "img/musicplayer/eye-active.png");
			}
		}
	});
	$(".button#play").click(function(){
		if( !$(this).hasClass("disabled") ) {
			Astrobeats.player.play();
		}
	});
	$(".button#pause").click(function(){
		if( !$(this).hasClass("disabled") ) {
			Astrobeats.player.pause();
		}
	});
	$(".button#prev").click(function(){
		if( !$(this).hasClass("disabled") ) {
			Astrobeats.player.prev();
		}
	});
	$(".button#next").click(function(){
		if( !$(this).hasClass("disabled") ) {
			Astrobeats.player.next();
		}
	});
	$(".button#heart").click(function(){
		if( !$(this).hasClass("disabled") ) {
			if( $(this).is(".active") ) {
				$(this).removeClass("active").find("img").attr("src", "img/musicplayer/heart.png");
				// remove
				Astrobeats.favorites.remove(Astrobeats.pages.currentPage, $(".item.playing").clone());
			}
			else {
				$(this).addClass("active").find("img").attr("src", "img/musicplayer/heart-active.png");
				// add
				Astrobeats.favorites.add(Astrobeats.pages.currentPage, $(".item.playing").clone());
			}
			console.log(Astrobeats.favorites);
		}
	});
	$(".button#download").click(function(){
		
	});
	
	var lastVolume = 100;
	
	$(".button#volumehigh, .button#volumelow").click(function(){
		lastVolume = $("#volumebar").slider("value");
		$("#volumebar").slider("value", 0);
	});
	$(".button#muted").click(function(){
		console.log("unmuting");
		console.log(lastVolume);
		$("#volumebar").slider("value", lastVolume);
	});
	$("#volumebar").slider({
		min: 0,
		max: 100,
		value: 100,
		change: function(evt, ui){
			Astrobeats.player.setVolume(ui.value);
		},
		slide: function(evt, ui){
			Astrobeats.player.setVolume(ui.value);
		}
	});
	
	$(".button#shuffle").click(function(){
		if( $(this).is(".active") ) {
			$(this).removeClass("active").find("img").attr("src", "img/musicplayer/shuffle.png");
			Astrobeats.player.options.shuffle = false;
		}
		else {
			$(this).addClass("active").find("img").attr("src", "img/musicplayer/shuffle-active.png");
			Astrobeats.player.options.shuffle = true;
		}
	});
	
	$(".button#repeat").click(function(){
		if( $(this).is(".active") ) {
			$(this).removeClass("active").find("img").attr("src", "img/musicplayer/repeat.png");
			Astrobeats.player.options.repeat = false;
		}
		else {
			$(this).addClass("active").find("img").attr("src", "img/musicplayer/repeat-active.png");
			Astrobeats.player.options.repeat = true;
		}
	});
});
