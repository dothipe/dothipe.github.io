<?php
$arrContextOptions=array(
"ssl"=>array(
"verify_peer"=>false,
"verify_peer_name"=>false,
),
);

$channel_id = 'UCXNtbNAsZSYyGjHMq4y_Zww';
$api_key = 'AIzaSyBkbsveXMqycACRd01QJLlyhYq2CTYiSWQ';
$api_response = file_get_contents('https://www.googleapis.com/youtube/v3/channels?part=statistics&id='.$channel_id.'&fields=items/statistics/subscriberCount&key='.$api_key, false, stream_context_create($arrContextOptions));
$api_response_decoded = json_decode($api_response, true);
echo $api_response_decoded['items'][0]['statistics']['subscriberCount'];
?>


  <script type="text/javascript">
	  function onYtEvent(payload) {
            console.log(payload);
            if (payload.eventType == 'subscribe') {
                // Add code to handle subscribe event.
                createCookie('subscribed','yes',30);
                location.hash = '#mainpage';
            } else if (payload.eventType == 'unsubscribe') {
                // Add code to handle unsubscribe event.
                eraseCookie('subscribed');
                location.hash = 'https://www.youtube.com/@NahMedia?sub_confirmation=1';
            }
            if (window.console) { // for debugging only
                window.console.log('YT event: ', payload);
            }
        }

	
</script>
  <script type="text/javascript">
function runApp() {
if (readCookie('subscribed') === 'yes') 
{
                location.hash = '#ABC';
            } else {
                location.hash = 'https://www.youtube.com/@NahMedia?sub_confirmation=1';
            }
}
</script>

 <!DOCTYPE html>
<html>
  <body>
<script src="https://apis.google.com/js/platform.js"></script>

<div class="g-ytsubscribe" data-channelid="UCXNtbNAsZSYyGjHMq4y_Zww" data-layout="default" data-count="default"></div>




 <br />
 <body onload="runApp()"></body>


    <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    <div id="player"></div>

    <script>
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'M7lc1UVf-VE',
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
    </script>
  </body>
</html>