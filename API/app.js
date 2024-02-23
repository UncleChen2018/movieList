import express from 'express';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

import cors from 'cors';
// import { getMovieList, findMovieById } from './movieService.js';

// express init
const app = express();
const prisma = new PrismaClient();
// express configurations
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// API endpoints

// GET: extra endpoint added to a service for the sole purpose of expressing its availability
app.get('/ping', (req, res) => {
	res.send('pong');
});

// GET: get all valid genres from the server
app.get('/genres', async (req, res) => {
    try {
        const genres = await prisma.genres.findMany();
        res.status(200).json(genres);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

// Get: get the total number of movies
app.get('/movieCount', async (req, res) => {
	try {
		const count = await prisma.details.count();
		res.status(200).json({ count });
	} catch (err) {
		console.log(err);
		res.status(500).json({ err });
	}
});

// GET: get a list of N movies
// or a list of N movies with a specific title
app.get('/movieList', async (req, res) => {
	try {
        
		// handling endpoint parameters check
		const movieTitle = req.query.movieTitle;
		const movieId = req.query.movieId;
		let movieList;
		// if movieTitle is provided, search for movies with the title; else, return a list of movies referenced by fetchNum and fetchPage
		if (movieTitle || movieId) {
			if (movieTitle) {
				movieList = await prisma.details.findMany({
					where: {
						title: {
							contains: movieTitle,
						},
					},
				});
			} else {
				movieList = await prisma.details.findMany({
					where: {
						id: parseInt(movieId),
					},
				});
			}
		} else {
			const fetchNum = parseInt(req.query.fetchNum);
			if (!fetchNum || isNaN(fetchNum)) {
				throw new Error('valid fetchNum is required');
			}
			const fetchPage = parseInt(req.query.fetchPage);
			if (!fetchPage || isNaN(fetchPage)) {
				throw new Error('valid fetchPage is required');
			}
			movieList = await prisma.details.findMany({
				skip: fetchNum * (fetchPage - 1),
				take: fetchNum,
				select: {
					id: true,
					title: true,
					genres: true,
					popularity: true,
				},
			});
		}

		res.status(200).json(movieList);
	} catch (err) {
		console.log(err.message);
		res.status(500).json({ err: err.message });
	}
});

// GET: get a movie with a specific id

app.get('/movie/:id', async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		if (!id) {
			throw new Error('valid id is required');
		}
		const movie = await prisma.details.findUnique({
			where: {
				id: id,
			},
		});
		if (movie) {
			res.status(200).json(movie);
		} else {
			res.status(404).json({
				err: `Movie id ${req.params.id} not found`,
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: err.message });
	}
});

// post: creates a new movie
app.post('/movie', async (req, res) => {
    try {
        if (!req.body) {
            throw new Error('valid data is required');
        }
        const data = {
            title: req.body.title,
            popularity: parseFloat(req.body.popularity),
            homepage: req.body.homepage,
            poster_path: req.body.poster_path,
            tagline: req.body.tagline,
            overview: req.body.overview,
            release_date: req.body.release_date + 'T00:00:00Z',
            vote_count: parseInt(req.body.vote_count),
            vote_average: parseFloat(req.body.vote_average),
        };
        const movie = await prisma.details.create({
            data: data,
        });
        if (movie) {
            res.status(201).json(movie);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
});

// PUT: updates movie with :id
app.put('/movie/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (!id) {
            throw new Error('valid id is required');
        }
        if (!req.body) {
            throw new Error('valid data is required');
        }
        const data = {}
        if(req.body.title){
            data.title = req.body.title;
        }
        if(req.body.popularity){
            data.popularity = parseFloat(req.body.popularity);
        }
        if(req.body.homepage){
            data.homepage = req.body.homepage;
        }
        if(req.body.poster_path){
            data.poster_path = req.body.poster_path;
        }
        if(req.body.tagline){
            data.tagline = req.body.tagline;
        }
        if(req.body.overview){
            data.overview = req.body.overview;
        }
        if(req.body.release_date){
            data.release_date = req.body.release_date + 'T00:00:00Z';
        }
        if(req.body.vote_count){
            data.vote_count = parseInt(req.body.vote_count);
        }
        if(req.body.vote_average){
            data.vote_average = parseFloat(req.body.vote_average);
        }
        console.log(data.poster_path);

        const movie = await prisma.details.update({
            where: {
                id: id,
            },
            data: data,
        });
       
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).json({
                err: `Movie id ${req.params.id} not found`,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
});

// delete: deletes movie with :id
app.delete('/movie/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            throw new Error('valid id is required');
        }
        const movie = await prisma.details.delete({
            where: {
                id: id,
            },
        });
        if (movie) {
            res.status(200).json({ message: 'Delete succeeded' });
        } else {
            res.status(404).json({
                err: `Movie id ${req.params.id} not found`,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
});


// Starts HTTP Server
app.listen(8001, () => {
	console.log('Server running on http://localhost:8001 🎉 🚀');
});
