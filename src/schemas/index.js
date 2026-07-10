import * as yup from 'yup';

export const createAdminSchema = yup.object().shape({
    firstname: yup.string().required('Required'),
    lastname: yup.string().required('Required'),
    email: yup.string().email('Invalid Email Address').required('Required'),
    phone_number: yup.string().required('Required'),
    username: yup.string().required('Required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Required'),
    avatar: yup.mixed().required('Required')
})

export const addPropertySchema = yup.object().shape({
    name: yup.string().required('Required'),
    address: yup.string().required('Required'),
    category: yup.string().required('Required'),
    total_price: yup.number().required('Required'),
    type: yup.string().required('Required'),
    inspection_fee: yup.number().required('Required'),
    about: yup.string().required('Required'),
    land_size: yup.string().when('type', {
        is: 'land',
        then: (schema) => schema.required('Required for Land'),
        otherwise: (schema) => schema.notRequired()
    })
})
export const addBlogSchema = yup.object().shape({
    title: yup.string().required('Required'),
    subtitle: yup.string().required('Required'),
    content: yup.string().required('Required')
})
export const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid Email Address').required('Required'),
    password: yup.string().required('Required')
})