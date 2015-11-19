require('../server.babel'); // babel registration (runtime transpilation for node)

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import {mapUrl} from 'utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import passport from "passport";
import PassportLinkedin from 'passport-linkedin';
import cookieParser from 'cookie-parser'
const pretty = new PrettyError();
const app = express();
const LinkedinStrategy =  PassportLinkedin.Strategy
const server = new http.Server(app);
const io = new SocketIo(server);
io.path('/ws');

app.use(session({
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());
passport.use( new LinkedinStrategy({  // request fields from facebook
  profileFields: ['summary','industry','positions','headline','picture-url','first-name','last-name','location'],
  consumerKey: '75wbm6jxhrsauj',
  consumerSecret: 'qz9SGDHb53Hi6tnU',
  callbackURL: 'api/auth/linkedin'
  //enableProof: false
  },
    (accessToken, refreshToken, profile, done) => {
    setTimeout(() => {
      return done(null, profile);
    },0);
  }
));

passport.serializeUser((user, done) => { // serialization is necessary for persistent sessions
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
app.get('api/auth/linkedin',passport.authenticate('linkedin', { scope: ['r_basicprofile'] }), (req,res) => {
  console.log("This is the json object",res.req.user._json)
  console.log("This is my summary",res.req.user._json.summary);
  console.log("These are my postions",res.req.user._json.positions);
  console.log("This is the industry",res.req.user._json.industry);
  console.log("This is the company(s)",res.req.user._json.company)

  res.send();
})
app.use((req, res) => {

  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splittedUrlPath);

  if (action) {
    action(req, params)
      .then((result) => {
        res.json(result);
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});


const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', {msg: `'Hello World!' from server`});

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex;
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);

} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
