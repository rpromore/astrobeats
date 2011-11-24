<?php

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

interface Services {
	/**
	 * @return Name of service.
	 */
	public function getName();
	
	// sorting methods
	/**
	 * @return Array of sorting methods.
	 */
	public function getSortingMethods();
	
	/**
	 * @return Array
	 */
	public function getItems($start, $length);

}

/**
 * Please ensure arrays are returned in following format:
 * title: string,
 * output: string,
 * service: string
 */

class Reddit implements Services {
	protected $subreddits = array("listentothis");
	private $sortingMethods = array("hot", "new", "controversial", "top");
	protected $items = array();
	
	public function __construct($sortMethod = "hot", $page = 0) {
		if( !in_array($sortMethod, $this->sortingMethods) )
			die("Sorting method not available.");
		
		foreach( $this->subreddits AS $i ) {
			$nest = json_decode(file_get_contents("http://reddit.com/r/$i/$sortMethod.json?limit=" . MAXLIMIT), true);
			$this->items[$i] = $nest["data"]["children"];
		}
	} 
	public function getName() {
		return "Reddit";
	}
	public function addSubReddit($subReddit) {
		$this->subreddits[] = $subReddit;
	}
	public function getSortingMethods() {
		return $this->sortingMethods;
	}
	public function getItems($start = 0, $length = LIMIT) {
		$ret = array();
		foreach( $this->items AS $k => $v ) {
			$nest = array_slice($v, $start, $length);
			foreach( $nest AS $j => $i ) {
				$arr = array();
				$arr["title"] = $i["data"]["title"];
				$arr["provider"] = $i["data"]["domain"];
				$arr["image"] = $i["data"]["media"]["oembed"]["thumbnail_url"];
				if( $arr["image"] != "" )
					$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
				else
					$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2></div>';
				
				$str = trim(preg_replace("/(\(.*\)|\[.*\])/", "", $i["data"]["title"]));
				preg_match("/(.*) \- (.*)/", $str, $matches);
				
				$arr["artist"] = !empty($matches[1]) ? $matches[1] : "";
				$arr["song"] = !empty($matches[2]) ? $matches[2] : "";
				
				if( $arr["provider"] == "youtube.com" )
					$arr["url"] = YTvid($i["data"]["url"]);
				else
					$arr["url"] = $i["data"]["url"];
				$ret[] = $arr;
			}
		}
		return $ret;
		/*
		foreach( $this->items AS $k => $v ) {
			$nest[$k] = array_slice($v, $start, $length);
			foreach( $nest[$k] AS $i ) {
				$arr = array();
				$arr["title"] = $i["data"]["title"];
				$arr["provider"] = $i["data"]["domain"];
				$arr["image"] = $i["data"]["media"]["oembed"]["thumbnail_url"];
				$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';;
				$arr["artist"] = "";
				// $arr["url"] = str_replace("watch?v=", "v/", $i["data"]["url"]);
				$arr["url"] = YTvid($i["data"]["url"]);
			}
			$nest[$k] = $arr;
			print_r($nest[$k]);
		}
		return $nest;
		*/
	}
}

class SoundCloud implements Services {
	private $sortingMethods = array("created_at", "hotness");
	protected $items = array();
	
	public function __construct($sortMethod = "hot", $page = 0) {
		//
	}
	public function getName() {
		return "SoundCloud";
	}
	public function getSortingMethods() {
		return $this->sortingMethods;
	}
	public function getItems($start, $length) {
		return $this->items;
	}
}

$reddit = new Reddit();
// print_r($reddit->getItems(0, 1));

header('Content-type: application/json');
echo json_encode($reddit->getItems(0, 10));		

?>
