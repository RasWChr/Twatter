import {useEffect, useState} from "react";
import { CreatePostForm } from "./CreatePostForm.tsx";
import {useNavigate} from "react-router";
import type {Post} from "./Interface";
import {COLORS} from "./colours"

export function GetAllPosts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [query, setQuery] = useState("")

    useEffect(() => {
        const url = query.trim()
            ? `https://dummyjson.com/posts/search?q=${encodeURIComponent(query.trim())}`
            : 'https://dummyjson.com/posts'

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

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            border: `1px solid ${COLORS.border}`,
            borderTop: 'none',
            borderBottom: 'none',
            fontFamily: '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            color: COLORS.text,
        }}>
            {/* Sticky header */}
            <div style={{
                position: 'sticky',
                top: 0,
                background: 'rgb(29 35 74)',
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${COLORS.border}`,
                padding: '12px 16px',
                zIndex: 10,
            }}>
                <h2 style={{margin: '0 0 12px 0', fontSize: '20px', fontWeight: 800}}>Home</h2>
                <CreatePostForm onCreate={addPost} />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts"
                    style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 16px',
                        marginTop: '10px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: '#eff3f4',
                        fontSize: '15px',
                        outline: 'none',
                    }}
                />
            </div>

            {posts.map(p => (
                <MyChildComponent key={p.id} post={p} removePost={removePost} />
            ))}
        </div>
    );
}

interface MyChildComponentPosts {
    post: Post;
    removePost: (id: number) => void;
}

function MyChildComponent({post, removePost}: MyChildComponentPosts) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    // deterministic-ish placeholder avatar color per post
    const avatarHue = (post.id * 47) % 360;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: `1px solid ${COLORS.border}`,
                background: hovered ? '#161b39' : COLORS.bg,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
            }}
            onClick={() => navigate('/GetSinglePost/' + post.id)}
        >
            {/* Avatar */}
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `hsl(${avatarHue}, 65%, 55%)`,
                flexShrink: 0,
            }} />

            {/* Content */}
            <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '4px'}}>
                    <span style={{fontWeight: 700, fontSize: '15px'}}>User {post.userId}</span>
                    <span style={{color: COLORS.subtext, fontSize: '15px'}}>
                        @user{post.userId} · {post.id}h
                    </span>
                </div>

                <div style={{
                    fontWeight: 600,
                    fontSize: '15px',
                    margin: '2px 0',
                }}>
                    {post.title}
                </div>
                <div style={{fontSize: '15px', lineHeight: 1.4, color: COLORS.text}}>
                    {post.body}
                </div>

                {/* Action row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '320px',
                    marginTop: '12px',
                    color: COLORS.subtext,
                    fontSize: '13px',
                }}>
                    <ActionIcon label="💬" count={post.reactions?.likes ?? 0} />
                    <ActionIcon label="🔁" count={0} />
                    <ActionIcon label="♥" count={post.reactions?.likes ?? 0} />
                    <ActionIcon label="👁" count={post.views} />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removePost(post.id);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: COLORS.subtext,
                            cursor: 'pointer',
                            fontSize: '13px',
                            padding: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.danger)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.subtext)}
                    >
                        🗑
                    </button>
                </div>
            </div>
        </div>
    );
}

function ActionIcon({label, count}: {label: string; count: number}) {
    return (
        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            {label} {count}
        </span>
    );
}