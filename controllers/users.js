const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (password === undefined || password.length < 3){
        return response
            .status(400)
            .send({ error: 'password is too short or missing'})
    }
    if (username === undefined || username.length < 3){
        return response
            .status(400)
            .send({error: 'username is too short or missing'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter

