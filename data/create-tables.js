/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(` 
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        email VARCHAR(512) NOT NULL,
        hash VARCHAR(512) NOT NULL
      );
    
      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY NOT NULL,
        show_id INTEGER NOT NULL,
        title VARCHAR(512) NOT NULL,
        image VARCHAR(1024) NOT NULL,
        rating FLOAT,
        description TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}