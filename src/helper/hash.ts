import { hashSync, compareSync } from 'bcrypt';

const SALT = 10;

export const hash = (raw: string) => hashSync(raw, SALT) as string;

export const compare = (raw, hash: string) => compareSync(raw, hash) as boolean;
