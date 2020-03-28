import { RoomPath, Room } from "./../types"

export const buildRoomApiUrlFromPath = (path: RoomPath, ...otherParts: string[]): string =>
  [
    ...(path.locationHandle ? ["locations", path.locationHandle] : []),
    "rooms",
    path.handle,
    ...otherParts,
  ].join("/")

export const buildRoomApiUrlFromRoom = (room: Room, ...otherParts): string =>
  buildRoomApiUrlFromPath(
    { locationHandle: room.location?.handle, handle: room.handle! },
    ...otherParts
  )

export const isPathForRoom = (path: RoomPath, room: Room): boolean =>
  room.location?.handle === path.locationHandle && room.handle === path.handle

export const buildRoomLocationPathFromRoom = (room: Room): string => {
  const parts: string[] = [
    "r",
    ...(room.location?.handle ? [room.location.handle!] : []),
    room.handle!,
  ]

  return `/${parts.join("/")}`
}
