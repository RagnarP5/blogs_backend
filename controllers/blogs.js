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


blogRouter.post('/', async (request, response) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author || "",
        url: body.url,
        user: request.user._id,
        likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    await savedBlog.populate('user')
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
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    await updatedBlog.populate('user')
    response.status(200).json(updatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const blogs = await Blog.find({})
    const blog = blogs.find((b) => b._id.toString() === request.params.id)

    if (blog.user.toString() === request.user._id.toString()){
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
})

module.exports = blogRouter