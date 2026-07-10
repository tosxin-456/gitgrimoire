import type { Metadata } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import { GitHubStarLink } from "@/components/layout/GitHubStarLink";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const title = "GitGrimoire — Every developer deserves a Grimoire";
const description =
  "Type your GitHub username and receive a Grimoire forged from your real contributions. Discover your Magic Attribute, Rank, and Squad.";

export const metadata: Metadata = {
  metadataBase: new URL("https://gitgrimoire.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://gitgrimoire.vercel.app",
    siteName: "GitGrimoire",
    type: "website",
    images: [
      {
        url: "/git_logo.jpg",
        width: 735,
        height: 386,
        alt: "GitGrimoire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/git_logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="arcane-backdrop min-h-full flex flex-col">
        <GitHubStarLink />
        {children}
      </body>
    </html>
  );
}
