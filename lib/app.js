/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';
import request from 'superagent';
import { formatShows } from '../utils/munge-utils.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);

// heartbeat route
app.get('/', (req, res) => {
  res.send('Famous Cats API');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:

app.post('/api/favorites', async (req, res) => {
  // use SQL query to get data...
  const favorite = req.body;
  try {
    const data = await client.query(`
      INSERT INTO favorites (show_id, title, image,rating, description, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)

      RETURNING id, show_id as "showId", title, image, rating, description, user_id as "userId";
    `, [favorite.showId, favorite.title, favorite.image, favorite.rating, favorite.description, req.userId]);

    // send back the data
    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/shows', async (req, res) => {
  // use SQL query to get data...
  try {
    const response = await request.get('http://api.tvmaze.com/search/shows')
      .query({ q: req.query.search });

    const shows = formatShows(response.body);

    // send back the data
    res.json(shows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
export default app;