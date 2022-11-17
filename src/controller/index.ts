import { Router, Response, Request } from 'express';
import authRouter from '@controller/auth/auth.route';
import { hash } from '@helper/hash';
import prisma from '@config/db';
const router = Router();

router.use('/auth', authRouter);
router.route('/auto').post(async (_req, res, next) => {
  try {
    const {
      username,
      password,
      email,
      gender,
      nickname,
      dateOfBirth,
      language,
      nation,
      avatar,
      urlCode,
      description,
      fee,
    } = _req.body;
    const hashPassword = hash(password);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashPassword,
        email,
        gender,
        nickname,
        dateOfBirth: new Date(dateOfBirth),
        language,
        nation,
        avatar,
        urlCode,
      },
    });
    await prisma.player.create({
      data: {
        id: user.id,
        name: user.nickname,
        description,
        album: "['_blank']",
        device: "['_blank']",
        dateJoin: user.dateJoin,
        fee,
      },
    });
    res.json({ msg: 'ok' });
  } catch (e) {
    next(e);
  }
})
  .put(async (_req, res, next) => {
      try {
          const user = await prisma.user.findFirst({
              where: {
                  urlCode: _req.body.urlCode,
              },
              select:{
                  id: true
              },
          });
          await prisma.player.update({
              where: {
                  id: user.id
              },
              data: {
                  album: _req.body.album
              }
          })
          res.json({msg: 'ok'})
      } catch (e) {
          next(e);
      }
  });

router.route('/').get((_req: Request, res: Response) => {
  return res.json({ msg: 'API v1' });
});

export default router;
