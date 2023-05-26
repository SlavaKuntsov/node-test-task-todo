import { check, matchedData, validationResult } from 'express-validator';

export default [
	check('email').notEmpty().isEmail(),
	check('password').notEmpty().isLength({min: 5})
]