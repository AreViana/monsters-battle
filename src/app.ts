import express from 'express';
import router from './router';
import errorHandler from './middlewares/error-handler';

const app = express();

app.disable('etag');
app.use(express.json());
app.use(router);
app.use(errorHandler);

export default app;
