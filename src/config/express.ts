import express, { NextFunction, Request, Response } from 'express';
import errorHandler from '@middleware/errorHandler';
import router from '@controller/index';
import morgan from 'morgan';
import fs from 'fs';
import createError from 'http-errors';

const createServer = (): express.Application => {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.disable('x-powered-by');
    if (!fs.existsSync('log')) {
        fs.mkdirSync('log');
    }
    const accessLogStream = fs.createWriteStream(`log/server.log`, {
        flags: 'a',
    });
    app.use(morgan('common', { stream: accessLogStream }));
    app.use(morgan('dev'));

    app.use('/api/v1', router);

    app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
        next(createError(404, 'URL not found'));
    });
    app.use(errorHandler);
    return app;
};

export { createServer };
