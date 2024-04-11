import { createContext,useEffect,useState } from "react";
import useWindowSize from '../hooks/useWindowSize'
import {Routes,Route, useNavigate} from 'react-router-dom';
import {format} from 'date-fns';
import useAxiosFetch from '../hooks/useAxiosFetch';
import api from '../api/posts';

export const DataContext=createContext({});

export const DataProvider=({children})=>{
    const [posts,setPosts] = useState([]);
  const [postTitle, setPostTitle]= useState("");
  const[postBody, setPostBody]=useState('');
  const [editTitle, setEditTitle]= useState("");
  const[editBody, setEditBody]=useState('');
  const[search,setSearch]=useState('');
  const[searchResult, setSearchResult] = useState([]);
  const navigate= useNavigate();
  const {width}=useWindowSize();
const{data,fetchError,isLoading}=useAxiosFetch("http://localhost:3500/posts")

const handleEditPosts=()=>{
  console.log("#######");
  console.log("##########",posts);
}
useEffect(()=>{
 const loadPosts=()=>{ setPosts(data);}
 loadPosts();
},[data,handleEditPosts])

   useEffect(()=>{
   if(!posts){
      console.log("POST Not Exists");
    }else{
      const filteredResults=posts.filter(post=>((post.body).toString().toLowerCase()).includes(searchResult.toString().toLowerCase())||
      ((post.title).toString().toLowerCase()).includes(search.toString().toLowerCase()));
      setSearchResult(filteredResults.reverse());
    }
   },[posts, search]);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const id= posts.length ? Number(posts[posts.length-1].id) + 1 : 1;
    console.log(" ID ",id);
    const dateTime= format(new Date(),'MMMM dd,yyyy pp');
    const newPost={id, title: postTitle,dateTime,body:postBody}
    try{
      const response= await api.post('/posts',newPost);
      setPosts([...posts,response.data]);
      setPostBody('');
      setPostTitle('');
      navigate("/")
    } catch(err){
      if(err.response){
        console.log(err.response.status);
        console.log(err.response.headers);
      }else{
        console.log(`Error ${err.message}`);
      }
    }
   
  }

  const handleEdit=async(id)=>{
    console.log("edit ",id);
    const dateTime= format(new Date(),'MMMM dd,yyyy pp');
    const updatedPost={id, title: editTitle,dateTime,body:editBody}

   try{
      const response=(await api.put(`/posts/${id}`),updatedPost); 
      setPosts(posts.map(post=>post.id===id? {...response.data}:post));  
      setEditBody("");
      setEditTitle("");
      navigate("/")
    }catch(err){
      if(err.response){console.log(err.response.status);
      console.log(err.response.headers);
    }else{
      console.log(`Error ${err.message}`);
    }
  }
  }
  const handleDelete=async(id)=>{
    console.log(" id ",id);
    try{
      await api.delete(`/posts/${id}`)
      const filteredArray=posts.filter(post=> (post.id).toString()!==id.toString());
      setPosts(filteredArray); 
    navigate("/")
    }
    catch(err){
      if(err.response){
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.message);
      }else{
        console.log(`Error ${err.message}`);
      }
    
  }
}
return <DataContext.Provider 
value={{fetchError,width,search,setSearch,handleSubmit,postTitle,setPostTitle,
postBody,isLoading, setPostBody, posts,handleDelete,handleEdit,editTitle,setEditTitle,setEditBody,editBody,searchResult,handleEditPosts}}>
{children}
</DataContext.Provider>
}