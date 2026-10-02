import type { ImageMetadata } from "astro";

import moonbeam1 from "../assets/recent-work/moonbeam/moonbeam_1.webp";
import moonbeam2 from "../assets/recent-work/moonbeam/moonbeam_2.webp";
import moonbeam3 from "../assets/recent-work/moonbeam/moonbeam_3.webp";
import moonbeamHero from "../assets/recent-work/moonbeam/moonbeam_hero.webp";
import tanssi1 from "../assets/recent-work/tanssi/tanssi_1.webp";
import tanssi2 from "../assets/recent-work/tanssi/tanssi_2.webp";
import tanssiHero from "../assets/recent-work/tanssi/tanssi_hero.webp";

export interface ContactLink {
  label: string;
  url: string;
}

export interface Header {
  name: string;
  title: string;
  location: string;
  workAuthorization?: string;
  links: ContactLink[];
}

export interface ExperienceRole {
  role: string;
  startDate: string;
  endDate: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  /** Role progression when several roles at one company are merged. */
  roles?: ExperienceRole[];
  highlights: string[];
  skills?: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  details?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
  variant?: "chips" | "list";
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface SectionNavLink {
  label: string;
  id: string;
}

export interface RecentWorkImage {
  src: ImageMetadata;
  alt: string;
}

export interface RecentWorkEntry {
  name: string;
  description: string;
  role: string;
  company: string;
  url?: string;
  hero: RecentWorkImage;
  gallery: RecentWorkImage[];
}

export interface ResumeSummaries {
  general: string;
  web3: string;
}

export type ResumeVariant = keyof ResumeSummaries;

export const RESUME_VARIANTS: ResumeVariant[] = ["general", "web3"];

export function isResumeVariant(value: string | null | undefined): value is ResumeVariant {
  return value === "general" || value === "web3";
}

export function parseResumeVariant(value: string | null | undefined): ResumeVariant {
  return isResumeVariant(value) ? value : "general";
}

export interface ResumePdfMeta {
  href: string;
  download: string;
  label: string;
}

export interface Resume {
  header: Header;
  summary: string;
  summaries: ResumeSummaries;
  experience: ExperienceEntry[];
  previousExperience?: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  certifications: Certification[];
  languages: Language[];
  recentWork: RecentWorkEntry[];
}

export const sectionNav: SectionNavLink[] = [
  { label: "Experience", id: "experience" },
  { label: "Earlier Roles", id: "earlier-roles" },
  { label: "Education", id: "education" },
  { label: "Skills", id: "skills" },
  { label: "Certifications", id: "certifications" },
  { label: "Recent Work", id: "recent-work" },
];

/** Static resume PDFs in /public — regenerate with `pnpm pdf` after content changes. */
export const resumePdfs: Record<ResumeVariant, ResumePdfMeta> = {
  general: {
    href: "/CV_MJM_full-stack.pdf",
    download: "Mario_Jose_Maurello_Resume.pdf",
    label: "Full-stack",
  },
  web3: {
    href: "/CV_MJM_web3.pdf",
    download: "Mario_Jose_Maurello_Resume_Web3.pdf",
    label: "Web3",
  },
};

export const summaries: ResumeSummaries = {
  general:
    "Full-Stack Engineer with 8+ years of end-to-end ownership shipping production web applications across React, TypeScript, PHP, and AWS. Comfortable working across the stack as a generalist: frontend, APIs, CI/CD, cloud infrastructure, and the product decisions that come with owning a feature from idea to production. Recent work includes client apps and developer SDKs with high reliability requirements in fast-paced product environments. Also experienced leading a cross-functional team of 6 (developers and QA) through delivery.",
  web3:
    "Full-Stack Engineer with 8+ years of end-to-end ownership shipping production systems across React, TypeScript, PHP, and AWS. Specialized in Web3 and dApps: owned Polkadot/Substrate and EVM products and cross-chain bridging SDKs end to end, working across frontend, on-chain integrations, CI/CD, and cloud infrastructure in fast-paced environments. Also experienced leading a cross-functional team of 6 (developers and QA) through delivery.",
};

const resumeBase: Omit<Resume, "summary"> = {
  header: {
    name: "Mario Jose Maurello",
    title: "Full-Stack Software Engineer",
    location: "Madrid, Spain",
    workAuthorization: "Eligible to work in the EU",
    links: [
      { label: "Site", url: "https://mjmaurello.dev" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/mariojmaurello" },
      { label: "GitHub", url: "https://github.com/mmaurello" },
    ],
  },
  summaries,
  experience: [
    {
      role: "Full-time parental leave / caregiving",
      company: "",
      location: "Madrid",
      startDate: "June 2026",
      endDate: "Present",
      highlights: [],
    },
    {
      role: "Software Engineer",
      company: "Purestake / Opslayer",
      location: "Madrid · Remote",
      startDate: "October 2021",
      endDate: "June 2026",
      highlights: [
        "Early-stage, fast-paced Web3 startup; continued on the same team after Purestake spun out Opslayer (ops and web apps).",
        "Owned end-to-end development of production React/TypeScript apps for Web3 products, including product and UX decisions for wallet connectivity, cross-chain bridging, and on-chain analytics, so users got coherent flows instead of chain-by-chain one-offs.",
        "Designed and built bridging SDKs that abstracted multi-system integrations for consuming teams, with docs, examples, and starter guides to speed adoption.",
        "Implemented CI/CD with GitHub Actions and automated testing with Playwright and Vitest, improving deployment reliability and reducing downtime.",
        "Shipped wallet-connected product features and on-chain data querying across Polkadot/Substrate and EVM ecosystems.",
        "Migrated web app infrastructure to AWS serverless to cut deploy complexity and ops load; operated production services with 99.9% uptime.",
      ],
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "AWS",
        "GitHub Actions",
        "Playwright",
        "Vitest",
        "Polkadot.js",
        "Wagmi",
        "Ethers.js",
        "Viem",
        "Solidity",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Digimobil",
      location: "Madrid",
      startDate: "April 2021",
      endDate: "October 2021",
      highlights: [
        "Developed internal logistics management web application to track and optimize inventory movement, reducing manual workload by 50%.",
        "Built RESTful APIs in PHP (Symfony), interfacing with SQL Server for real-time data tracking.",
        "Improved application security by implementing user authentication and role-based access control.",
      ],
      skills: ["PHP", "Symfony", "SQL Server", "REST APIs"],
    },
    {
      role: "Project Manager / Full Stack Developer",
      company: "Imaweb",
      location: "Madrid",
      startDate: "February 2017",
      endDate: "March 2021",
      roles: [
        {
          role: "Project Manager",
          startDate: "December 2019",
          endDate: "March 2021",
        },
        {
          role: "Project Leader",
          startDate: "July 2019",
          endDate: "December 2019",
        },
        {
          role: "Full Stack Developer",
          startDate: "August 2017",
          endDate: "July 2019",
        },
        {
          role: "SQA Developer",
          startDate: "February 2017",
          endDate: "August 2017",
        },
      ],
      highlights: [
        "Progressed from SQA Developer to Full Stack Developer, Project Leader, and Project Manager on automotive CRM products.",
        "Managed a cross-functional team of 4 developers and 2 QA testers; delivered 20+ releases on time and improved customer satisfaction by 25%.",
        "Built core CRM modules used by 500+ European car dealerships; integrated REST/SOAP APIs and tuned MySQL performance.",
        "Refactored legacy PHP and optimized queries, reducing page load times by up to 60%.",
      ],
      skills: ["PHP", "MySQL", "Agile", "Jira", "REST APIs"],
    },
  ],
  previousExperience: [
    {
      role: "Natural ADABAS Junior Programmer",
      company: "Software AG",
      location: "Madrid",
      startDate: "June 2016",
      endDate: "February 2017",
      highlights: [
        "Developed mainframe applications using Natural and managed data in Adabas, for Madrid's water supply company.",
        "Documented legacy system workflows and contributed to early-stage migration planning to modern platforms.",
      ],
      skills: ["Natural", "ADABAS"],
    },
    {
      role: "Maintenance Engineer",
      company: "Empresas Polar",
      location: "Caracas",
      startDate: "May 2014",
      endDate: "February 2015",
      highlights: [
        "Led a team of 4 interns in executing preventive maintenance plans for an ice cream production plant.",
        "Reduced machinery downtime by 15% through optimization of maintenance schedules and troubleshooting protocols.",
        "Prepared daily reports for upper management on productivity and maintenance KPIs.",
      ],
    },
  ],
  education: [
    {
      degree: "Diploma, Maintenance Planning Applied to Industrial Processes",
      institution: "Universidad Simón Bolívar",
      location: "Caracas, Venezuela",
      startDate: "",
      endDate: "",
    },
    {
      degree: "Bachelor's Degree, Mechanical Engineering",
      institution: "Universidad Simón Bolívar",
      location: "Caracas, Venezuela",
      startDate: "",
      endDate: "",
    },
  ],
  skills: [
    {
      category: "Core Skills",
      variant: "list",
      items: [
        "Full-stack web application development and hosting",
        "Service integrations (REST APIs, WebSockets, SDKs)",
        "CI/CD pipelines, automated testing, and QA",
        "Cloud infrastructure and deployment automation (AWS)",
        "AI-assisted development (design, testing, and shipping)",
        "Agile delivery and cross-functional collaboration",
        "Domain experience in Web3 / dApps (Polkadot and EVM)",
      ],
    },
    {
      category: "Frontend",
      items: ["TypeScript", "React", "Next.js", "Astro"],
    },
    {
      category: "Backend",
      items: ["Node.js", "PHP", "Symfony", "Laravel", "GraphQL"],
    },
    {
      category: "Cloud & Tooling",
      items: [
        "AWS",
        "GH Actions",
        "Docker",
        "Playwright",
        "Vitest",
        "Jest",
        "Postman",
      ],
    },
    {
      category: "Data",
      items: ["MySQL", "SQL Server", "PostgreSQL", "DynamoDB", "Drizzle", "Supabase"],
    },
    {
      category: "Web3",
      items: ["Polkadot.js", "Wagmi", "Ethers.js", "Viem", "Solidity"],
    },
    {
      category: "Collaboration",
      items: ["GitHub", "GitLab", "Jira", "Confluence", "Notion", "Figma"],
    },
  ],
  certifications: [
    {
      name: "Ethereum and Solidity",
      issuer: "Udemy",
      year: "2021",
      url: "https://www.udemy.com/certificate/UC-8f15db2c-4ebc-4e37-b1a0-cfb31592da01/",
    },
  ],
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "Advanced" },
  ],
  recentWork: [
    {
      name: "Moonbeam Foundation dApp",
      description:
        "EVM-compatible dApp for the Moonbeam ecosystem, with wallet integrations, cross-chain bridging, and on-chain interactions across the network.",
      role: "Owned end-to-end development",
      company: "Opslayer",
      hero: {
        src: moonbeamHero,
        alt: "Moonbeam Foundation dApp governance interface",
      },
      gallery: [
        {
          src: moonbeam1,
          alt: "Moonbeam Foundation dApp staking dashboard view",
        },
        {
          src: moonbeam2,
          alt: "Moonbeam Foundation dApp staking candidates view",
        },
        {
          src: moonbeam3,
          alt: "Moonbeam Foundation dApp projects view",
        },
      ],
    },
    {
      name: "Tanssi Network dApp",
      description:
        "Web application for the Tanssi appchain ecosystem, including wallet connectivity, cross-chain bridging, and on-chain data flows.",
      role: "Owned end-to-end development",
      company: "Opslayer",
      hero: {
        src: tanssiHero,
        alt: "Tanssi Network dApp main interface",
      },
      gallery: [
        {
          src: tanssi1,
          alt: "Tanssi Network dApp wallet briding page",
        },
        {
          src: tanssi2,
          alt: "Tanssi Network dApp proxies page",
        },
      ],
    },
  ],
};

export function getResume(variant: ResumeVariant = "general"): Resume {
  return {
    ...resumeBase,
    summary: summaries[variant],
  };
}

/** Default public resume (general / full-stack summary). */
export const resume: Resume = getResume("general");
