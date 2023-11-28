import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()
  
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const notes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], notes.concat(newAnecdote))
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 },
      {
        onSuccess: () => {
          notificationDispatch({
            type: 'SHOW',
            data: `you created '${content}'`
          })
          setTimeout(() => {
            notificationDispatch({ type: 'HIDE' })
          }, 5000)
        },
        onError: () => {
          notificationDispatch({
            type: 'SHOW',
            data: `too short anecdote, must have length 5 or more`,
          })
          setTimeout(() => {
            notificationDispatch({ type: 'HIDE' })
          }, 5000)
        }
      }
    )
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
