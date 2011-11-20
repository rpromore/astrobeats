<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="author" content="Robert Romore" />
	<link href='http://fonts.googleapis.com/css?family=Chivo' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Sansita+One' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Istok+Web:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="css/jquery.ui/Aristo/Aristo.css" />
    <link rel="stylesheet" type="text/css" href="css/elements.css" />
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jqueryui.js"></script>
    <script type="text/javascript" src="js/jquery.address.js?state=#!"></script>
    <script type="text/javascript" src="js/jquery.imagesloaded.js"></script>
    <script type="text/javascript" src="js/masonry.js"></script>
    <script type="text/javascript" src="js/astrobeats.js"></script>
	<title>AstroBeats</title>
</head>
<body>

<div id="header">
	<div class="container">
		<div id="title">
			AstroBeats
		</div>
		<ul id="places">
			<li id="explore" class="active"><a href="explore">Explore Music</a></li>
			<li id="artists"><a href="artists">Artists</a></li>
			<li id="albums"><a href="albums">Albums</a></li>
			<li id="artists"><a href="artists">Events</a></li>
			<li id="playlists"><a href="playlists">Playlists</a></li>
			<li id="options"><a href="options">Options</a></li>
		</ul>
		<div id="musicpanel">
			<button id="prev"></button>
			<button id="play"></button>
			<button id="pause" style="display: none;"></button>
			<button id="next"></button>
			<div id="seekbar" class="bar"></div>
			<button id="heart"></button>
			<button id="download"></button>
			<button id="volumeon"></button>
			<button id="volumeoff" style="display: none;"></button>
			<div id="volumebar" class="bar">
				<div class="bar" style="width: 50%;"></div>
			</div>
		</div>
	</div>
</div>
<div class="main container">
	<div id="content">
		<div id="content-left">
			<div id="search">
				<label for="search">Search</label>
					<input type="text" id="search" name="search" class="pill white" />
				<label for="filter">Filters</label>
					<div id="filters">
						<button class="" id="resources">Resources</button>
						<div class="popup">
							<span><input type="checkbox" /> Last.FM</span>
							<span><input type="checkbox" /> Reddit</span>
							<span><input type="checkbox" /> SoundCloud</span>
							<span><input type="checkbox" /> BeatPort</span>
						</div>
						<!--<button class="" id="genres">Genres</button>-->
					</div>
				<label for="views">View Options</label>
					<div id="viewoptions">
						<p>Display Style</p>
						<div id="display-style" style="text-align: center">
							<input type="radio" id="displaystyle-wall" name="displaystyle" checked /><label for="displaystyle-wall">Wall</label>
							<input type="radio" id="displaystyle-list" name="displaystyle" /><label for="displaystyle-list">List</label>
						</div>
						<p>Thumbnail Size</p>
						<div id="thumbnail-size"></div>
					</div>
			</div>
		</div>
		<div id="content-right">
				<div id="loading">
					<div class="ball"></div>
					<div class="ball1"></div>
				</div>
				<div id="loadhere" class="wall" style="margin: 0 auto; text-align: center;">
					
				</div>
		</div>
	</div>
</div>

</body>
</html>
