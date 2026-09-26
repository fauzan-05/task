const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdValidator = (val) => mongoose.Types.ObjectId.isValid(val);

const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      fullName: z
        .string({ required_error: 'Full name is required' })
        .trim()
        .min(2, 'Full name must be at least 2 characters'),
      email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Please provide a valid email address'),
      phone: z
        .string({ required_error: 'Phone number is required' })
        .trim()
        .min(7, 'Phone number must be at least 7 characters')
        .max(20, 'Phone number cannot exceed 20 characters'),
      address: z
        .string({ required_error: 'Street address is required' })
        .trim()
        .min(5, 'Address must be at least 5 characters'),
      city: z
        .string({ required_error: 'City is required' })
        .trim()
        .min(2, 'City must be at least 2 characters'),
      state: z
        .string({ required_error: 'State/Province is required' })
        .trim()
        .min(2, 'State must be at least 2 characters'),
      postalCode: z
        .string({ required_error: 'Postal code is required' })
        .trim()
        .min(3, 'Postal code must be at least 3 characters')
        .max(10, 'Postal code cannot exceed 10 characters')
    })
  })
});

const getOrderSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Order ID is required' })
      .refine(objectIdValidator, { message: 'Invalid Order ID format' })
  })
});

module.exports = {
  createOrderSchema,
  getOrderSchema
};
