import express from 'express';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

import cors from 'cors';
import { getMovieList, findMovieById } from './movieService.js';

// express init
const app = express();
const prisma = new PrismaClient();
// express configurations
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// test some prisma stuff
app.get('/movies_p/:id', async (req, res) => {
	try {
		const movie = await prisma.details.findUnique({
			where: {
				id: parseInt(req.params.id),
			},
		});
		if (movie) {
			res.status(200).json(movie);
		} else {
			res.status(404).send(`Movie id ${req.params.id} not found`);
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ err });
	}
});

// API endpoints

// GET: extra endpoint added to a service for the sole purpose of expressing its availability
app.get('/ping', (req, res) => {
	res.send('pong');
});

// GET: get a list of 10 movies
app.get('/movieList', async (req, res) => {
	try {
		const fetchNum = parseInt(req.query.fetchNum);
		const movieList = await prisma.details.findMany({
           
			take: fetchNum,
			select: {
				id: true,
				title: true,
				genres: true,
				popularity: true,
			},
		});
		if (movieList.length === 0) {
			res.status(404).send('No movies found');
		} else {
			res.status(200).json(movieList);
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ err });
	}
});

app.get('/movie/:id', async (req, res) => {
	try {
		const movie = await prisma.details.findUnique({
			where: {    
                id: parseInt(req.params.id),
            },
		});
		if (movie) {
			res.status(200).json(movie);
		} else {
			res.status(404).send(`Movie id ${req.params.id} not found`);
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ err });
	}
});

// // POST: creates new tweet
// app.post("/tweets", (req, res) => {
//   const newTweet = createTweet(req.body.text, req.body.username);
//   res.status(201).json(newTweet);
// });

// // GET: return Tweet with :id
// app.get("/tweets/:id", (req, res) => {
//   const tweet = findTweetById(req.params.id);

//   if (tweet) {
//     res.status(200).json(tweet);
//   } else {
//     res.status(404).send(`Tweet id ${req.params.id} not found`);
//   }
// });

// // PUT: updates Tweet text with :id
// app.put("/tweets/:id", (req, res) => {
//   if (!req.body.text || !req.params.id) {
//     res.status(401).send("incorrect input values");
//   }

//   const updateResult = updateTweet(req.params.id, req.body.text);

//   if (updateResult) {
//     res.status(200).send();
//   } else {
//     res.status(404).send(`Tweet id ${req.params.id} not found`);
//   }
// });

// app.delete("/tweets/:id", (req, res) => {
//   const deleteResult = deleteTweet(req.params.id);

//   if (deleteResult) {
//     res.status(200).send("Delete succeeded");
//   } else {
//     res.status(404).send(`Tweet id ${req.params.id} not found`);
//   }
// });

// Starts HTTP Server
app.listen(8001, () => {
	console.log('Server running on http://localhost:8001 🎉 🚀');
});
