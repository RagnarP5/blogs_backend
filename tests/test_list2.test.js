const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany()

    const noteObjects = helper.initialBlogsMany
        .map(blog => new Blog(blog))
    const promiseArray = noteObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Correct number of blogs are returned', async () =>{
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogsMany.length)
})

test('Verify that the unique identifier is named id (not _id)', async () => {
    const response = await Blog.find({})
    const test_blog = response[0]
    expect(test_blog.id).toBeDefined()
})

test('A valid blog can be added', async () => {
    const newBlog = {
        title: "Dummy blog title",
        author: "Dummy blog author",
        url: "Dummy blog url",
        likes: 42
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogsMany.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    const authors = blogsAtEnd.map(b => b.author)
    const urls = blogsAtEnd.map(b => b.url)
    const likes = blogsAtEnd.map(b => b.likes)

    expect(titles).toContain("Dummy blog title")
    expect(authors).toContain("Dummy blog author")
    expect(urls).toContain("Dummy blog url")
    expect(likes).toContain(42)
})

test('Test whether likes initialize to 0 if no value is given', async () => {
    const newBlog = {
        title: "Dummy title",
        author: "Dummy author",
        url: "Dummy url"
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)

    const savedBlog = JSON.parse(response.text)
    expect(savedBlog.likes).toEqual(0)
})

test('Verify that a blog cannot be posted without title', async () => {
    const noTitleBlog = {
        url: "No title url"
    }
    const response = await api
        .post('/api/blogs')
        .send(noTitleBlog)
        .expect(400)

    const savedBlogs = await helper.blogsInDb()
    expect(savedBlogs).toHaveLength(helper.initialBlogsMany.length)
})

test('Verify that a blog cannot be posted without url', async () => {
    const noTitleBlog = {
        title: "No url title"
    }
    await api
        .post('/api/blogs')
        .send(noTitleBlog)
        .expect(400)

    const savedBlogs = await helper.blogsInDb()
    expect(savedBlogs).toHaveLength(helper.initialBlogsMany.length)
})

describe('Deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const blogsIds = blogsAtEnd.map(b => b.id)
        expect(blogsIds).not.toContain(blogToDelete.id)
    })
})

describe('Updating a note', () => {
    test('Can successfully update a blog', async () => {
        const blogsAtStart = await helper.initialBlogsMany
        const blogToUpdate = blogsAtStart[0]
        blogToUpdate.likes = 666

        const response = await api
            .put(`/api/blogs/${blogToUpdate._id}`)
            .send(blogToUpdate)
            .expect(200)

        // Check if blog has been updated
        const response2 = await api.get(`/api/blogs/${blogToUpdate._id}`)

        const returnedUpdatedBlog = JSON.parse(response2.text)
        expect(returnedUpdatedBlog.likes).toEqual(666)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})