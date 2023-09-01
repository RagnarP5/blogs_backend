const listHelper = require('../utils/list_helper')
const test_lists = require('./test_lists')
const mongoose = require("mongoose");

describe('listHelper', () => {


    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(test_lists.listWithOneBlog)
        expect(result).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(test_lists.blogs)
        expect(result).toBe(36)
    })

    test('find favourite blog', () => {
        const result = listHelper.favouriteBlog(test_lists.blogs)
        const expected = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }
        expect(result).toEqual(expected)
    })

    test('find author with most blogs', () => {
        const result = listHelper.mostBlogs(test_lists.blogs)
        const expected = {
            author: "Robert C. Martin",
            blogs: 3}
        expect(result).toEqual(expected)
    })

    test('find author with most likes', () => {
        const result = listHelper.mostLikes(test_lists.blogs)
        const expected = {
            author: "Edsger W. Dijkstra",
            likes: 17
        }
        expect(result).toEqual(expected)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})