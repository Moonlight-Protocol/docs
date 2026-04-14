import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Moonlight",
  description:
    "Documentation for the Moonlight protocol — a privacy layer built on Stellar",

  head: [["link", { rel: "icon", href: "/favicon.ico" }]],

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "Protocol", link: "/protocol/" },
      { text: "SDK", link: "/sdk/" },
      { text: "Getting Started", link: "/getting-started/quickstart" },
    ],

    sidebar: [
      {
        text: "Whitepaper",
        collapsed: false,
        items: [
          { text: "Introduction", link: "/readme/whitepaper/" },
          {
            text: "The Privacy Challenge",
            link: "/readme/whitepaper/the-privacy-challenge-on-public-dlts",
          },
          {
            text: "Architecture",
            link: "/readme/whitepaper/architecture/",
            items: [
              {
                text: "On-chain Privacy Channel",
                link: "/readme/whitepaper/architecture/on-chain-privacy-channel",
              },
              {
                text: "Trusted Privacy Providers",
                link: "/readme/whitepaper/architecture/trusted-privacy-providers",
              },
              {
                text: "Client Layer",
                link: "/readme/whitepaper/architecture/client-layer",
              },
            ],
          },
        ],
      },
      {
        text: "Protocol",
        collapsed: false,
        items: [
          { text: "Overview", link: "/protocol/" },
          { text: "Accounts and Keys", link: "/protocol/accounts" },
          {
            text: "Deposit and Withdrawal Flows",
            link: "/protocol/flows",
          },
        ],
      },
      {
        text: "Privacy Providers",
        collapsed: false,
        items: [
          { text: "Overview", link: "/privacy-providers/" },
          {
            text: "What is a Privacy Provider?",
            link: "/privacy-providers/what-is-a-privacy-provider",
          },
          { text: "Requirements", link: "/privacy-providers/requirements" },
          {
            text: "Operating a Provider",
            link: "/privacy-providers/operating-a-provider",
          },
          { text: "Mempool", link: "/privacy-providers/mempool" },
          {
            text: "Provider Console",
            link: "/privacy-providers/provider-console",
          },
          {
            text: "Compliance and Audit",
            link: "/privacy-providers/compliance-and-audit",
          },
          {
            text: "Entropy and Privacy",
            link: "/privacy-providers/entropy-and-privacy",
          },
        ],
      },
      {
        text: "Councils",
        collapsed: false,
        items: [
          { text: "Overview", link: "/councils/" },
          {
            text: "What is a Council?",
            link: "/councils/what-is-a-council",
          },
          { text: "Channels", link: "/councils/channels" },
          { text: "Governance", link: "/councils/governance" },
        ],
      },
      {
        text: "SDK",
        collapsed: false,
        items: [
          { text: "Overview", link: "/sdk/" },
          { text: "Getting Started", link: "/sdk/getting-started" },
          { text: "Core Concepts", link: "/sdk/core-concepts" },
          { text: "API Reference", link: "/sdk/api-reference" },
          { text: "Integration Guide", link: "/sdk/integration-guide" },
        ],
      },
      {
        text: "Getting Started",
        items: [
          {
            text: "Quickstart",
            link: "/getting-started/quickstart",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/Moonlight-Protocol" },
    ],

    search: {
      provider: "local",
    },
  },
});
