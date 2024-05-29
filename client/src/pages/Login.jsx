import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';
import { saveMe, saveSessionMe } from '../utils/rememberMe';
import { loginUser } from '../utils/postData';
import Loading from './Loading';
import ResetPasswordModal from '../components/ResetPasswordModal';
import { changeTabText } from '../App';

export default function Login() {
  changeTabText('Login');
  const dispatch = useDispatch();
  const ID = process.env.REACT_APP_ACCESS_KEY;

  const DEMO_USER = {
    name: process.env.REACT_APP_DEMO_USERNAME,
    password: process.env.REACT_APP_DEMO_PASSWORD,
  };

  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(
          `https://api.unsplash.com/photos/random?query=wallpaper&client_id=${ID}`
        );
        const res = await req.json();
        setImage(res.urls.full);
      } catch (e) {
        console.error(e.message);
        setImage(
          'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [ID]);

  const handleSubmitDemo = async (event) => {
    event.preventDefault();

    const email = DEMO_USER.name;
    const password = DEMO_USER.password;

    // Attempt to login user
    const res = await loginUser(email, password);

    // If login successful
    if (res.status === 'success') {
      // Dispatch user login action
      dispatch(login(res.user));
      saveSessionMe({ ...res.user, isLoggedIn: true });
    } else {
      // Handle login failure
      return null;
    }
  };

  // State to manage the visibility of the password reset modal
  const [open, setOpen] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Extract data from the form
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const remember = data.get('remember');

    // Attempt to login user
    const res = await loginUser(email, password);

    // If login successful
    if (res.status === 'success') {
      // Dispatch user login action
      dispatch(login(res.user));

      // Save user data based on remember option
      if (remember) {
        saveMe({ ...res.user, isLoggedIn: true });
      } else {
        saveSessionMe({ ...res.user, isLoggedIn: true });
      }
    } else {
      // Handle login failure
      return null;
    }
  };

  if (isLoading) return <Loading />;
  return (
    // Main container
    <Grid container component='main' sx={{ height: '100vh' }}>
      <CssBaseline />
      {/* Background image */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Login form container */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Avatar */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            {/* Email input */}
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
            />
            {/* Password input */}
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            {/* Remember me checkbox */}
            <FormControlLabel
              control={
                <Checkbox value='remember' name='remember' color='primary' />
              }
              label='Remember me'
            />
            <Button
              type='submit'
              fullWidth
              variant='outlined'
              onClick={handleSubmitDemo}
              sx={{ mt: 3, mb: 2 }}
            >
              Demo user
            </Button>
            {/* Sign in button */}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            {/* Forgot password link */}
            <Grid container>
              <Grid item xs>
                <p
                  className=' cursor-pointer text-blue-500'
                  onClick={() => setOpen(true)}
                >
                  Forgot password?
                </p>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      {/* Password reset modal */}
      <ResetPasswordModal open={open} setOpen={setOpen} />
    </Grid>
  );
}
