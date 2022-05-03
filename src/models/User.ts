import mongoose from 'mongoose';

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       accountType:
 *         type: string
 *       date_created:
 *         type: string
 *         format: date
 */

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['user', 'bot', 'admin'],
    default: 'user',
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model('User', userSchema);
