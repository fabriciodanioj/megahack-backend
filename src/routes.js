import { Router } from 'express';

import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
import VerifyController from './app/controllers/VerifyController.js';
import AuthMiddleware from './app/middlewares/auth.js';

const routes = new Router();

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.delete('/users/:id', UserController.delete);

routes.put('/verify/:id', VerifyController.update);

routes.post('/session', SessionController.store);

routes.use(AuthMiddleware);

export default routes;
