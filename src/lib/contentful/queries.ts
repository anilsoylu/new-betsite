import { getContentfulClient } from "./client";
import type { HomePageEntry, HomePageSkeleton, HomePageFields } from "./types";

/**
 * Get HomePage content
 */
export async function getHomePage(
  preview = false,
): Promise<HomePageEntry | null> {
  const client = getContentfulClient(preview);

  try {
    const response = await client.getEntries<HomePageSkeleton>({
      content_type: "homepage",
      limit: 1,
    });

    if (response.items.length === 0) return null;

    const item = response.items[0];
    return {
      sys: { id: item.sys.id },
      fields: item.fields as unknown as HomePageFields,
    };
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return null;
  }
}
