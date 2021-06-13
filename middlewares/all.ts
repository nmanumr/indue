import nc from 'next-connect';
import database from './database';
import session from './session';

const all = nc();

all.use(database).use(session);

export default all;

