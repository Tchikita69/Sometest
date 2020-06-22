axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=121926e80b5830236fdcacb0ce687312&language=en-US", {
        headers: {}
    }).then(res => {
        genres = res.data.genres;
        genres.map((genre, index) => {
            var val = index + 1;
            document.getElementById("genre"+val).innerHTML=genre.name;
        })
        JSON.parse(localStorage.getItem("films")).map((film, index) => {
            movieSearch(index);
        })
})