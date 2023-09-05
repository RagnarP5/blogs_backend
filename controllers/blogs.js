const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user')
    response.json(blogs)
})

blogRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
    }

    const users = await User.find({})
    const user = users.find((u) => u.id === decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author || "",
        url: body.url,
        user: user._id,
        likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.status(200).json(blog)
})

blogRouter.delete('/:id', async (request, response, next) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogRouter