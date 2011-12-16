<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="author" content="Robert Romore" />
	<link href='http://fonts.googleapis.com/css?family=Chivo' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Sansita+One' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Istok+Web:400,700' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Signika+Negative' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Galdeano' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="css/jquery.ui/Aristo/Aristo.css" />
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="css/player.css" />
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://raw.github.com/syntacticx/routesjs/master/jquery.routes.min.js"></script>
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"></script>
    <script type="text/javascript" src="js/jquery.gmap.js"></script>
    <script type="text/javascript" src="js/soundcloud.player.api.js"></script>
    <script type="text/javascript" src="js/jquery.marquee.js"></script>
    <script type="text/javascript" src="js/json2.js"></script>
    <script type="text/javascript" src="js/jquery.store.js"></script>
    
    <script type="text/javascript" src="js/ui.js"></script>
    <script type="text/javascript" src="js/astrobeats.js"></script>
    <script type="text/javascript" src="js/player.js"></script>
    <script type="text/javascript" src="js/favorites.js"></script>
    <script type="text/javascript" src="js/musicplayer.js"></script>
	<title>AstroBeats</title>
</head>
<body>
<div id="header">
	<div class="container">
		<div id="title">
			AstroBeats
		</div>
		<ul id="places">
			<li id="tracks" class="active"><a href="#/tracks">Tracks</a></li>
			<!--
			<li id="artists"><a href="#/artists">Artists</a></li>
			<li id="albums"><a href="#/albums">Albums</a></li>
			<li id="playlists"><a href="#/playlists">Playlists</a></li>
			-->
			<li id="events"><a href="#/events">Events</a></li>
			<li id="search"><a href="#/search">Search</a></li>
			<li id="favorites"><a href="#/favorites">Favorites</a></li>
			<li id="options"><a href="#/options">Options</a></li>
		</ul>
	</div>
</div>
<div class="main container">
	<div id="content">
		<div id="content-left">
				<div id="search" style="margin: 7px;">
					<form action="/#/search" method="post" id="search">
						<label class="title" for="search">Search</label>
						<center></center><input type="text" id="search" name="search" /><input type="submit" name="submit" value="Go" /></center>
					</form>
				</div>
				<div id="filters-container" style="margin: 7px;">
					<label class="title" for="filter">Filters</label>
					<div id="filters">
						<div id="filters-tracks"></div>
						<div id="filters-favorites"></div>
						<div id="filters-artists"></div>
						<div id="filters-albums"></div>
						<div id="filters-events"></div>
						<div id="filters-playlists"></div>
						<div id="filters-search"></div>
						<div id="filters-options"></div>
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
			<!--
			<div id="loading">
				Loading...
				<div style="position: relative;">
					<div class="ball"></div>
				</div>
			</div>
			-->
			<div id="loadhere" class="wall">
				<div id="tracks"></div>
				<div id="tracks-search"></div>
				<div id="tracks-info"></div>
				<div id="artists"></div>
				<div id="albums"></div>
				<div id="events"></div>
				<div id="events-info"></div>
				<div id="playlists"></div>
				<div id="search"></div>
				<div id="favorites"></div>
				<div id="options">
					<h2>AstroBeats</h2>
					<table width="800px">
						<tr>
							<td width="50%">
								<label for="scrollload">Enable scroll-loading?</label><br />
								<p>Loads more content as you scroll down.</p>
							</td>
							<td width="50%">
								<input type="checkbox" id="scrollload" name="scrollload" checked="checked" />
							</td>
						</tr>
						<tr>
							<td width="50%">
								<label for="scrollload-offset">Scroll-loading offset.</label><br />
								<p>How far towards the bottom before new content is loaded.</p>
							</td>
							<td width="50%">
								<input type="text" name="scrollload-offset" value="150" />
							</td>
						</tr>
					</table>
					
					<h2>Player</h2>
					<table width="800px">
						<tr>
							<td width="50%">
								<label for="shuffling">Shuffling</label><br />
								<p>Randomizes playlist.</p>
							</td>
							<td width="50%">
								<input type="checkbox" id="shuffling" name="shuffling" />
							</td>
						</tr>
						<tr>
							<td width="50%">
								<label for="continuous">Continuous playing.</label><br />
								<p>Automatically plays next song in playlist.</p>
							</td>
							<td width="50%">
								<input type="checkbox" name="continuous" checked="checked" />
							</td>
						</tr>
						<tr>
							<td width="50%">
								<label for="repeat">Repeat</label><br />
								<p>Repeats item in playlist.</p>
							</td>
							<td width="50%">
								<input type="checkbox" id="repeat" name="repeat" />
							</td>
						</tr>
						<tr>
							<td width="50%">
								<label for="autoplay">Autoplay.</label><br />
								<p>Automatically play items as soon as they're ready.</p>
							</td>
							<td width="50%">
								<input type="checkbox" name="autoplay" checked="checked" />
							</td>
						</tr>
					</table>					
				</div>
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
		<div class="button medium disabled" id="info">
			<div class="icon">
				<img src="img/musicplayer/info-disabled.png" />
			</div>
		</div>
		<div class="button medium disabled" id="heart">
			<div class="icon">
				<img src="img/musicplayer/heart-disabled.png" />
			</div>
		</div>
		<div class="button medium disabled" id="eye">
			<div class="icon">
				<img src="img/musicplayer/eye-disabled.png" />
			</div>
		</div>
		<div class="spacer">&nbsp;</div>
		<div class="button medium disabled" id="prev">
			<div class="icon">
				<img src="img/musicplayer/prev-disabled.png" />
			</div>
		</div>
		<div class="button large disabled" id="play">
			<div class="icon">
				<img src="img/musicplayer/play-disabled.png" />
			</div>
		</div>
		<div class="button large" id="pause">
			<div class="icon">
				<img src="img/musicplayer/pause.png" />
			</div>
		</div>
		<div class="button medium disabled" id="next">
			<div class="icon">
				<img src="img/musicplayer/next-disabled.png" />
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
