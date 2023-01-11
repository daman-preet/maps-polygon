import * as yup from 'yup';

export const signInSchema = yup.object().shape({
  email: yup.string().required().email('This email is invalid'),
  password: yup.string().required('Password is required'),
});

export const saveAreaSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});
