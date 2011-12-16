Astrobeats.favorites = {
	favs: $.store.get("favorites") || { tracks: [] },
	save: function(){
		console.log("Saving:");
		console.log(this.favs);
		$.store.set("favorites", this.favs);
	},
	add: function(type, x) {
		this.favs.tracks.push(x);
		this.save();
	},
	remove: function(type, x) {
		
	},
	flush: function(){
		$.store.clear();
	}
};
