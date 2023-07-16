import mongoose from "mongoose";
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		lowercase: true
	},
	email: {
		type: String,
		lowercase: true,
		trim: true
	},
	phoneNumber: {
		type: String,
		// required: true,
		// unique: true,
		trim: true
	},
	photo: {
		type: String
	},
	password: {
		type: String,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	}

})

const User = mongoose.model('User', UserSchema)

export default User;