const baseURL = 'http://localhost:8001';

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

// create li element for each movie
function renderMovieList(movieList) {
	for (const movie of movieList) {
		console.log(movie.id);
		const movieItem = createMovieItem(movie);
		document
			.querySelector('ul.movies-list')
			.appendChild(movieItem)
			.insertAdjacentElement('afterend', document.createElement('hr'));
		console.log(movieItem, movie.id, 'finished');
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
		console.log('enter createGenreDiv');
		const genresDiv = document.createElement('div');
		genresDiv.classList.add('genres');

		genres.forEach((genre) => {
			const genreSpan = document.createElement('span');
			genreSpan.textContent = genre.name;
			genreSpan.style.backgroundColor = genresColor[genre.id];
			genreSpan.dataset.genreId = genre.id;
			genresDiv.appendChild(genreSpan);
		});
		console.log('exit createGenreDiv');
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

			// console.log(
			// 	event.currentTarget.closest('.movie-item').dataset.movieId,
			// );
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
	movieDetails.innerText = JSON.stringify(movie, null, 2);

	return movieDetails;
}

async function loadingList() {
	try {
		const movieListEndPoint = '/movieList';
		const params = '?fetchNum=10';

		let fetchMovieList = await fetch(baseURL + movieListEndPoint + params); //
		movieList = await fetchMovieList.json();
		console.log(movieList);
		//console.log(movieList);
		renderMovieList(movieList);
	} catch (error) {
		console.error('Error:', error.message);
	}
}

async function getMovieDetails(movieId) {
	try {
		if (details[movieId]) {
			return details[movieId];
		}
		const movieEndPoint = `/movie/${movieId}`;
		let movie = await fetch(baseURL + movieEndPoint);
		movie = await movie.json();
		details[movieId] = movie;
		return details[movieId];
	} catch (error) {
		console.error('Error:', error.message);
	}
}

document.addEventListener('DOMContentLoaded', loadingList);
