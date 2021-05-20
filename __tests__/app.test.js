import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';
import showData from '../data/shows';
import { formatShows } from '../utils/munge-utils';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/shows', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });

    // append the token to your requests:
    //  .set('Authorization', user.token);

    it('GET from /api/shows', async () => {

      // remove this line, here to not have lint error:
      const response = await request
        .get('/api/shows')
        .set('Authorization', user.token)
        .query({ search: 'girls' });

      // console.log(response.body);
      expect(response.status).toBe(200);
      // expect(response.body).toEqual(?);
    });

    let favorite = {
      id: expect.any(Number),
      showId: 139,
      title: 'Girls',
      image: 'https://static.tvmaze.com/uploads/images/medium_portrait/31/78286.jpg',
      rating: 6.6,
      description: '<p>This Emmy winning series is a comic look at the assorted humiliations and rare triumphs of a group of girls in their 20s.</p>'
    };


    it('POST from /api/favorites', async () => {

      // remove this line, here to not have lint error:
      const response = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favorite);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...favorite,
        userId: user.id
      });
    });
  });
});

describe('Munging Data', () => {

  const expectedShows = [
    {
      showId: 139,
      title: 'Girls',
      image: 'https://static.tvmaze.com/uploads/images/medium_portrait/31/78286.jpg',
      rating: 6.6,
      description: '<p>This Emmy winning series is a comic look at the assorted humiliations and rare triumphs of a group of girls in their 20s.</p>'
    },
    {
      showId: 23542,
      title: 'Good Girls',
      image: 'https://static.tvmaze.com/uploads/images/medium_portrait/297/744253.jpg',
      rating: 7.4,
      description: '<p><b>Good Girls</b> follows three "good girl" suburban wives and mothers who suddenly find themselves in desperate circumstances and decide to stop playing it safe, and risk everything to take their power back.</p>'
    }
  ];

  it('munges movie data', async () => {
    const output = formatShows(showData);

    expect(output).toEqual(expectedShows);

  });
});