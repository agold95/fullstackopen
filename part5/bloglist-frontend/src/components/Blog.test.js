import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

const blog = {
  'title': 'Test Blog',
  'author': 'Guy Namesman',
  'url': 'www.stuff.com',
  'likes': 2
}

test('checks that component displays title and author', () => {
  const component = render(
    <Blog blog={blog} />
  )

  const title = component.container.querySelector('.title')
  expect(title).toBeDefined()
  expect(title).toBeVisible()
  expect(title).toHaveTextContent(`${blog.title} by: ${blog.author}`)
})

test('clicking button will show blog url and likes', async () => {
  const component = render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const blogContent = component.container.querySelector('.blogContent')
  expect(blogContent).toBeVisible()
  expect(blogContent).toHaveTextContent(`${blog.url}`)
  expect(blogContent).toHaveTextContent(`${blog.likes}`)
})

test('like button is clicked twice', async () => {
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLikes={mockHandler} />
  )

  const user = userEvent.setup()
  const showButton = screen.getByText('view')
  await user.click(showButton)

  const blogContent = component.container.querySelector('.blogContent')
  expect(blogContent).toBeVisible()

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('create new blog', async () => {
  const component = render(
    <BlogForm />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeDefined()
})