const createStore = (reducer) => {
  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)

    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action)

    listeners.forEach(listener => listener())
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

const ADD_TODO = "ADD_TODO"
const REMOVE_TODO = "REMOVE_TODO"
const TOGGLE_TODO = "TOGGLE_TODO"
const ADD_GOAL = "ADD_GOAL"
const REMOVE_GOAL = "REMOVE_GOAL"

const app = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo])
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id)
    case TOGGLE_TODO:
      return state.map((todo) =>
        (todo.id === action.id)
          ? Object.assign(todo, {complete: !todo.complete})
          : todo
      )
    default:
      return state
  }
}

const goals = (state = [], action) => {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal])
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id)
    default:
      return state
  }
}

const susbcriber = (name, store) => {
  const storeUpdated = () => console.log("\n\n", `${name} notifided:`, store.getState())

  return {
    storeUpdated
  }
}

const store = createStore(app)

const updateLists = () => {
  const { todos, goals } = store.getState()

  document.getElementById('todos').innerHTML = ''
  document.getElementById('goals').innerHTML = ''

  todos.forEach(addTodoToDOM)
  goals.forEach(addGoalToDOM)
}

store.subscribe(updateLists)

const addTodoAction = todo => (
  {
    type: ADD_TODO,
    todo: {
      ...{
        id: generateUUID(),
        complete: false
      },
      ...todo
    }
  }
)

const removeTodoAction = id => ({ type: REMOVE_TODO, id })
const toggleTodoAction = id => ({ type: TOGGLE_TODO, id })

const addGoalAction = goal => (
  {
    type: ADD_GOAL,
    goal: {
      ...{
        id: generateUUID(),
      },
      ...goal
    }
  }
)

const removeGoalAction = id => ({ type: REMOVE_GOAL, id })

// DOM code

const addTodoToDOM = (todo) => {
  const node = document.createElement('li')
  const text = document.createTextNode(todo.description)
  const removeBtn = removeButton(() => (store.dispatch(removeTodoAction(todo.id))))

  node.style.textDecoration = todo.complete ? 'line-through' : 'none'

  node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  document.getElementById('todos')
    .appendChild(node)
}

const addGoalToDOM = (goal) => {
  const node = document.createElement('li')
  const text = document.createTextNode(goal.description)
  const removeBtn = removeButton(() => (store.dispatch(removeGoalAction(goal.id))))

  node.appendChild(text)
  node.appendChild(removeBtn)

  document.getElementById('goals')
    .appendChild(node)
}

const removeButton = (onClick) => {
  const removeButton = document.createElement('button')
  removeButton.innerHTML = 'X'
  removeButton.addEventListener('click', onClick)

  return removeButton
}

const addTodo = () => {
  const input = document.getElementById('todo')
  const description = input.value;

  input.value = '';

  store.dispatch(addTodoAction({ description }))
}

const addGoal = () => {
  const input = document.getElementById('goal')
  const description = input.value;

  input.value = '';

  store.dispatch(addGoalAction({ description }))
}

document.getElementById('todoBtn')
  .addEventListener('click', addTodo)

document.getElementById('goalBtn')
  .addEventListener('click', addGoal)
