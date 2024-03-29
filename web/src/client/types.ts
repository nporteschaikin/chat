export interface Location {
  id: number
  handle: string
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
  private: boolean
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

export interface RoomPath {
  locationHandle?: string
  handle: string
}

export interface Room {
  id: number
  handle: string | null
  formattedHandle: string
  description: string | null
  starred: boolean
  open: boolean
  read: boolean
  location: Location | null
  privateUuid: string | null
  members: User[]
}

export interface Manifest {
  user: User
  rooms: Room[]
  lastOpenRoom: Room
}
