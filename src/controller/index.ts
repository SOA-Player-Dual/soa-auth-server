import { Router, Response, Request } from 'express';
import authRouter from "@controller/auth/auth.route";
const router = Router();

router.use('/auth', authRouter);

router.route('/').get((_req: Request, res: Response) => {
    return res.json({ msg: 'API v1' });
});

export default router;
