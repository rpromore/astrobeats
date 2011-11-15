<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="author" content="Robert Romore" />
	<link href='http://fonts.googleapis.com/css?family=Chivo' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Sansita+One' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Istok+Web:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="jquery.ui/css/Aristo/Aristo.css" />
    <link rel="stylesheet" type="text/css" href="elements.css" />
    <link rel="stylesheet" type="text/css" href="style.css" />
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="jquery.ui/js/ui.js"></script>
    <script type="text/javascript" src="jquery.address.js?state=#!"></script>
    <script type="text/javascript" src="jquery.imagesloaded.js"></script>
    <script type="text/javascript" src="masonry.js"></script>
    <script type="text/javascript" src="notes.js"></script>
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
			<!--
			<li id="tracks"><a href="tracks">Tracks</a></li>
			<li id="concerts"><a href="concerts">Concerts</a></li>
			<li id="artists"><a href="artists">Artists</a></li>
			<li id="playlists"><a href="playlists">Playlists</a></li>
			<li id="videos"><a href="videos">Videos</a></li>
			<li id="options"><a href="options">Options</a></li>
			-->
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
<div class="container">
	<div id="content">
		<div id="content-left">
			<div id="search">
				<label for="search">Search</label>
					<input type="text" id="search" name="search" class="pill white" />
				<label for="filter">Filters</label>
					<div id="filters">
						<button class="" id="resources">Resources</button>
						<div class="popup">
							<span><input type="checkbox" /> Reddit</span>
							<span><input type="checkbox" /> SoundCloud</span>
							<span><input type="checkbox" /> GrooveShark</span>
						</div>
						<button class="" id="genres">Genres</button>
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
			<div style="position: absolute; top: 0px; left: 0px; bottom: 0px; right: 0px; overflow: auto; padding: 10px 0 0 10px;">
				<div id="loading">
					<div class="ball"></div>
					<div class="ball1"></div>
				</div>
				<div id="loadhere" class="wall" style="margin: 0 auto;">
					
				</div>
			</div>
		</div>
	</div>
</div>

</body>
</html>
