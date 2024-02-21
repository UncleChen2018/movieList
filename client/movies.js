const baseURL = 'http://localhost:8001';
const img_base_url = 'http://image.tmdb.org/t/p/';
const img_size = 'w185';

const colors = [
	'#3498db', // Blue
	'#e74c3c', // Red
	'#2ecc71', // Green
	'#f39c12', // Orange
	'#9b59b6', // Purple
	'#1abc9c', // Turquoise
	'#e67e22', // Pumpkin
	'#34495e', // Midnight Blue
	'#2c3e50', // Wet Asphalt
	'#16a085', // Green Sea
	'#d35400', // Pumpkin
	'#c0392b', // Pomegranate
	'#2980b9', // Belize Hole
	'#8e44ad', // Wisteria
	'#27ae60', // Nephritis
	'#f1c40f', // Sunflower
	'#7f8c8d', // Silver
	'#d35400', // Pumpkin
	'#95a5a6', // Concrete
];
const ids = [
	28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878,
	10770, 53, 10752, 37,
];

let details = [];

function generateGenresColor() {
	let colorMap = {};
	for (let i = 0; i < ids.length; i++) {
		colorMap[ids[i]] = colors[i % colors.length];
	}
	return colorMap;
}
const genresColor = generateGenresColor();
const totalMovieCount = 0;

//
async function renderMovieListToolbar(totalMovieCount, fetchNum) {
	const totalPage = document.getElementById('total-pages');
	const maxPage = Math.ceil(parseInt(totalMovieCount.count) / fetchNum);
	totalPage.textContent = maxPage;
	const currentPage = document.getElementById('page-number');
	currentPage.setAttribute('max', maxPage);
	currentPage.setAttribute('min', 1);
	currentPage.style.width = `${maxPage.toString().length + 1}em`;
}

function updatePageNumber() {
	const currentPage = document.getElementById('page-number');
	const maxPage = document.getElementById('total-pages').textContent;

	if (parseInt(currentPage.value) > parseInt(maxPage)) {
		currentPage.value = maxPage;
	}
}

document
	.getElementById('page-number')
	.addEventListener('change', updatePageNumber);

document.getElementById('page-size').addEventListener('change', () => {
    const currentPage = document.getElementById('page-number');
    currentPage.value = 1;
	loadingList(), updatePageNumber();
});

// create li element for each movie
async function renderMovieList(movieList) {
	const movieListElement = document.querySelector('ul.movies-list');
	movieListElement.innerHTML = `
    <li class='column-name'>
      <div>Title</div>
      <div>Hot</div>
      <div>Genres</div>
    </li>
    <hr>
  `;
	for (const movie of movieList) {
		const movieItem = createMovieItem(movie);
		document
			.querySelector('ul.movies-list')
			.appendChild(movieItem)
			.insertAdjacentElement('afterend', document.createElement('hr'));
	}

	function createMovieItem(movie) {
		const movieItem = document.createElement('li');
		movieItem.classList.add('movie-item');
		movieItem.dataset.movieId = movie.id;
		movieItem.appendChild(createTitleDiv(movie.title));
		movieItem.appendChild(createPopularityDiv(movie.popularity));
		movieItem.appendChild(createGenreDiv(movie.genres));
		movieItem.appendChild(createFoldingDiv());
		return movieItem;
	}

	function createTitleDiv(title) {
		const titleDiv = document.createElement('div');
		titleDiv.classList.add('movie-title');
		titleDiv.textContent = title;
		return titleDiv;
	}

	function createPopularityDiv(popularity) {
		const popularityDiv = document.createElement('div');
		popularityDiv.classList.add('popularity');
		let fires = 1;
		if (popularity > 99) {
			fires = 5;
		} else if (popularity > 80) {
			fires = 4;
		} else if (popularity > 60) {
			fires = 3;
		} else if (popularity > 40) {
			fires = 2;
		}
		for (let i = 0; i < fires; i++) {
			const star = document.createElement('i');
			star.classList.add('fa-solid', 'fa-fire-flame-curved');
			popularityDiv.appendChild(star);
		}
		return popularityDiv;
	}

	function createGenreDiv(genres) {
		const genresDiv = document.createElement('div');
		genresDiv.classList.add('genres');

		genres.forEach((genre) => {
			const genreSpan = document.createElement('span');
			genreSpan.textContent = genre.name;
			genreSpan.style.backgroundColor = genresColor[genre.id];
			genreSpan.dataset.genreId = genre.id;
			genresDiv.appendChild(genreSpan);
		});

		return genresDiv;
	}

	function createFoldingDiv() {
		const foldingDiv = document.createElement('div');
		foldingDiv.classList.add('folding');
		const icon = document.createElement('i');
		icon.classList.add('fa-solid', 'fa-angle-down');
		foldingDiv.appendChild(icon);

		foldingDiv.addEventListener('click', async function (event) {
			let icon = event.currentTarget.querySelector('i');
			// this is the current status of the folding div
			let status = icon.classList.contains('fa-angle-down')
				? 'folded'
				: 'unfolded';
			let movieList = event.currentTarget.closest('.movie-item');
			let movieId = movieList.dataset.movieId;

			const currentIcon = event.currentTarget.querySelector('i');
			currentIcon.classList.toggle('fa-angle-down');
			currentIcon.classList.toggle('fa-angle-up');
			if (status === 'folded') {
				const details = await getMovieDetails(movieId);
				movieList.insertAdjacentElement(
					'afterend',
					renderMovieDetails(details)
				);
			} else {
				const details = document.querySelector(
					`.movie-details[data-movie-id="${movieId}"]`
				);
				details.remove();
			}
		});

		return foldingDiv;
	}
}

function renderMovieDetails(movie) {
	const movieDetails = document.createElement('div');
	movieDetails.classList.add('movie-details');
	movieDetails.dataset.movieId = movie.id;
	movieDetails.appendChild(createPosterDiv());
	movieDetails.appendChild(createInfoDiv());

	return movieDetails;

	function createPosterDiv() {
		const posterDiv = document.createElement('div');
		posterDiv.classList.add('poster');
		const poster_path = movie.poster_path;
		console.log(poster_path);
		let posterURL;
		if (!poster_path.startsWith('http')) {
			posterURL = img_base_url + img_size + poster_path;
		} else {
			posterURL = poster_path;
		}
		console.log(posterURL);

		const tooltip = document.createElement('span');
		tooltip.classList.add('tooltip');
		tooltip.textContent = 'Click to visit homepage';
		posterDiv.appendChild(tooltip);

		posterDiv.style.backgroundImage = `url(${posterURL})`;
		posterDiv.addEventListener('click', function () {
			window.open(movie.homepage, '_blank');
		});
		return posterDiv;
	}

	function createInfoDiv() {
		const contentDiv = document.createElement('div');
		contentDiv.classList.add('info');
		contentDiv.innerHTML = `            
            <blockquote>
                &ldquo;
                ${movie.tagline}
                &rdquo;
            </blockquote>
            <p class='overview'>${movie.overview}</p>
            <div class='produce-info'>
                <span>Released Date: ${movie.release_date.substring(
					0,
					10
				)}</span>
                <div><i class="fa-regular fa-thumbs-up"></i>${
					movie.vote_count
				}</div>
                <div><i class="fa-regular fa-star"></i>${
					movie.vote_average
				}</div>
            </div>
            
            `;
		return contentDiv;
	}
}

// retrieve the list of movies from the server
// as well as the total number of movies
async function loadingList() {
	try {
		const movieListEndPoint = '/movieList';
		const fetchNum = document.getElementById('page-size').value;
		const fetchPage = document.getElementById('page-number').value;
		const params = `?fetchNum=${fetchNum}&fetchPage=${fetchPage}`;
		let fetchMovieList = fetch(baseURL + movieListEndPoint + params); 
		const movieCountEndPoint = '/movieCount';
		let fetchMovieCount = fetch(baseURL + movieCountEndPoint);

		let [movieListResponse, movieCountResponse] = await Promise.all([
			fetchMovieList,
			fetchMovieCount,
		]);

		let [movieList, totalMovieCount] = await Promise.all([
			movieListResponse.json(),
			movieCountResponse.json(),
		]);

		renderMovieList(movieList);
		// get the total number of movies
		renderMovieListToolbar(totalMovieCount, fetchNum);
	} catch (error) {
		console.error('Error:', error.message);
	}
}

async function getMovieDetails(movieId) {
	try {
		const movieEndPoint = `/movie/${movieId}`;
		let movie = await fetch(baseURL + movieEndPoint);
		movie = await movie.json();
		return movie;
	} catch (error) {
		console.error('Error:', error.message);
	}
}

document.addEventListener('DOMContentLoaded', loadingList);
