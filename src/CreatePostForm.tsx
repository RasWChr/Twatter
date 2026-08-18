import { useState, type FormEvent } from "react";
import type { Post } from "./GetAllPosts.tsx";

interface CreatePostFormProps {
    onCreate: (post: Post) => void;
}

let nextTempId = -1; // see note below on why this isn't `created.id`

export function CreatePostForm({ onCreate }: CreatePostFormProps) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch("https://dummyjson.com/posts/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body, userId: 5 }),
            });
            const created = await res.json();

            const newPost: Post = {
                id: nextTempId--,
                title: created.title,
                body: created.body,
                tags: created.tags ?? [],
                reactions: created.reactions ?? { likes: 0, dislikes: 0 },
                views: created.views ?? 0,
                userId: created.userId,
            };

            onCreate(newPost);
            setTitle("");
            setBody("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ padding: 5 }}>
            <div>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            </div>
            <div>
        <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
        />
            </div>
            <button type="submit" disabled={submitting}>
                {submitting ? "Posting…" : "Post"}
            </button>
        </form>
    );
}