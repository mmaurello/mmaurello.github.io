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
  links: ContactLink[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
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

export interface Resume {
  header: Header;
  summary: string;
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

/** Static resume PDF in /public — update when resume content changes. */
export const resumePdf = {
  href: "/CV_MJM_2026.pdf",
  download: "Mario_Jose_Maurello_Resume.pdf",
} as const;

export const resume: Resume = {
  header: {
    name: "Mario Jose Maurello",
    title: "Full-Stack Software Engineer",
    location: "Madrid, Spain",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/mariojmaurello" },
      { label: "GitHub", url: "https://github.com/mmaurello" },
    ],
  },
  summary:
    "Full-Stack Engineer specializing in web applications, with 8+ years building and shipping production systems across React, TypeScript, PHP, and AWS. Currently focused on Web3 and dApps. Recently owned end-to-end development of Polkadot/Substrate and EVM dApps and cross-chain bridging SDKs, with hands-on implementation across frontend, on-chain integrations, CI/CD, and cloud infrastructure.",
  experience: [
    {
      role: "Software Engineer — Web3 Developer",
      company: "Opslayer",
      location: "Madrid · Remote",
      startDate: "June 2023",
      endDate: "Present",
      highlights: [
        "Owned development of both Polkadot/Substrate-based and EVM-based dApps, integrating Web3 wallets and on-chain data analytics.",
        "Integrated and maintained dApps with Polkadot.js API for interacting with Substrate-based blockchains, enabling real-time querying of on-chain data and transaction signing.",
        "Built bridging SDKs to facilitate seamless token transfers across EVM-compatible chains and Substrate chain, removing the complexity for users of interacting with smart contract and Substrate interfaces.",
        "Implemented CI/CD pipelines with GitHub Actions, improving deployment reliability and reducing downtime.",
        "Provided ongoing infrastructure support via AWS, achieving 99.9% service uptime.",
      ],
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "Polkadot.js",
        "Wagmi",
        "Ethers.js",
        "Viem",
        "Solidity",
        "GitHub Actions",
        "AWS",
      ],
    },
    {
      role: "Software Engineer",
      company: "Purestake",
      location: "Madrid · Remote",
      startDate: "October 2021",
      endDate: "June 2023",
      highlights: [
        "Developed and maintained decentralized applications (dApps) using React, Ethers.js, Viem, Wagmi, and interactions with Solidity contracts.",
        "Designed and maintained SDKs for blockchain bridging, resulting in improved developer integration in the Polkadot ecosystem.",
        "Migrated web apps infrastructure to AWS server-less services, reducing deployment times and complexity.",
      ],
      skills: ["React", "TypeScript", "Ethers.js", "Viem", "Wagmi", "Solidity", "AWS"],
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
      role: "Project Manager",
      company: "Imaweb",
      location: "Madrid",
      startDate: "December 2019",
      endDate: "March 2021",
      highlights: [
        "Managed a cross-functional team of 4 developers and 2 QA testers in the agile development of CRM solutions for automotive clients.",
        "Delivered 20+ project releases on time and within budget, improving customer satisfaction scores by 25%.",
        "Acted as primary liaison between clients and technical teams, translating business needs into functional requirements.",
        "Introduced sprint retrospectives and kanban boards, leading to a 15% productivity increase.",
      ],
    },
    {
      role: "Project Leader",
      company: "Imaweb",
      location: "Madrid",
      startDate: "July 2019",
      endDate: "December 2019",
      highlights: [
        "Supervised development of custom modules for automotive CRMs, reducing feature request backlog.",
        "Mentored junior developer and QA tester, resulting in quicker onboarding and quality improvements.",
        "Ensured adherence to deadlines and code quality standards during high-priority client rollouts.",
      ],
      skills: ["PHP", "MySQL", "Agile", "Jira"],
    },
    {
      role: "Full Stack Developer",
      company: "Imaweb",
      location: "Madrid",
      startDate: "August 2018",
      endDate: "July 2019",
      highlights: [
        "Built core modules for a CRM platform used by over 500 car dealerships across Europe.",
        "Integrated third-party systems using REST/SOAP APIs, enhancing data flow across platforms.",
        "Wrote backend services in PHP, managing relational data in MySQL and performance tuning SQL queries.",
      ],
      skills: ["PHP", "MySQL", "REST APIs", "SOAP"],
    },
    {
      role: "SQA Developer",
      company: "Imaweb",
      location: "Madrid",
      startDate: "August 2018",
      endDate: "July 2019",
      highlights: [
        "Refactored legacy PHP code and optimized MySQL queries, reducing page load times by up to 60%.",
        "Collaborated with development teams to triage and resolve bugs reported from production.",
      ],
      skills: ["PHP", "MySQL"],
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
        "Web development and hosting",
        "Web3 development in Polkadot and EVM ecosystems",
        "Service integrations (REST APIs, JSON-RPC, WebSockets, SDKs)",
        "CI/CD pipelines, automated testing, and QA",
        "Agile project management (Scrum, Kanban)",
      ],
    },
    {
      category: "Languages",
      items: ["JavaScript", "TypeScript", "PHP", "Solidity"],
    },
    {
      category: "Frontend & Web3",
      items: ["React", "Next.js", "Wagmi", "Ethers.js", "Viem"],
    },
    {
      category: "Backend & Frameworks",
      items: ["Node.js", "Symfony", "Laravel"],
    },
    {
      category: "Databases",
      items: ["MySQL", "SQL Server", "PostgreSQL", "DynamoDB", "Drizzle", "Supabase"],
    },
    {
      category: "Testing & CI/CD",
      items: ["Playwright", "Vitest", "Jest", "GitHub Actions", "Docker"],
    },
    {
      category: "Cloud & Collaboration",
      items: [
        "AWS",
        "GCP",
        "GitHub",
        "GitLab",
        "Jira",
        "Confluence",
        "Notion",
        "Figma",
        "Postman",
      ],
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
