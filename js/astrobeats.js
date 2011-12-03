Array.prototype.shuffle = function() {
	var s = [];
	while (this.length) s.push(this.splice(Math.random() * this.length, 1));
	while (s.length) this.push(s.pop());
	return this;
}

var AstroBeats = (function(){
	var AstroBeats = {
		routes: {
			'/explore': function(){ display("explore"); console.log("explore"); },
			'/artists': function(){ display("artists"); console.log("artists"); },
			'/artists/:artist': function(artist){ console.log(artist.artist); }
		}
	};
	var services = {
		reddit: {
			
		}
	};
	var favorites = {
		tracks: {},
		albums: {},
		artists: {},
		events: {},
		add: function(type, x) {
			window.favorites[type].push(x);
		}
	};
})();

$(document).ready(function(){
	$(document).bind("ajaxStart.main", function(){
		$("#loading").show();
		$("#loadhere").hide();
	}).bind("ajaxStop.main", function(){
		$("#loading").hide();
		$("#loadhere").show();
	});
	
	$.getJSON("lib/services.php?a=getFilters", function(data){
		$.each(data, function(k, v) {
			$list = $("<ul>");
			$.each(v, function(j, u) {
				// console.log(j+": "+u.type);
				if( u.type == "checkbox" ) {
					$j = '<input type="checkbox" id="'+j+'" /><label for="'+j+'">'+j+'</label><br />';
				}
				else if( u.type == "select" ) {
					$j = $('<select name="'+j+'" />').before(j);
					$.each(u.options, function(key, option) {
						$j.append('<option value="'+option+'">'+option+'</option>');
					});
				}
				$list.append($j);
			});
			$h = '<input type="checkbox" id="'+k+'" value="'+k+'" name="filters" checked="yes" /><label for="'+k+'">'+k+'</label>';
			$("#filters").append($h).append($list);
            $("#filters")
				.find("input[name=filters]")
					.button({ icons: { primary: "ui-icon-check", secondary: "ui-icon-triangle-1-n" }, text: true })
					.live("click", function(){
						if( this.checked ) {
							$(this).next().next("ul").stop().show();
							$(this).button("option", "icons", {primary: "ui-icon-check", secondary: "ui-icon-triangle-1-n"});
						}
						else {
							$(this).next().next("ul").stop().hide();
							$(this).button("option", "icons", {primary: "ui-icon-close", secondary: "ui-icon-triangle-1-s"});
						}
					});
			$("#filters")
				.find(".ui-button").eq(0).css({ "border-top-left-radius": "2px", "border-top-right-radius": "2px" })
				.siblings(".ui-button:last").next("ul:visible").css({ "border-bottom-left-radius": "2px", "border-bottom-right-radius": "2px", "border-bottom": "1px #BFBFBF solid" })
			$("#filters")
				.find(".ui-button:last")
				.live("click", function(){
					if( $(this).next("ul").is(":visible") ) {
						$(this).css({ "border-bottom-left-radius": "4px", "border-bottom-right-radius": "4px", "border-bottom": "1px #BFBFBF solid" });
					}
					else {
						$(this).css({ "border-radius": "0px", "border-bottom": "none" });
					}
				});
			;
		});
	});
	
	$.routes({
		'/explore': function(){ display("explore"); console.log("explore"); },
		'/artists': function(){ display("artists"); console.log("artists"); },
		'/artists/:artist': function(artist){ console.log(artist.artist); }
	});
	
	if( !$.routes("get") || $.routes("get") == "" ){
		window.location = "#/explore";
	}
	
	places_highlight($.address.pathNames()[0]);
	
	function places_highlight(id) {
		$("ul#places").find("#"+id).addClass("active").siblings("li").removeClass("active");
	}
	
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
						
						$("<div>", {
							class: "item-shadow"
						}).appendTo(item);
						
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
								
								if( $(this).attr("data-provider") == "youtube.com" || $(this).attr("data-provider") == "youtu.be" ) {
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
