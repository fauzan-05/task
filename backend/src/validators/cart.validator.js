const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdValidator = (val) => mongoose.Types.ObjectId.isValid(val);

const addCartItemSchema = z.object({
  body: z.object({
    productId: z
      .string({ required_error: 'Product ID is required' })
      .refine(objectIdValidator, { message: 'Invalid Product ID format' }),
    quantity: z
      .number({ required_error: 'Quantity is required' })
      .int('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1')
  })
});

const updateCartItemSchema = z.object({
  params: z.object({
    productId: z
      .string({ required_error: 'Product ID is required' })
      .refine(objectIdValidator, { message: 'Invalid Product ID format' })
  }),
  body: z.object({
    quantity: z
      .number({ required_error: 'Quantity is required' })
      .int('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1')
  })
});

const removeCartItemSchema = z.object({
  params: z.object({
    productId: z
      .string({ required_error: 'Product ID is required' })
      .refine(objectIdValidator, { message: 'Invalid Product ID format' })
  })
});

module.exports = {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema
};
