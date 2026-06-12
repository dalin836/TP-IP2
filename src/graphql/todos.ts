import { gql } from '@apollo/client/core'

/**
 * GET ALL TODOS
 */
export const GET_TODOS = gql`
  query GetTodos {
    todo(order_by: { created_at: desc }) {
      id
      title
      is_done
      created_at
    }
  }
`

/**
 * ADD TODO
 */
export const ADD_TODO = gql`
  mutation AddTodo(
    $title: String!
    $is_done: Boolean!
  ) {
    insert_todo_one(
      object: {
        title: $title
        is_done: $is_done
      }
    ) {
      id
      title
      is_done
      created_at
    }
  }
`

/**
 * UPDATE TITLE
 */
export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: uuid!
    $title: String!
  ) {
    update_todo_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title }
    ) {
      id
      title
      is_done
      created_at
    }
  }
`

/**
 * TOGGLE DONE
 */
export const TOGGLE_TODO = gql`
  mutation ToggleTodo(
    $id: uuid!
    $done: Boolean!
  ) {
    update_todo_by_pk(
      pk_columns: { id: $id }
      _set: { is_done: $done }
    ) {
      id
      is_done
    }
  }
`

/**
 * DELETE TODO
 */
export const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todo_by_pk(id: $id) {
      id
    }
  }
`

/**
 * REALTIME SUBSCRIPTION
 */
export const TODOS_SUB = gql`
  subscription TodosSub {
    todo(order_by: { created_at: desc }) {
      id
      title
      is_done
      created_at
    }
  }
`