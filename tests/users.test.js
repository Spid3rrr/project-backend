const request = require('supertest')
const app = require('../index')

describe('Get users', () => {
  it('should get users', async () => {
    console.log(app);
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('users')
  })
})