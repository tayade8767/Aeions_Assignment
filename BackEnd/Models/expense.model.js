import mongoose from "mongoose";
import { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    default: 'Other',
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Expense = mongoose.model("Expense",expenseSchema);

export default Expense;