"use client"
import { Box, Typography, Button, TextField, FormControlLabel, Checkbox, Link} from '@mui/material';
import { auth, signInWithEmailAndPassword } from '@/app/config/firebase';
import { useRouter } from 'next/navigation';
import ShoppingBasketSharpIcon from '@mui/icons-material/ShoppingBasketSharp';


export default function SignIn() {
  const router = useRouter();

  const handleSignIn = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
        await signInWithEmailAndPassword(auth, data.get('email'), data.get('password'));
        router.push('/tracker');
    } catch(error){
      console.log(error.message)
      alert(error.message)
    }
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
        <ShoppingBasketSharpIcon sx={{color: '#166AC5', fontSize: 40}}/>
      </Typography>
      <Box 
        component="form" 
        onSubmit={handleSignIn} 
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
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Link href="./sign-up" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
      </Box>
    </Box>
  );
}