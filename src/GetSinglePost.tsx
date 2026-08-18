import {useEffect, useState} from "react";
import {Outlet, useParams} from "react-router";
import type {Root, Post} from "./Interface.tsx"


export function GetSinglePost() {

    const [post, setPost] = useState<Post>();

    const params = useParams()

    useEffect(() => {
        fetch('https://dummyjson.com/posts/'+params.id)
            .then(res => res.json())
            .then((json: Post) => {
                setPost(json);
            });
    }, []);


    return (
        <div>
            {post && <MyChildComponent post={post} />}
        </div>
    );
}


interface MyChildComponentPost {
    post: Post
}


function MyChildComponent({post}: MyChildComponentPost) {

    return <>
        <div style={{padding: '5px'}}>{post?.title} </div>
    <div style={{padding: '10px'}}> {post?.body}</div>
        <div> {post?.tags}</div>

    </>
}


