import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate, Navigate } from 'react-router-dom';
import { Box, Card, CardContent, Container, Grid, IconButton, InputAdornment, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
//formik
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

//components imported
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
import Iconify from 'src/components/Iconify';

//firebasefunctions
import { AuthContext } from 'src/firebase/Auth';
import { doChangePassword } from 'src/firebase/FirebaseFunctions';

const UserSettingsPage = () => {
    const { currentUser } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const [ showCurrentPassword, setShowCurrentPassword ] = useState(false);
    const [ showNewPassword, setShowNewPassword ] = useState(false);
    const [ showConfirmNewPassword, setShowConfirmNewPassword ] = useState(false);
    const RegisterSchema = Yup.object().shape({
        email: Yup.string()
          .email('Email must be a valid email address')
          .required('Email is required'),
        currentPassword: Yup.string().min(6, 'Too Short!')
          .required('Password is required'),
        newPassword: Yup.string().min(6, 'Too Short!')
          .required('Password is required'),
        confirmNewPassword: Yup.string()
          .when("newPassword", {
            is: val => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
              [Yup.ref("newPassword")],
              "Both password need to be the same"
            )
          })
      });

    const formik = useFormik({
        initialValues: {
            email: currentUser.email,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema: RegisterSchema,
      });
    const { errors, touched, getFieldProps, handleChange, values } = formik;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (values.newPassword !== values.confirmNewPassword) {
            return false;
        }
        try {
            await doChangePassword(
              values.email,
              values.currentPassword,
              values.newPassword,
              values.confirmNewPassword
            );
            // navigate('/login', { replace: true })
        }catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    }

    return(
            <Page title="Client">
                <Container maxWidth="xl">
                    <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
                        <Logo />
                    </Box>
                    <Box sx={{ pb: 5 }}>
                        <Typography
                            variant='h5'
                            component='h2'
                        >
                            Change your Password
                        </Typography>
                    </Box>
                    <Box sx={{ pb: 5 }}>
                        <Typography
                            variant='h5'
                            component='h3'
                        >
                            {currentUser.displayName}
                        </Typography>
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
                                        <Grid item xs={12}>
                                            <TextField
                                                disabled
                                                fullWidth
                                                label="Email"
                                                {...getFieldProps('email')}
                                                id='email'
                                                type='email'
                                                onChange={handleChange}
                                                value={values.email}
                                                error={Boolean(touched.email && errors.email)}
                                                helperText={touched.email && errors.email}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Current Password"
                                            {...getFieldProps('currentPassword')}
                                            id='currentPassword'
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            onChange={handleChange}
                                            value={values.currentPassword}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowCurrentPassword((prev) => !prev)}>
                                                        <Iconify icon={showCurrentPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            error={Boolean(touched.currentPassword && errors.currentPassword)}
                                            helperText={touched.currentPassword && errors.currentPassword}
                                        />
                                        </Grid>
                                        <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="New Password"
                                            {...getFieldProps('newPassword')}
                                            id='newPassword'
                                            type={showNewPassword ? 'text' : 'password'}
                                            onChange={handleChange}
                                            value={values.newPassword}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowNewPassword((prev) => !prev)}>
                                                        <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            error={Boolean(touched.newPassword && errors.newPassword)}
                                            helperText={touched.newPassword && errors.newPassword}
                                        />
                                        </Grid>
                                        <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Confirm New Password"
                                            {...getFieldProps('confirmNewPassword')}
                                            id='confirmNewPassword'
                                            type={showConfirmNewPassword ? 'text' : 'password'}
                                            onChange={handleChange}
                                            value={values.confirmNewPassword}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowConfirmNewPassword((prev) => !prev)}>
                                                        <Iconify icon={showConfirmNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                                            helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                                        />
                                        </Grid>
                                    </Grid>
                                    <Box 
                                        display="flex"
                                        justifyContent="flex-end"
                                        alignItems="flex-end"
                                        sx={{ mt: 3 }}
                                    >
                                    <Button 
                                        variant="contained" 
                                        size='small' 
                                        type='submit'
                                    >
                                    Change password
                                    </Button>
                                    </Box>
                                </Form>
                            </FormikProvider>
                        </CardContent>
                    </Card>
                    </Grid>
                </Container>
            </Page>
    )

}

export default UserSettingsPage;