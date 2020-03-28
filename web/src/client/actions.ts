import * as actioncable from "@rails/actioncable"
import Cookies from "universal-cookie"

import ApiRequest, { ApiRequestMethod } from "./models/ApiRequest"
import Subscription from "./models/Subscription"
import { Room, RoomPath, Manifest, Message, UserToken, User, RegistrationForm } from "./types"
import { buildRoomApiUrlFromRoom, buildRoomApiUrlFromPath } from "./helpers/rooms"

export enum Types {
  AppBooted,
  Authenticated,
  AuthenticatedTokenCookieSet,
  AuthenticationFailed,
  LocationsFetched,
  LoggedIn,
  LoggedOut,
  LoginInvalid,
  PopularRoomsFetched,
  Registered,
  RoomClosed,
  RoomClosing,
  RoomKeydownReceived,
  RoomKeydownSent,
  RoomKeydownTimedOut,
  RoomMessageReceived,
  RoomMessageSent,
  RoomMessageUpdated,
  RoomMessagesFetched,
  RoomOpened,
  RoomOpeningByPath,
  RoomReceived,
  RoomsReceived,
  SearchedRoomsFetched,
  SubscribedToRoom,
  SubscribedToUserState,
  RoomStarSetting,
  RoomStarSet,
  TokenCookieFound,
  UserStateReceived,
}

const TOKEN_COOKIE_NAME = "token"

// path helpers
// actions
export const boot = () => (dispatch) => {
  const cookies = new Cookies()
  const token = cookies.get(TOKEN_COOKIE_NAME)

  if (token) {
    dispatch({ type: Types.TokenCookieFound, token })
    dispatch(authenticate())
  } else {
    dispatch({ type: Types.AppBooted })
  }
}

export const setAuthenticatedTokenCookie = () => (_, getState) => {
  const { authenticatedToken } = getState()

  const cookies = new Cookies()
  cookies.set(TOKEN_COOKIE_NAME, authenticatedToken, { path: "/" })

  return {
    type: Types.AuthenticatedTokenCookieSet,
  }
}

export const logIn = (email, password) => (dispatch) => {
  const req = new ApiRequest<UserToken>(ApiRequestMethod.POST, `/auth`, {
    json: {
      userToken: {
        email,
        password,
      },
    },
  })

  req
    .execute()
    .then((userToken) => dispatch({ type: Types.LoggedIn, userToken }))
    .then(() => dispatch(setAuthenticatedTokenCookie()))
    .then(() => dispatch(authenticate()))
    .catch(() => dispatch({ type: Types.LoginInvalid }))
}

export const logOut = () => (dispatch) => {
  const cookies = new Cookies()
  cookies.remove(TOKEN_COOKIE_NAME)

  dispatch({
    type: Types.LoggedOut,
  })
}

export const authenticate = () => (dispatch, getState) => {
  const req = new ApiRequest<Manifest>(ApiRequestMethod.GET, "/manifest", {
    authenticatedToken: getState().authenticatedToken,
  })

  req
    .execute()
    .then((manifest) => dispatch(receiveAuthentication(manifest)))
    .catch((ex) =>
      dispatch({
        type: Types.AuthenticationFailed,
        ex: ex,
      })
    )
}

export const receiveAuthentication = (manifest) => (dispatch, getState) => {
  dispatch({
    type: Types.Authenticated,
    manifest,
    consumer: actioncable.createConsumer(
      [process.env.API_URL, `cable?token=${getState().authenticatedToken}`].join("/")
    ),
  })

  dispatch(subscribeToUserState(manifest.user.handle))
  dispatch(receiveRooms(manifest.rooms))
}

export const register = (registration: RegistrationForm) => (dispatch) => {
  const req = new ApiRequest<RegistrationForm>(ApiRequestMethod.POST, "/registration", {
    json: { registration },
  })

  req
    .execute()
    .then((registration) =>
      dispatch({
        type: Types.Registered,
        registration,
      })
    )
    .then(() => dispatch(setAuthenticatedTokenCookie()))
    .then(() => dispatch(authenticate()))
}

enum RoomEventType {
  MessageUpdated = "MessageUpdatedEvent",
  MessageCreated = "MessageCreatedEvent",
  Keydown = "KeydownEvent",
}

enum RoomAction {
  Keydown = "keydown",
}

export const receiveRooms = (rooms) => (dispatch, _) => {
  rooms.forEach((room) => dispatch(subscribeToRoom(room)))
  dispatch({
    type: Types.RoomsReceived,
    rooms,
  })
}

export const receiveRoom = (room) => (dispatch, _) => {
  dispatch(subscribeToRoom(room))
  dispatch({
    type: Types.RoomReceived,
    room,
  })
}

export const receiveRoomKeydown = (room, keydown) => (dispatch, getState) => {
  const { roomKeydowns } = getState()
  const existing = (roomKeydowns[room.id] || []).find((key) => key.userId === keydown.userId)

  const timeout = (() =>
    existing
      ? existing.timeout
      : setTimeout(() => dispatch({ type: Types.RoomKeydownTimedOut, room, keydown }), 2000))()

  dispatch({
    type: Types.RoomKeydownReceived,
    room,
    keydown: { ...keydown, timeout },
  })
}

export const subscribeToRoom = (room: Room) => (dispatch, getState) => {
  const state = getState()
  const { consumer } = state
  const oldSubscription = state.roomSubscriptions[room.id]

  if (!!oldSubscription) return

  const subscription = new Subscription(consumer, "RoomChannel", { id: room.id })

  subscription.onConnected(() => dispatch({ type: Types.SubscribedToRoom, room, subscription }))
  subscription.on(RoomEventType.MessageCreated, (message) =>
    dispatch({
      type: Types.RoomMessageReceived,
      room,
      message,
    })
  )
  subscription.on(RoomEventType.MessageUpdated, (message) =>
    dispatch({
      type: Types.RoomMessageUpdated,
      room,
      message,
    })
  )
  subscription.on(RoomEventType.Keydown, (keydown) => dispatch(receiveRoomKeydown(room, keydown)))

  subscription.connect()
}

export const sendRoomMessage = (room, body) => (dispatch, getState) => {
  const { authenticatedToken } = getState()

  const req = new ApiRequest<Message[]>(
    ApiRequestMethod.POST,
    buildRoomApiUrlFromRoom(room, "messages"),
    {
      authenticatedToken,
      json: { body },
    }
  )

  req.execute().then((message) =>
    dispatch({
      type: Types.RoomMessageSent,
      message,
    })
  )
}

export const sendRoomKeydown = (room) => (_, getState) => {
  const { roomSubscriptions } = getState()
  const subscription = roomSubscriptions[room.id]

  if (subscription) {
    subscription.perform(RoomAction.Keydown)
  }

  return {
    type: Types.RoomKeydownSent,
  }
}

enum UserStateEventType {
  Changed = "ChangedEvent",
}

export const subscribeToUserState = (user) => (dispatch, getState) => {
  const state = getState()
  const { consumer } = state
  const oldSubscription = state.userStateSubscriptions[user.id]

  if (!!oldSubscription) return

  const subscription = new Subscription(consumer, "UserStateChannel", { id: user.id })

  subscription.onConnected(() =>
    dispatch({ type: Types.SubscribedToUserState, user, subscription })
  )
  subscription.on(UserStateEventType.Changed, (state) =>
    dispatch({
      type: Types.UserStateReceived,
      user,
      state,
    })
  )

  subscription.connect()
}

export const fetchRoomMessages = (room) => (dispatch, getState) => {
  const { authenticatedToken } = getState()
  const req = new ApiRequest<Message[]>(
    ApiRequestMethod.GET,
    buildRoomApiUrlFromRoom(room, "messages"),
    {
      authenticatedToken,
    }
  )

  return req
    .execute()
    .then((messages) => dispatch({ type: Types.RoomMessagesFetched, room, messages }))
}

export const openRoomByPath = (path: RoomPath) => (dispatch, getState) => {
  dispatch({
    type: Types.RoomOpeningByPath,
    path,
  })

  const req = new ApiRequest<{ room: Room; user: User }>(
    ApiRequestMethod.POST,
    buildRoomApiUrlFromPath(path, "open"),
    {
      authenticatedToken: getState().authenticatedToken,
    }
  )

  req.execute().then((open) =>
    dispatch(fetchRoomMessages(open.room))
      .then(() => dispatch(receiveRoom(open.room)))
      .then(() => dispatch({ type: Types.RoomOpened, room: open.room }))
  )
}

export const fetchPopularRooms = () => (dispatch, getState) => {
  const { authenticatedToken } = getState()
  const req = new ApiRequest<Room[]>(ApiRequestMethod.GET, "/rooms/popular", {
    authenticatedToken,
  })

  req.execute().then((rooms) => dispatch({ type: Types.PopularRoomsFetched, rooms }))
}

export const searchRooms = (query) => (dispatch, getState) => {
  const { authenticatedToken } = getState()
  const req = new ApiRequest<Room[]>(ApiRequestMethod.GET, "/rooms", {
    authenticatedToken,
    params: {
      q: query,
    },
  })

  req.execute().then((rooms) => dispatch({ type: Types.SearchedRoomsFetched, rooms }))
}

export const setRoomStar = (room, starred) => (dispatch, getState) => {
  dispatch({ type: Types.RoomStarSetting, room, starred })

  const req = new ApiRequest<{ room: Room }>(
    starred ? ApiRequestMethod.POST : ApiRequestMethod.DELETE,
    buildRoomApiUrlFromRoom(room, "star"),
    {
      authenticatedToken: getState().authenticatedToken,
    }
  )

  req.execute().then((star) => dispatch(receiveRoom(star.room)))
}

export const closeRoom = (room) => (dispatch, getState) => {
  dispatch({
    type: Types.RoomClosing,
    room,
  })

  const { authenticatedToken } = getState()
  const req = new ApiRequest<{ user: User; room: Room }>(
    ApiRequestMethod.DELETE,
    buildRoomApiUrlFromRoom(room, "open"),
    {
      authenticatedToken,
    }
  )

  req.execute().then((open) => dispatch(receiveRoom(open.room)))
}

export const fetchLocations = () => (dispatch, getState) => {
  const { authenticatedToken } = getState()
  const req = new ApiRequest<Location[]>(ApiRequestMethod.GET, `/locations`, {
    authenticatedToken,
  })

  req.execute().then((locations) => dispatch({ type: Types.LocationsFetched, locations }))
}
