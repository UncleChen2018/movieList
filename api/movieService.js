
// We are going to save in memory for now, in our next class we will save to a relational database
const db = {
	details: [
		{
			id: 13,
			genres: '[{"id": 35, "name": "Comedy"}, {"id": 18, "name": "Drama"}, {"id": 10749, "name": "Romance"}]',
			title: 'Forrest Gump',
			overview:
				'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.',
			tagline:
				"The world will never be the same once you've seen it through the eyes of Forrest Gump.",
			homepage: 'https://www.paramountmovies.com/movies/forrest-gump',
			release_date: '1994-06-23',
			adult: 0,
			popularity: 82.044,
			vote_average: 8.477,
			vote_count: 26165,
		},
		{
			id: 22,
			genres: '[{"id": 12, "name": "Adventure"}, {"id": 14, "name": "Fantasy"}, {"id": 28, "name": "Action"}]',
			title: 'Pirates of the Caribbean: The Curse of the Black Pearl',
			overview:
				"Jack Sparrow, a freewheeling 18th-century pirate, quarrels with a rival pirate bent on pillaging Port Royal. When the governor's daughter is kidnapped, Sparrow decides to help the girl's love save her.",
			tagline: 'Prepare to be blown out of the water.',
			homepage:
				'https://movies.disney.com/pirates-of-the-caribbean-the-curse-of-the-black-pearl',
			release_date: '2003-07-09',
			adult: 0,
			popularity: 133.064,
			vote_average: 7.796,
			vote_count: 19693,
		},
		{
			id: 27,
			genres: '[{"id": 18, "name": "Drama"}, {"id": 10402, "name": "Music"}, {"id": 10749, "name": "Romance"}]',
			title: '9 Songs',
			overview:
				"Matt, a young glaciologist, soars across the vast, silent, icebound immensities of the South Pole as he recalls his love affair with Lisa. They meet at a mobbed rock concert in a vast music hall - London's Brixton Academy. They are in bed at night's end. Together, over a period of several months, they pursue a mutual sexual passion whose inevitable stages unfold in counterpoint to nine live-concert songs.",
			tagline: '2 lovers, one summer, and the 9 songs that defined them.',
			homepage: '',
			release_date: '2004-07-16',
			adult: 0,
			popularity: 32.937,
			vote_average: 5.621,
			vote_count: 485,
		},
		{
			id: 33,
			genres: '[{"id": 37, "name": "Western"}]',
			title: 'Unforgiven',
			overview:
				'William Munny is a retired, once-ruthless killer turned gentle widower and hog farmer. To help support his two motherless children, he accepts one last bounty-hunter mission to find the men who brutalized a prostitute. Joined by his former partner and a cocky greenhorn, he takes on a corrupt sheriff.',
			tagline:
				'Some legends will never be forgotten. Some wrongs can never be forgiven.',
			homepage: '',
			release_date: '1992-08-07',
			adult: 0,
			popularity: 33.239,
			vote_average: 7.915,
			vote_count: 4113,
		},
	],
};

export const getMovieList = () => {
    const resultArray = db.details.map((item) => ({
        id: item.id,
        title: item.title,
        genres: item.genres,
        popularity: item.popularity,
      }));
	return  resultArray;
};



export const findMovieById = (movieId) => {
	return db.details.find((m) => m.id.toString() === movieId);
};





export const createTweet = (text, username) => {
	const newTweet = {
		id: generateId(),
		text: text,
		username: username,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};

	db.tweets.push(newTweet);

	return newTweet;
};

export const updateTweet = (tweetId, text) => {
	let indexToUpdate = -1;

	const currentTweet = db.tweets.find((t, i) => {
		indexToUpdate = i;
		return t.id.toString() === tweetId;
	});

	if (currentTweet) {
		db.tweets.splice(indexToUpdate, 1, {
			...currentTweet,
			text: text,
			updatedAt: Date.now(),
		});

		return true;
	} else {
		return false;
	}
};

export const deleteTweet = (tweetId) => {
	const indexToDelete = db.tweets.findIndex(
		(t) => t.id.toString() === tweetId
	);

	if (indexToDelete !== -1) {
		db.tweets.splice(indexToDelete, 1);
		return true;
	} else {
		return false;
	}
};
