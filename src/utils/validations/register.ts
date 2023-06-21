import { check, matchedData, validationResult } from 'express-validator';

export default [
	check('email').notEmpty().isEmail(),
	check('fullname').notEmpty().isLength({min: 2}),
	check('password').notEmpty().isLength({min: 5})
]