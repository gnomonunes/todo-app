let action = {
  type: "ADD_TODO",
  todo: {
    id: 1,
    description: "do the laundry",
    complete: false
  }
}

let action2 = {
  type: "ADD_TODO",
  todo: {
    id: 2,
    description: "study redux",
    complete: false
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.todo])
    case "REMOVE_TODO":
      return state.filter(todo => todo.id !== action.todo.id)
    case "TOGGLE_TODO":
      return state.map((todo) =>
        (todo.id === action.todo.id)
          ? Object.assign(todo, {complete: !todo.complete})
          : todo
      )
    default:
      return state
  }
}

const goals = (state = [], action) => {
  switch (action.type) {
    case "ADD_GOAL":
      return state.concat([action.goal])
    case "REMOVE_GOAL":
      return state.filter(goal => goal.id !== action.goal.id)
    default:
      return state
  }
}

const app = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  }
}

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

const susbcriber = (name, store) => {
  const storeUpdated = () => console.log(`${name} notifided:`, store.getState())

  return {
    storeUpdated
  }
}

const store = createStore(app)

subs1 = susbcriber("Fernando", store)
// subs2 = susbcriber("Gnomo", store)

subs1.unsubscribe = store.subscribe(subs1.storeUpdated)
// subs2.unsubscribe = store.subscribe(subs2.storeUpdated)

store.dispatch(action)

store.dispatch(action2)

store.dispatch({
  type: "REMOVE_TODO",
  todo: {
    id: 2,
    description: "study redux"
  }
})

store.dispatch({
  type: "TOGGLE_TODO",
  todo: {
    id: 1
  }
})
store.dispatch({
  type: "TOGGLE_TODO",
  todo: {
    id: 1
  }
})

store.dispatch({
  type: "TOGGLE_TODO",
  todo: {
    id: 1
  }
})

store.dispatch({
  type: "ADD_GOAL",
  goal: {
    id: 1,
    description: "finish redux training"
  }
})

store.dispatch({
  type: "ADD_GOAL",
  goal: {
    id: 2,
    description: "create an app"
  }
})

store.dispatch({
  type: "REMOVE_GOAL",
  goal: {
    id: 1
  }
})

// subs2.unsubscribe()
