const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./user/userController');
const authRouter = require('./auth/authController');
const pageRouter = require('./page/pageController');
const descriptionRouter = require('./description/descriptionController');
const notificationRouter = require('./notification/notificationController');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(morgan('dev'));
app.use(cors());

// Não modificar a ordem em que as rotas foram adicionadas, manter as rotas abertas primeiro (caso seja o mesmo recurso)
app.get('/', (req, res) => res.status(200).send());
app.use('/auth', authRouter);
app.use('/user', userRouter.openRouter, userRouter.authRouter);
app.use('/page', pageRouter);
app.use('/description', descriptionRouter);
app.use('/notification', notificationRouter);

module.exports = app;