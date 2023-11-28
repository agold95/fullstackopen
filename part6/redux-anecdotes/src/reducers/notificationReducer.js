import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return null
        }
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const notify = (message, time) => {
    return async dispatch => {
        await dispatch(setNotification(message))
        setTimeout(async () => await dispatch(clearNotification()), time * 1000)
    }
}

export default notificationSlice.reducer