import 'dotenv/config';

import express from 'express';
import { connect, set } from 'mongoose';
import cors from 'cors';

import routes from './routes';

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
    connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    set('useCreateIndex', true);
  }
}

export default new App().server;
