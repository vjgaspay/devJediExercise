import { useMemo, useState } from 'react'

const FILTERS = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}

const STORAGE_KEY = 'blue-todo-items'

function loadInitialTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function App() {
  const [todos, setTodos] = useState(loadInitialTodos)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const persist = (nextTodos) => {
    setTodos(nextTodos)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos))
  }

  const addTodo = (event) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    persist([
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
      },
      ...todos,
    ])
    setText('')
  }

  const toggleTodo = (id) => {
    persist(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    persist(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    persist(todos.filter((todo) => !todo.completed))
  }

  const activeCount = todos.filter((t) => !t.completed).length

  return (
    <main className="page">
      <section className="card">
        <h1>Blue Todo</h1>
        <p className="subtitle">A simple React to-do app with a light-blue style.</p>

        <form onSubmit={addTodo} className="inputRow">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a new task..."
            aria-label="Todo text"
          />
          <button type="submit">Add</button>
        </form>

        <div className="filters">
          {Object.entries(FILTERS).map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? 'active' : ''}
              onClick={() => setFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="todoList">
          {visibleTodos.length === 0 && (
            <li className="empty">No tasks here yet. You're all caught up.</li>
          )}
          {visibleTodos.map((todo) => (
            <li key={todo.id} className="todoItem">
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'done' : ''}>{todo.text}</span>
              </label>
              <button
                type="button"
                className="deleteBtn"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <footer className="footer">
          <small>{activeCount} task(s) left</small>
          <button type="button" onClick={clearCompleted} className="ghost">
            Clear completed
          </button>
        </footer>
      </section>
    </main>
  )
}
