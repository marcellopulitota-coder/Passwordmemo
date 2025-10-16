import React from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TrashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const NoteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const CalendarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, deleteTodo }) => {
  const hasDetails = todo.notes || todo.date;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Add timezone offset to display correct date
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).format(localDate);
  };
  
  return (
    <li
      className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-3 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex-shrink-0 pt-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
        />
      </div>
      <div className="flex-grow mx-4">
        <span
          className={`text-gray-700 dark:text-gray-200 transition-all duration-300 ${
            todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
          }`}
        >
          {todo.text}
        </span>
         {hasDetails && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {todo.notes && (
                 <span className="flex items-center gap-1">
                    <NoteIcon className="h-4 w-4" />
                    {todo.notes}
                 </span>
            )}
            {todo.date && (
                 <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(todo.date)}
                 </span>
            )}
          </div>
        )}
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={() => deleteTodo(todo.id)}
          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-700"
          aria-label={`Elimina l'elemento ${todo.text}`}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

export default TodoItem;