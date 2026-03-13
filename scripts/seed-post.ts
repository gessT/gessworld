import "dotenv/config";
import { db } from '@/db';
import { posts } from '@/db/schema';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const POSTS_DIR = join(__dirname, 'posts');

interface PostData {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  cover_photo_url?: string;
  tags?: string[];
  content: string;
  visibility?: 'public' | 'private';
}

interface PostFile {
  NEW_POST: PostData;
}

async function seedPosts() {
  console.log('Seeding posts...');
  const files = await readdir(POSTS_DIR);
  const postFiles = files.filter((file) => file.endsWith('.json'));

  for (const file of postFiles) {
    const filePath = join(POSTS_DIR, file);
    const raw = await readFile(filePath, 'utf-8');
    // Support files with or without the outer {} wrapper
    const trimmed = raw.trim();
    const jsonStr = trimmed.startsWith('{') ? trimmed : `{${trimmed}}`;
    const json: PostFile = JSON.parse(jsonStr);
    const post = json.NEW_POST;

    const coverImage = post.coverImage ?? post.cover_photo_url;

    console.log(`Inserting post: "${post.title}" (slug: ${post.slug})`);

    await db
      .insert(posts)
      .values({
        title: post.title,
        slug: post.slug,
        description: post.description,
        coverImage,
        tags: post.tags,
        content: post.content,
        visibility: post.visibility ?? 'public',
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          title: post.title,
          description: post.description,
          coverImage,
          tags: post.tags,
          content: post.content,
          visibility: post.visibility ?? 'public',
        },
      });
  }

  console.log('✅ Posts seeded successfully!');
  process.exit(0);
}

seedPosts().catch((err) => {
  console.error('❌ Error seeding posts:', err);
  process.exit(1);
});
