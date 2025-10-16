
import React from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, deleteTodo }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">La tua lista è vuota!</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Aggiungi un elemento per iniziare.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
};

export default TodoList;
