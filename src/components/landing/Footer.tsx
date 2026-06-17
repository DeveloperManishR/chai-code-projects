import { Zap } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = [
  {
    label: "Product",
    links: [
      { name: "Capabilities", href: "#capabilities" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "FAQ", href: "#faq" },
    ],
  },
  {
    label: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Refunds", href: "/refunds" },
    ],
  },
  {
    label: "Company",
    links: [
      { name: "Changelog", href: "/changelog" },
      { name: "Contact", href: "mailto:hello@swiftmail.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-sm">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">SwiftMail</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              AI-powered email intelligence for your Gmail inbox.
            </p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.label}>
              <h4 className="mb-3 text-sm font-medium">{group.label}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SwiftMail. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
