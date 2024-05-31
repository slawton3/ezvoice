import type { FooterItem, MainNavItem } from "@/types"

export type SiteConfig = typeof siteConfig

const links = {
  x: "https://twitter.com/snlwtn",
  github: "https://github.com/slawton3/ezvoice",
  githubAccount: "https://github.com/slawton3",
  calDotCom: "https://cal.com/seanlawton",
}

export const siteConfig = {
  name: "ezVoice",
  title: "ezVoice - ClickUp and Quickbooks Integration",
  description:
    "ezVoice is a ClickUp and Quickbooks integration that automates your workflows and saves you time.",
  url: "https://ezvoice.io",
  ogImage: "https://ezvoice.io/opengraph-image.png",
  links,
  mainNav: [
    {
      title: "Home",
      items: [
        {
          title: "Technology",
          href: "/tech",
          description: "All the tech used in ezVoice.",
          items: [],
        },
        {
          title: "Demo (Coming soon)",
          href: "/#",
          description: "Check out the demo.",
          items: [],
        },
        {
          title: "Blog (Coming soon)",
          href: "/#",
          description: "Read our latest blog posts.",
          items: [],
        },
      ],
    },
  ] satisfies MainNavItem[],
  footerNav: [
    {
      title: "Getting started",
      items: [
        {
          title: "Getting started",
          href: "#",
          external: false,
        },
        {
          title: "FAQ",
          href: "#",
          external: false,
        },
        {
          title: "Blog",
          href: "/blog",
          external: false,
        },
      ],
    },
    {
      title: "Company",
      items: [
        {
          title: "Meet us",
          href: "/about",
          external: false,
        },
        {
          title: "Contact us",
          href: "/contact",
          external: false,
        },
        {
          title: "Terms of service",
          href: "/terms",
          external: false,
        },
        {
          title: "Privacy",
          href: "/privacy",
          external: false,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "X (Twitter)",
          href: links.x,
          external: true,
        },
        {
          title: "GitHub",
          href: links.githubAccount,
          external: true,
        },
        {
          title: "cal.com",
          href: links.calDotCom,
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
}
