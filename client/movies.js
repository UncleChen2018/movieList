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


const ids = genres.map((genre) => genre.id);

let details = [];

function generateGenresColor() {
	let colorMap = {};
	for (let i = 0; i < ids.length; i++) {
		colorMap[ids[i]] = colors[i % colors.length];
	}
	return colorMap;
}
const genresColor = generateGenresColor();
// const totalMovieCount = 0;

//when browse, update the total page number
async function renderMovieListToolbar(totalMovieCount, fetchNum) {
	const totalPage = document.getElementById('total-pages');
	const maxPage = Math.ceil(parseInt(totalMovieCount.count) / fetchNum);
	totalPage.textContent = maxPage;
	const currentPage = document.getElementById('page-number');
	currentPage.setAttribute('max', maxPage);
	currentPage.setAttribute('min', 1);
	currentPage.style.width = `${maxPage.toString().length + 1}em`;
}

// make the current page number not exceed the total page number
function updatePageNumber() {
	const currentPage = document.getElementById('page-number');
	const maxPage = document.getElementById('total-pages').textContent;

	if (parseInt(currentPage.value) > parseInt(maxPage)) {
		currentPage.value = maxPage;
	}
}

function resetSearchBar() {
	document.getElementById('title-search').value = '';
	document.getElementById('id-search').value = '';
}

function getPosterURL(poster_path) {
	let posterURL;
	if (!poster_path.startsWith('http')) {
		posterURL = img_base_url + img_size + poster_path;
	} else {
		posterURL = poster_path;
	}
	return posterURL;
}

async function renderMovieList(movieList) {
	const movieListElement = document.querySelector('ol.movies-list');
	movieListElement.innerHTML = `
    <li class='column-name'>
      <div>Title</div>
      <div>Hot</div>
      <div>Genres</div>
    </li>
    <hr>
    `;

	// if the movie list is empty, display the empty result

	if (movieList.length === 0) {
		const emptyResult = document.createElement('div');
		emptyResult.classList.add('empty-result');
		emptyResult.innerHTML = `
        <img src="./resources/no_movies.png" alt="empty" />
        <p>No movie found</p>
        <div class="more-info"><p></p></div>
        `;
		if (
			document.getElementById('title-search').value ||
			document.getElementById('id-search').value
		) {
			emptyResult.querySelector('.more-info p').innerHTML =
				'No movie found with the given title or id';
		} else {
			const p = emptyResult.querySelector('.more-info p');
			p.style.color = '#1E90FF';
			p.innerHTML =
				'Follow READ.me to import the Movie Databases before using';
		}
		movieListElement.appendChild(emptyResult);
		return;
	}

	for (const movie of movieList) {
		const movieItem = document.createElement('li');
		movieItem.classList.add('movie-item');
		movieItem.dataset.movieId = movie.id;
		movieItem.appendChild(renderMovieHead(movie));

		document
			.querySelector('ol.movies-list')
			.appendChild(movieItem)
			.appendChild(document.createElement('hr'));
	}
}

function getHotFromPopularity(popularity) {
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
	return fires;
}

function createPopularityDiv(popularity) {
	const popularityDiv = document.createElement('div');
	popularityDiv.classList.add('popularity');
	const fires = getHotFromPopularity(popularity);
	for (let i = 0; i < fires; i++) {
		const star = document.createElement('i');
		star.classList.add('fa-solid', 'fa-fire-flame-curved');
		popularityDiv.appendChild(star);
	}
	return popularityDiv;
}

function renderMovieHead(movie) {
	const movieHead = document.createElement('div');

	movieHead.classList.add('movie-head');
	movieHead.dataset.movieId = movie.id;
	movieHead.appendChild(createTitleDiv(movie.title));
	movieHead.appendChild(createPopularityDiv(movie.popularity));
	movieHead.appendChild(createGenreDiv(movie.genres));
	movieHead.appendChild(createFoldingDiv());
	return movieHead;

	function createTitleDiv(title) {
		const titleDiv = document.createElement('div');
		titleDiv.classList.add('movie-title');
		titleDiv.textContent = title;
		return titleDiv;
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
			let movieList = event.currentTarget.closest('.movie-head');
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

	//update the title
	const movieHead = document.querySelector(
		`.movie-head[data-movie-id="${movie.id}"]`
	);
	movieHead.querySelector('.movie-title').textContent = movie.title;
	movieHead
		.querySelector('.popularity')
		.replaceWith(createPopularityDiv(movie.popularity));
	//update the popularity

	return movieDetails;

	function openHomepage() {
		window.open(movie.homepage, '_blank');
	}

	function createPosterDiv() {
		const posterDiv = document.createElement('div');
		posterDiv.classList.add('poster');
		const poster_path = movie.poster_path;

		let posterURL = getPosterURL(poster_path);

		const tooltip = document.createElement('span');
		tooltip.classList.add('tooltip');
		tooltip.textContent = 'Click to visit homepage';
		posterDiv.appendChild(tooltip);
		
		posterDiv.style.backgroundImage = `url(${posterURL}), url('./resources/no preview.png')`;
		

		posterDiv.addEventListener('click', openHomepage);

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
                <span>Id: ${movie.id}</span>
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
		contentDiv.appendChild(createManageDiv());
		return contentDiv;
	}

	function createManageDiv() {
		const manageDiv = document.createElement('div');
		manageDiv.classList.add('manage-panel');
		manageDiv.innerHTML = `
            <button class='edit'>Edit</button>
            <button class='delete'>Delete</button>
        `;

		manageDiv
			.querySelector('.edit')
			.addEventListener('click', editMovieDetails);
		manageDiv
			.querySelector('.delete')
			.addEventListener('click', deleteMovieDetails);
		return manageDiv;
	}
}

async function editMovieDetails(event) {
	const movieDetails = event.currentTarget.closest('.movie-details');

	const movieId = movieDetails.dataset.movieId;
	console.log(movieId);
	const movie = await getMovieDetails(movieId);
	const editForm = createEditForm(movie);
	movieDetails.replaceWith(editForm);

}

function createEditForm(movie) {
	const editForm = document.createElement('form');
	editForm.classList.add('movie-details');
	editForm.dataset.movieId = movie.id;
	editForm.innerHTML = `
        <div class='poster editing'>  
        Id (can not change): <input type='text' name='id' readonly value='${
			movie.id
		}' />
        title<input type='text' name='title' value='${movie.title}' required  />
            hot<input type='number' name='popularity' min="0" step="0.001" value='${
				movie.popularity
			}' required  />
            <label for="genres">Genres(can not change):</label>
<input type="text" name="genres" list="genreList" readonly value="${movie.genres
		.map((genre) => genre.name)
		.join(', ')}"/>

<!-- Datalist containing options based on your array of genres -->
<datalist id="genreList">
    ${genres.map((genre) => `<option value="${genre.name}"></option>`).join('')}
</datalist>
        
            home page(start with http(s))<input type='text' name='homepage' pattern="https?://.+" 
            value='${movie.homepage}' />
            poster_path(start with http(s))<input type='text' name='poster_path' pattern ="https?://.+"  value='${getPosterURL(
				movie.poster_path
			)}' />
        </div>
        <div class='info' >
           
            
            tagline<input type='text' name='tagline' value='${movie.tagline}' />
            <textarea name='overview' required style='height:60px;'>${
				movie.overview
			}</textarea>

            release date<input type='date' name='release_date' value='${movie.release_date.substring(
				0,
				10
			)}' />
            <div style='display: flex; justify-content: space-between;align-items:baseline'>
            vote count<input type='number' name='vote_count' value='${
				movie.vote_count
			}' />
            vote average <input type='number' name='vote_average' value='${
				movie.vote_average
			}' step="0.001" max="10" min="0" />
            </div>
            <div style='display: flex; justify-content: space-around;'>
            <button type='submit'>Save</button>
            <button type='button' class='cancel'>Cancel</button>
            </div>
        </div>
    `;

	editForm.addEventListener('submit', async function (event) {
		event.preventDefault();
		const formData = new FormData(editForm);
		const updatedMovie = Object.fromEntries(formData);
		const movieId = editForm.dataset.movieId;
		const movie = await getMovieDetails(movieId);
		console.log(movie);
		console.log(updatedMovie);
		const retMovie = await putUpdateMovieDetails(updatedMovie);

		editForm.replaceWith(renderMovieDetails(retMovie));
	});
	editForm.querySelector('.cancel').addEventListener('click', function () {
		editForm.replaceWith(renderMovieDetails(movie));
	});
	return editForm;
}

// update the movie details
// and render the updated movie details
async function putUpdateMovieDetails(updatedData) {
	try {
		console.log(updatedData);
		const movieId = updatedData.id;
		const movieEndPoint = `/movie/${movieId}`;
		const putRequestConfig = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedData),
		};
		console.log(baseURL + movieEndPoint);
		const response = await fetch(baseURL + movieEndPoint, putRequestConfig);
		const movie = await response.json();
		return movie;
	} catch (error) {
		console.error('Error:', error.message);
	}
}

async function deleteMovieDetails(event) {
	const movieId =
		event.currentTarget.closest('.movie-details').dataset.movieId;
	const confirmDelete = window.confirm('Are you sure to delete this movie?');

	if (confirmDelete) {
		const movieEndPoint = `/movie/${movieId}`;
        const deleteRequestConfig = {
            method: 'DELETE',
        };
        const response = await fetch(baseURL + movieEndPoint, deleteRequestConfig);
        const movie = await response.json();
        console.log(movie);
        const movieDetails = document.querySelector(
            `.movie-item[data-movie-id="${movieId}"]`
        );
        movieDetails.remove();

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

async function loadMovieSearchList() {
	try {
		const movieListEndPoint = '/movieList';
		const movieTitle = document.getElementById('title-search').value.trim();
		const movieId = document.getElementById('id-search').value;
		let fetchMovieList;
		if (movieTitle) {
			fetchMovieList = await fetch(
				baseURL + movieListEndPoint + `?movieTitle=${movieTitle}`
			);
		} else {
			fetchMovieList = await fetch(
				baseURL + movieListEndPoint + `?movieId=${movieId}`
			);
		}
		const movieSearchList = await fetchMovieList.json();
		renderMovieList(movieSearchList);
	} catch (error) {
		console.error('Error:', error.message);
	}
}

function setToolBar() {
	// function on browse button click, update the movie list
	document
		.getElementById('page-number')
		.addEventListener('change', updatePageNumber);

	document.getElementById('page-size').addEventListener('change', () => {
		const currentPage = document.getElementById('page-number');
		currentPage.value = 1;
		loadingList(), updatePageNumber();
	});

	document.querySelector('.toolbar .browse').addEventListener('click', () => {
		resetSearchBar();
	});

	// function on search bar change, update the movie list
	document.getElementById('title-search').addEventListener('focus', () => {
		document.getElementById('id-search').value = '';
	});
	document.getElementById('title-search').addEventListener('input', () => {
		if (document.getElementById('title-search').value.trim() != '') {
			loadMovieSearchList();
		}
	});

	document.getElementById('id-search').addEventListener('focus', () => {
		document.getElementById('title-search').value = '';
	});
	document.getElementById('id-search').addEventListener('input', () => {
		if (document.getElementById('id-search').value != '') {
			loadMovieSearchList();
		}
	});
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
document.addEventListener('DOMContentLoaded', setToolBar);
