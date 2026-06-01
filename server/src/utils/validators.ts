import { isEmail, isLength, isEmpty } from "class-validator";

export const validateEmail = (email: string): boolean => {
  return isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  return isLength(password, { min: 8 });
};

export const validateRequired = (value: any): boolean => {
  return !isEmpty(value);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};
