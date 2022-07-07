import { model, Schema, Model, Document } from 'mongoose';


export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    date?: Date;
}

// Create Schema
const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const UserModel: Model<IUser> = model<IUser>('Users', UserSchema);

