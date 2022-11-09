import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

const errorHandler = (
    error: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    try {
        return res.status(error.statusCode).json({ error: error.message });
    } catch (_err) {
        return res.status(500).json({ error: 'Unexpected error from server' });
    }
};

export default errorHandler;
