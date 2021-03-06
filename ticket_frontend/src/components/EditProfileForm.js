import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Typography, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
//formik
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

//firebase functions
import { AuthContext } from 'src/firebase/Auth';
import { doUpdateUser } from 'src/firebase/FirebaseFunctions';

const EditProfile = () => {
    const { currentUser } = React.useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const [ firstName, setFirstName ] = useState(currentUser.firstName);
    const [ lastName, setLastName ] = useState(currentUser.lastName);
    const [ displayName, setDisplayName ] = useState(currentUser.displayName);
    const [ phoneNumber, setPhoneNumber ] = useState(currentUser.phoneNumber);
    
    var phoneRegEx = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
          .required('First name required'),
        lastName: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
          .required('Last name required'),
        displayName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Last name required'),
        phoneNumber: Yup.string()
            .matches(phoneRegEx, 'Invalid Phone Number')
            .min(12, "Phone Number must be atleast 12 characters")
            .max(12, "Phone Number at most must be 12 characters"),
        email: Yup.string()
          .email('Email must be a valid email address')
          .required('Email is required'),
    });
    const formik = useFormik({
        initialValues: {
          firstName: firstName,
          lastName: lastName,
          displayName: displayName,
          role: currentUser.role,
          phoneNumber: phoneNumber,
          email: currentUser.email,
        },
        validationSchema: RegisterSchema,
    });
    const { errors, touched, getFieldProps, handleChange, values } = formik;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!values.firstName || values.firstName.length < 2 || values.firstName.length > 50 || !values.firstName.replace(/\s/g, "").length ){
            enqueueSnackbar("invalid firstname", { variant: 'error' });
            return false
        }  
        if(!values.lastName || values.lastName.length < 2 || values.lastName.length > 50 || !values.lastName.replace(/\s/g, "").length ){
            enqueueSnackbar("invalid lastname", { variant: 'error' });
            return false;
        }

        if(!values.displayName || values.displayName.length < 2 ||  !values.displayName.replace(/\s/g, "").length){
            enqueueSnackbar("invalid displayName", { variant: 'error' });
            return false;
        }
        if(typeof values.phoneNumber !== 'string' || !values.phoneNumber.replace(/\s/g, "" || values.phoneNumber.match(/^\d{3}[-]\d{3}[-]\d{4}$/) === null).length){
            enqueueSnackbar("Please enter a valid input phoneNumber", { variant: 'error' });
            return false;
        }

        try{
            setFirstName(values.firstName);
            setLastName(values.lastName);
            setDisplayName(values.displayName);
            setPhoneNumber(values.phoneNumber);
            await doUpdateUser(values.firstName, values.lastName, values.displayName, values.phoneNumber);
            enqueueSnackbar("User information updated successfully", {variant: 'success'});
            window.location.reload();
        }catch(error){
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    }
    return (
        <Container maxWidth="xl">
            <Box sx={{mb: 5}}>
                <Typography variant='h4' component='h2'>Edit your profile..</Typography>
            </Box>
                <Grid
                    container
                    justifyContent="space-evenly"
                >
                <Card sx={{ maxWidth: 700 }} margin='auto' variant='outlined'>
                    <CardContent>
                        <FormikProvider value={formik}>
                            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                <Grid 
                                    container 
                                    justifyContent="space-evenly"
                                    rowSpacing={3}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                >
                                    <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        {...getFieldProps('firstName')}
                                        id='firstName'
                                        onChange={handleChange}
                                        value={values.firstName}
                                        error={Boolean(touched.firstName && errors.firstName)}
                                        helperText={touched.firstName && errors.firstName}
                                    />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        {...getFieldProps('lastName')}
                                        id='lastName'
                                        onChange={handleChange}
                                        value={values.lastName}
                                        error={Boolean(touched.lastName && errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                    />
                                    </Grid>
                                    <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Dislay Name"
                                        {...getFieldProps('displayName')}
                                        id='displayName'
                                        onChange={handleChange}
                                        value={values.displayName}
                                        error={Boolean(touched.displayName && errors.displayName)}
                                        helperText={touched.displayName && errors.displayName}
                                    />
                                    </Grid>
                                    <Grid item xs={6}>
                                    <TextField
                                        disabled
                                        fullWidth
                                        label="Role"
                                        {...getFieldProps('role')}
                                        id='role'
                                        onChange={handleChange}
                                        value={values.role}
                                        error={Boolean(touched.role && errors.role)}
                                        helperText={touched.role && errors.role}
                                    />
                                    </Grid>
                                    <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        {...getFieldProps('phoneNumber')}
                                        id='phoneNumber'
                                        onChange={handleChange}
                                        value={values.phoneNumber}
                                        error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                        helperText={touched.phoneNumber && errors.phoneNumber}
                                    />
                                    </Grid>
                                    <Grid item xs={12}>
                                    <TextField
                                        disabled
                                        fullWidth
                                        label="Email"
                                        {...getFieldProps('email')}
                                        id='email'
                                        onChange={handleChange}
                                        value={values.email}
                                        error={Boolean(touched.email && errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                    </Grid>
                                </Grid>
                                <Box 
                                    sx={{ mt: 3 }}
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="flex-end"
                                >
                                <Button 
                                    variant="contained" 
                                    size='small' 
                                    type='submit'
                                >
                                Save Changes
                                </Button>
                                </Box>
                            </Form>
                        </FormikProvider>
                    </CardContent>
                </Card>
                </Grid>
            </Container>
    )
}

export default EditProfile;