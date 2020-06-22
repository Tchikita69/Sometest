axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=121926e80b5830236fdcacb0ce687312&language=en-US", {
        headers: {}
}).then(res => {
    genres = res.data.genres;
    movieSearch()
})

window.$ = window.jQuery = require('jquery');

$('#youtube_search_input').on('click', async function() {
    var id = localStorage.getItem('videoId');  
      $('#player').empty();
      $('#player').append("<iframe id='player' type='text/html' width='700' height='400' src='http://www.youtube.com/embed/" + id + "?enablejsapi=1&origin=http://example.com'frameborder='0'></iframe>");
});