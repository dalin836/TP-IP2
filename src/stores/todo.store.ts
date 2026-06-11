import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apolloClient } from '@/apollo/client'
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, TODOS_SUB } from '@/graphql/todos'

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

  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const { data } = await apolloClient.query<{ todos: Todo[] }>({
        query: GET_TODOS,
        fetchPolicy: 'network-only', // keep it simple for students
      })
      todos.value = data.todos
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load todos'
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title: string) {
    const clean = title.trim()
    if (!clean) return

    // await apolloClient.mutate({
    //   mutation: ADD_TODO,
    //   variables: { title: clean },
    // })
    const tempTodo: Todo = {
      id: crypto.randomUUID(),
      title: clean,
      is_done: false,
      created_at: new Date().toISOString(),
    } 
    // show immediately
  todos.value.unshift(tempTodo)

  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_TODO,
      variables: { title: clean },
    })

    // replace temp todo with real todo
    const index = todos.value.findIndex(
      todo => todo.id === tempTodo.id
    )

    if (index !== -1 && data?.insert_todos_one) {
      todos.value[index] = data.insert_todos_one
    }

    } catch (e) {
      // rollback if failed
      todos.value = todos.value.filter(
        todo => todo.id !== tempTodo.id
      )

      console.error('Add failed', e)
    }

    // await fetchTodos()
  }

  async function toggleTodo(todo: Todo) {
    // await apolloClient.mutate({
    //   mutation: TOGGLE_TODO,
    //   variables: { id: todo.id, done: !todo.is_done },
    // })
    // await fetchTodos()

    const oldValue = todo.is_done

  // instant UI update
  todo.is_done = !todo.is_done

  try {
    await apolloClient.mutate({
      mutation: TOGGLE_TODO,
      variables: {
        id: todo.id,
        done: todo.is_done,
      },
    })
    } catch (e) {
      // rollback if failed
      todo.is_done = oldValue

      console.error('Toggle failed', e)
    }
  }

  async function deleteTodo(id: string) {
    // await apolloClient.mutate({
    //   mutation: DELETE_TODO,
    //   variables: { id },
    // })
    // await fetchTodos()

     // backup
  const oldTodos = [...todos.value]

  // remove immediately
  todos.value = todos.value.filter(
    todo => todo.id !== id
  )

  try {
      await apolloClient.mutate({
        mutation: DELETE_TODO,
        variables: { id },
      })
    } catch (e) {
      // rollback if failed
      todos.value = oldTodos

      console.error('Delete failed', e)
    }
  }

  // Optional: realtime updates (subscription)
 function startRealtime() {
  const observable = apolloClient.subscribe({
    query: TODOS_SUB
  })

  const sub = observable.subscribe(
    ({ data }) => {
      if (data?.todos) {
        todos.value = data.todos
      }
    },
    (error) => {
      console.error('Subscription error:', error)
    }
  )

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