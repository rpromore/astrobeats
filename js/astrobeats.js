Array.prototype.shuffle = function() {
	var s = [];
	while (this.length) s.push(this.splice(Math.random() * this.length, 1));
	while (s.length) this.push(s.pop());
	return this;
}
$(document).ready(function(){
	$(document).bind("ajaxStart.main", function(){
		$("#loading").show();
		$("#loadhere").hide();
	}).bind("ajaxStop.main", function(){
		$("#loading").hide();
		$("#loadhere").show();
	});
	
	$.routes({
		'/': function(){ display("explore"); },
		'/explore': function(){ display("explore"); },
		'/explore/:id': function(id){ console.log(id); },
		'/artists': function(){ display("artists"); },
		'/artists/:id': function(id){ display_artist(id.id); }
	});
	
	if( $.address.path() == '/' || $.address.path() == '/#' )
		$.address.value("explore");
	else {
		// var addr = $.address.path().replace("/", "");
		// $("#"+addr).addClass("active").siblings("li").removeClass("active");
	}
	
	function places_highlight(id) {
		$("#"+id).addClass("active").siblings("li").removeClass("active");
	}
		
	$.address.change(function(e){
		var p = e.pathNames;
		if( p[0] == "explore" ) {
			places_highlight("explore");
			display("explore");
		}
		else if( p[0] == "artists" ) {
			places_highlight("artists");
			if( p.length > 1 )
				display_artist(p[1]);
			else
				display("artists");
		}
			
	});
	
	function display_artist(id) {
		id = id.replace(/\+/g, ' ');
		$("#loadhere").html(id);
	}
	
	function display(page) {
		$container = $("#loadhere");
		switch(page) {
			case "artists":
				break;
			case "explore":
				$("#loadhere").html("");
				$.getJSON("lib/explore.php", function(data){
					$.each(data, function(k, v) {
						item = $("<div>", {
							class: "item",
							"data-provider": v["provider"],
							"data-url": v["url"],
							"data-title": v["title"],
							"data-artist": v["artist"],
							html: v["output"]
						});
						$more = $("<div>", {
							class: "more"
						}).appendTo(item);
						$("<img>", {
							src: "img/play.png",
							class: "play"
						}).click(function(e){
							$(this).parents(".item").trigger("click");
							$(this).hide().siblings(".pause").show();
							e.stopPropagation();
						}).appendTo($more);
						$("<img>", {
							src: "img/pause.png",
							class: "pause"
						}).click(function(e){
							$(".button#pause").trigger("click");
							$(this).hide().siblings(".play").show();
							e.stopPropagation();
						}).appendTo($more);
						$("<img>", {
							src: "img/info.png",
							class: "info"
						}).click(function(e){
							$("<div>", { text: "test" }).dialog({ modal: true, dialogClass: "modal", draggable: false, resizable: false, title: "Title" });
							e.stopPropagation();
						}).appendTo($more);
						
						
						$("#loadhere").append(item);
					});
					$("#loadhere")
					.find(".item")
					.live({
						click: function(){
							if( $(this).hasClass("playing") ) {
								if( $(".button#pause").is(":visible") )
									$(".button#pause").trigger("click");
								else
									$(".button#play").trigger("click");
							}
							else {
								$(this).siblings(".item.playing").children(".desc").stop().animate({ left: "187px" }, {duration: 700, easing: "easeOutBounce"});
								$(this).siblings(".item.playing").children(".more").stop().animate({ bottom: "-26px" }, {duration: 800, easing: "easeOutExpo"}).children("img.pause").hide().siblings("img.play").show();
								$(this).addClass("playing").siblings(".item").removeClass("playing");
								$("#artist_info #trackinfo").html($(this).attr("data-title"));
								
								$(this).children(".desc").stop().animate({ left: "0px" }, {duration: 400, easing: "easeOutExpo"});
								$(this).children(".more").stop().animate({ bottom: "0px" }, {duration: 500, easing: "easeOutExpo"}).children("img.pause").show().siblings("img.play").hide();
								
								if( $(this).attr("data-provider") == "youtube.com" ) {
									embed("youtube", $(this).attr("data-url"));
								}
								else if( $(this).attr("data-provider") == "soundcloud.com" ) {
									embed("soundcloud", $(this).attr("data-url"));
								}
								else {
									console.log("Unable to load provider. Provider: "+$(this).attr("data-provider"));
									$(this).next(".item").trigger("click");
								}
							}
						}
					})
					;
					$("#loadhere.wall")
					.find(".item:not(.playing)")
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
				});	
				break;
		}
	}
});
