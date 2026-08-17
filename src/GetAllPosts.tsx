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
                return <MyChildComponent key={p.id} post={p}/>
            })
        }
    </div>;
}

interface MyChildComponentProps {
    post: Post,

}

function MyChildComponent({post, removeProduct}: MyChildComponentProps) {

    return <div>{post?.title} </div>
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
