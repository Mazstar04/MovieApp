const apiKey = "2955f6c6957d5bb090574e89cfdfd6a7";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
let movieState = null;

let trendings = null;
let movies = null;
let moviesByGenre = null;
let currentMovieGenreId = null;
let genres = null;
let searchResultsM = null;
let searchResultsT = null;
let pageNumber = 1;


const fetchTrending = async (pageNo) => {
    if (pageNo === null) {
        pageNo = 1;
    }
    const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&page=${pageNo}`);

    const data = await response.json();
    trendings = data.results;
    return trendings;
}

const fetchMovies = async (pageNo) => {
    if (pageNo === null) {
        pageNo = 1;
    }
    let mState = null;

    if (movieState === null) {

        pageNumber % 2 == 0 ? mState = "movie" : mState = "tv";
    }
    else {
        mState = movieState
    }



    const response = await fetch(`https://api.themoviedb.org/3/discover/${mState}?api_key=${apiKey}&language=en-US&page=${pageNo}`);

    const data = await response.json();
    movies = data.results;
    return movies;
}

const fetchGenre = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);

    const data = await response.json();
    genres = data.genres;

    return genres;

}

const fetchMoviesByGenreId = async (pageNo, genreId) => {
    if (pageNo === null) {
        pageNo = 1;
    }

    let mState = null;

    if (movieState === null) {

        pageNumber % 2 == 0 ? mState = "movie" : mState = "tv";
    }
    else {
        mState = movieState
    }
    const response = await fetch(`https://api.themoviedb.org/3/discover/${mState}?api_key=${apiKey}&with_genres=${genreId}&page=${pageNo}`);
    const data = await response.json();
    moviesByGenre = data.results;

    return moviesByGenre;
}

const fetchSearchMovie = async (query, movieType) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/${movieType}?api_key=${apiKey}&language=en-US&query=${query}&page=1&year=2021`);


    const data = await response.json();

    movieType == "movie" ? searchResultsM = data.results : searchResultsT = data.results;

}

const controlCarousel = () => {
    const carousel = document.querySelector('.carousel-container');

    carousel.addEventListener('scroll', (e) => {
        const firstChild = carousel.children[0];
        const lastChild = carousel.children[2];

        if (firstChild.getBoundingClientRect().x < -60) {
            setActiveCarouselItem(carousel.children[2]);
            carousel.removeChild(firstChild);
            carousel.appendChild(firstChild);
        }
    })
}

const setActiveCarouselItem = (item) => {

    const carousel = document.querySelector('.carousel-container');
    Array.from(carousel.children).forEach(child => {

        child.classList.remove("active");
        let mId = child.dataset.movieId;
        child.style.backgroundImage = trendings.find(t => t.id == mId).poster_path;
        child.style.backgroundImage = `url(${imageBaseUrl}${trendings.find(t => t.id == mId).poster_path})`;
    })

    const movieid = item.dataset.movieId;
    item.classList.add('active');
    const trend = trendings.find(t => t.id == movieid);
    rateMovie(Math.floor(trend.vote_average / 2));
    item.style.backgroundImage = `url(${imageBaseUrl}${trend.backdrop_path})`;

}

const populateCarousel = async () => {
    const data = trendings;

    for (let i = 1; i <= 3; i++) {

        let movie = data[i - 1];

        let carouselItem = document.querySelector(`.carousel-item-${i}`);

        carouselItem.setAttribute('data-movie-id', movie.id);
        carouselItem.setAttribute('data-movie-type', movie.media_type);


        let title = carouselItem.querySelector('.carousel-item-title');
        let rating = carouselItem.querySelector('.rating');
        carouselItem.style.backgroundImage = `url(${imageBaseUrl}${movie.poster_path})`;

        title.textContent = movie.title ?? movie.name;
        let rate = movie.vote_average / 2;
        rating.textContent = rate.toString().substring(0, 3);
        rateMovie(rate);
    }
}

const populateGenre = async () => {
    const data = genres;
    const genreItem = document.querySelector('.genre');

    data.forEach((d, index) => {
        let newGenreItem = document.createElement('div');
        newGenreItem.id = `genre${index + 1}`;
        newGenreItem.dataset['genreId'] = d.id;
        newGenreItem.classList.add('genre-item');
        newGenreItem.textContent = d.name;
        genreItem.appendChild(newGenreItem);
    })

    const genreItems = document.querySelectorAll('.genre-item');

    genreItems.forEach(g => g.addEventListener('click', changeGenre))

}

const rateMovie = (ratings) => {
    const active = document.querySelector('.carousel-item.active');
    const star = active.querySelector('.star');
    const r = Math.floor(ratings);
    for (let i = 0; i < r; i++) {

        star.children[i].style.color = 'darkorange';

    }

}


const populateAll = () => {
    const data = movies;

    const genreMovie = document.querySelector('.genre-movie');
    data.forEach((d, index) => {


        let genreMovieItem = document.createElement('div');
        genreMovieItem.dataset['movieId'] = d.id;
        if (movieState === null) {

            pageNumber % 2 == 0 ? genreMovieItem.dataset['movieType'] = "movie" : genreMovieItem.dataset['movieType'] = "tv";
        }
        else {
            genreMovieItem.dataset['movieType'] = movieState;
        }
        genreMovieItem.style.backgroundImage = `url(${imageBaseUrl}${d.poster_path})`;
        genreMovieItem.classList.add('genre-movie-item');
        genreMovie.appendChild(genreMovieItem);

    })
}

const viewMovieDetails = () => {
    const genreMovieItem = document.querySelectorAll('.genre-movie-item');
    genreMovieItem.forEach(g => g.addEventListener('click', () => {
        localStorage.setItem('movieId', g.dataset['movieId']);
        localStorage.setItem('movieType', g.dataset['movieType']);
        location.pathname = "/pages/details.html"
    }));
}

const viewTrendingMovieDetails = () => {
    const carouselItem = document.querySelectorAll('.carousel-item');
    carouselItem.forEach(g => g.addEventListener('click', () => {
        localStorage.setItem('movieId', g.dataset['movieId']);
        localStorage.setItem('movieType', g.dataset['movieType']);
        location.pathname = "/pages/details.html"
    }));
}

const viewSearchItemDetails = () => {
    const searchResultItem = document.querySelectorAll('.search-result-item');
    searchResultItem.forEach(s => s.addEventListener('click', () => {
        localStorage.setItem('movieId', s.dataset['movieId']);
        localStorage.setItem('movieType', s.dataset['movieType']);
        location.pathname = "/pages/details.html"
    }));
}

const populateMoviesByGenre = () => {
    const data = moviesByGenre;
    const genreMovie = document.querySelector('.genre-movie');


    data.forEach((d) => {
        let genreMovieItem = document.createElement('div');
        genreMovieItem.dataset['movieId'] = d.id;

        if (movieState === null) {
            pageNumber % 2 == 0 ? genreMovieItem.dataset['movieType'] = "movie" : genreMovieItem.dataset['movieType'] = "tv";
        }
        else {
            genreMovieItem.dataset['movieType'] = movieState;
        }
        genreMovieItem.style.backgroundImage = `url(${imageBaseUrl}${d.poster_path})`;
        genreMovieItem.classList.add('genre-movie-item');
        genreMovie.appendChild(genreMovieItem);
        viewMovieDetails();
    })

}

const changeGenre = (e) => {

    const target = document.getElementById(e.target.id);
    const title = document.querySelector('.title-change');
    const movies = document.querySelector('.genre-movie');
    const genreItems = document.querySelectorAll('.genre-item');
    genreItems.forEach(g => g.classList.remove('active'));

    pageNumber = 1;
    if (target != null) {
        target.classList.add('active');
        title.textContent = target.textContent;
        movies.innerHTML = "";
        currentMovieGenreId = target.dataset['genreId'];
        fetchMoviesByGenreId(pageNumber, currentMovieGenreId).then(populateMoviesByGenre);
    }
    else {
        genreItems[0].classList.add('active');
        title.textContent = genreItems[0].textContent;
        movies.innerHTML = "";
        currentMovieGenreId = null;
        fetchMovies(pageNumber).then(populateAll);
    }
}

const populateScroll = () => {

    const gm = document.querySelector('.genre-movie');
    const sect = document.querySelector('.section-content');
    sect.addEventListener('scroll', function (event) {
        var sect = event.target;
        if (sect.scrollHeight - sect.scrollTop <= sect.clientHeight + 20) {
            pageNumber = pageNumber + 1;
            if (movieState === null) {

                pageNumber % 2 == 0 ? movieState = "movie" : movieState = "tv";
                movieState = null;
            }
            currentMovieGenreId === null ? fetchMovies(pageNumber).then(populateAll) : fetchMoviesByGenreId(pageNumber, currentMovieGenreId).then(populateMoviesByGenre);;

        }
        viewMovieDetails();
    });
}


const navigateControl = () => {
    const mobileControl = document.querySelectorAll('.mobile-control');
    const movies = document.querySelector('.genre-movie');
    const title = document.querySelector('.title-change');
    const allGenre = document.querySelector('#all-genre');
    const genres = document.querySelector('.genre')
    mobileControl.forEach(m => m.addEventListener('click', (e) => {
        mobileControl.forEach(c => c.classList.remove('active'));
        const ar = Array.from(genres.children);
        ar.forEach(a => a.classList.remove('active'))
        m.classList.add('active');
        allGenre.classList.add('active');
        title.textContent = allGenre.textContent
        movies.innerHTML = " ";
        pageNumber = 1;
        viewMovieDetails();
        if (m.textContent.toLowerCase().trim() == "movies") {

            movieState = "movie";
            fetchMovies(pageNumber).then(populateAll).then(viewMovieDetails);
        }
        else if (m.textContent.toLowerCase().trim() == "series") {

            movieState = "tv";
            fetchMovies(pageNumber).then(populateAll).then(viewMovieDetails);
        }
        else {

            movieState = null;
            fetchMovies(pageNumber).then(populateAll).then(viewMovieDetails);
        };

    }));


}

const searchMovie = async () => {
    var search = document.querySelector('#search');
    await fetchSearchMovie(search.value, "movie");

    console.log("using data: ", searchResultsM);
    const moviedata = [];
    searchResultsM?.forEach(s => {
        moviedata.push({ obj: s, mt: "movie" });
    });
    await fetchSearchMovie(search.value, "tv");
    const tvdata = [];
    searchResultsT?.forEach(s => {
        tvdata.push({ obj: s, mt: "tv" });
    });

    let data = moviedata.concat(tvdata);

    if (data.length > 8) {
        data = data.slice(0, 8);
    }

    data = data.sort((a, b) => new Date(b.obj.release_date) - new Date(a.obj.release_date))

    return data;
}

const populateSearch = async () => {
    var search = document.querySelector('#search');
    var searchResult = document.querySelector('.search-result');
    search.addEventListener('keyup', async () => {
        if (search.value.length >= 2) {
            searchResult.classList.add('active');
            const data = await searchMovie();

            if (data != null) {
                searchResult.innerHTML = " ";
                data.forEach(d => {

                    let title = d.obj.original_title ?? d.obj.name;

                    // title = title.toLowerCase();

                    const sRItem = document.createElement('div');
                    sRItem.classList.add("search-result-item");
                    sRItem.dataset['movieId'] = d.obj.id;
                    sRItem.dataset['movieType'] = d.mt;
                    const sRImg = document.createElement('div');
                    sRImg.classList.add('search-result-img');
                    sRImg.style.backgroundImage = `url(${imageBaseUrl}${d.obj.poster_path})`;
                    const sRDetail = document.createElement('div');
                    sRDetail.classList.add('search-result-details');
                    const sRTitle = document.createElement('div');
                    sRTitle.classList.add('search-result-title');

                    var hh = search.value.toLowerCase();

                    let ind = title.toLowerCase().indexOf(hh)


                    if (ind != -1) {
                        let ntitle =
                        `${title.substr(0, ind)}<span class="highlighted">${title.substr(ind, hh.length)}</span>${title.substr(ind + hh.length)}`


                        sRTitle.innerHTML = ntitle;
                        const rating = d.obj.vote_average / 2;
                        const sRRating = document.createElement('div');
                        sRRating.classList.add('search-result-rating');
                        sRRating.innerHTML = `<span id="sRating">${rating.toFixed(1)}</span> <i class="icofont-star">`;
                        const sRating = document.createElement('span');
                        sRating.id = "sRating"
                        const bL = document.createElement('hr')
                        bL.id = "breakLine";
                        sRDetail.appendChild(sRTitle);
                        sRDetail.appendChild(sRRating);
                        sRItem.appendChild(sRImg);
                        sRItem.appendChild(sRDetail);
                        searchResult.appendChild(sRItem);
                        searchResult.appendChild(bL);

                    }


                })
            }
            viewSearchItemDetails();
        }
        else {
            searchResult.classList.remove('active');
            searchResults = null;
        }
    });

}


fetchTrending(null).then(populateCarousel).then(viewTrendingMovieDetails);
fetchGenre().then(populateGenre);
fetchMovies(null).then(populateAll).then(viewMovieDetails);
controlCarousel();
populateScroll();
navigateControl();
populateSearch();
