import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/db';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateBlogPost(productId: string): Promise<void> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.error(`generateBlogPost: Product not found — ${productId}`);
      return;
    }

    const systemPrompt = `You are an expert tech blogger and SEO specialist. You write engaging, well-structured, ~1500-word articles in Markdown. You always reply with valid JSON and nothing else.`;

    const userPrompt = `Write a ~1500-word SEO-friendly blog article about the following product launch:

Product Name: ${product.name}
Tagline: ${product.tagline}
Description: ${product.description}
Website: ${product.websiteUrl}

Requirements:
- A natural, engaging introduction (no "Introduction" heading).
- 3 to 4 sections with ## headings, covering features, use cases, and benefits.
- Include 3 to 4 inline contextual Markdown links to ${product.websiteUrl} woven naturally into the text (not all in one place). These links should use rel="dofollow".
- End with a short conclusion paragraph encouraging readers to visit the site.
- Do NOT include an H1 title in the content — that will be displayed separately.

Return ONLY valid JSON in this exact shape:
{
  "title": "A catchy, SEO-friendly blog post title (under 70 characters)",
  "content": "The full Markdown content of the article (no H1)"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

    // Strip optional markdown code fences
    const jsonStr = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    let data: { title?: string; content?: string };
    try {
      data = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('generateBlogPost: Failed to parse Claude response:', parseErr, rawText.substring(0, 200));
      return;
    }

    if (!data.title || !data.content) {
      console.error('generateBlogPost: Unexpected JSON shape from Claude', data);
      return;
    }

    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    await prisma.blogPost.create({
      data: {
        title: data.title,
        content: data.content,
        slug: uniqueSlug,
        productId: product.id,
      },
    });

    console.log(`generateBlogPost: Published blog post "${data.title}" for product ${product.name}`);
  } catch (error) {
    console.error('generateBlogPost: Error:', error);
  }
}
