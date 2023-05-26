import jwt, { Secret } from 'jsonwebtoken'

export default (token: string) => 
new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET as Secret, (err, decodeToken) => err ? reject({}) : resolve(decodeToken));
		// jwt.verify(token, process.env.JWT_SECRET as Secret, (err, decodeToken) => {
		// 	if(err !== null || decodeToken) {
		// 		console.log('decodeToken: ', decodeToken);
		// 		console.log('err ', err)
		// 		return reject(err);
		// 	}

		// 	console.log('decodeToken: ', decodeToken);
		// 	return resolve(decodeToken);
		// });
});