const apiKey = "2955f6c6957d5bb090574e89cfdfd6a7";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

let details = null;
let cast = null;
let similarMovies = null;
let reviews = null;
const movieId = localStorage.getItem('movieId');
const movieType = localStorage.getItem('movieType');


const fetchDetails = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/${movieType}/${movieId}?api_key=${apiKey}&language=en-US`);
    const data = await response.json();
    details = data;
    return details;
}

const fetchMovieCast = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/${movieType}/${movieId}/credits?api_key=${apiKey}&language=en-US`);
    const data = await response.json();
    cast = data.cast;
    return cast;
}

const fetchSimilarMovie = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/${movieType}/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`);
    const data = await response.json();
    similarMovies = data.results;
    return similarMovies;
}

const fetchMovieReviews = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/${movieType}/${movieId}/reviews?api_key=${apiKey}&language=en-US&page=1`);
    const data = await response.json();
    reviews = data.results;
    console.log(data);
    return reviews;

}

const computeMovieDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes}mins`;
    }
    else {
        const hour = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hour}h ${mins}mins`
    }
}

const rateMovie = (ratings) => {
    const movieRatings = document.querySelector('#movie-ratings');
    const r = Math.floor(ratings);
    for (let i = 0; i < r; i++) {

        movieRatings.children[i].style.color = 'darkorange';

    }

}

const populateDetails = () => {
    const data = details;
    const bgImage = document.querySelector('.header-background');
    const movieImage = document.querySelector('.movie-img');
    const title = document.querySelector('#movie-title');
    const aboutMovie = document.querySelector('.sypnosis-body');
    const movieGenre = document.querySelector('#movie-genre');
    const movieDuration = document.querySelector('#movie-duration');
    const rate = document.querySelector('#rating');
    const genres = data.genres

    data.original_title !== undefined ? title.textContent = data.original_title : title.textContent = data.name;
    aboutMovie.textContent = data.overview;
    if (genres !== null) {

        if (genres.length > 2) {
            movieGenre.textContent = `${genres[0].name}, ${genres[1].name} & ${genres[2].name}`;
        }
        else if (genres.length == 2) {
            movieGenre.textContent = `${genres[0].name} & ${genres[1].name}`;

        }
        else if (genres.length == 1) {

            movieGenre.textContent = `${genres[0].name}`;
        }
    }

    const ratings = data.vote_average / 2;
    rateMovie(ratings.toFixed(1)[0]);
    rate.textContent = `(${ratings.toFixed(1)})`;
    bgImage.style.backgroundImage = `url(${imageBaseUrl}${data.backdrop_path})`;
    movieImage.style.backgroundImage = `url(${imageBaseUrl}${data.poster_path})`;
    if (data.runtime !== undefined) {
        movieDuration.textContent = computeMovieDuration(data.runtime);

    }
    else {
        movieDuration.textContent = `${data.number_of_seasons} Seasons (${data.number_of_episodes} Episodes)`;
    }

}

const populateMovieCast = () => {

    const data = cast;
    const castInfos = document.querySelector('.cast-infos');
    data.forEach(d => {
        const castInfo = document.createElement('div');
        const castImg = document.createElement('div');
        const castName = document.createElement('div');
        castImg.classList.add('cast-img');
        castName.classList.add('cast-name');
        castInfo.classList.add('cast-info');
        castImg.dataset['castId'] = d.id;
        if (d.profile_path !== null) {
            castImg.style.backgroundImage = `url(${imageBaseUrl}${d.profile_path})`;
        }
        const name = d.name.split(" ");
        castName.textContent = `${name[0]} ${name[0][1].toUpperCase()}.`;
        castInfo.appendChild(castImg);
        castInfo.appendChild(castName);
        castInfos.appendChild(castInfo);
    })

}

const navbarControl = () => {
    const navItems = document.querySelectorAll('.nav-item');
    const abtMovie = document.querySelector('.abt-movie');
    const movieReview = document.querySelector('.movie-review');
    navItems.forEach((n, index) => n.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        n.classList.add('active');
        if (index == 0) {
            movieReview.classList.remove('active');
            abtMovie.classList.add('active');
        }
        else {
            abtMovie.classList.remove('active');
            movieReview.classList.add('active');
        }
    }))

}

const populateSimilarMovies = () => {
    const data = similarMovies;

    data.forEach(d => {
        const similarMovies = document.querySelector('.similar-movies');
        const similarMovie = document.createElement('div');
        similarMovie.classList.add('similar-movie');
        similarMovie.dataset['movieId'] = d.id;
        similarMovie.style.backgroundImage = `url(${imageBaseUrl}${d.poster_path})`;
        similarMovies.appendChild(similarMovie);
    });

}

const populateReviews = () => {
    const data = reviews;
    const movieReview = document.querySelector('.movie-review');

    if (data.length > 0) {
        movieReview.innerHTML = "";
        data.forEach(d => {
            const mRI = document.createElement('div');
            mRI.classList.add('movie-review-item');

            if (d.content.length < 200) {
                mRI.textContent = d.content;
            }
            else {
                mRI.textContent = `${d.content.substring(0, 200)} .. `;
                const readMore = document.createElement('span');
                readMore.id = "read-more";
                readMore.textContent = "READ MORE"
                mRI.appendChild(readMore);
                const seeLess = document.createElement('span');
                seeLess.id = "read-more";
                seeLess.textContent = " . . SEE LESS"
                readMore.addEventListener('click', () => {
                    mRI.textContent = d.content;
                    mRI.appendChild(seeLess);
                })

                seeLess.addEventListener('click', () => {
                    mRI.textContent = `${d.content.substring(0, 200)} .. `;
                    mRI.appendChild(readMore);
                })
            }
            
            const reviewerDetails = document.createElement('div');
            reviewerDetails.classList.add('reviewer-details');
            const reviewerImg =  document.createElement('div');
            reviewerImg.classList.add('reviewer-img');
            const reviewerName =  document.createElement('div');
            reviewerName.classList.add('reviewer-name');
            reviewerName.textContent = d.author_details.username;
            reviewerDetails.appendChild(reviewerImg);
            reviewerDetails.appendChild(reviewerName);
            
            const dateCreated = document.createElement('div');
            dateCreated.classList.add('review-date');
            dateCreated.textContent = new Date(d.created_at).toDateString();
            const breakLine = document.createElement('hr');

            movieReview.appendChild(reviewerDetails);
            movieReview.appendChild(mRI);
            movieReview.appendChild(dateCreated);
            movieReview.appendChild(breakLine);
        });
    }
}

const viewSimilarMovieDetails = () => {
    const genreMovieItem = document.querySelectorAll('.similar-movie');
    genreMovieItem.forEach(g => g.addEventListener('click', () => {
        localStorage.setItem('movieId', g.dataset['movieId']);
        location.pathname = "/pages/details.html"
    }));
}

navbarControl();
fetchDetails().then(populateDetails);
fetchMovieCast().then(populateMovieCast);
fetchSimilarMovie().then(populateSimilarMovies).then(viewSimilarMovieDetails);
fetchMovieReviews().then(populateReviews);