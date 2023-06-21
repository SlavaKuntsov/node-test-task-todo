export default (count: number) => {
	// const chars = 'acdefhiklmnoqrstuvwxyz0123456789'.split('');
	const chars = '0123456789'.split('')
	let result = ''

	for (let i = 0; i < count; i++) {
		var x = Math.floor(Math.random() * chars.length)
		result += chars[x]
	}
	return result
}
