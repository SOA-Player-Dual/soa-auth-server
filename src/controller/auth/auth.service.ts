import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import prisma, { Prisma } from '@config/db';
import { compare, hash } from '@helper/hash';

export const login = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: _req.body.username,
      },
    });
    if (!user) return next(createError(401, 'Username not exist'));
    if (!compare(_req.body.password, user.password))
      return next(createError(401, 'Wrong password'));
    return res.json({ msg: 'Login ok', data: {...user, password: ''} });
  } catch (e) {
    return next(e);
  }
};

export const register = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
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
      },
    });
    res.json({
      msg: 'Register success',
      data: { ...user, password: '' },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      let eMsg: string;
      switch (e.code) {
        case 'P2002':
          if (e.meta.target === 'User_username_key') {
            eMsg = 'Username already exist';
          } else if (e.meta.target === 'User_email_key') {
            eMsg = 'Email already exist';
          }
          break;
      }
      return next(createError(400, eMsg));
    }
    next(e);
  }
};
