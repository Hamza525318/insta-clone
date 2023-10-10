import { Avatar } from '@material-ui/core';
import React, { useEffect } from 'react';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { useState } from 'react';
import firebase from 'firebase';

import './post.css'
import { dbs } from './firebase';

function Post({postId,user,imageUrl,username,caption}) {
  const[comments,setComments] = useState([]);
  const[comment,setComment] = useState('');

  useEffect(()=>{
    let unsubscribe;
     if(postId){
      unsubscribe = dbs
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp','desc')
      .onSnapshot((snapshot)=>{
        setComments(snapshot.docs.map((doc)=>doc.data()));
      });

     }

     return ()=>{
      unsubscribe();
     }

  },[postId]);

   const postComment = (e)=>{
      e.preventDefault();
      
      dbs.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      setComment('');
   }

  const [isActive, setIsActive] = useState(false);

  const handleClick = event => {
   
    setIsActive(current => !current);
  };
    
  return (
    <div className='post'>
        <div className='post_header'>
        <Avatar
        className='post_avatar'
        src= {username}
        alt={username}
        
        />
        <h3>{username}</h3>
        </div>
        <img className='post_image' src={imageUrl} alt='Post not available'/>
        <h4 className='post_text'><strong>{username}</strong>: {caption}</h4> 
        <div className='postComments'>
          {comments.map((comment)=>{
            return(
            <p className='user_comment'>
              <strong>{comment.username}</strong>: {comment.text}
            </p>
            );
          })}
        </div>
        {user &&(
           <form className='comment_box'>
           <input 
            type="text"
            className='cmt_text'
            placeholder='enter your comment'
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
            
            />
            <button  className='comment_btn' disabled={!comment} type="submit" onClick={postComment}>
              POST
            </button>
         </form>
        )}
       
    </div>
  )
}

export default Post