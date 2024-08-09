"use client"
import { Box, Typography, Button, TextField, Link, Grid} from '@mui/material';
import { auth, createUserWithEmailAndPassword } from '../config/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  
  const handleSignUp = async (event) => {
    const data = new FormData(event.currentTarget);
    const userCredential = await createUserWithEmailAndPassword(auth, data.get('email'), data.get('password'));
    const uid = userCredential.user.uid;
    
    // Correctly reference the user's document
    const userDocRef = doc(collection(firestore, 'users'), uid);
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(userDocRef, {
        next: snapshot => {
          unsubscribe();
          resolve(snapshot.data());
        },
        error: error => {
          unsubscribe();
          reject(error);
        }
      });
    });
  };

  return (
    <Box
      width='100vw'
      height='100vh'
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Typography component="h1" variant="h4">
        Sign up
      </Typography>
      <Box 
        component="form" 
        onSubmit={handleSignUp}
        noValidate 
        sx={{ mt: 3 }}
        width={{ xs: '90%', sm: '15%', md: '25%' }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
        >
        <Link href=".." variant="body2">
          Already have an account? Sign in
        </Link>
        </Box>
      </Box>
    </Box>
  );
}