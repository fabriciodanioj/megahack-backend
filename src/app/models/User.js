import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    token: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
    },
    bag: {
      type: Object,
      default: {
        amount: 0,
      },
      required: true,
    },
    loan_id: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', UserSchema);
