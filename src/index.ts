import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import mongoose from 'mongoose'

import { CreateRoutes } from './core/core'
import { CreateSocket } from './core/core'

const app = express()
const http = createServer(app)
const io = CreateSocket(http)

dotenv.config()

CreateRoutes(app, io)

mongoose.connect('mongodb://127.0.0.1:27017/chat')


http.listen(process.env.PORT, () => {
	console.log(`Server: http://localhost:${process.env.PORT}`)
})
