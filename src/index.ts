import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import mongoose from 'mongoose'

import { CreateRoutes, CreateSocket } from './core/core'

const cors = require('cors')

const app = express()
app.use(cors())
const http = createServer(app)
const io = CreateSocket(http)

dotenv.config()

CreateRoutes(app, io)

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGOOSE_EMAIL}:${process.env.MONGOOSE_PASS}@tasks.c05rcgo.mongodb.net/task?retryWrites=true&w=majority`
	)
	.then(res => console.log('Connect to MongoDB'))
	.catch(err => console.log('Connect error: ' + err))
// mongoose.connect('mongodb://127.0.0.1:27017/test')

const server = http.listen(process.env.PORT, () => {
	console.log(`Server Task: http://localhost:${process.env.PORT}`)
})
// err ? console.log(1) : console.log(`Server Task: http://localhost:${process.env.PORT}`)

server.on('error', error => {
	console.log('Error starting server:', error)
})
