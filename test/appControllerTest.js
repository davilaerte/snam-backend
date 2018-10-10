process.env.ENVIROMENT_BD = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../appController');
const mongoose = require('../database');
const userRepository = require('../user/userRepository');
const pageRepository = require('../page/pageRepository');
const descriptionRepository = require('../description/descriptionRepository');
const should = chai.should();
const expect = chai.expect;
const config = require('../_config');

chai.use(chaiHttp);

const authUser = chai.request.agent(server);

let userAuth;

before(async () => {
  await mongoose.connect(config.mongoURI[process.env.ENVIROMENT_BD], { useCreateIndex: true, useNewUrlParser: true });
  userAuth = await userRepository.create({ name: 'pedro', email: 'pedro@gmail.com', password: '12345' });
  const authRes = await authUser.post('/auth').send({ email: 'pedro@gmail.com', password: '12345' });
  expect(authRes).to.have.cookie('access_token');
  authRes.should.have.status(201);
});

after(async () => {
  await userRepository.dropAll();
  await mongoose.connection.close();
  await authUser.close();
});

describe('Tests for path /user in API', () => {
  it('should list ALL users on /user GET', (done) => {
    authUser.get('/user')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });
  it('should return a 401 response on /user GET', (done) => {
    chai.request(server)
      .get('/user')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error');
        res.body.error.should.equal('No token provider');
        done();
      });
  });
  it('should list a SINGLE user on /user/<id> GET', (done) => {
    authUser.get('/user/' + userAuth.id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('_id');
        res.body.should.have.property('name');
        res.body.should.have.property('email');
        res.body._id.should.equal(userAuth.id);
        res.body.name.should.equal(userAuth.name);
        res.body.email.should.equal(userAuth.email);
        done();
      });
  });
  it('should add a SINGLE user on /user POST', (done) => {
    const user = { name: 'davi', email: 'davi@gmail.com', password: '12385' };
    chai.request(server)
      .post('/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('_id');
        res.body.should.have.property('name');
        res.body.should.have.property('email');
        res.body.name.should.equal(user.name);
        res.body.email.should.equal(user.email);
        done();
      });
  });
});

describe('Tests for path /page in API', () => {
  let page;

  before(async () => {
    const res = await authUser.post('/page').send({ name: 'Narutando' });
    page = res.body;
    res.should.have.status(201);
  });

  after(async () => {
    await pageRepository.dropAll();
  });

  it('should list ALL pages on /page GET', (done) => {
    authUser.get('/page')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });
  it('should list a SINGLE page on /page/<id> GET', (done) => {
    authUser.get('/page/' + page._id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('_id');
        res.body.should.have.property('name');
        res.body.should.have.property('idUserAdm');
        res.body.should.have.property('posts');
        res.body.should.have.property('like');
        res.body._id.should.equal(page._id);
        res.body.name.should.equal(page.name);
        res.body.idUserAdm.should.equal(userAuth.id);
        res.body.posts.should.be.a('array');
        res.body.posts.length.should.equal(0);
        res.body.like.should.equal(0);
        done();
      });
  });
  it('should add a SINGLE page on /page POST', (done) => {
    const newPage = { name: 'Bleaching' };
    authUser.post('/page')
      .send(newPage)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('_id');
        res.body.should.have.property('name');
        res.body.should.have.property('idUserAdm');
        res.body.should.have.property('posts');
        res.body.should.have.property('like');
        res.body.name.should.equal(newPage.name);
        res.body.idUserAdm.should.equal(userAuth.id);
        res.body.posts.should.be.a('array');
        res.body.posts.length.should.equal(0);
        res.body.like.should.equal(0);
        done();
      });
  });
  it('should add a SINGLE post page on /page/<id>/post POST', (done) => {
    const postObj = { name: 'Oloko', text: 'massa dmais' };
    authUser.post('/page/' + page._id + '/post')
      .send(postObj)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('posts');
        res.body.posts.length.should.equal(1);
        done();
      });
  });
});

describe('Tests for path /description in API', () => {
  let description;

  before(async () => {
    const res = await authUser.post('/description').send({ title: 'Naruto', text: 'Melhor anime que eu nunca vi' });
    description = res.body;
    res.should.have.status(201);
  });

  after(async () => {
    await descriptionRepository.dropAll();
  });

  it('should list ALL descriptions on /description GET', (done) => {
    authUser.get('/description')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });
  it('should list a SINGLE description on /description/<id> GET', (done) => {
    authUser.get('/description/' + description._id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('_id');
        res.body.should.have.property('title');
        res.body.should.have.property('text');
        res.body.should.have.property('idUserAdm');
        res.body.should.have.property('like');
        res.body.title.should.equal(description.title);
        res.body._id.should.equal(description._id);
        res.body.text.should.equal(description.text);
        res.body.idUserAdm.should.equal(userAuth.id);
        res.body.like.should.equal(0);
        done();
      });
  });
  it('should add a SINGLE description on /description POST', (done) => {
    const newDescription = { title: 'Bleach', text: 'Melhor anime que eu jamais verei' };
    authUser.post('/description')
      .send(newDescription)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('_id');
        res.body.should.have.property('title');
        res.body.should.have.property('text');
        res.body.should.have.property('idUserAdm');
        res.body.should.have.property('like');
        res.body.title.should.equal(newDescription.title);
        res.body.text.should.equal(newDescription.text);
        res.body.idUserAdm.should.equal(userAuth.id);
        res.body.like.should.equal(0);
        done();
      });
  });
});

describe('Tests for path /notification in API', () => {
  it('should list ALL notifications on /notification GET', (done) => {
    authUser.get('/notification')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });
});

describe('Tests for path /auth in API', () => {
  const credentials = { email: 'kakashi@gmail.com', password: '12745' };

  before(async () => {
    await userRepository.create(Object.assign({ name: 'kakashi' }, credentials));
  });

  it('should get a cookie with a access token', (done) => {
    chai.request(server)
      .post('/auth')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res).to.have.cookie('access_token');
        done();
      });
  });
});