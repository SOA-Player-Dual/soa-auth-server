import { Router, Response, Request } from 'express';
import {login, register} from '@controller/auth/auth.service';
const router = Router();

router.route('/login').post(login);
router.route('/register').post(register)

router.route('/').get((_req: Request, res: Response) => {
  return res.json({ msg: 'auth API' });
});

export default router;
