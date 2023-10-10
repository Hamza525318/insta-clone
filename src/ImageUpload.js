import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {dbs,storage} from './firebase'
import firebase from 'firebase';
import './ImageUpload.css'

function ImageUpload({username}) {
    const[caption,setCaption] = useState('');
    const[progress,setProgress] = useState(0);
    const[image,setImage] = useState(null);


    const handleChange = (e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = ()=>{
  
        const Uploadtask  = storage.ref(`images/${image.name}`).put(image);

        Uploadtask.on(
            "state_changed",
            (snapshot)=>{
                //progress function
                //getting the progress bar
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100);
                    setProgress(progress);
                
            },
            (error)=>{
                //if any error message occurs while uploading we alert it to the user
                console.log(error);
                alert(error.message);
            },
            ()=>{
                //we are getting the image and getting the url link for download
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    //post image inside database
                    console.log(url);
                   dbs.collection("posts").add({
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      caption: caption,
                      imageUrl: url,
                      username: username,

                   })

                   setProgress(0);
                   setImage(null);
                   setCaption('');
                })
               
            },
        )
    }

  return (
    <div className='image_upload'>
        {/* I want to have a caption input ,file picker,and post button*/}
        <progress className='progress_bar' max="100" value={progress}/>
        <input type="text"
         placeholder='caption here....' 
         value={caption} 
         onChange={(e)=>setCaption(e.target.value)}/>

        <input type="file"  onChange={handleChange}/>
        <Button onClick={handleUpload}>POST</Button>
    </div>
  )
}

export default ImageUpload