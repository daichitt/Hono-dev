import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()
app.use(prettyJSON()) // With options: prettyJSON({ space: 4 })

// Define a simple blogPost
let blogPost = [
  { id: 1, title: 'First Post', content: 'This is my first post' },
  { id: 2, title: 'Second Post', content: 'This is my second post' },
]

app.get('/', (c) => c.text('Hello Hono!'))
// get post by ID
app.get('/posts/:id', (c) => {
  const id = Number(c.req.param('id'));
  const post = blogPost.find((p) => p.id === id);
  if(post) {
    return c.json({ post });
  } else {
    return c.json({ message: 'Post not found' }, 404);
  }
})


// get all posts
app.get('/posts', (c) => {
  return c.json({ blogPost });
});

// create a new post
app.post('/posts', async (c) => {
  const { title, content } = await c.req.json<{
    title: string; content: string 
  }>();
  const newPost = { id: Number(blogPost.length + 1), title, content };
  blogPost = [...blogPost, newPost]
  return c.json({ message: 'Post created', newPost});
});

// edit post by ID
app.put('/posts/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const index = blogPost.findIndex((p) => p.id === id);
  if (index === - 1)  {
    return c.json({ message: 'Post not found' }, 404);
  }
  const { title, content } = await c.req.json();
  blogPost[index] = {...blogPost[index], title, content};
  return c.json(blogPost[index]);
});

// delete post by ID
app.delete('/posts/:id', (c) => {
  const id = Number(c.req.param('id'));
  const index = blogPost.findIndex((p) => p.id === id);
  if (index === -1) {
    return c.json({ message: 'Post not found' }, 404);
  }
  blogPost = blogPost.filter((p) => p.id !== id);
  return c.json({ message: 'Post deleted', blogPost: blogPost});
});

export default app
