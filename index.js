class Store {
  constructor(initialState = {}) {
    this.state = Object.freeze(initialState);
    this.subscribers = {};
  }

  subscribe(key, observer) {
    this.subscribers[key] = observer;
  };

  notifyAll(prevState, nextState) {
    Object.keys(this.subscribers).forEach((key) => {
      const subscriber = this.subscribers[key];

      if (prevState[key] !== nextState[key]) {
        subscriber(nextState[key]);
      }
    });
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    const prevState = Object.assign({}, this.state);
    const next = (action) => reducer(prevState, action);
    const nextState = middleware(this)(next)(action);

    this.state = Object.freeze(nextState);
    this.notifyAll(prevState, nextState);
  }
}

const middleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', result);
  console.groupEnd(action.type);

  return result;
};

const reducer = function (state, action) {
  switch (action.type) {
    case 'ADD_USER':
      return Object.assign({}, state,
        {
          users: [...state.users, action.payload]
        }
      );

    case 'ADD_ARTICLE':
      return Object.assign({}, state,
        {
          articles: [...state.articles, action.payload]
        }
      );

    default:
      return Object.assign({}, state);
  }
};

const store = new Store({
  test: true,
  users: [],
  articles: [],
});
store.subscribe('users', (data) => {
  console.log('users updated: ', data);
  document.getElementById('userCount').innerHTML = data.length;
});
store.subscribe('articles', (data) => {
  console.log('articles updated: ', data);
  document.getElementById('articleCount').innerHTML = data.length;
});


function addUser() {
  store.dispatch({
    type: 'ADD_USER',
    payload: {id: 4564, name: 'Hofd'},
  });
}

function addArticle() {
  store.dispatch({
    type: 'ADD_ARTICLE',
    payload: {id: 42, name: 'The Title', text: 'Say Hi to Dan Abramov!'},
  });
}

// console.log(store);
