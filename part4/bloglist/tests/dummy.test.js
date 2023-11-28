const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})

describe('most likes', () => {
    const blogsList = [
        {
            _id: '1',
            title: 'title',
            author: 'author',
            url: 'url',
            likes: 3,
            __v: 0
        },
        {
            _id: '2',
            title: 'title',
            author: 'author',
            url: 'url',
            likes: 2,
            __v: 0
        },
        {
            _id: '3',
            title: 'title',
            author: 'author',
            url: 'url',
            likes: 4,
            __v: 0
        }
    ]

    test('out of every blog post', () => {
        const result = listHelper.favoriteBlog(blogsList)
        expect(result).toEqual(blogsList[2])
    })
})

describe('most blogs', () => {
    const blogsList = [
        {
            _id: '1',
            title: 'title1',
            author: 'author1',
            url: 'url',
            likes: 3,
            __v: 0
        },
        {
            _id: '2',
            title: 'title2',
            author: 'author2',
            url: 'url',
            likes: 2,
            __v: 0
        },
        {
            _id: '3',
            title: 'title3',
            author: 'author1',
            url: 'url',
            likes: 4,
            __v: 0
        },
        {
            _id: '4',
            title: 'title4',
            author: 'author3',
            url: 'url',
            likes: 1,
            __v: 0
        },
        {
            _id: '5',
            title: 'title5',
            author: 'author1',
            url: 'url',
            likes: 7,
            __v: 0
        }
    ]
    test('out of every author', () => {
        const result = listHelper.mostBlogs(blogsList)
        expect(result).toEqual({ author: 'author1', blogs: 3})
    })
})

describe('most likes', () => {
    const blogsList = [
        {
            _id: '1',
            title: 'title1',
            author: 'author1',
            url: 'url',
            likes: 3,
            __v: 0
        },
        {
            _id: '2',
            title: 'title2',
            author: 'author2',
            url: 'url',
            likes: 2,
            __v: 0
        },
        {
            _id: '3',
            title: 'title3',
            author: 'author3',
            url: 'url',
            likes: 4,
            __v: 0
        },
        {
            _id: '4',
            title: 'title4',
            author: 'author4',
            url: 'url',
            likes: 1,
            __v: 0
        },
        {
            _id: '5',
            title: 'title5',
            author: 'author5',
            url: 'url',
            likes: 7,
            __v: 0
        }
    ]
    test('out of every author', () => {
        const result = listHelper.mostLikes(blogsList)
        expect(result).toEqual({ author: 'author5', likes: 7})
    })
})