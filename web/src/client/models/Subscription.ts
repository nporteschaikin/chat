import camelize from "camelize"

export interface ReceivedEvent {
  type: string
  attributes: any
}

class Subscription {
  isConnected: boolean = false

  private consumer: any
  private channel: string
  private params: any

  private subscription: any
  private handlers: { [key: string]: ((args: ReceivedEvent) => void)[] } = {}
  private connectedHandlers: (() => void)[] = []
  private disconnectedHandlers: (() => void)[] = []
  private performQueue: { action: string; params: any }[] = []

  constructor(consumer: any, channel: string, params: any = {}) {
    this.consumer = consumer
    this.channel = channel
    this.params = params
  }

  on(event, fn): void {
    this.handlers[event] = this.handlers[event] || []
    this.handlers[event].push(fn)
  }

  onConnected(fn): void {
    this.connectedHandlers.push(fn)
  }

  onDisconnected(fn): void {
    this.disconnectedHandlers.push(fn)
  }

  connect(): void {
    if (!this.subscription) {
      this.subscription = this.consumer.subscriptions.create(
        { ...this.params, channel: this.channel },
        {
          connected: () => this.handleConnected(),
          disconnected: () => this.handleDisconnected(),
          received: (data) => this.handleReceived(camelize(data) as ReceivedEvent),
        }
      )
    }
  }

  perform(action: string, params: any = {}) {
    if (this.isConnected) {
      this.subscription.perform(action, params)
    } else {
      this.performQueue.push({
        action,
        params,
      })
    }
  }

  disconnect(): void {
    if (this.subscription) {
      this.subscription.disconnect()
    }
  }

  private handleReceived(event: ReceivedEvent) {
    ;(this.handlers[event.type] || []).forEach((fn) => fn(event.attributes))
  }

  private handleConnected() {
    this.isConnected = true
    this.connectedHandlers.forEach((fn) => fn())

    this.performQueue.forEach(({ action, params }) => this.perform(action, params))
    this.performQueue = []
  }

  private handleDisconnected() {
    this.isConnected = false
    this.disconnectedHandlers.forEach((fn) => fn())
  }
}

export default Subscription
