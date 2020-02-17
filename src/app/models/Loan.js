import { Schema, model } from 'mongoose';

const LoanSchema = new Schema(
  {
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    amountRequested: {
      type: Number,
      required: true,
      default: 0,
    },
    amountReceived: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Loan', LoanSchema);
