const { z } = require('zod');

const registerSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name cannot exceed 50 characters'),
      email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Please provide a valid email address'),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters long'),
      confirmPassword: z
        .string({ required_error: 'Please confirm your password' })
        .min(6, 'Confirm password must be at least 6 characters long')
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    })
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required')
  })
});

module.exports = {
  registerSchema,
  loginSchema
};
