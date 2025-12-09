import { createClient } from "contentful"

if (!process.env.CONTENTFUL_SPACE_ID) {
  throw new Error("CONTENTFUL_SPACE_ID is not defined")
}

if (!process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN) {
  throw new Error("CONTENTFUL_DELIVERY_ACCESS_TOKEN is not defined")
}

// Delivery client (published content)
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
})

// Preview client (draft content) - optional
export const contentfulPreviewClient = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
  ? createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      host: "preview.contentful.com",
    })
  : null

// Get appropriate client based on preview mode
export function getContentfulClient(preview = false) {
  if (preview && contentfulPreviewClient) {
    return contentfulPreviewClient
  }
  return contentfulClient
}
