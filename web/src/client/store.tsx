import * as React from "react"

import { Types } from "./actions"
import { isPathForRoom } from "./helpers/rooms"

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
  unreadRooms: {},
  searchedRooms: [],
  userStateSubscriptions: {},
  userStates: {},
  openRoomId: null,
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
        unreadRooms: {},
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
        consumer: action.consumer,
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
          [action.user.id]: action.state,
        },
      }
    }
    case Types.SubscribedToRoom: {
      return {
        ...state,
        roomSubscriptions: {
          ...state.roomSubscriptions,
          [action.room.id]: action.subscription,
        },
      }
    }
    case Types.SubscribedToUserState: {
      return {
        ...state,
        userSubscriptions: {
          ...state.userSubscriptions,
          [action.user.id]: action.subscription,
        },
      }
    }
    case Types.RoomMessagesFetched: {
      return {
        ...state,
        roomMessages: {
          ...state.roomMessages,
          [action.room.id]: action.messages.reverse(),
        },
      }
    }
    case Types.RoomMessageReceived: {
      return {
        ...state,
        unreadRooms: {
          ...state.unreadRooms,
          [action.room.id]: state.openRoomId !== action.room.id,
        },
        roomMessages: {
          ...state.roomMessages,
          [action.room.id]: state.roomMessages[action.room.id]
            ? [...state.roomMessages[action.room.id], action.message]
            : undefined,
        },
      }
    }
    case Types.RoomKeydownReceived: {
      return {
        ...state,
        roomKeydowns: {
          ...state.roomKeydowns,
          [action.room.id]: pushOrReplace(
            state.roomKeydowns[action.room.id] || [],
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
          [action.room.id]: (state.roomKeydowns[action.room.id] || []).filter(
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
    case Types.RoomOpeningByPath: {
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          isPathForRoom(action.path, room) ? { ...room, open: true } : room
        ),
      }
    }
    case Types.RoomClosing: {
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.id === action.room.id ? { ...room, open: false } : room
        ),
      }
    }
    case Types.RoomStarSetting: {
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.id === action.room.id ? { ...room, starred: action.starred } : room
        ),
      }
    }
    case Types.RoomsReceived: {
      return {
        ...state,
        rooms: action.rooms,
      }
    }
    case Types.RoomReceived: {
      return {
        ...state,
        rooms: pushOrReplace(
          state.rooms,
          action.room,
          (oldRoom, newRoom) => newRoom.id === oldRoom.id
        ),
      }
    }
    case Types.RoomOpened: {
      return {
        ...state,
        openRoomId: action.room.id,
        unreadRooms: {
          ...state.unreadRooms,
          [action.room.id]: false,
        },
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
