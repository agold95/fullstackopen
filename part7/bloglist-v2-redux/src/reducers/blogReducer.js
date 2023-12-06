import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
    updateBlogLikes(state, action) {
      return state.map((blog) => {
        if (blog.id === action.payload.id) {
          return { ...blog, likes: action.payload.likes }
        }
        return blog
      })
    }
  }
})

export const initilizeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    blogs.sort((a, b) => b.likes - a.likes)
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = blog => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch(addBlog(newBlog))
  }
}

export const updateBlog = (id, updatedBlog) => {
  return async dispatch => {
    await blogService.update(id, updatedBlog)
    dispatch(updateBlogLikes(updatedBlog))
  }
}

export const removeBlog = blog => {
  return async dispatch => {
    await blogService.remove(blog)
    dispatch(deleteBlog(blog))
  }
}

export const { setBlogs, addBlog, deleteBlog, updateBlogLikes } = blogSlice.actions
export default blogSlice.reducer