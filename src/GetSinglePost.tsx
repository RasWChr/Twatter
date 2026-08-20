import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import type {Post, Comment} from "./Interface.tsx"
import {COLORS} from "./Colours.tsx"

type ReactionKey = 'likes' | 'dislikes'

export function GetSinglePost() {

    const [post, setPost] = useState<Post>();
    const [comment, setComment] = useState<Comment[]>([]);
    const [myReaction, setMyReaction] = useState<ReactionKey | null>(null);

    const params = useParams()

    useEffect(() => {
        fetch('https://dummyjson.com/posts/' + params.id)
            .then(res => res.json())
            .then((json: Post) => {
                setPost(json);
            });
    }, [params.id]);

    useEffect(() => {
        fetch('https://dummyjson.com/posts/' + params.id + '/comments')
            .then(res => res.json())
            .then((json) => {
                setComment(json.comments);
            });
    }, [params.id]);

    function react(key: ReactionKey) {
        const next = myReaction === key ? null : key

        setPost(prev => {
            if (!prev) return prev
            const reactions = { ...prev.reactions }
            if (myReaction) reactions[myReaction] = Math.max(0, reactions[myReaction] - 1)
            if (next) reactions[next] = reactions[next] + 1
            return { ...prev, reactions }
        })

        setMyReaction(next)
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
            minHeight: '100vh',
            background: '#1d234a',
        }}>
            <div style={{
                position: 'sticky',
                top: 0,
                background: 'rgb(29 35 74)',
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${COLORS.border}`,
                padding: '12px 16px',
                zIndex: 10,
            }}>
                <BackButton />
                <h2 style={{margin: 0, fontSize: '20px', fontWeight: 800}}>Post</h2>
            </div>

            {post && <MyChildComponent post={post} comment={comment} react={react} myReaction={myReaction} />}
        </div>
    );
}

function BackButton() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '6px',
                marginBottom: '8px',
                borderRadius: '50%',
                color: COLORS.text,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#161a37')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
            ←
        </button>
    );
}

interface MyChildComponentPost {
    post: Post,
    comment?: Comment[]
    react: (key: ReactionKey) => void
    myReaction: ReactionKey | null
}

function MyChildComponent({post, comment, react, myReaction}: MyChildComponentPost) {

    const avatarHue = (post.id * 47) % 360;

    return (
        <>
            <div style={{
                display: 'flex',
                gap: '12px',
                padding: '16px',
                borderBottom: `1px solid ${COLORS.border}`,
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `hsl(${avatarHue}, 65%, 55%)`,
                    flexShrink: 0,
                }} />

                <div style={{flex: 1, minWidth: 0}}>
                    <div style={{display: 'flex', alignItems: 'baseline', gap: '4px'}}>
                        <span style={{fontWeight: 700, fontSize: '15px'}}>User {post.userId}</span>
                        <span style={{color: COLORS.subtext, fontSize: '15px'}}>@user{post.userId}</span>
                    </div>

                    <div style={{fontWeight: 600, fontSize: '17px', margin: '4px 0'}}>
                        {post.title}
                    </div>
                    <div style={{fontSize: '15px', lineHeight: 1.5}}>
                        {post.body}
                    </div>

                    <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                    }}>
                        {post.tags?.map(tag => (
                            <span key={tag} style={{color: COLORS.accent, fontSize: '14px'}}>
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        marginTop: '14px',
                        color: COLORS.subtext,
                        fontSize: '13px',
                    }}>
                        <span>👁 {post.views} views</span>
                        <ReactionButton
                            label="♥"
                            count={post.reactions?.likes ?? 0}
                            activeColor={COLORS.danger}
                            active={myReaction === 'likes'}
                            onClick={() => react('likes')}
                        />
                        <ReactionButton
                            label="👎"
                            count={post.reactions?.dislikes ?? 0}
                            activeColor={COLORS.accent}
                            active={myReaction === 'dislikes'}
                            onClick={() => react('dislikes')}
                        />
                    </div>
                </div>
            </div>

            <div>
                {comment?.map(c => (
                    <div key={c.id} style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        borderBottom: `1px solid ${COLORS.border}`,
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: `hsl(${(c.id * 47) % 360}, 65%, 55%)`,
                            flexShrink: 0,
                        }} />
                        <div style={{flex: 1, minWidth: 0}}>
                            <div style={{fontWeight: 700, fontSize: '14px'}}>
                                @{c.user?.username}
                            </div>
                            <div style={{fontSize: '14px', lineHeight: 1.4, marginTop: '2px'}}>
                                {c.body}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function ReactionButton({label, count, activeColor, active, onClick}: {
    label: string;
    count: number;
    activeColor: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: active ? activeColor : COLORS.subtext,
                fontWeight: active ? 700 : 400,
                cursor: 'pointer',
                fontSize: '13px',
                padding: 0,
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = activeColor }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = COLORS.subtext }}
        >
            {label} {count}
        </button>
    );
}