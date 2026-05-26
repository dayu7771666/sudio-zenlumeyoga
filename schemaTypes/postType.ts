import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & Meta'},
  ],
  fields: [
    // ── Core Content ──────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().min(10).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
      initialValue: 'Zenlume Studio',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Brand Building', value: 'brand-building'},
          {title: 'Fabric & Materials', value: 'fabric-materials'},
          {title: 'Production Guide', value: 'production-guide'},
          {title: 'Design Tips', value: 'design-tips'},
          {title: 'Industry Insights', value: 'industry-insights'},
          {title: 'Yoga Wear Knowledge Base', value: 'yoga-wear-knowledge'},
        ],
      },
    }),

    // ── Cover Image ───────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (for SEO & accessibility)',
          description:
            'Describe the image for search engines and screen readers. e.g. "Yoga leggings flat lay on marble surface"',
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text is required for SEO.'),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Body (Rich Text with Images) ──────────────────────────
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) =>
                      rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']}),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        // Inline image block with alt text, caption and size
        {
          type: 'image',
          title: 'Image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text (required for SEO)',
              description:
                'Describe what is shown in the image. Used by Google Image Search and screen readers.',
              type: 'string',
              validation: (rule) => rule.required().warning('Please add alt text for SEO.'),
            }),
            defineField({
              name: 'caption',
              title: 'Caption (shown below image)',
              type: 'string',
            }),
            defineField({
              name: 'size',
              title: 'Display Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Full Width', value: 'full'},
                  {title: 'Large (centered)', value: 'large'},
                  {title: 'Medium (centered)', value: 'medium'},
                ],
                layout: 'radio',
              },
              initialValue: 'full',
            }),
          ],
        },
      ],
    }),

    // ── SEO Fields ────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      description:
        'Overrides the post title in browser tab and Google results. 50–60 characters recommended. Leave blank to use the post title.',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      description:
        'Shown in Google search results. 120–160 characters recommended. Leave blank to auto-generate from article content.',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      description:
        'Comma-separated keywords for this article. e.g. "yoga leggings, custom activewear, private label yoga"',
      type: 'string',
      group: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'image',
      category: 'category',
    },
    prepare({title, author, media, category}) {
      return {
        title,
        subtitle: `${author ?? 'Unknown'} · ${category ?? 'Uncategorized'}`,
        media,
      }
    },
  },
})
