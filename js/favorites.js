window.favorites = {
	tracks: {},
	albums: {},
	artists: {},
	events: {},
	add: function(type, x) {
		window.favorites[type].push(x);
	}
};
function addFavorite(type, x) {
	window.favorites.add(type, x);
}
