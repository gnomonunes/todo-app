// Actions
// Todo actions
const ADD_TODO = "ADD_TODO"
const REMOVE_TODO = "REMOVE_TODO"
const TOGGLE_TODO = "TOGGLE_TODO"
// Goals actions
const ADD_GOAL = "ADD_GOAL"
const REMOVE_GOAL = "REMOVE_GOAL"

// Todos store reducer: handle todos state changes
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

// Goals store reducer: handle goals state changes
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

// Create the store using our reducer
const store = Redux.createStore(Redux.combineReducers({
  todos,
  goals
}))

// Function to update the todos and goals in the application interface
const updateLists = () => {
  const { todos, goals } = store.getState()

  document.getElementById('todos').innerHTML = ''
  document.getElementById('goals').innerHTML = ''

  todos.forEach(addTodoToDOM)
  goals.forEach(addGoalToDOM)
}

// Make updateLists a subscriber to store changes
store.subscribe(updateLists)

// Check action is valid before dispatching
const checkAndDispatch = (store, action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.description.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert("Nope. That's a bad idea.")
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.description.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert("Nope. That's a bad idea.")
  }

  store.dispatch(action)
}

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
  const removeBtn = removeButton(() => (checkAndDispatch(store, removeTodoAction(todo.id))))

  node.style.textDecoration = todo.complete ? 'line-through' : 'none'

  node.addEventListener('click', () => {
    checkAndDispatch(store, toggleTodoAction(todo.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  document.getElementById('todos')
    .appendChild(node)
}

const addGoalToDOM = (goal) => {
  const node = document.createElement('li')
  const text = document.createTextNode(goal.description)
  const removeBtn = removeButton(() => (checkAndDispatch(store, removeGoalAction(goal.id))))

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

  checkAndDispatch(store, addTodoAction({ description }))
}

const addGoal = () => {
  const input = document.getElementById('goal')
  const description = input.value;

  input.value = '';

  checkAndDispatch(store, addGoalAction({ description }))
}

document.getElementById('todoBtn')
  .addEventListener('click', addTodo)

document.getElementById('goalBtn')
  .addEventListener('click', addGoal)
