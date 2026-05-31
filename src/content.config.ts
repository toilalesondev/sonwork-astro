import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    series: z.string().optional(),
    tags: z.array(z.string()).default([]),
    readTime: z.string().default('3 min'),
    draft: z.boolean().default(false),
    emoji: z.string().default('📝'),
  }),
});

export const collections = { posts };
