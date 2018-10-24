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

subs1 = susbcriber("Fernando", store)
// subs2 = susbcriber("Gnomo", store)

subs1.unsubscribe = store.subscribe(subs1.storeUpdated)
// subs2.unsubscribe = store.subscribe(subs2.storeUpdated)


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

const addGoalAction = goal => ({ type: ADD_GOAL, goal })
const removeGoalAction = id => ({ type: REMOVE_GOAL, id })

// store.dispatch(addTodoAction({
//   id: 1,
//   description: "study redux",
//   complete: false
// }))
//
// store.dispatch(addTodoAction({
//   id: 2,
//   description: "do the laundry",
//   complete: false
// }))
//
// store.dispatch(removeTodoAction(2))
//
// store.dispatch(toggleTodoAction(1))
//
// store.dispatch(addGoalAction({
//   id: 1,
//   description: "finish redux training"
// }))
//
// store.dispatch(addGoalAction({
//   id: 2,
//   description: "create an app"
// }))
//
// store.dispatch(removeGoalAction(1))


// DOM code

const addTodo = () => {
  const input = document.getElementById('todo')
  const description = input.value;

  input.value = '';

  store.dispatch(addTodoAction({ description }))
}

document.getElementById('todoBtn')
  .addEventListener('click', addTodo)
