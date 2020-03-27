export interface Location {
  id: number
  humanName: string
}

export enum UserState {
  New = "new",
  Online = "online",
  Offline = "offline",
  Away = "away",
}

export interface User {
  id: number
  displayName: string
  handle: string
  formattedHandle: string
  state: UserState
  location: Location
  avatar: {
    url: string
  }
}

export interface UserToken {
  user: User
  token: string
}

export interface RegistrationForm {
  displayName: string
  email: string
  handle: string
  password: string
}

export interface Registration {
  userToken: UserToken
}

export interface Message {
  id: number
  body: string
  author: User | null
  createdAt: string
}

export interface Room {
  id: number
  handle: string
  formattedHandle: string
  description: string | null
  starred: boolean
  open: boolean
  location: Location | null
}

export interface Manifest {
  user: User
  rooms: Room[]
  lastOpenRoom: Room
}
