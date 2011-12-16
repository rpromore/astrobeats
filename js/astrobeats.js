// Following 2 functions from phpjs.
function urldecode(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}
function urlencode (str) {
	str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
function shiftOtherChildren(){
	$("#loadhere").children(":not(#tracks)").hide();
	$("#loadhere #tracks").css("bottom", "1000px");
}
var Astrobeats = {
	options: {
		scrollLoad: true,
		scrollLoadOffset: 150
	},
	routes: {
		'/tracks': function(){
			Astrobeats.pages.tracks.load();
			$.get("lib/tracks.php?page=filters", function(data){
				$("#filters-tracks").html(data);
			});
			places_highlight("tracks");
		},
		'/search': function(){
			$("input#search").focus();
		},
		'/search/*': function(t){
			params = { type: "search", search: t.path };
			Astrobeats.pages.tracks.load(params);
			places_highlight("search");
		},
		'/events': function(){
			Astrobeats.pages.events.load();
			places_highlight("events");
		},
		'/events/*': function(t){
			var parts = t.path.split('_');
			var service = $(parts).get(-2);
			var uid = $(parts).get(-1);
			Astrobeats.items.loadItem($("#loadhere #events-info"), { cat: "events", page: "getItem", uid: uid });
		},
		'/favorites': function(){
			Astrobeats.pages.favorites.load();
			places_highlight("favorites");
		},
		'/options': function(){
			Astrobeats.pages.options.load();
			places_highlight("options");
		}
	},
	pages: {
		currentPage: "tracks",
		options: {
			hasLoaded: false,
			load: function(params){
				$("#loadhere").children("#options").show().siblings().hide();
				if( !this.hasLoaded ) {
					$("#options #scrollload").change(function(){
						if( this.checked )
							Astrobeats.options.scrollLoad = true;
						else
							Astrobeats.options.scrollLoad = false;
					});
					$("#options #scrollload-offset").change(function(){
						Astrobeats.options.scrollOffset = $(this).val();
					});
					$("#options #shuffling").change(function(){
						$(".button#shuffle").trigger("click");
					});
					$("#options #repeat").change(function(){
						$(".button#repeat").trigger("click");
					});
					$("#options #continuous").change(function(){
						if( this.checked )
							Astrobeats.player.options.continous = true;
						else
							Astrobeats.player.options.continuous = false;
					});
					$("#options #autoplay").change(function(){
						if( this.checked )
							Astrobeats.player.options.autoplay = true;
						else
							Astrobeats.player.options.autoplay = false;
					});
					this.hasLoaded = true;
					Astrobeats.pages.currentPage = "options";
				}
			}
		},
		favorites: {
			hasLoaded: false,
			load: function(params){
				$("#loadhere").children("#favorites").html("").show().siblings().hide();
				$("#filters-favorites").html("No filtering options available.").show().siblings().hide();
				$.each(Astrobeats.favorites.favs, function(k, v){
					$.each(v, function(j, w){
						$("#loadhere").children("#favorites").append(Astrobeats.items.createItem(w));
					});
				});
				Astrobeats.pages.currentPage = "favorites";
			}
		},
		tracks: {
			hasLoaded: false,
			load: function(params){
				if( typeof params == "undefined" )
					params = null;
					
				if( params != null && params["type"] == "search" ) {
					var s = params["search"];
					var i = 0;
					Astrobeats.items.loadItems($("div#loadhere div#search"), { cat: "tracks", page: "search", pagenumber: i++, q: s });
					var t = setInterval(function(){
						if( $(document).height() <= $(window).height() )
							Astrobeats.items.loadItems($("div#loadhere div#search"), { cat: "tracks", page: "search", pagenumber: i++, q: s });
						else if( $(document).height() > $(window).height() )
							clearInterval(t);
							
						if( i >= 5 )
							clearInterval(t);
					}, 1000);
				}
				else {
					if( !this.hasLoaded ) {
						var i = 0;
						
						Astrobeats.items.loadItems($("div#loadhere div#tracks"), { cat: "tracks", pagenumber: i++ });
						var t = setInterval(function(){
							if( $(document).height() <= $(window).height() )
								Astrobeats.items.loadItems($("div#loadhere div#tracks"), { cat: "tracks", pagenumber: i++ });
							else if( $(document).height() > $(window).height() )
								clearInterval(t);
								
							if( i >= 5 )
								clearInterval(t);
						}, 1000);
						
						if( Astrobeats.options.scrollLoad ) {
							$(document).scroll(function(e){
								if( $(window).scrollTop() >= $(document).height() - $(window).height() - Astrobeats.options.scrollLoadOffset ) {
									Astrobeats.items.loadItems($("div#loadhere div#tracks"), { cat: "tracks", pagenumber: i++ });
								}
							});
						}
						this.hasLoaded = true;
					}
					$("#loadhere").children("#tracks").show().siblings().hide();
					Astrobeats.pages.currentPage = "tracks";
				}
			}
		},
		events: {
			hasLoaded: false,
			load: function(params){
				$.get("lib/events.php?page=getFilters", function(data){
					var d = $(data);
					$("#filters-events").html(data);
				});
				
				if( typeof params == "undefined" )
					params = null;
					
				if( params != null && params["type"] == "search" ) {
					var s = params["search"];
					var i = 0;
					Astrobeats.items.loadItems($("div#loadhere div#search"), { cat: "events", page: "search", pagenumber: i++, q: s });
					var t = setInterval(function(){
						if( $(document).height() <= $(window).height() )
							Astrobeats.items.loadItems($("div#loadhere div#search"), { cat: "events", page: "search", pagenumber: i++, q: s });
						else if( $(document).height() > $(window).height() )
							clearInterval(t);
							
						if( i >= 5 )
							clearInterval(t);
							
						console.log("timer active");
					}, 1000);
				}
				else {
					if( !this.hasLoaded ) {
						var i = 0;
						
						Astrobeats.items.loadItems($("div#loadhere div#events"), { cat: "events", pagenumber: i++ });
						var t = setInterval(function(){
							if( $(document).height() <= $(window).height() )
								Astrobeats.items.loadItems($("div#loadhere div#events"), { cat: "events", pagenumber: i++ });
							else if( $(document).height() > $(window).height() )
								clearInterval(t);
								
							if( i >= 5 )
								clearInterval(t);
								
							console.log("timer active");
						}, 1000);
						// wait 2 seconds before seeing if there are enough results
						
						if( Astrobeats.options.scrollLoad ) {
							$(document).scroll(function(e){
								if( $(window).scrollTop() >= $(document).height() - $(window).height() - Astrobeats.options.scrollLoadOffset ) {
									Astrobeats.items.loadItems($("div#loadhere div#events"), { cat: "events", pagenumber: i++ });
								}
							});
						}
						this.hasLoaded = true;
					}
					$("#loadhere").children("#events").show().siblings().hide();
					Astrobeats.pages.currentPage = "events";
				}
			}
		}
	},
	items: {
		createItem: function(options) {
			$item = $("<div>", options)
			.bind({
				click: function(e){
					/*
					if( $.inArray($(this), Astrobeats.favorites.tracks) > 0 ) {
						$(".button#heart").find("img").attr("src", "img/musicplayer/heart-active.png");
						addFavorite(Astrobeats.pages.currentPage, $(this).clone(true));
						save();
					}
					else {
						$(".button#heart").find("img").attr("src", "img/musicplayer/heart.png");
						// Astrobeats.favorites.remove(Astrobeats.pages.currentPage, $(this).clone(true));
					}
					*/
					if( options["data-playable"] ) {
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
							
							$("#artist_info #trackinfo").html('<marquee scrollamount="2" behavior="alternate">'+$(this).attr("data-title")+'</marquee>');
							
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
								Astrbeats.player.next();
							}
						}
					}
					else if( options["data-info"] )
						$(this).find(".info").trigger("click");
					e.stopPropagation();
				},
				mouseenter: function(){
					$(this).children(".desc").stop().animate({ left: "0px" }, {duration: 400, easing: "easeOutExpo"});
					$(this).children(".more").stop().animate({ bottom: "0px" }, {duration: 500, easing: "easeOutExpo"});
				}, 
				mouseleave: function(){
					$(this).not(".playing").children(".desc").stop().animate({ left: "187px" }, {duration: 700, easing: "easeOutBounce"});
					$(this).not(".playing").children(".more").stop().animate({ bottom: "-26px" }, {duration: 800, easing: "easeOutExpo"});
				}
			});
	
			$more = $("<div>", {
						class: "more"
					}).appendTo($item);
			
			if( options["data-playable"] ) {
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
				$("#musicbar").find("#play").removeClass("disabled").find("img").attr("src", "img/musicplayer/play.png");
			}
			if( options["data-info"] ) {
				$("<img>", {
					src: "img/info.png",
					class: "info"
				}).click(function(e){					
					tit = options["data-title"];	
					window.location = "#/events/"+urlencode(tit.replace(/ /g, '-').replace(/[!,"'@#$%^&*\(\)\=]/g, ''))+"_"+options["data-service"]+"_"+options["data-uid"];
					e.stopPropagation();
				}).appendTo($more);
			}
			if( options["data-download"] ) {
				$("<img>", {
					src: "img/download.png",
					class: "download"
				}).click(function(e){
					
					e.stopPropagation();
				}).appendTo($more);
			}
			
			$("<img>", {
				src: "img/heart.png",
				class: "heart"
			}).click(function(e){
				if( $.inArray($(this).parents(".item"), Astrobeats.favorites.tracks) < 0 ) {
					if( $(this).parents(".item").is(".playing") )
						$(".button#heart").find("img").attr("src", "img/musicplayer/heart-active.png");
					Astrobeats.favorites.add(Astrobeats.pages.currentPage, options);
				}
				else {
					if( $(this).parents(".item").is(".playing") )
						$(".button#heart").find("img").attr("src", "img/musicplayer/heart.png");
					//(Astrobeats.pages.currentPage, $(this).parents(".item").clone(true).trigger("mouseleave"));
				}
				e.stopPropagation();
			}).appendTo($more);
			return $item;
		},
		loadItems: function(parent, params){
			$.getJSON("lib/"+params["cat"]+".php", params, function(data){
				$.each(data, function(k, v) {
					var options = {
						class: "item "+v["service"],
						"data-provider": v["provider"],
						"data-url": v["url"],
						"data-title": v["title"],
						"data-artist": v["artist"],
						"data-playable": v["playable"],
						"data-info": v["info"],
						"data-uid": v["uid"],
						"data-service": v["service"],
						html: v["output"]
					};
					parent.append(Astrobeats.items.createItem(options));
				});
				parent.show().siblings().hide();
			});
		},
		loadItem: function(parent, params) {
			$.get("lib/"+params["cat"]+".php", params, function(data){
				parent.html(data).show().siblings().hide();
			});
		}
	}
};

$(document).ready(function(){	
	$.routes(Astrobeats.routes);
	if( !$.routes("get") || $.routes("get") == "" ){
		window.location = "#/tracks";
	}
});
