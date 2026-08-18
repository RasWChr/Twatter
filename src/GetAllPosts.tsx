import {useEffect, useState} from "react";
import { CreatePostForm } from "./CreatePostForm.tsx";
import {useLocation, useNavigate} from "react-router";
import type {Root, Post} from "./Interface";

export function GetAllPosts() {

    const [posts, setPosts] = useState<Root[]>([])

    useEffect(() => {
        fetch('https://dummyjson.com/posts')
            .then(res => res.json())
            .then((json) => {
                setPosts(json.posts)
            });
    }, []);

    function removePost(id: number) {
        const duplicate = [...posts];
        const filteredArray = duplicate.filter(p => p.id != id)
        setPosts(filteredArray)
    }

    function addPost(post: Post) {
        setPosts(prev => [post, ...prev])
    }

    return <div>
            <CreatePostForm onCreate={addPost} />
        {
            posts.map(p => {
                // @ts-ignore
              return <MyChildComponent key={p.id} post={p} removePost={removePost}/>
            })
        }
    </div>;
}

interface MyChildComponentPosts {
    post: Post;

}

// @ts-ignore
function MyChildComponent({post, removePost}: MyChildComponentPosts) {

    const navigate = useNavigate()

    return <>
      <div style={{padding: '5px'}}> <a onClick={() => {
          navigate('/GetSinglePost/'+post.id)
      }}>{post?.title} </a></div>
      <div> {post?.body}</div>
        <div> <button onClick={() => removePost(post.id)}>Delete</button></div>
    </>
}
