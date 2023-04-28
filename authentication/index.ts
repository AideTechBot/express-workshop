import express from 'express';
import dotenv from 'dotenv';
import sessions from 'express-session';
import path from 'path';
import { ONE_DAY } from './constants';
import { getUserEntryById } from './fake-user-db';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  sessions({
    // DO NOT DO THIS IN PROD
    secret: 'thisisasecretthatshouldnotbestoredinplaintextinprod',
    saveUninitialized: true,
    cookie: { maxAge: ONE_DAY },
    resave: false,
  })
);

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const id = (req?.session as any)?.userId;
  const userEntry = getUserEntryById(id);
  if (userEntry && id) {
    userEntry.session = req?.session;
    res.send(`Welcome ${id}! <a href='/logout'>click to logout</a>`);
  } else {
    res.sendFile('front-end/index.html', { root: __dirname });
  }
});

app.get('/login', (req, res) => {
  res.redirect('/');
});

app.post('/login', (req, res) => {
  const { username: id, password } = req.body;
  const userEntry = getUserEntryById(id);
  if (userEntry && password == userEntry.password) {
    userEntry.session = req.session;
    userEntry.session.userId = id;
    console.log(req.session);
    res.send(`Hey there ${id}, welcome <a href=\'/logout'>click to logout</a>`);
  } else {
    res.send('Invalid username or password');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
