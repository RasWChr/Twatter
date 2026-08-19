import {useEffect, useState} from "react";
import {Outlet, useParams} from "react-router";
import type {Root, Post, Comment} from "./Interface.tsx"


export function GetSinglePost() {

    const [post, setPost] = useState<Post>();

    const [comment, setComment] = useState<Comment[]>([]);

    const params = useParams()

    useEffect(() => {
        fetch('https://dummyjson.com/posts/' + params.id)
            .then(res => res.json())
            .then((json: Post) => {
                setPost(json);
            });
    }, []);

    useEffect(() => {
        fetch('https://dummyjson.com/posts/' + params.id + '/comments')
            .then(res => res.json())
            .then((json) => {
                setComment(json.comments);
            });
    }, []);


    return (
        <div>
            {post && <MyChildComponent post={post} comment={comment}/>}
        </div>
    );
}


interface MyChildComponentPost {
    post: Post,
    comment?: Comment[]
}


function MyChildComponent({post, comment}: MyChildComponentPost) {


    return <>
        <div style={{padding: '5px'}}>{post?.title} </div>
        <div style={{padding: '10px'}}> {post?.body} </div>
        <div> {post?.tags?.join(' ')} </div>
        <div> views {post?.views} Likes: {post?.reactions?.likes} / Dislikes: {post?.reactions?.dislikes} </div>
        <div style={{padding: '10px'}}>
            {comment?.map(c => (
                <div key={c.id}>
                    <div style={{fontWeight:'bold', padding: '5px'}} >{c.user?.username}</div>
                    <div>{c.body}</div>
                </div>))}
        </div>
    </>
}


