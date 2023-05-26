const socket = require('socket.io')
import http from 'http'


export default (http: http.Server) => {
	const io = socket(http)

	io.on('connection', (socket: any) => {
		console.log('CONNECTED')
		// socket.emit('connection', 'test') // посылает
	})

	return io
}