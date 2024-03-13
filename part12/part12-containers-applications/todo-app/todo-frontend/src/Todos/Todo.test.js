import React from "react";
import { render, screen } from '@testing-library/react';
import Todo from "./Todo";

test('renders todo', () => {
    const todo = {
        text: 'some text',
        done: false
    };

    const deleteTodo = jest.fn();
    const completeTodo = jest.fn();

    render(<Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />);

    expect(screen.getByText('some text')).toBeInTheDocument();
    expect(screen.getByText('This todo is not done')).toBeInTheDocument();
})