import * as React from "react"
import { Types } from "./actions"

interface ContextType {
  state: any
  dispatch: any
}

const initialState = {
  isReady: false,
  isAuthenticated: false,
  authenticatedUser: null,
  authenticatedToken: null,
  locations: null,
  popularRooms: [],
  rooms: [],
  roomSubscriptions: {},
  roomKeydowns: {},
  roomMessages: {},
  searchedRooms: [],
  userStateSubscriptions: {},
  userStates: {},
  login: {
    isInvalid: false,
  },
}

// Helper to replace objects
const pushOrReplace = (arr: any[], newObj: any, compare: (oldObj: any, newObj: any) => boolean) =>
  arr.findIndex((o) => compare(o, newObj)) > -1
    ? arr.map((o) => (compare(o, newObj) ? newObj : o))
    : [...arr, newObj]

const reducer = (state, action) => {
  switch (action.type) {
    case Types.AppBooted: {
      return {
        ...state,
        isReady: true,
      }
    }
    case Types.TokenCookieFound: {
      return {
        ...state,
        authenticatedToken: action.token,
      }
    }
    case Types.LoggedIn: {
      return {
        ...state,
        authenticatedUser: action.userToken.user,
        authenticatedToken: action.userToken.token,
        login: {
          ...state.login,
          isInvalid: false,
        },
      }
    }
    case Types.LoginInvalid: {
      return {
        ...state,
        login: {
          ...state.login,
          isInvalid: true,
        },
      }
    }
    case Types.LoggedOut: {
      return {
        ...state,
        isAuthenticated: false,
        authenticatedUser: null,
        authenticatedToken: null,
        consumer: null,
        rooms: null,
        roomMessages: {},
        roomKeydowns: {},
        subscriptions: {},
        userStateSubscriptions: {},
      }
    }
    case Types.Registered: {
      return {
        ...state,
        authenticatedUser: action.registration.userToken.user,
        authenticatedToken: action.registration.userToken.token,
      }
    }
    case Types.Authenticated: {
      return {
        ...state,
        isAuthenticated: true,
        authenticatedUser: action.manifest.user,
        userStateSubscription: action.userStateSubscription,
        consumer: action.consumer,
        rooms: action.manifest.rooms,
        lastOpenRoom: action.manifest.lastOpenRoom,
        isReady: true,
      }
    }
    case Types.AuthenticationFailed: {
      return {
        ...state,
        isReady: true,
      }
    }
    case Types.UserStateReceived: {
      return {
        ...state,
        userStates: {
          ...state.userStates,
          [action.handle]: action.state,
        },
      }
    }
    case Types.SubscribedToRoom: {
      return {
        ...state,
        roomSubscriptions: {
          ...state.roomSubscriptions,
          [action.handle]: action.subscription,
        },
      }
    }
    case Types.SubscribedToUserState: {
      return {
        ...state,
        userSubscriptions: {
          ...state.userSubscriptions,
          [action.handle]: action.subscription,
        },
      }
    }
    case Types.RoomMessagesFetched: {
      return {
        ...state,
        roomMessages: {
          ...state.roomMessages,
          [action.handle]: action.messages.reverse(),
        },
      }
    }
    case Types.RoomMessageReceived: {
      return {
        ...state,
        roomMessages: {
          ...state.roomMessages,
          [action.handle]: [...(state.roomMessages[action.handle] || []), action.message],
        },
      }
    }
    case Types.RoomKeydownReceived: {
      return {
        ...state,
        roomKeydowns: {
          ...state.roomKeydowns,
          [action.handle]: pushOrReplace(
            state.roomKeydowns[action.handle],
            action.keydown,
            (oldKeydown, newKeydown) => oldKeydown.id === newKeydown.id
          ),
        },
      }
    }
    case Types.RoomKeydownTimedOut: {
      return {
        ...state,
        roomKeydowns: {
          ...state.roomKeydowns,
          [action.handle]: (state.roomKeydowns[action.handle] || []).filter(
            (keydown) => keydown.userId !== action.keydown.userId
          ),
        },
      }
    }
    case Types.PopularRoomsFetched: {
      return {
        ...state,
        popularRooms: action.rooms,
      }
    }
    case Types.SearchedRoomsFetched: {
      return {
        ...state,
        searchedRooms: action.rooms,
      }
    }
    case Types.RoomOpening: {
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.handle === action.handle ? { ...room, open: true } : room
        ),
      }
    }
    case Types.RoomStarSetting: {
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.handle === action.handle ? { ...room, starred: action.starred } : room
        ),
      }
    }
    case Types.RoomStarSet: {
      return {
        ...state,
        rooms: pushOrReplace(
          state.rooms,
          action.star.room,
          (oldRoom, newRoom) => newRoom.id === oldRoom.id
        ),
      }
    }
    case Types.RoomOpened:
    case Types.RoomClosed: {
      return {
        ...state,
        rooms: pushOrReplace(
          state.rooms,
          action.open.room,
          (oldRoom, newRoom) => newRoom.id === oldRoom.id
        ),
      }
    }
    case Types.LocationsFetched: {
      return {
        ...state,
        locations: action.locations,
      }
    }
    default: {
      return state
    }
  }
}

const store = React.createContext<ContextType>({
  state: null,
  dispatch: null,
})

const { Provider, Consumer } = store

const StoreProvider = (props) => {
  const [_state, _setState] = React.useState(initialState)
  const state = React.useRef(_state)
  const getState = React.useCallback(() => state.current, [state])
  const setState = React.useCallback(
    (newState) => {
      state.current = newState
      _setState(newState)
    },
    [state, _setState]
  )
  const reduce = React.useCallback(
    (action) => {
      return reducer(getState(), action)
    },
    [reducer, getState]
  )
  const dispatch = React.useCallback(
    (action) =>
      typeof action === "function" ? action(dispatch, getState) : setState(reduce(action)),
    [getState]
  )

  return <Provider value={{ state: _state, dispatch }}>{props.children}</Provider>
}

export { store, StoreProvider as Provider, Consumer }
