"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FaqItem {
  question: string
  answer: string
}

// Static FAQ data for homepage
const faqs: FaqItem[] = [
  {
    question: "What is Soccer Offices?",
    answer: "Soccer Offices is your comprehensive platform for live football scores, fixtures, team statistics, and player information. We cover leagues and competitions from around the world, providing real-time updates and detailed match analysis."
  },
  {
    question: "How often are live scores updated?",
    answer: "Our live scores are updated in real-time, typically within seconds of events occurring on the pitch. We use reliable data sources to ensure you never miss a goal, card, or substitution."
  },
  {
    question: "Which leagues and competitions do you cover?",
    answer: "We cover over 1,000 leagues and competitions worldwide, including the Premier League, La Liga, Bundesliga, Serie A, Ligue 1, UEFA Champions League, Europa League, and many more domestic and international tournaments."
  },
  {
    question: "Can I save my favorite teams and matches?",
    answer: "Yes! You can add any team or match to your favorites by clicking the star icon. Your favorites will appear at the top of the homepage for quick access, and you can manage them from the Favorites page."
  },
  {
    question: "How do I find information about a specific player?",
    answer: "Use the search function in the header or navigate to the Players page. You can search by player name to find detailed profiles including career statistics, current team, position, and recent performance data."
  },
  {
    question: "What does the match timeline show?",
    answer: "The match timeline displays all key events during a game in chronological order, including goals, assists, yellow and red cards, substitutions, VAR decisions, and penalty shootouts when applicable."
  },
  {
    question: "Are match odds available on the platform?",
    answer: "Yes, we display pre-match odds from various bookmakers for select fixtures. These odds are for informational purposes only and help you understand market expectations for upcoming matches."
  },
  {
    question: "How can I view past match results?",
    answer: "Use the date picker on the homepage to navigate to previous dates and view completed match results. You can also visit individual team pages to see their recent form and match history."
  },
  {
    question: "Is Soccer Offices available as a mobile app?",
    answer: "Currently, Soccer Offices is a web-based platform optimized for both desktop and mobile browsers. You can add it to your home screen for an app-like experience. Native mobile apps are planned for future release."
  },
  {
    question: "How do I report an issue or provide feedback?",
    answer: "We value your feedback! You can report issues or share suggestions through our contact form. We're constantly working to improve the platform based on user input and appreciate your help in making Soccer Offices better."
  }
]

interface FaqSectionProps {
  title?: string
}

export function FaqSection({ title = "Frequently Asked Questions" }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                  "hover:bg-muted/50",
                  isOpen && "bg-muted/30"
                )}
              >
                <span className="font-medium text-sm pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-200 ease-in-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
