import {useEffect, useState} from "react";
import { CreatePostForm } from "./CreatePostForm.tsx";
import {useNavigate} from "react-router";
import type {Post} from "./Interface";

export function GetAllPosts() {

    const [posts, setPosts] = useState<Post[]>([])
    const [query, setQuery] = useState("")

    useEffect(() => {
        const url = query.trim()
            ? `https://dummyjson.com/posts/search?q=${encodeURIComponent(query.trim())}`
            : 'https://dummyjson.com/posts'

        // wait for typing to pause before hitting the API, instead of firing on every keystroke
        const timeoutId = setTimeout(() => {
            fetch(url)
                .then(res => res.json())
                .then((json) => {
                    setPosts(json.posts)
                });
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query]);

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
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                style={{padding: '5px', margin: '5px 0'}}
            />
        {
            posts.map(p => {
              return <MyChildComponent key={p.id} post={p} removePost={removePost}/>
            })
        }
    </div>;
}

interface MyChildComponentPosts {
    post: Post;
}

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