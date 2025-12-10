import type { Metadata } from "next";
import { SITE, SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: SEO.privacy.title,
  description: SEO.privacy.description,
  alternates: {
    canonical: `${SITE.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">
          Last updated: December 10, 2025
        </p>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            Information We Collect
          </h2>
          <p>
            {SITE.name} collects information to provide better services to our
            users. This includes information you provide directly (such as
            favorite teams and preferences stored locally in your browser) and
            information collected automatically (such as usage data and
            analytics).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            How We Use Your Information
          </h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services. This includes displaying live football scores,
            fixtures, standings, and statistics. Your favorite teams and matches
            are stored locally on your device and are not transmitted to our
            servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            Cookies and Tracking
          </h2>
          <p>
            We use cookies and similar technologies to remember your
            preferences, understand how you use our services, and improve your
            experience. You can control cookie settings through your browser
            preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            Third-Party Services
          </h2>
          <p>
            We may use third-party services that collect information used to
            identify you. These services include analytics providers and content
            delivery networks. Each of these services has their own privacy
            policies governing their use of your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your
            information. However, no method of transmission over the internet or
            electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            through our website.
          </p>
        </section>
      </div>
    </main>
  );
}
