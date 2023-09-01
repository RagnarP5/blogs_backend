

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
    const favourite = blogs.reduce((prev, curr) =>  (prev.likes > curr.likes) ? prev : curr)

    return {
        'title': favourite.title,
        'author': favourite.author,
        'likes': favourite.likes
    }
}

const mostBlogs = (blogs) => {
    const authors = {}
    const popularAuthor = {
        author: '',
        blogs: 0
    }

    blogs.forEach((blog) => {
        authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1
    })

    for (const [author, blogs] of Object.entries(authors)){
        if (blogs > popularAuthor.blogs) {
            popularAuthor.author = author
            popularAuthor.blogs = blogs
        }
    }
    return popularAuthor
}

const mostLikes = (blogs) => {
    authors = {}
    mostLikesAuthor = {
        author: '',
        likes: 0
    }

    blogs.forEach((blog) => {
        authors[blog.author] = authors[blog.author] ? authors[blog.author] + blog.likes : blog.likes
    })

    for (const [author, likes] of Object.entries(authors)){
        if (likes > mostLikesAuthor.likes) {
            mostLikesAuthor.author = author
            mostLikesAuthor.likes = likes
        }
    }
    return mostLikesAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}