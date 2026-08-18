import {useEffect, useState} from "react";


export function GetSinglePost() {

    const [post, setPost] = useState<Root | null>(null);

    useEffect(() => {
        fetch('https://dummyjson.com/posts/1')
            .then(res => res.json())
            .then((json: Root) => {
                setPost(json);
            });
    }, []);

    function removePost() {
        setPost(null);
    }


    return (
        <div>
            {post && <MyChildComponent post={post} removePost={removePost} />}
        </div>
    );
}


interface MyChildComponentPost {
    post: Root,
    removePost: () => void
}


function MyChildComponent({post, removePost}: MyChildComponentPost) {

    return <>
        <div style={{padding: '5px'}}>{post?.title} </div>
    <div style={{padding: '10px'}}> {post?.body}</div>
        <div> {post?.tags}</div>

    </>
}


export interface Root {
    id: number
    title: string
    body: string
    tags: string[]
    reactions: Reactions
    views: number
    userId: number
}

export interface Reactions {
    likes: number
    dislikes: number
}