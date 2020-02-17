import 'dotenv/config.js';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import routes from './routes.js';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
  }

  database() {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    mongoose.set('useCreateIndex', true);
  }
}

export default new App().server;
