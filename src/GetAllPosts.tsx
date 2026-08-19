import {useEffect, useState} from "react";
import { CreatePostForm } from "./CreatePostForm.tsx";
import {useNavigate} from "react-router";
import type {Post} from "./Interface";

export function GetAllPosts() {

    const [apiPosts, setApiPosts] = useState<Post[]>([])
    const [createdPosts, setCreatedPosts] = useState<Post[]>([])
    const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set())
    const [query, setQuery] = useState("")

    useEffect(() => {
        const url = query.trim()
            ? `https://dummyjson.com/posts/search?q=${encodeURIComponent(query.trim())}`
            : 'https://dummyjson.com/posts'

        const timeoutId = setTimeout(() => {
            fetch(url)
                .then(res => res.json())
                .then((json) => {
                    setApiPosts(json.posts)
                });
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query]);

    function removePost(id: number) {
        if (id < 0) {
            // locally created post, never makes it to the server so just gets dropped.
            setCreatedPosts(prev => prev.filter(p => p.id !== id))
            return
        }
        // For posts from the API, ensures that they stay hidden through future fetches.
        setDeletedIds(prev => new Set(prev).add(id))
    }

    function addPost(post: Post) {
        setCreatedPosts(prev => [post, ...prev])
    }

    const q = query.trim().toLowerCase()
    const visibleCreated = createdPosts.filter(p =>
        !deletedIds.has(p.id) &&
        (!q || p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q))
    )
    const visibleApi = apiPosts.filter(p => !deletedIds.has(p.id))
    const posts = [...visibleCreated, ...visibleApi]

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