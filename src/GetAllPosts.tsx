import {useEffect, useState} from "react";

export function GetAllPosts() {

    const [posts, setPosts] = useState<Root[]>([])

    useEffect(() => {
        fetch('https://dummyjson.com/posts')
            .then(res => res.json())
            .then((json) => {
                setPosts(json.posts)
            });
    }, []);

    return <div>
        {
            posts.map(p => {
                // @ts-ignore
              return <MyChildComponent key={p.id} post={p}/>
            })
        }
    </div>;
}

interface MyChildComponentProps {
    post: Post,

}

function MyChildComponent({post}: MyChildComponentProps) {

    return <>
      <div style={{padding: '5px'}}>{post?.title} </div>
      <div> {post?.body}</div>
    </>
}

export interface Root {
    posts: Post[]
    total: number
    skip: number
    limit: number
}

export interface Post {
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
