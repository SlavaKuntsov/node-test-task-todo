import mongoose, { Document, Types } from 'mongoose'
const { Schema } = mongoose

export interface IMessage extends Document {
	dialog: {
		type: Types.ObjectId,
		ref: string,
		require: boolean
	}
	user: {
		type: Types.ObjectId,
		ref: string,
		require: boolean
	}
	text: {
		type: string,
		require: boolean
	}
	isReaded: {
		type: boolean,
		default: boolean
	},
	attachments: object[],
	avatar: string,
	// created_at: string,
	// updated_at: string,

}

const MessageSchema = new Schema(
	{
		dialog: {
			type: Types.ObjectId,
			ref: "Dialog",
			require: true,
		},
		user: {
			type: Types.ObjectId,
			ref: "User",
			require: true
		},
		text: {
			type: String,
			require: true,
		},
		// isMe: Boolean,
		isReaded: {
			type: Boolean,
			default: false
		},
		attachments: Array,
		avatar: String,
		// created_at: {
		// 	type: String,
		// 	default: new Date().toLocaleString()
		// },
		// updated_at: {
		// 	type: String,
		// 	default: new Date().toLocaleString()
		// },
	},
	{
		timestamps: true
	}
)

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel
