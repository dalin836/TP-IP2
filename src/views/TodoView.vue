<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount , computed} from 'vue'
import { useTodoStore } from '@/stores/todo.store'
import { Plus, Trash2, Check } from 'lucide-vue-next'

const store = useTodoStore()
const title = ref('')
//filter
const filter = ref<'all' | 'active' | 'done'>('all')
let stopRealtime: null | (() => void) = null

//filter
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return store.todos.filter(todo => !todo.is_done)

    case 'done':
      return store.todos.filter(todo => todo.is_done)

    default:
      return store.todos
  }
})

const totalTodos = computed(() => store.todos.length)

const activeTodos = computed(
  () => store.todos.filter(todo => !todo.is_done).length
)

const doneTodos = computed(
  () => store.todos.filter(todo => todo.is_done).length
)
//
onMounted(async () => {
  await store.fetchTodos()
  stopRealtime = store.startRealtime()
})

onBeforeUnmount(() => stopRealtime?.())

async function add() {
  if (!title.value.trim()) return

  await store.addTodo(title.value)

  title.value = ''
}


</script>

<template>
  <div class="container">
    <div class="card">

      <h1 class="title">📝 Todo App</h1>

      <!-- Input -->
      <div class="input-group">
        <input
          v-model="title"
          placeholder="Write a new task..."
          class="input"
          @keyup.enter="add"
        />

        <button class="btn-add" @click="add">
          <Plus :size="18" />
        </button>
      </div>

      <!-- Filters - Challenge 1 !-->
      <div class="filters">
        <button @click="filter = 'all'">All</button>
        <button @click="filter = 'active'">Active</button>
        <button @click="filter = 'done'">Done</button>
      </div>

      <div class="stats">
        <span>Total: {{ totalTodos }}</span>
        <span>Active: {{ activeTodos }}</span>
        <span>Done: {{ doneTodos }}</span>
      </div>
      <!-- C1-->
      <p v-if="store.loading" class="info">Loading tasks...</p>
      <p v-if="store.error" class="error">{{ store.error }}</p>

      <!-- List -->
      <ul class="list">
        <li v-for="todo in filteredTodos" :key="todo.id" class="item">  <!-- //todo in store.todos  -->

          <label class="left">
            <input
              type="checkbox"
              :checked="todo.is_done"
              @change="store.toggleTodo(todo)"
            />

            <span :class="{ done: todo.is_done }">
              {{ todo.title }}
            </span>
          </label>

          <div class="actions">

            <!-- Optional check icon -->
            <Check v-if="todo.is_done" :size="18" class="done-icon" />

            <!-- Delete button -->
            <button class="btn-delete" @click="store.deleteTodo(todo.id)">
              <Trash2 :size="18" />
            </button>

          </div>

        </li>
      </ul>

    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f8;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 26px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
}

.input:focus {
  border-color: #4f46e5;
}

.btn-add {
  padding: 10px 15px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-add:hover {
  background: #4338ca;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: 0.2s;
}

.item:hover {
  background: #fafafa;
}

.left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.done {
  text-decoration: line-through;
  color: #999;
}

.btn-delete {
  background: transparent;
  border: none;
  color: red;
  font-size: 18px;
  cursor: pointer;
}

.info {
  color: #555;
  font-size: 14px;
}

.error {
  color: red;
  font-size: 14px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.done-icon {
  color: green;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.filters button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #e5e7eb;
}

.filters button:hover {
  background: #d1d5db;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: #555;
}
</style>