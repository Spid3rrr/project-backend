const request = require('supertest')
const {app} = require('../index')

describe('Get users', () => {
  it('should get users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('users')
  })
})

describe('Create test user', () => {
  it('should create test user', async () => {
    const data = {
      "username" : "testuser",
      "password" : "testuser",
      "email" : "testemail@email.com"
    }
    const res = await request(app).post('/users').send(data);
    expect(res.statusCode).toEqual(200)
  })
})

describe('Update test user', () => {
  it('should update test user', async () => {
    const data = {
      "username" : "testuser",
      "changes":{
        "email" : "testemailupdated"
      }
    }
    const res = await request(app).patch('/users/'+data.username).send(data.changes);
    expect(res.statusCode).toEqual(200)
  })
})


describe('Get user', () => {
  it('should get user', async () => {
    const data = {
      "username":"testuser"
    };
    const res = await request(app).get('/users/'+data.username);
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('userID')
  })
})

describe('Delete test user', () => {
  it('should delete test user', async () => {
    const data = {
      "username" : "testuser",
    }
    const res = await request(app).delete('/users/'+data.username);
    expect(res.statusCode).toEqual(200)
  })
})

describe('Get Leaderboard', () => {
  it('should get leaderboard', async () => {
    const res = await request(app).get('/users/leaderboard');
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('users')
  })
})

describe('Login user', () => {
  it('should login user', async () => {
    const data = {
      "username":"admin",
      "password":"admin"
    };
    const res = await request(app).post('/users/auth').send(data);
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('token')
  })
})