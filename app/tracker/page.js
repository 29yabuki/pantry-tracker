"use client";
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '@/app/config/firebase';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, signOut } from '@/app/config/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';

const modal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 }, 
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchName, setSearchName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter();
  
  const user = auth.currentUser;
  const userId = user?.uid;
  const userDocRef = userId ? doc(firestore, 'users', userId) : null;
  
  const updatePantry = async () => {
    if (!userId) return;

    const pantryCollectionRef = collection(userDocRef, 'pantry');
    const snapshot = await getDocs(pantryCollectionRef);
    const pantryList = [];

    snapshot.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  const filterPantry = async () => {
    if (!userId) return;
  
    const pantryCollectionRef = collection(userDocRef, 'pantry');
    let q;
  
    if (searchName.trim() === '') {
      // Fetch all items if searchName is empty
      q = pantryCollectionRef;
    } else {
      // Filter based on searchName
      q = query(pantryCollectionRef, where('__name__', '==', searchName.toLowerCase()));
    }
  
    try {
      const snapshot = await getDocs(q);
      const pantryList = [];
  
      snapshot.forEach((doc) => {
        pantryList.push({ name: doc.id, ...doc.data() });
      });
      setPantry(pantryList);
    } catch (error) {
      console.error('Error fetching pantry items:', error);
    }
  };
  
  useEffect(() => {
    if (userId) {
      updatePantry();
    } else {
    }
  }, [userId]);

  const addItem = async (item) => {
    if (!userId) return;

    const docRef = doc(collection(userDocRef, 'pantry'), item.toLowerCase());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count+1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    if (!userId) return;
    
    const docRef = doc(collection(userDocRef, 'pantry'), item.toLowerCase());
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count-1 });
      }
      await updatePantry();
    }
  };

  const clearItem = async (item) => {
    if (!userId) return;

    const docRef = doc(collection(userDocRef, 'pantry'), item.toLowerCase());
    await deleteDoc(docRef);
    await updatePantry();
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
      <Box height='30%'></Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width='100%' direction={'row'} spacing={2}>
            <TextField 
              id='outlined-basic'
              label='Item'
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant='contained'
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose(); 
              }}
            >
                Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant='contained' onClick={handleOpen}>
        Add
      </Button>
      <Box
        display={'flex'}
        justifyContent={'center'}
        width={{ xs: '100%', sm: '600px', md: '800px' }}

        >
        <TextField
          autoFocus
          id="search"
          label="Search Item"
          name="search"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Button onClick={filterPantry}>
          <SearchIcon />
        </Button>
      </Box>

      <Box border={'1px solid #333'}>
        <Stack
          width={{ xs: '100%', sm: '600px', md: '800px' }}
          height={{ xs: 'auto', sm: '300px' }}
          spacing={2}
          overflow="auto"
          marginX="auto"
        >
          {pantry.map(({ name, count }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              paddingX={3}
              paddingY={2}
              marginBottom={1}
            >
              <Typography
                variant="h5"
                color="#333"
                textAlign={{ xs: 'center', sm: 'left' }}
              >
                ({count}) {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Box
                display="flex"
                gap={2}
              >
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
                >
                  -
                </Button>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  onClick={() => clearItem(name)}
                  sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
                >
                  <DeleteOutlinedIcon sx={{color: '#f0f0f0'}} />
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      <Box height='20%'></Box>
      <Box alignContent={'end'} height='10%'>
        <Stack>
          <Typography variant='h6' component='h6'>
            user: {auth.currentUser?.email}
          </Typography>
          <Button 
            variant="text" 
            size='large'
            sx={{color: '#DC5B5B'}}
            onClick={() => {signOut(auth).then(() => router.push('/'))}}
          >
            Sign Out
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}