"use client"

import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES, Document } from "@contentful/rich-text-types"
import Image from "next/image"
import Link from "next/link"

interface RichTextProps {
  content: Document
  className?: string
}

const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mb-4 last:mb-0">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-2xl font-bold mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-xl font-semibold mb-2">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className="text-lg font-semibold mb-2">{children}</h4>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li>{children}</li>
    ),
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-6 border-border" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title, description } = node.data.target.fields
      const url = file?.url
      const alt = description || title || "Image"

      if (!url) return null

      return (
        <div className="my-4">
          <Image
            src={`https:${url}`}
            alt={alt}
            width={800}
            height={400}
            className="rounded-lg"
          />
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      )
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <Link
        href={node.data.uri}
        className="text-primary underline hover:no-underline"
        target={node.data.uri.startsWith("http") ? "_blank" : undefined}
        rel={node.data.uri.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    ),
  },
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null

  return (
    <div className={className}>
      {documentToReactComponents(content, options)}
    </div>
  )
}
