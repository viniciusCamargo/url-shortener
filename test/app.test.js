const request = require('supertest')
const { expect } = require('chai')
const app = require('../src/app')

const l = console.log

describe('POST /api/create', () => {
  const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJqb2huZG9lIiwicmVhbG5hbWUiOiJKb2huIERvZSJ9.10cg9u3gFDOLtY0hQvqkR2LlryOdifz5yrjATBHyXjA`

  it('succeed when a short URL is NOT provided', async () => {
    try {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', token)
        .send({ original_url: 'https://jsonplaceholder.typicode.com/posts/1' })

      expect(response.status).to.be.equal(201)
      expect(response.header['content-type']).contains('json')
      expect(response.body['shorthand']).not.be.null
    } catch (error) {
      console.error(error)
    }
  })

  it('succeed when a short URL is provided', async () => {
    try {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', token)
        .send({ original_url: 'https://jsonplaceholder.typicode.com/posts/1', shorthand: 'test' })

      expect(response.status).to.be.equal(201)
      expect(response.header['content-type']).contains('json')
      expect(response.body['shorthand']).to.be.equal('test')
    } catch (error) {
      console.error(error)
    }
  })

  it('fail when no URL is provided', async () => {
    try {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', token)
        .set('Content-Type', 'application/json')

      expect(response.status).to.be.equal(400)
      expect(response.header['content-type']).contains('json')
      expect(response.body).to.be.deep.equal({ error: 'No URL provided.' })
    } catch (error) {
      console.error(error)
    }
  })

  it('fail when no Authorization header is provided', async () => {
    try {
      const response = await request(app).post('/api/create')

      expect(response.status).to.be.equal(403)
      expect(response.header['content-type']).contains('json')
      expect(response.body).to.be.deep.equal({ error: 'No credentials sent.' })
    } catch (error) {
      console.error(error)
    }
  })

  it('fail when an invalid Authorization header is provided', async () => {
    try {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', 'Invalid Authorization header')

      expect(response.status).to.be.equal(403)
      expect(response.header['content-type']).contains('json')
      expect(response.body).to.be.deep.equal({ error: 'Invalid credentials.' })
    } catch (error) {
      console.error(error)
    }
  })

  it('fail when an invalid Authorization token is provided', async () => {
    try {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', 'Bearer Invalid token')

      expect(response.status).to.be.equal(403)
      expect(response.header['content-type']).contains('json')
      expect(response.body).to.be.deep.equal({ error: 'Invalid credentials.' })
    } catch (error) {
      console.error(error)
    }
  })

  it('fail when no Content-Type is provided', async () => {
    try {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', token)

      expect(response.status).to.be.equal(415)
      expect(response.header['content-type']).contains('json')
      expect(response.body).to.be.deep.equal({ error: 'Invalid Content-Type.' })
    } catch (error) {
      console.error(error)
    }
  })

  it('fail when a short URL already exists', async () => {
    try {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', token)
        .send({ original_url: 'https://jsonplaceholder.typicode.com/posts/1', shorthand: 'test' })

      expect(response.status).to.be.equal(409)
      expect(response.header['content-type']).contains('json')
      expect(response.body).to.be.deep.equal({ error: 'The provided shorthand is already taken.' })
    } catch (error) {
      console.error(error)
    }
  })
})

describe('GET shorthand', () => {
  it('fail when the provided short URL does NOT exist', async () => {
    try {
      const response = await request(app).get('/do-not-exist')

      expect(response.status).to.be.equal(404)
      expect(response.body).to.be.deep.equal({ error: 'The provided shorthand was not found.' })
    } catch (error) {
      console.error(error)
    }
  })

  it('succeed when a valid short URL is provided', async () => {
    const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJqb2huZG9lIiwicmVhbG5hbWUiOiJKb2huIERvZSJ9.10cg9u3gFDOLtY0hQvqkR2LlryOdifz5yrjATBHyXjA`

    try {
      await request(app)
        .post('/api/create')
        .set('Authorization', token)
        .send({ original_url: 'https://jsonplaceholder.typicode.com/posts/1', shorthand: 'test' })

      const response = await request(app)
        .get('/test')
        .redirects(1)

      expect(response.redirects[0]).to.be.equal('https://jsonplaceholder.typicode.com/posts/1')
      expect(response.body).to.be.deep.equal({
        userId: 1,
        id: 1,
        title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
      })
    } catch (error) {
      console.error(error)
    }
  })
})
