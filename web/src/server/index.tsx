import { resolve } from "path"
import express from "express"

const app = express()

const DIST = "dist"
const INDEX = "index.html"
const PORT = process.env.PORT || 3000

const dist = (...rest) => resolve(__dirname, DIST, ...rest)
console.log(__dirname, dist())

app.use(express.static(dist()))
app.get("*", (_, response) => response.sendFile(dist(INDEX)))

app.listen(PORT, () => console.log(`👋 Hello from port ${PORT}!`))
