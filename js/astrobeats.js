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
		},
		'/tracks/*': function(t){
			matches = urldecode(t.path).replace(/\+/g, ' ').split("_");			
			Astrobeats.pages.tracks.load(0, matches);
		}
	},
	queue: [],
	pages: {
		tracks: {
			hasLoaded: false,
			load: function(page, params){
				if( typeof page == "undefined" )
					page = 0;
				if( typeof service == "undefined" )
					service = null;
				if( typeof uid == "undefined" )
					uid = null;
					
				// $("div#loadhere div#tracks").show().css("top", "0px"); 
				
				if( params == null ) {
					// list all
					$("#loadhere").children("#tracks").show().css({ left: 0, right: 0, overflow: "hidden" }).siblings().hide();
					if( !this.hasLoaded ) {
						var i = 0;
						
						console.log($(window).height());
						console.log($(document).height());
						
						var t = setInterval(function(){
							if( $(document).height() <= $(window).height() )
								Astrobeats.items.loadItems($("div#loadhere div#tracks"), "tracks", i++);
							else
								clearInterval(t);
						}, 1000);
						
						Astrobeats.items.loadItems($("div#loadhere div#tracks"), "tracks", i++);
						if( Astrobeats.options.scrollLoad ) {
							$(document).scroll(function(e){
								if( $(window).scrollTop() >= $(document).height() - $(window).height() - Astrobeats.options.scrollLoadOffset ) {
									Astrobeats.items.loadItems($("div#loadhere div#tracks"), "tracks", i++);
								}
							});
						}
						this.hasLoaded = true;
					}
				}
				else {
					// list single item					
					$("#loadhere").children("#tracks-info").show().siblings().hide();
					$("#loadhere").children("#tracks").show().css({ left: "-1000%", right: "1000%" });
					Astrobeats.items.loadItem($("div#loadhere div#tracks-info"), "tracks", params);
				}
			}
		},
		artists: {
			hasLoaded: false,
			load: function(page, service, uid){
				if( typeof page == "undefined" )
					page = 0;
				if( typeof service == "undefined" )
					service = null;
				if( typeof uid == "undefined" )
					uid = null;
				
				if( service == null && uid == null ) {
					// list all
				}
				else {
					// list single item
					
				}
			}
		},
		albums: {
			hasLoaded: false,
			load: function(page, service, uid){
				if( typeof page == "undefined" )
					page = 0;
				if( typeof service == "undefined" )
					service = null;
				if( typeof uid == "undefined" )
					uid = null;
				
				if( service == null && uid == null ) {
					// list all
				}
				else {
					// list single item
					
				}
			}
		},
		playlists: {
			hasLoaded: false,
			load: function(page, service, uid){
				if( typeof page == "undefined" )
					page = 0;
				if( typeof service == "undefined" )
					service = null;
				if( typeof uid == "undefined" )
					uid = null;
				
				if( service == null && uid == null ) {
					// list all
				}
				else {
					// list single item
					
				}
			}
		},
		favorites: {
			hasLoaded: false,
			load: function(page, service, uid){
				if( typeof page == "undefined" )
					page = 0;
				if( typeof service == "undefined" )
					service = null;
				if( typeof uid == "undefined" )
					uid = null;
				
				if( service == null && uid == null ) {
					// list all
				}
				else {
					// list single item
					
				}
			}
		}
	},
	items: {
		loadItems: function(parent, page, n){
			var t = this;
			$.getJSON("lib/"+page+".php?page="+n, function(data){
				$.each(data, function(k, v) {
					$item = $("<div>", {
								class: "item "+v["service"],
								"data-provider": v["provider"],
								"data-url": v["url"],
								"data-title": v["title"],
								"data-artist": v["artist"],
								html: v["output"]
							});
					$more = $("<div>", {
								class: "more"
							}).appendTo($item);
					
					if( v["playable"] ) {
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
					}
					
					$("<img>", {
						src: "img/info.png",
						class: "info"
					}).click(function(e){
						if( v["artist"] == "" || v["song"] == "" )
							var tit = v["title"].replace(/\-/g, "_");
						else
							var tit = v["artist"]+"_"+v["song"];
							
						window.location = "#/tracks/"+urlencode(tit.replace(/ /g, '-').replace(/[!,"'@#$%^&*\(\)\=]/g, ''))+"_"+v["service"]+"_"+v["uid"];
						e.stopPropagation();
					}).appendTo($more);
					$("<img>", {
						src: "img/heart.png",
						class: "heart"
					}).click(function(e){
						Astrobeats.favorites.add($item);
						e.stopPropagation();
					}).appendTo($more);
					$("<img>", {
						src: "img/download.png",
						class: "download"
					}).click(function(e){
						
						e.stopPropagation();
					}).appendTo($more);
					
					$item.bind({
						click: function(e){
							if( v["playable"] ) {
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
										window.player.next();
									}
								}
							}
							else {
								// Astrobeats.pages.tracks.load(0, v["service"], v["uid"]);
							}
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
					parent.append($item);
				});
			});
			// $("#loadhere").children("#"+page).show();
		},
		loadItem: function(parent, page, params) {
			// $("#loadhere").children().hide("slide", { direction: "left" });
			if( matches.length == 4 )
				title = matches[0]+" - "+matches[1];
			else
				title = matches[0];
			provider = $(matches).get(-2);
			uid = $(matches).get(-1);
			
			$.getJSON("lib/"+page+".php?a=getItem&service="+service+"&item="+uid, function(data){
				parent.append(data);
				$(document).scrollTo(0);
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
