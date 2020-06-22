window.$ = window.jQuery = require('jquery');
var api = require('../api_conf');

var channelsData = {};
var gamesData = {};
var streamsData = {};
var channelOffset = 0;
var streamOffset = 0;
var gameStreamCursor = '';
var gameStreamOffset = 0;
var currentGame = '';
var query = ''

$(document).ready(setHomePage);
$('div#navbar a').on('click', () => {
  $('div#main').css('display', 'flex');
});

async function setHomePage() {
  var res = await fetch('https://api.twitch.tv/kraken/streams/featured?limit=5', {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': api.twitch_client_id
    }
  });
  var json = await res.json();
  console.log(json);
  var i = 0;
  while (i < json.featured.length) {
    var stream = json.featured[i].stream;
    var title = stream.channel.status.length > 25 ? stream.channel.status.substr(0, 25) + '...' : stream.channel.status;
    $('#twitch_home_page').append("<div class='twitch_home_page_stream' channel_name='" + stream.channel.name + "'>\
      <img src='" + stream.preview.medium + "' >\
      <p class='twitch_title'>" + title + "</p>\
    ");
    i = i + 1;
  }
  $('div.twitch_home_page_stream').on('click', drawHPStream);
}

function drawHPStream() {
  $('#twitch_home_page').empty();
  $('div#twitch_player').append("<iframe\
    src='https://player.twitch.tv/?channel=" + this.getAttribute('channel_name') + "&parent=localhost'\
    height='600'\
    width='800'\
    frameborder=''\
    scrolling='no'\
    allowfullscreen='true'>\
    </iframe>\
  ");
  $('#twitch_back').append('<button type="button" id="back_button_twitch">Back</button>')
  $('#back_button_twitch').on('click', backButtonHP);
}

function backButtonHP() {
  $('div#twitch_player').empty();
  setHomePage();
  $('#twitch_back').empty();
}

$('#twitch_search_input').on('change', async function() {
  query = this.value;
  await queryAPI();
  $('div#main').css('display', 'block');
  $('div#twitch_player').empty();
  $('#twitch_home_page').empty();
  eraseChannels();
  eraseGames();
  eraseStreams();
  drawChannels(channelsData.channels);
  drawGames(gamesData.games);
  drawStreams(streamsData.streams);
  this.value = '';
});

async function queryAPI() {
  var channels = await fetch('https://api.twitch.tv/kraken/search/channels?limit=10&query=' + query, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': api.twitch_client_id
    }
  });
  var games = await fetch('https://api.twitch.tv/kraken/search/games?query=' + query, {
    method: 'GET',
    headers: {
        Accept: 'application/vnd.twitchtv.v5+json',
        'Client-ID': api.twitch_client_id
      }
  });
  var streams = await fetch('https://api.twitch.tv/kraken/search/streams?limit=5&query=' + query, {
    method: 'GET',
    headers: {
        Accept: 'application/vnd.twitchtv.v5+json',
        'Client-ID': api.twitch_client_id
      }
  });
  channelsData = await channels.json();
  gamesData = await games.json();
  streamsData = await streams.json();
  channelOffset = 10;
  streamOffset = 5;
}

function drawChannels(channels) {
  if (channels) {
    $('<h2 class="twitch_channel_h2">Channels</h2>').insertBefore('#twitch_results_channels');
  }
  channels.forEach(element => {
      $('#twitch_results_channels').append("<div class='twitch_channel' channel_name='" + element.name + "'>\
        <img src='" + element.logo + "' width='50' height='50' >\
        <p class='twitch_title'>" + element.name + "</p>\
      </div>\
    ");
  });
  $('#twitch_results_channels').append('<button type="button" id="more_channels_twitch">More</button>');
  $('#more_channels_twitch').on('click', drawMoreChannels);
  $(".twitch_channel").on('click', channelOnClickHandler);
}

async function drawGames(games) {
  currentGame = '';
  if (games) {
    $('<h2 class="twitch_games_h2">Games</h2>').insertBefore('#twitch_results_games');
  }
  var i = 0;
  while (i < games.length) {
    $('#twitch_results_games').append("<div class='twitch_game' game_id='" + games[i]._id + "'>\
      <img src='" + games[i].box.medium + "' >\
      <p class='twitch_title'>" + games[i].name + "</p>\
    ");
    i = i + 1;
  }
  $('.twitch_game').on('click', async function() {
    currentGame = this.getAttribute('game_id');
    var streams = await queryGameStreams(currentGame);
    gamesOnClickHandler(streams);
  });
}

function drawStreams(streams) {
  if (streams) {
    $('<h2 class="twitch_streams_h2">Streams</h2>').insertBefore('#twitch_results_streams');
  }
  var i = 0;
  while (i < streams.length) {
    var title = streams[i].channel.status.length > 20 ? streams[i].channel.status.substr(0, 20) + '...' : streams[i].channel.status;
    $('#twitch_results_streams').append("<div class='twitch_stream' channel_name='" + streams[i].channel.name + "'>\
      <img src='" + streams[i].preview.medium + "' >\
      <p class='twitch_title'>" + title + "</p>\
    ");
    i = i + 1;
  }
  $('#twitch_results_streams').append('<button type="button" id="more_streams_twitch">More</button>');
  $('#more_streams_twitch').on('click', drawMoreStreams);
  $('div.twitch_stream').on('click', streamOnClickHandler);
}

function eraseChannels() {
  $('#twitch_results_channels').empty();
  $('.twitch_channel_h2').remove();
}

function eraseGames() {
  $('#twitch_results_games').empty();
  $('.twitch_games_h2').remove();
}

function eraseStreams() {
  $('#twitch_results_streams').empty();
  $('.twitch_streams_h2').remove();
}

function channelOnClickHandler() {
  $('div#twitch_player').empty();
  $('div#twitch_player').append("<iframe\
    src='https://player.twitch.tv/?channel=" + this.getAttribute('channel_name') + "&parent='\
    height='600'\
    width='800'\
    frameborder=''\
    scrolling='no'\
    allowfullscreen='true'>\
    </iframe>\
  ");
  eraseChannels();
  eraseGames();
  eraseStreams();
  $('#twitch_back').append('<button type="button" id="back_button_twitch">Back</button>')
  $('#back_button_twitch').on('click', backButtonOnClickHandler);
}

async function gamesOnClickHandler(streams) {
  eraseGames();
  eraseChannels();
  eraseStreams();
  $('#twitch_back').append('<button type="button" id="back_button_twitch">Back</button>')
  $('#back_button_twitch').on('click', function() {
    $('div#twitch_results_games').empty();
    drawChannels(channelsData.channels);
    drawGames(gamesData.games);
    drawStreams(streamsData.streams);
    $('#twitch_back').empty();
  });
  drawGameStreams(streams);
  $('div.twitch_game_stream').on('click', gameStreamOnClickHandler);
}

function drawGameStreams(streams) {
  var j = 0;
  while (j < streams.data.length) {
    var title = streams.data[j].title.length > 20 ? streams.data[j].title.substr(0, 20) + '...' : streams.data[j].title;
    $('#twitch_results_games').append("<div class='twitch_game_stream' user_name='" + streams.data[j].user_name + "'>\
      <img src='" + streams.data[j].thumbnail_url.replace('{width}', '400').replace('{height}', '300') + "' >\
      <p class='twitch_title'>" + title + "</p>\
    ");
    j = j + 1;
  }
  $('#twitch_results_games').append('<button type="button" id="more_game_streams_twitch">More</button>');
  $('#more_game_streams_twitch').on('click', drawMoreGameStreams);
}

function gameStreamOnClickHandler() {
  $('div#twitch_player').append("<iframe\
    src='https://player.twitch.tv/?channel=" + this.getAttribute('user_name') + "&parent=localhost'\
    height='600'\
    width='800'\
    frameborder=''\
    scrolling='no'\
    allowfullscreen='true'>\
    </iframe>\
  ");
  eraseGames();
  $('#twitch_back').empty();
  $('#twitch_back').append('<button type="button" id="back_button_twitch">Back</button>')
  $('#back_button_twitch').on('click', function() {
    $('div#twitch_player').empty();
    drawChannels(channelsData.channels);
    drawGames(gamesData.games);
    drawStreams(streamsData.streams);
    $('#twitch_back').empty();
    gameStreamCursor = '';
    gameStreamOffset = 0;
  });
}

async function queryGameStreams(game_id) {
  var request = gameStreamCursor == '' ? 'https://api.twitch.tv/helix/streams?first=5&game_id=' + game_id : 'https://api.twitch.tv/helix/streams?first=5&game_id=' + game_id + '&after=' + gameStreamCursor
  var result = await fetch(request, {
    method: 'GET',
    headers: {
      'Client-ID': api.twitch_client_id,
      Authorization: 'Bearer ' + api.twitch_app_access_token
    }
  });
  var json = await result.json()
  gameStreamCursor = json.pagination.cursor;
  gameStreamOffset += 5;
  return (json);
}

function streamOnClickHandler() {
  $('div#twitch_player').append("<iframe\
    src='https://player.twitch.tv/?channel=" + this.getAttribute('channel_name') + "&parent=localhost'\
    height='600'\
    width='800'\
    frameborder=''\
    scrolling='no'\
    allowfullscreen='true'>\
    </iframe>\
  ");
  eraseChannels();
  eraseGames();
  eraseStreams();
  $('#twitch_back').append('<button type="button" id="back_button_twitch">Back</button>')
  $('#back_button_twitch').on('click', backButtonOnClickHandler);
}

function backButtonOnClickHandler() {
  $('div#twitch_player').empty();
  drawChannels(channelsData.channels);
  drawGames(gamesData.games);
  drawStreams(streamsData.streams);
  $('#twitch_back').empty();
}

async function drawMoreChannels() {
  var res = await fetch('https://api.twitch.tv/kraken/search/channels?limit=10&query=' + query + '&offset=' + channelOffset.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': api.twitch_client_id
    }
  });
  chan_json = await res.json();
  channelsData.channels = channelsData.channels.concat(chan_json.channels);
  chan_json.channels.forEach(element => {
    $('#twitch_results_channels').append("<div class='twitch_channel' channel_name='" + element.name + "'>\
    <img src='" + element.logo + "' width='50' height='50' >\
    <p class='twitch_title'>" + element.name + "</p>\
    </div>\
    ");
  });
  var chans = $(".twitch_channel")
  chans.splice(0, channelOffset);
  chans.on('click', channelOnClickHandler);
  $('#more_channels_twitch').remove();
  $('#twitch_results_channels').append('<button type="button" id="more_channels_twitch">More</button>');
  $('#more_channels_twitch').on('click', drawMoreChannels);
  channelOffset += 10;
}

async function drawMoreStreams() {
  var res = await fetch('https://api.twitch.tv/kraken/search/streams?limit=5&query=' + query + '&offset=' + streamOffset.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': api.twitch_client_id
    }
  });
  stream_json = await res.json();
  streamsData.streams = streamsData.streams.concat(stream_json.streams);
  var streams = stream_json.streams;
  var i = 0;
  while (i < streams.length) {
    var title = streams[i].channel.status.length > 20 ? streams[i].channel.status.substr(0, 20) + '...' : streams[i].channel.status;
    $('#twitch_results_streams').append("<div class='twitch_stream' channel_name='" + streams[i].channel.name + "'>\
      <img src='" + streams[i].preview.medium + "' >\
      <p class='twitch_title'>" + title + "</p>\
    ");
    i = i + 1;
  }
  console.log($('.twitch_stream'));
  var str_obj = $('.twitch_stream');
  str_obj.splice(0, streamOffset);
  str_obj.on('click', streamOnClickHandler);
  $('#more_streams_twitch').remove();
  $('#twitch_results_streams').append('<button type="button" id="more_streams_twitch">More</button>');
  $('#more_streams_twitch').on('click', drawMoreStreams);
  streamOffset += 5;
}

async function drawMoreGameStreams() {
  var streams = await queryGameStreams(currentGame);
  var j = 0;
  while (j < streams.data.length) {
    var title = streams.data[j].title.length > 20 ? streams.data[j].title.substr(0, 20) + '...' : streams.data[j].title;
    $('#twitch_results_games').append("<div class='twitch_game_stream' user_name='" + streams.data[j].user_name + "'>\
      <img src='" + streams.data[j].thumbnail_url.replace('{width}', '400').replace('{height}', '300') + "' >\
      <p class='twitch_title'>" + title + "</p>\
    ");
    j = j + 1;
  }
  var gameStreamObj = $('.twitch_game_stream');
  gameStreamObj.splice(0, gameStreamOffset - 5);
  gameStreamObj.on('click', gameStreamOnClickHandler);
  $('#more_game_streams_twitch').remove();
  $('#twitch_results_games').append('<button type="button" id="more_game_streams_twitch">More</button>');
  $('#more_game_streams_twitch').on('click', drawMoreGameStreams);
}

