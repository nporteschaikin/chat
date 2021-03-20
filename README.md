# chat

I was looking for a side project at the beginning of the COVID-19 quarantine, so I played with building a chat app for no particularly meaningful reason.

This repository contains:

- [A Rails app](https://github.com/nporteschaikin/chat/tree/master/api) which powers:
  - An API for chat transactions over web sockets, along with HTTP requests to fetch historical messages, create users, find rooms, etc.
  - [Sidekiq](https://github.com/mperham/sidekiq) workers for background processing.
- [A client app](https://github.com/nporteschaikin/chat/tree/master/client), including a Node.js server and React app (mostly written in TypeScript).

## Usage

With Docker, it's easy:

```
$ docker-compose up -d
```

Visit https://localhost:4001 to access the client.

## License

[MIT](LICENSE).
