/**
 * JSON-LD Script Component for Structured Data
 *
 * This component safely renders JSON-LD structured data for SEO purposes.
 * The schema data is generated server-side from trusted API responses,
 * not from user input, so XSS is not a concern here.
 *
 * This is the standard Next.js pattern for embedding JSON-LD.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
 */

interface JsonLdScriptProps {
  id: string;
  schema: Record<string, unknown>;
}

export function JsonLdScript({ id, schema }: JsonLdScriptProps) {
  // JSON.stringify safely escapes the content for embedding in HTML
  const jsonLdString = JSON.stringify(schema);

  return (
    <script
      id={id}
      type="application/ld+json"
      // Safe: schema is generated from trusted server-side data, not user input
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
