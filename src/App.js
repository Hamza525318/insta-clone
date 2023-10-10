import './App.css';
import Post from './Post';
import { useState,useEffect } from 'react';
import {dbs,auth} from './firebase'
import { Input } from '@material-ui/core';
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};




function App() {
  const [posts,setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const[openSignIn,setOpenSignIn] = useState(false);
  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[username,setUsername] = useState('');
  const[user,setUser] = useState(null);

  const onSignUp = (event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
     return authUser.user.updateProfile({
        displayName: username,
      });
    })
    .catch((error)=>alert(error.message));
   

     setOpen(false);
     setEmail('');
     setUsername('');
     setPassword('');
     
  }

  const onLogin = (e)=>{
    e.preventDefault();
    
    auth.signInWithEmailAndPassword(email,password)
     .catch((error)=>alert(error.message));

    
     
     setOpenSignIn(false);
     setEmail('');
     setPassword('');
  }


   //useEffect runs a piece of code based on specific condition
   useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
       if(authUser){
         //user has logged in
         
         console.log(authUser);
         setUser(authUser);
         

       }
       else{
          //user has logged out
          setUser(null);
       }
     })
      return ()=>{
        unsubscribe();
      }   

   },[user,username]);
   
   useEffect(()=>{
    dbs.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
        setPosts(snapshot.docs.map(doc=> ({
          id: doc.id,
          post: doc.data(),
        })))
    })
},[]);


  return (

   
    <div className="App">
        <div>
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modal' sx={style}>
          <form>
          <center className="form_signup">
            <img className='insta_logo' src='insta.png' alt='INSTAGRAM-CLONE' />

            <Input className='signup_input' type="text" 
              placeholder='enter your username' 
              value={username} 
              onChange={(e)=>setUsername(e.target.value)}
            />  

            <Input className='signup_input'  type="text" 
               placeholder='enter your email' 
               value={email} 
               onChange={(e)=>setEmail(e.target.value)}
            />  

            <Input className='signup_input'  type="password"

               placeholder='enter your password' 
               value={password}
               onChange={(e)=>setPassword(e.target.value)}
               />

             <Button style={{'margin-top':'10px'}} type="submit" onClick={onSignUp}>SignUp</Button>    
          </center>
          </form>
        </Box>
      </Modal>
    </div>
     
    <div> {/* the modal up is for signing in ,the modal down is for logging in*/}
     
     <Modal
       open={openSignIn}
       onClose={()=>setOpenSignIn(false)}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
     >
       <Box className='modal' sx={style}>
         <form>
         <center className="form_signup">
           <img className='insta_logo' src='insta.png' alt='INSTAGRAM-CLONE' />

           <Input className='signup_input'  type="text" 
              placeholder='enter your email' 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)}
           />  

           <Input className='signup_input'  type="password"

              placeholder='enter your password' 
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />

            <Button style={{'margin-top':'10px'}} type="submit" onClick={onLogin}>LOG IN</Button>    
         </center>
         </form>
       </Box>
     </Modal>
   </div>
   


      <div className="appHeader">
        <img src="insta.png" className="insta_logo" alt="Instagram" />
        {user?(
      <div>
      <Button className='login_btns' style={{'background-color':'red','color':'white','border-radius':'15px'}}  onClick={()=>auth.signOut()} >LOGOUT</Button>
      
      <Button className='login_btns'style={{'background-color':'red','color':'white','margin':'0px 8px','border-radius':'15px'}} onClick= {()=>setOpenSignIn(true)}>Log In</Button>
      </div>
    ):(
      <div className='app_loginbox'> 
      <Button className='login_btns'style={{'background-color':'red','color':'white','margin':'0px 8px','border-radius':'15px'}} onClick= {()=>setOpenSignIn(true)}>Log In</Button>
      <Button className='login_btns' style={{'background-color':'red','color':'white','border-radius':'15px'}} onClick={handleOpen}>Sign Up</Button>
     </div>
    )}


      </div>
      <div className='app_posts'> 
      {
        posts.map(({id,post})=>(
          <Post key={id} postId={id} user={user} imageUrl={post.imageUrl} username={post.username} caption={post.caption} />
        ))
      }
      </div>
      
       { user?.displayName?(
        <ImageUpload  username={user.displayName}/>
       ):(
        <h2>Sorry Login to post if No account is there Sign Up Please!!!</h2>
       )
     }
      
      
    </div>
  );
}

export default App;
