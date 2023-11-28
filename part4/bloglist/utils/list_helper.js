const { _ } = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => sum + blog.likes
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const mostLikes = Math.max(...blogs.map(blog => blog.likes))
    const mostLikesIndex = blogs.findIndex(blog => blog.likes === mostLikes)
    return blogs[mostLikesIndex]
}

const mostBlogs = (blogs) => {
    const authorMostBlogs = _.chain(blogs)
        .groupBy("author")
        .map((group, author) => {
            return { author: author, blogs: group.length }
        })
        .maxBy((object) => object.blogs)
        .value()
    return authorMostBlogs
}

const mostLikes = (blogs) => {
    const authorMostLikes = _.chain(blogs)
        .groupBy("author")
        .map((group, author) => {
            return {
                author: author,
                likes: group.reduce((acc, next) => {
                    return (acc += next.likes)
                }, 0),
            }
        })
        .maxBy(object => object.likes)
        .value()
    return authorMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}