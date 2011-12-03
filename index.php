<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="author" content="Robert Romore" />
	<link href='http://fonts.googleapis.com/css?family=Chivo' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Sansita+One' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Istok+Web:400,700' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Signika+Negative' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="css/jquery.ui/Aristo/Aristo.css" />
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="css/player.css" />
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://raw.github.com/syntacticx/routesjs/master/jquery.routes.min.js"></script>
    <!--
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jqueryui.js"></script>
	-->
    <script type="text/javascript" src="js/soundcloud.player.api.js"></script>
    <!--<script type="text/javascript" src="js/jquery.address.js"></script>-->
    <!--
    <script type="text/javascript" src="js/jquery.imagesloaded.js"></script>
    <script type="text/javascript" src="js/jquery.lazyload.js"></script>
    -->
    <script type="text/javascript" src="js/player.js"></script>
    <script type="text/javascript" src="js/ui.js"></script>
    <script type="text/javascript" src="js/musicplayer.js"></script>
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
			<li id="explore" class="active"><a href="#/explore">Explore Music</a></li>
			<li id="favorites"><a href="#/favorites">Favorites</a></li>
			<li id="artists"><a href="#/artists">Artists</a></li>
			<li id="albums"><a href="albums">Albums</a></li>
			<li id="events"><a href="events">Events</a></li>
			<li id="playlists"><a href="playlists">Playlists</a></li>
			<li id="options"><a href="options">Options</a></li>
		</ul>
	</div>
</div>
<div class="main container">
	<div id="content">
		<div id="content-left">
				<div id="search" style="margin: 7px;">
					<label class="title" for="search">Search</label>
					<input type="text" id="search" name="search" />
				</div>
				<div id="filters-container" style="margin: 7px;">
					<label class="title" for="filter">Filter by Service</label>
					<div id="filters">
						
					</div>
				</div>
				<div id="views-container" style="margin: 7px;">
					<label class="title" for="views">View Options</label>
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
				Loading...
				<div class="ball"></div>
				<div class="ball1"></div>
			</div>
			<div id="loadhere" class="wall">
				
			</div>
		</div>
	</div>
</div>

<div id="coverart">
	<div id="player"></div>
	<div id="boxshadow"></div>
</div>
<div id="musicbar">
	<div id="artist_info">
		<div id="trackinfo">
			
		</div>
	</div>
	<div id="controls">
		<div class="button medium" id="info">
			<div class="icon">
				<img src="img/musicplayer/info.png" />
			</div>
		</div>
		<div class="button medium" id="heart">
			<div class="icon">
				<img src="img/musicplayer/heart.png" />
			</div>
		</div>
		<div class="button medium" id="eye">
			<div class="icon">
				<img src="img/musicplayer/eye.png" />
			</div>
		</div>
		<div class="spacer">&nbsp;</div>
		<div class="button medium" id="prev">
			<div class="icon">
				<img src="img/musicplayer/prev.png" />
			</div>
		</div>
		<div class="button large" id="play">
			<div class="icon">
				<img src="img/musicplayer/play.png" />
			</div>
		</div>
		<div class="button large" id="pause">
			<div class="icon">
				<img src="img/musicplayer/pause.png" />
			</div>
		</div>
		<div class="button medium" id="next">
			<div class="icon">
				<img src="img/musicplayer/next.png" />
			</div>
		</div>
		<div class="spacer">&nbsp;</div>
		<div id="seekbar">
			<div id="time"><span id="played">00:00</span> / <span id="total-time">00:00</span></div>
			<div class="bar" id="total"></div>
			<div class="bar" id="buffered"></div>
			<div class="bar" id="played"></div>
		</div>
		<div class="spacer">&nbsp;</div>
		<div class="button medium" id="shuffle">
			<div class="icon">
				<img src="img/musicplayer/shuffle.png" />
			</div>
		</div>
		<div class="button medium" id="repeat">
			<div class="icon">
				<img src="img/musicplayer/repeat.png" />
			</div>
		</div>
		<div class="spacer">&nbsp;</div>
		<div id="volumecontrols">
			<div class="button small" id="volumehigh">
				<div class="icon">
					<img src="img/musicplayer/volume-high.png" />
				</div>
			</div>
			<div class="button small" id="volumelow">
				<div class="icon">
					<img src="img/musicplayer/volume-low.png" />
				</div>
			</div>
			<div class="button small" id="muted">
				<div class="icon">
					<img src="img/musicplayer/mute.png" />
				</div>
			</div>
			<div id="volumebar"></div>
		</div>
	</div>
</div>

</body>
</html>
