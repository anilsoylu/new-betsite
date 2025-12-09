import type { Document } from "@contentful/rich-text-types"
import type { EntryFieldTypes, EntrySkeletonType } from "contentful"

// HomePage content type skeleton
export interface HomePageSkeleton extends EntrySkeletonType {
  contentTypeId: "homepage"
  fields: {
    content?: EntryFieldTypes.RichText
  }
}

// HomePage entry with resolved fields
export interface HomePageFields {
  content?: Document
}

export interface HomePageEntry {
  sys: { id: string }
  fields: HomePageFields
}
