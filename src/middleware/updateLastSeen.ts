import { NextFunction, Request, Response } from 'express'

import { UserModel } from '../schemas/schemas'

export default (req: Request, res: Response, next: NextFunction) => {

	UserModel.updateMany({ last_seen: new Date().toLocaleString() }).exec()

	next()
}
