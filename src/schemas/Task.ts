import mongoose, { Document, Types } from 'mongoose'
const { Schema } = mongoose

export interface ITask extends Document {
	title: string
	text: string
}

const TaskSchema = new Schema(
	{
		user: {
			type: String,
			ref: 'User',
			require: true
		},
		category: {
			type: String,
			require: true,
		},
		name: {
			type: String,
			require: true,
		},
		text: {
			type: String,
			require: true,
		},
		status: {
			type: String,
			require: true,
		},
		
	},
	{
		timestamps: true
	}
)

const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel
