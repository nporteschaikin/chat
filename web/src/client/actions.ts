import * as actioncable from "@rails/actioncable"
import Cookies from "universal-cookie"

import ApiRequest, { ApiRequestMethod } from "./models/ApiRequest"
import Subscription from "./models/Subscription"
import { Room, Manifest, Message, UserToken, RegistrationForm } from "./types"

export enum Types {
  AppBooted,
  Authenticated,
  AuthenticatedTokenCookieSet,
  AuthenticationFailed,
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
  RoomOpening,
  SearchedRoomsFetched,
  SubscribedToRoom,
  SubscribedToUserState,
  RoomStarSetting,
  RoomStarSet,
  TokenCookieFound,
  UserStateReceived,
}

const TOKEN_COOKIE_NAME = "token"

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
  const { authenticatedToken } = getState()

  const req = new ApiRequest<Manifest>(ApiRequestMethod.GET, "/manifest", { authenticatedToken })
  req
    .execute()
    .then((manifest) => {
      const consumer = actioncable.createConsumer(
        [process.env.API_URL, `cable?token=${authenticatedToken}`].join("/")
      )

      dispatch({
        type: Types.Authenticated,
        manifest,
        consumer,
      })

      return manifest
    })
    .then((manifest) => dispatch(subscribeToUserState(manifest.user.handle)))
    .catch(() =>
      dispatch({
        type: Types.AuthenticationFailed,
      })
    )
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

export const receiveRoomKeydown = (handle, keydown) => (dispatch, getState) => {
  const { roomKeydowns } = getState()
  const existing = (roomKeydowns[handle] || []).find((key) => key.userId === keydown.userId)

  const timeout = (() =>
    existing
      ? existing.timeout
      : setTimeout(() => dispatch({ type: Types.RoomKeydownTimedOut, handle, keydown }), 2000))()

  dispatch({
    type: Types.RoomKeydownReceived,
    handle,
    keydown: { ...keydown, timeout },
  })
}

export const subscribeToRoom = (handle) => (dispatch, getState) => {
  const state = getState()
  const { consumer } = state
  const oldSubscription = state.roomSubscriptions[handle]

  if (!!oldSubscription) return

  const subscription = new Subscription(consumer, "RoomChannel", { handle })

  subscription.onConnected(() => dispatch({ type: Types.SubscribedToRoom, handle, subscription }))
  subscription.on(RoomEventType.MessageCreated, (message) =>
    dispatch({
      type: Types.RoomMessageReceived,
      handle,
      message,
    })
  )
  subscription.on(RoomEventType.MessageUpdated, (message) =>
    dispatch({
      type: Types.RoomMessageUpdated,
      handle,
      message,
    })
  )
  subscription.on(RoomEventType.Keydown, (keydown) => dispatch(receiveRoomKeydown(handle, keydown)))

  subscription.connect()
}

export const sendRoomMessage = (handle, body) => (dispatch, getState) => {
  const { authenticatedToken } = getState()

  const req = new ApiRequest<Message[]>(ApiRequestMethod.POST, `/rooms/${handle}/messages`, {
    authenticatedToken,
    json: { body },
  })

  req.execute().then((message) =>
    dispatch({
      type: Types.RoomMessageSent,
      message,
    })
  )
}

export const sendRoomKeydown = (handle) => (_, getState) => {
  const { roomSubscriptions } = getState()
  const subscription = roomSubscriptions[handle]

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

export const subscribeToUserState = (handle) => (dispatch, getState) => {
  const state = getState()
  const { consumer } = state
  const oldSubscription = state.userStateSubscriptions[handle]

  if (!!oldSubscription) return

  const subscription = new Subscription(consumer, "UserStateChannel", { handle })

  subscription.onConnected(() =>
    dispatch({ type: Types.SubscribedToUserState, handle, subscription })
  )
  subscription.on(UserStateEventType.Changed, (state) =>
    dispatch({
      type: Types.UserStateReceived,
      handle,
      state,
    })
  )

  subscription.connect()
}

export const fetchRoomMessages = (handle) => (dispatch, getState) => {
  const { authenticatedToken } = getState()
  const req = new ApiRequest<Message[]>(ApiRequestMethod.GET, `/rooms/${handle}/messages`, {
    authenticatedToken,
  })

  return req
    .execute()
    .then((messages) => dispatch({ type: Types.RoomMessagesFetched, handle, messages }))
}

export const openRoom = (handle) => (dispatch, getState) => {
  dispatch({
    type: Types.RoomOpening,
    handle,
  })

  const req = new ApiRequest<Message[]>(ApiRequestMethod.POST, `/rooms/${handle}/open`, {
    authenticatedToken: getState().authenticatedToken,
  })

  req.execute().then((room) =>
    dispatch(fetchRoomMessages(handle))
      .then(() => dispatch(subscribeToRoom(handle)))
      .then(() => dispatch({ type: Types.RoomOpened, room }))
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

export const setRoomStar = (handle, starred) => (dispatch, getState) => {
  dispatch({ type: Types.RoomStarSetting, handle, starred })

  const req = new ApiRequest<Room[]>(
    starred ? ApiRequestMethod.POST : ApiRequestMethod.DELETE,
    `/rooms/${handle}/star`,
    {
      authenticatedToken: getState().authenticatedToken,
    }
  )

  req.execute().then((star) => dispatch({ type: Types.RoomStarSet, star }))
}

export const closeRoom = (handle) => (dispatch, getState) => {
  dispatch({
    type: Types.RoomClosing,
    handle,
  })

  const { authenticatedToken } = getState()

  const req = new ApiRequest<Room[]>(ApiRequestMethod.DELETE, `/rooms/${handle}/close`, {
    authenticatedToken,
  })

  req.execute().then((room) => dispatch({ type: Types.RoomClosed, room }))
}
