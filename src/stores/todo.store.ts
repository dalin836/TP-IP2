import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apolloClient } from '@/apollo/client'
import {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_TODO,
  DELETE_TODO,
  TODOS_SUB
} from '@/graphql/todos'

export type Todo = {
  id: string
  title: string
  is_done: boolean
  created_at: string
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * ======================
   * FETCH TODOS
   * ======================
   */
  async function fetchTodos() {
    loading.value = true
    error.value = null

    try {
      const { data } = await apolloClient.query<{ todo: Todo[] }>({
        query: GET_TODOS,
        fetchPolicy: 'network-only',
      })

      // IMPORTANT: clone to avoid frozen Apollo objects
      todos.value = (data?.todo ?? []).map(t => ({ ...t }))
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load todos'
    } finally {
      loading.value = false
    }
  }

  /**
   * ======================
   * ADD TODO (OPTIMISTIC)
   * ======================
   */
  async function addTodo(title: string) {
    const clean = title.trim()
    if (!clean) return

    const tempTodo: Todo = {
      id: crypto.randomUUID(),
      title: clean,
      is_done: false,
      created_at: new Date().toISOString(),
    }

    // ❌ no unshift (causes extensibility error in some cases)
    todos.value = [tempTodo, ...todos.value]

    try {
      const { data } = await apolloClient.mutate({
        mutation: ADD_TODO,
        variables: {
          title: clean,
          is_done: false,
        },
      })

      const serverTodo = data?.insert_todo_one

      if (!serverTodo) return

      // replace temp with server result (clone it)
      todos.value = todos.value.map(t =>
        t.id === tempTodo.id ? { ...serverTodo } : t
      )

    } catch (e) {
      // rollback
      todos.value = todos.value.filter(t => t.id !== tempTodo.id)
      console.error('Add failed:', e)
    }
  }

  /**
   * ======================
   * TOGGLE TODO
   * ======================
   */
  async function toggleTodo(todo: Todo) {
    const oldValue = todo.is_done
    const newValue = !oldValue

    // local update (safe because it's reactive state)
    todo.is_done = newValue

    try {
      await apolloClient.mutate({
        mutation: TOGGLE_TODO,
        variables: {
          id: todo.id,
          done: newValue,
        },
      })
    } catch (e) {
      // rollback
      todo.is_done = oldValue
      console.error('Toggle failed', e)
    }
  }

  /**
   * ======================
   * DELETE TODO
   * ======================
   */
  async function deleteTodo(id: string) {
    const backup = [...todos.value]

    todos.value = todos.value.filter(t => t.id !== id)

    try {
      await apolloClient.mutate({
        mutation: DELETE_TODO,
        variables: { id },
      })
    } catch (e) {
      todos.value = backup
      console.error('Delete failed', e)
    }
  }

  /**
   * ======================
   * REALTIME SUBSCRIPTION
   * ======================
   */
  function startRealtime() {
    const observable = apolloClient.subscribe({
      query: TODOS_SUB,
    })

    const sub = observable.subscribe({
      next({ data }) {
        if (data?.todo) {
          // clone to avoid frozen objects
          todos.value = data.todo.map((t: Todo) => ({ ...t }))
        }
      },
      error(err) {
        console.error('Subscription error:', err)
      }
    })

    return () => sub.unsubscribe()
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    startRealtime,
  }
})