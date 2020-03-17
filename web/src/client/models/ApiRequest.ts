import { stringify } from "rackstring"
import camelize from "camelize"
import * as snakeize from "snakecase-keys"

export enum ApiRequestMethod {
  GET = "GET",
  POST = "POST",
}

class ApiResponseError extends Error {
  code: number
  body: string

  constructor(code, body) {
    super()

    this.code = code
    this.body = body
  }
}

class ApiRequest<T> {
  private path: string
  private method: ApiRequestMethod
  private options: any

  constructor(method: ApiRequestMethod, path: string, options: any = {}) {
    this.method = method
    this.path = path
    this.options = options
  }

  async execute(): Promise<T> {
    const { json, authenticatedToken } = this.options

    const response = await fetch(this.url, {
      method: this.method,
      headers: {
        accept: "application/json; charset=utf-8",
        "content-type": "application/json; charset=utf-8",
        Authorization: authenticatedToken,
      },
      body: !!json ? JSON.stringify(snakeize(json)) : null,
    })

    if (response.status < 400) {
      return camelize(await response.json()) as T
    }

    throw new ApiResponseError(response.body, response.status)
  }

  private get url(): string {
    const url = [process.env.API_URL, this.path.replace(/^\//, "")].join("/")
    const { params } = this.options

    if (!!params) {
      return [url, stringify(params)].join("?")
    }

    return url
  }
}

export default ApiRequest
