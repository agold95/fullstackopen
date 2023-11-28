import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { notify } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if (filter) {
            return anecdotes.filter(anecdote =>
                anecdote.content.includes(filter)
            )
        }
        return anecdotes
    })

    const addVote = anecdote => {
        dispatch(voteAnecdote(anecdote))
        dispatch(notify(`you voted '${anecdote.content}'`, 5))
    }

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    return (
        <div>
            {sortedAnecdotes.map(anecdote => 
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() =>
                        addVote(anecdote)
                    }
                />
            )}
        </div>
    )
}

export default AnecdoteList