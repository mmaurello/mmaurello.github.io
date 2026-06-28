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
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  url: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Resume {
  header: Header;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  certifications: Certification[];
  languages: Language[];
}

export const resume: Resume = {
  header: {
    name: "Lorem Ipsum",
    title: "Dolor Sit Amet",
    location: "Consectetur, Adipiscing",
    links: [
      { label: "Lorem", url: "https://example.com/lorem" },
      { label: "Ipsum", url: "https://example.com/ipsum" },
      { label: "Dolor", url: "https://example.com/dolor" },
    ],
  },
  summary:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  experience: [
    {
      role: "Lorem Ipsum Dolor",
      company: "Sit Amet Inc.",
      location: "Consectetur, Elit",
      startDate: "Lorem 0000",
      endDate: "Ipsum Present",
      highlights: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      ],
    },
    {
      role: "Sit Amet Consectetur",
      company: "Adipiscing Labs",
      location: "Elit, Sed",
      startDate: "Dolor 0000",
      endDate: "Amet 0000",
      highlights: [
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        "Deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste.",
        "Natus error sit voluptatem accusantium doloremque laudantium totam rem.",
      ],
    },
    {
      role: "Adipiscing Elit Sed",
      company: "Tempor Agency",
      location: "Incididunt, Labore",
      startDate: "Ut 0000",
      endDate: "Enim 0000",
      highlights: [
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.",
        "Quam nihil molestiae consequatur vel illum qui dolorem eum fugiat quo.",
      ],
    },
  ],
  education: [
    {
      degree: "Lorem Ipsum Degree",
      institution: "Dolor Sit University",
      location: "Amet, Consectetur",
      startDate: "0000",
      endDate: "0000",
      details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ],
  skills: [
    {
      category: "Lorem",
      items: ["Ipsum", "Dolor", "Sit", "Amet", "asdasd"],
    },
    {
      category: "Adipiscing",
      items: ["Elit", "Sed", "Do", "Eiusmod", "Tempor"],
    },
    {
      category: "Incididunt",
      items: ["Ut", "Labore", "Dolore", "Magna", "Aliqua", "Veniam"],
    },
  ],
  certifications: [
    {
      name: "Lorem Ipsum Certification",
      issuer: "Dolor Sit Amet",
      year: "0000",
      url: "https://example.com/lorem-certification",
    },
    {
      name: "Consectetur Adipiscing Elit",
      issuer: "Sed Do Eiusmod",
      year: "0000",
      url: "https://example.com/consectetur-certification",
    },
  ],
  languages: [
    { name: "Lorem", level: "Ipsum" },
    { name: "Dolor", level: "Sit" },
    { name: "Amet", level: "Consectetur" },
  ],
};
