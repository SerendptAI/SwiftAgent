import type { SchemaTypeDefinition } from "sanity";

const blockContent: SchemaTypeDefinition = {
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) => rule.required(),
              },
            ],
          },
        ],
      },
    },
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Describe the image for screen readers and search.",
          validation: (rule) => rule.required(),
        },
      ],
    },
  ],
};

const post: SchemaTypeDefinition = {
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(120),
    },
    {
      name: "slug",
      type: "slug",
      description: "The URL segment. Generate it from the title.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    },
    {
      name: "excerpt",
      type: "text",
      rows: 3,
      description:
        "Shown on the blog index and used as the search and social description. Around 160 characters reads best.",
      validation: (rule) => rule.required().max(300),
    },
    {
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required(),
        },
      ],
    },
    {
      name: "authorName",
      type: "string",
      title: "Author",
      validation: (rule) => rule.required(),
    },
    {
      name: "authorRole",
      type: "string",
      title: "Author role",
      description: "Optional, e.g. “Head of Support”.",
    },
    {
      name: "publishedAt",
      type: "datetime",
      title: "Published at",
      description:
        "Posts dated in the future stay hidden until that moment passes.",
      validation: (rule) => rule.required(),
    },
    {
      name: "body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    },
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "authorName", media: "coverImage" },
  },
};

export const schemaTypes: SchemaTypeDefinition[] = [post, blockContent];
