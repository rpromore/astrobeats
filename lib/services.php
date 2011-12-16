<?php
error_reporting(E_ALL ^ E_NOTICE);
define("MAXLIMIT", 50);
define("LIMIT", 10);

/**
* Works on URLs like:
* http://www.youtube.com/watch?v=0bt9xBuGWgw
* http://youtu.be/0bt9xBuGWgw
*
* outputs just the video id
**/
// source: http://forrst.com/posts/Simple_Youtube_video_ID_parser-Ykw
function YTvid($videourl) {
    $longurl = preg_match("#(?<=v=)[a-zA-Z0-9-]+(?=&)|(?<=[0-9]\/)[^&\n]+|(?<=v=)[^&\n]+#", $videourl, $ytid );

    if( !$longurl ) {
        $ytpath = parse_url($videourl);
        if( $ytpath['host'] == 'youtu.be' )
            $ytid = ltrim( $ytpath['path'],'/');
    }
    return $longurl ? $ytid[0] : $ytid;
}

interface Service {	
	/**
	 * @return Array
	 */
	public function getItems($start, $length);
}

class Services implements Service {
	protected static $services = array();
	
	public function getServices() {
		return Services::$services;
	}
	public function addService($arr) {
		Services::$services = array_merge(Services::$services, $arr);
	}
	public function getSortingMethods(){
		
	}
	public function getItems($start, $length) {
		
	}
}

class Youtube extends Services {
	private $items = array();
	function video_search($q) {
		$results = json_decode(file_get_contents("http://gdata.youtube.com/feeds/api/videos?q=" . urlencode($q) . "&alt=json&max-results=" . MAXLIMIT), true);
		foreach( $results["feed"]["entry"] AS $k => $v ) {
			$arr["title"] = $v['title']['$t'];
			$arr["description"] = $v['content']['$t'];
			$arr["provider"] = "youtube.com";
			$arr["service"] = "youtube.com";
			$arr["image"] = $v['media$group']['media$thumbnail'][0]['url'];
			if( $arr["image"] != "" )
				$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2>' . $arr["description"] . '</div>';
			else
				$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2>' . $arr["description"] . '</div>';
			
			$arr["url"] = str_replace('/', '', strrchr($v['id']['$t'], '/'));
			
			$arr["playable"] = true;
			$this->items[] = $arr;
		}
	}
	function getItems($start = 0, $length = LIMIT) {
		$items = array_slice($this->items, $start, $length);
		return $items;
	}
}

class Reddit extends Services {
	protected $subreddits = array("listentothis");
	
	public function __construct($page = 0) {
		parent::addService(array("Reddit" => array()));
	}
	public function loadItemFromId($id) {
		
	}
	public function loadItemFromArray($i) {
		$allowed_providers = array("youtube.com", "youtu.be", "soundcloud.com");
		$arr["provider"] = $i["data"]["domain"];
		if( in_array($arr["provider"], $allowed_providers) ) {
			$arr["title"] = $i["data"]["title"];
			$arr["service"] = "reddit";
			
			$arr["image"] = $i["data"]["media"]["oembed"]["thumbnail_url"];
			if( $arr["image"] != "" )
				$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
			else
				$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2></div>';
			
			$str = trim(preg_replace("/(\(.*\)|\[.*\])/", "", $i["data"]["title"]));
			preg_match("/(.*) \- (.*)/", $str, $matches);
			
			$arr["artist"] = !empty($matches[1]) ? $matches[1] : "";
			$arr["song"] = !empty($matches[2]) ? $matches[2] : "";
			$arr["playable"] = true;
			$arr["uid"] = $i["data"]["id"];
			
			if( $arr["provider"] == "youtube.com" || $arr["provider"] == "youtu.be" )
				$arr["url"] = YTvid($i["data"]["url"]);
			else
				$arr["url"] = $i["data"]["url"];
			
			return $arr;
		}
		else
			return false;
	}
	public function getItems($start = 0, $length = LIMIT) {
		$subreddits = implode("+", $this->subreddits);
		// caching here
		$items = json_decode(file_get_contents("http://reddit.com/r/$subreddits.json?limit=" . MAXLIMIT), true);
		$items = $items["data"]["children"];
		$ret = array();
		// foreach( $items AS $k => $i ) {
		for( $y = $start; $y < $start+$length; $y++ ) {
			$i = $items[$y];
			$r = $this->loadItemFromArray($i);
			if( !empty($r) )
				$ret[] = $r;
		}
		return $ret;
	}
}

class SoundCloud extends Services {
	protected $items = array();
	protected $page;
	protected $method;
	private $clientId = "c6dc5b166e3d58345cc4751665f9ce08";
	private $q = "";
	
	public function __construct($method = "tracks", $q = "") {
		parent::addService(array("SoundCloud" => array()));
		$this->method = $method;
		$this->q = $q;
	}
	public function getName() {
		return "SoundCloud";
	}
	
	public function getItems($start = 0, $length = LIMIT) {
		$weekago = date("Y-m-d+00:00:00", strtotime("1 week ago"));
		switch( $this->method ) {
			case "tracks":
				$this->items = json_decode(file_get_contents("http://api.soundcloud.com/tracks.json?q={$this->q}&client_id={$this->clientId}&created_at[from]=$weekago"), true);
				break;
			case "users":
				break;
			case "playlists":
				break;
			case "resolve":
				break;
		}
		$ret = array();
		$this->items = array_slice($this->items, $start, $length);
		foreach( $this->items AS $k => $i ) {
			$arr = array();
			$arr["title"] = $i["title"];
			$arr["service"] = "soundcloud";
			$arr["provider"] = "soundcloud.com";
			$arr["image"] = !empty($i["artwork_url"]) ? $i["artwork_url"] : $i["user"]["avatar_url"];
			$arr["image"] = str_replace("large.jpg", "t300x300.jpg", $arr["image"]);
			preg_match("/(.*) \- (.*)/", $i["title"], $matches);
			
			$arr["artist"] = !empty($matches[1]) ? $matches[1] : "";
			$arr["song"] = !empty($matches[2]) ? $matches[2] : "";
			$arr["url"] = $i["permalink_url"];
			
			$arr["playable"] = true;
			
			$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
			$ret[] = $arr;
		}
		return $ret;
	}
}
class LastFM extends Services {
	private $method;
	private $api_key = "b25b959554ed76058ac220b7b2e0a026";
	
	public function __construct($method = "geo.getEvents") {
		parent::addService(array("LastFM" => array()));
		$this->method = $method;
	}
	public function getItems($start = 0, $length = LIMIT, $params = array()) {
		$url = "";
		$items = array();
		switch( $this->method ) {
			case "album.getBuyLinks":
				$artist = $params["artist"];
				$album = $params["album"];
				$mbid = $params["mbid"];
				$autocorrect= $params["autocorrect"];
				$country = $params["country"];
				if(($artist == null || $album == null) && $mbid == null)
					die("Missing Information");

				$url = "http://ws.audioscrobbler.com/2.0/?method=album.getBuyLinks&api_key={$this->api_key}&artist=$artist&album=$album&mbid=$mbid&autocorrect=$autocorrect&country=$country&format=json";
				$items = json_decode(file_get_contents($url),true);
				$ret = $items["affiliations"]["downloads"]["affiliation"];
				break;
				
			case "album.getInfo":
				$artist = $params["artist"];
				$album = $params["album"];
				$mbid = $params["mbid"];
				$lang = $params["lang"];
				$autocorrect = $params["autocorrect"];
				$username = $params["username"];
				if(($album == null || $artist == null) && $mbid == null)
					die("Missing Information");				
				$url = "http://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key={$this->api_key}&artist=$artist&album=$album&mbid=$mbid&autocorrect=$autocorrect&lang=$lang&username=$username&format=json";
				$items = json_decode(file_get_contents($url), true);
				
				$ret = array();
				$ret["name"] = $items["name"];
				$ret["artist"] = $items["artist"];
				$ret["id"] = $items["id"];
				$ret["mbid"] =$items["mbid"];
				$ret["url"] = $items["url"];
				$ret["date"] = $items["releasedate"];
				$ret["image"] = $items["image"][3]["#text"];
				break;
			case "album.search":
				$album = $params["album"];
				$page = $params["page"];
				$limit = $params["limit"];
				if($album == null){
					die("No Album Given");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=album.search&api_key={$this->api_key}&album=$album&page=$page&limit=$limitformat=json";
				$items = json_decode(file_get_contents($url),true);
				
				$ret = array();
				$arr = array();
				$items = array_slice($items["albummatches"]["album"],$start,$length);
				
				foreach($items AS  $k => $v){
					$arr["artist"] = $v["artist"];
					$arr["album"] = $v["name"];
					$arr["mbid"] = $v["mbid"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					$ret[] = $arr;
				}
				
				break;
			case "artist.getEvents":
				$artist = $params["artist"];
				$mbid = $params["mbid"];
				$autocorrect = $params["autocorrect"];
				$limit = $params["limit"];
				$page = $params["page"];
				$festivonly= $params["festivalonly"];
				if(artist == null && mbid == null)
					die("Need artist or mbid");
				
				$url = "http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key={$this->api_key}&artist=$artist&ambid=$mbid&autocorrect=$autocorrect&limit=$limit&page=$page&festivalonly=$festivonly&format=json";
				$items = json_decode(file_get_contents($url),true);
				$items = array_slice($items["events"]["event"],$start,$length);
				$arr = array();
				$ret = array();
				
				foreach($items AS $k => $v){
					$arr["title"] = $v["title"];
					$arr["provider"] = "last.fm";
					$arr["service"] = "lastfm";
					$arr["description"] = $v["description"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					$arr["artists"] = $v["artists"];
					
					if($arr["image"] != "")
						$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2>' . $description . '</div>';
					
					else
						$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2>' . $description . '</div>';
						
					$ret[] = $arr;
				}

				break;
			case "artist.getSimilar":
				$limit = $params["limit"];
				$artist = $params["artist"];
				$mbid = $params["mbid"];
				$autocorrect = $params["autocorrect"];
				
				if($artist == null && $mbid == null){
					die("No artist or mbid");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&api_key={$this->api_key}&artist=$artist&ambid=$mbid&autocorrect=$autocorrect&limit=$limit&format=json";
				$items = json_decode(file_get_contents($url),true);
				$items = array_slice($items["similarartists"]["artist"],$start,$length);
				$arr = array();
				$ret = array();
				
				foreach($items AS $k => $v){
					$arr["artist"] = $v["name"];
					$arr["mbid"] = $v["mbid"];
					$arr["match"] = $v["match"]; #Uh comment?
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					
					$ret[] = $arr;
				
				}

				break;
			case "artist.getTopAlbums":
				$artist = $params["artist"];
				$mbid = $params["mbid"];
				$autocorrect = $params["autocorrect"];
				$page = $params["page"];
				$limit = $params["limit"];
				
				if($artist == null && $mbid == null){
					die("No artist or mbid");					
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopablums&api_key={$this->api_key}&artist=$artist&ambid=$mbid&autocorrect=$autocorrect&limit=$limit&page=$page&format=json";
				
				$items = json_decode(file_get_contents($url),true);
				$items = array_slice($items["tobalbums"]["album"],$start,$length);
				$arr = array();
				$ret = array();
				
				foreach($items AS $k => $v){
					//$arr["artist"] = $artist;
					$arr["artist"] = $v["artist"]["name"];
					$arr["album"] = $v["name"];
					$arr["mbid"] = $v["mbid"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					$ret[] = $arr;
				}

				break;
			case "artist.getTopTracks":
				$artist = $params["artist"];
				$mbid = $params["mbid"];
				$autocorrect = $params["autocorrect"];
				$page = $params["page"];
				$limit = $params["limit"];
				
				if($artist == null && $mbid == null){
					die("No artist or mbid");					
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopablums&api_key={$this->api_key}&artist=$artist&ambid=$mbid&autocorrect=$autocorrect&limit=$limit&page=$page&format=json";
				
				$items = json_decode(file_get_contents($url),true);
				$items = array_slice($items["toptracks"]["track"],$start,$length);
				$arr = array();
				$ret = array();
				
				foreach($items AS $k => $v){
					//$arr["artist"] = $artist;
					$arr["artist"] = $v["artist"]["name"];
					$arr["track"] = $v["name"];
					//$arr["time"] = $v["duration"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					$ret[] = $arr; 
				}

				break;
			case "artist.search":
				$artist = $params["artist"];
				$page = $params["page"];
				$limit = $params["limit"];
				
				
				if($artist == null){
					die("No Artist Given");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&api_key={$this->api_key}&artist=$artist&page=$page&limit=$limit&format=json";
				$items = json_decode(file_get_contents($url),true);
				
				$ret = array();
				$arr = array();
				$items = array_slice($items["artistmatches"]["artist"],$start,$length);
				
				foreach($items AS  $k => $v){
					$arr["artist"] = $v["name"];
					$arr["mbid"] = $v["mbid"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					$ret[] = $arr;
				}
				

				break;
			case "chart.getHypedArtists":
				$page = $params["page"];
				$limit = $params["limit"];
				
				$url = "http://ws.audioscrobbler.com/2.0/?method=chart.gethypedartists&api_key={$this->api_key}&page=$page&limit=$limit&format=json";
				$items = json_decode(file_get_contents($url),true);
				$items = array_slice($items["artists"]["artist"],$start,$length);
				$arr = array();
				$ret = array();
				foreach($items AS $k => $v){
					$arr["artist"] = $v["name"];
					$arr["mbid"] = $v["mbid"];
					$arr["url"] = $v["url"];
					$arr["image"] =$v["image"][3]["#text"];
					$ret[] = $arr;
				}

				break;
			case "chart.getHypedTracks":
				$page = $params["page"];
				$limit = $params["limit"];
				
				$url = "http://ws.audioscrobbler.com/2.0/?method=chart.gethypedtracks&api_key={$this->api_key}&page=$page&limit=$limit&format=json";
				$items = json_decode(file_get_contents($url),true);
				$items = array_slice($items["tracks"]["track"],$start,$length);
				$arr = array();
				$ret = array();
				foreach($items AS $k => $v){
					$arr["artist"] = $v["artist"]["name"];
					$arr["song"] = $v["name"];
					$arr["title"] = $arr["artist"] . " - " . $arr["song"];
					$arr["service"] = "lastfm";
					
					$yt_results = json_decode(file_get_contents("http://gdata.youtube.com/feeds/api/videos?q=" . urlencode($arr["title"]) . "&alt=json&max-results=1"), true);
					
					if( $yt_results == null ) break;
					
					$arr["provider"] = "youtube.com";
					if( $v["image"] != null )
						$arr["image"] = $v["image"][3]["#text"];
					else
						$arr["image"] = $yt_results['feed']['entry'][0]['media$group']['media$thumbnail'][0]['url'];
						
					if( $arr["image"] != "" )
						$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
					else
						$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2></div>';
					
					$arr["url"] = str_replace('/', '', strrchr($yt_results['feed']['entry'][0]['id']['$t'], '/'));
					
					$arr["playable"] = true;
					// $arr["uid"] = $i["data"]["id"];
					
					$ret[] = $arr;
				}

				break;
			case "chart.getTopArtists":
				$page = $params["page"];
				$limit = $params["limit"];
				
				$url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key={$this->api_key}&page=$page&limit=$limit&format=json";
				$items = json_decode(file_get_contents($url),true);
				$items = array_slice($items["artists"]["artist"],$start,$length);
				$arr = array();
				$ret = array();
				
				foreach($items AS $k => $v){
					$arr["artist"] = $v["name"];
					$arr["mbid"] = $v["mbid"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					
					$ret[] = $arr;
				
				}

				break;
			case "chart.getTopTracks":
				$page = $params["page"];
				$limit = $params["limit"];
				
				$url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key={$this->api_key}&page=$page&limit=$limit&format=json";
				$items = json_decode(file_get_contents($url),true);
				$items = array_slice($items["tracks"]["track"],$start,$length);
				$arr = array();
				$ret = array();
				
				foreach($items AS $k => $v){
					$arr["artist"] = $v["artist"]["name"];
					$arr["track"] = $v["name"];
					$arr["url"] = $v["url"];
					$arr["time"] = $v["duration"];
					
					$ret[] = $arr;
				}

				break;
			case "event.getInfo":
				$event = $params["event"];
				if($event == null){
					die("No event");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=event.getinfo&api_key={$this->api_key}&event=$event&format=json";
				$items = json_decode(file_get_contents($url),true);
				
				$title = $items["event"]["title"];
				$start = $items["event"]["startDate"];
				$description = $items["event"]["description"];
				$artists = $items["event"]["artists"];
				$url = $items["event"]["url"];
				$venue = $items["event"]["venue"];
				
				$vname = $venue["name"];
				$vurl = $venue["website"] != "" ? $venue["website"] : $venue["url"];
				$vstreet = $venue["location"]["street"];
				$vcity = $venue["location"]["city"];
				$vcountry = $venue["location"]["country"];
				$vzip = $venue["location"]["postalcode"];
				$vphone = $venue["phonenumber"];
				$vphone = $vphone != "" ? "<b>Phone:</b> " . $vphone : "";
				
				$lat = $venue["location"]["geo:point"]["geo:lat"];
				$long = $venue["location"]["geo:point"]["geo:long"];
				
				echo "<h1><a href=\"$url\" target=\"_blank\">$title</a></h1>";
				if( $description != null ) {
					echo "<strong>Description</strong>";
					echo $description;
				}
				echo "<strong>When</strong>";
				echo $start;
				echo "<strong>Who</strong>";
				foreach( $artists["artist"] AS $k => $v ) {
					$vv = urlencode($v);
					echo "<a href=\"http://last.fm/music/$vv\" target=\"_blank\">$v</a>, ";
				}
				echo "<strong>Where</strong>";
				echo <<<EOT
<div style="width:200px; float: left;">
	<strong><a href="$vurl" target="_blank">$vname</a></strong>
	$vstreet<br />
	$vcity, $vcountry<br />
	$vzip<br />
	$vphone
</div>
<div style="width: 600px; float: left;"><div id="map_canvas">map</div></div>

<script type="text/javascript">
 var latlng = new google.maps.LatLng($lat, $long);
    var myOptions = {
      zoom: 8,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
</script>
EOT;
				break;
			case "geo.getEvents":
				$lat = $params["latitude"];
				$long = $params["longitude"];
				$location = $params["location"];
				$distance = $params["distance"];
				if( $location != null )
					$url = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=$location&api_key={$this->api_key}&format=json&limit=50";
				elseif( $lat != null && $long != null )
					$url = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key={$this->api_key}&lat=$lat&long=$long&format=json&limit=50";

				$items = json_decode(file_get_contents($url), true);
				// $items = array_slice($items["events"]["event"], $start, $length);
				$ret = array();
				$arr = array();
				// foreach( $items AS $k => $v ) {
				for( $y = $start; $y < $length; $y++ ) {
					$v = $items["events"]["event"][$y];
					$arr["title"] = $v["title"];
					$arr["provider"] = "last.fm";
					$arr["service"] = "lastfm";
					$arr["description"] = $v["description"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					$arr["artists"] = $v["artists"];
					$arr["uid"] = $v["id"];
					if( $arr["image"] != "" )
						$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2>' . $description . '</div>';
					else
						$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2>' . $description . '</div>';
					
					$arr["info"] = "<h2>{$arr['title']}</h2>";
					$ret[] = $arr;
				}
				break;
				
			case "track.getBuyLinks":
				$artist = $params["artist"];
				$track = $params["track"];
				$mbid = $params["mbid"];
				$autocorrect= $params["autocorrect"];
				$country = $params["country"];
				if(($artist == null || $track == null) && $mbid == null){
					die("Missing Information");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=track.getBuyLinks&api_key={$this->api_key}&artist=$artist&track=$track&mbid=$mbid&autocorrect=$autocorrect&country=$country&format=json";
				$items = json_decode(file_get_contents($url),true);
				$ret = array();
				$ret = $items["affiliations"]["downloads"]["affiliation"];
				

				break;
			case "track.getInfo":
				$artist = $params["artist"];
				$track = $params["track"];
				$mbid = $params["mbid"];
				$autocorrect= $params["autocorrect"];
				$username = $params["username"];
				if(($artist == null || $track == null) && $mbid == null){
					die("Missing Information");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=track.getgetinfo&api_key={$this->api_key}&artist=$artist&track=$track&mbid=$mbid&autocorrect=$autocorrect&username=$username&format=json";
				$items = json_decode(file_get_contents($url),true);
				$ret = array();
				
				
				$v = $items["track"];
				$arr["artist"] = $v["artist"]["name"];
				$arr["song"] = $v["name"];
				$arr["title"] = $arr["artist"] . " - " . $arr["song"];
				$arr["service"] = "lastfm";
				
				$yt_results = json_decode(file_get_contents("http://gdata.youtube.com/feeds/api/videos?q=" . urlencode($arr["title"]) . "&alt=json&max-results=1"), true);
				
				if( $yt_results == null ) break;
				
				$arr["provider"] = "youtube.com";
				if( $v["album"]["image"] != null )
					$arr["image"] = $v["album"]["image"][3]["#text"];
				else
					$arr["image"] = $yt_results['feed']['entry'][0]['media$group']['media$thumbnail'][0]['url'];
					
				if( $arr["image"] != "" )
					$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
				else
					$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2></div>';
				
				$arr["playable"] = true;
				// $arr["uid"] = $i["data"]["id"];
				
				$arr["url"] = str_replace('/', '', strrchr($yt_results['feed']['entry'][0]['id']['$t'], '/'));
				
				$ret[] = $arr;
				
				break;
			case "track.getSimilar":
				$artist = $params["artist"];
				$track = $params["track"];
				$mbid = $params["mbid"];
				$autocorrect= $params["autocorrect"];
				$limit = $params["limit"];
				if(($artist == null || $track == null) && $mbid == null){
					die("Missing Information");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=track.getgetinfo&api_key={$this->api_key}&artist=$artist&track=$track&mbid=$mbid&autocorrect=$autocorrect&limit=$limit&format=json";
				$items= json_decode(file_get_contents($url),true);
				$items = array_splice($items["similartracks"]["track"],$start,$length);
				$ret = array();
				$arr = array();
				foreach($items AS $k => $v){
					$arr["track"] = $v["name"];
					$arr["url"] = $v["url"];
					$arr["artist"]= $v["artist"]["name"];
					$arr["image"] = $v["image"][3]["#text"];
					
					$ret[] = $arr;
				}
				
				break;
			case "track.search":
				$track = urlencode($params["track"]);
				$artist = urlencode($params["artist"]);
				if($track == null && $artist == null){
					die("Missing information.");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=track.getgetinfo&api_key={$this->api_key}&artist=$artist&track=$track&page=$page&limit=$limit&format=json";
				
				$items = json_decode(file_get_contents($url),true);
				$ret = array();
				$arr = array();
				
				$v = $items["track"];
				$arr["artist"] = $v["artist"]["name"];
				$arr["song"] = $v["name"];
				$arr["title"] = $arr["artist"] . " - " . $arr["song"];
				$arr["service"] = "lastfm";
				
				$yt_results = json_decode(file_get_contents("http://gdata.youtube.com/feeds/api/videos?q=" . urlencode($arr["title"]) . "&alt=json&max-results=1"), true);
				
				if( $yt_results == null ) break;
				
				$arr["provider"] = "youtube.com";
				if( $v["album"]["image"] != null )
					$arr["image"] = $v["album"]["image"][3]["#text"];
				else
					$arr["image"] = $yt_results['feed']['entry'][0]['media$group']['media$thumbnail'][0]['url'];
					
				if( $arr["image"] != "" )
					$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
				else
					$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2></div>';
				
				$arr["playable"] = true;
				// $arr["uid"] = $i["data"]["id"];
				
				$arr["url"] = str_replace('/', '', strrchr($yt_results['feed']['entry'][0]['id']['$t'], '/'));
				
				$ret[] = $arr;
				break;
			case "geo.getEvents2":
				$lat = $params["latitude"];
				$long = $params["longitude"];
				$location = $params["location"];
				$distance = $params["distance"];
				if( $location != null )
					$url = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=$location&api_key={$this->api_key}&format=json";
				elseif( $lat != null && $long != null )
					$url = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key=b25b959554ed76058ac220b7b2e0a026&lat=$lat&long=$long&format=json";
					
				$items = json_decode(file_get_contents($url), true);
				$items = array_slice($items["events"]["event"], $start, $length);
				$ret = array();
				$arr = array();
				foreach( $items AS $k => $v ) {
					$arr["title"] = $v["title"];
					$arr["provider"] = "last.fm";
					$arr["service"] = "lastfm";
					$arr["description"] = $v["description"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					$arr["artists"] = $v["artists"];
					if( $arr["image"] != "" )
						$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2>' . $description . '</div>';
					else
						$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2>' . $description . '</div>';
					$ret[] = $arr;
				}
				break;
		}
		// return $items;
		return $ret;
	}
}



/*
$a = isset($_GET["a"]) ? $_GET["a"] : "";

$R = new Reddit();
$S = new SoundCloud();
$L = new LastFM();
// $L->getItems(0, 10, array("location" => "United+States"));
// $R->getItems();


/*
new Reddit();
new SoundCloud();
new Beatport();
$S = new Services();
if( $a == "getFilters" ) 
	echo json_encode($S->getServices());
*/

// beatport
// lastfm
// 8tracks
// jamendo

?>
