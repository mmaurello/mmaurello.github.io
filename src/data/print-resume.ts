import type {
  Certification,
  EducationEntry,
  ExperienceEntry,
  Header,
  Language,
  ResumeVariant,
  SkillGroup,
} from "./resume";
import { getResume } from "./resume";

/**
 * PDF presentation layer over `resume.ts`.
 * Content still lives in resume.ts — this only reshapes for a compact CV layout
 * (earlier-role one-liners, shorter dates, compact skills layout).
 */

export interface PrintExperienceEntry {
  role: string;
  company: string;
  location: string;
  dates: string;
  progression?: { role: string; dates: string }[];
  highlights: string[];
}

export interface PrintResume {
  header: Header;
  summary: string;
  experience: PrintExperienceEntry[];
  earlierRoles: string[];
  education: EducationEntry[];
  skills: SkillGroup[];
  certifications: Certification[];
  languages: Language[];
}

const monthAbbreviations: Record<string, string> = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

function shortenDate(value: string): string {
  const [month, ...rest] = value.split(" ");
  const abbreviated = monthAbbreviations[month];
  return abbreviated ? [abbreviated, ...rest].join(" ") : value;
}

function formatRange(startDate: string, endDate: string): string {
  return `${shortenDate(startDate)} – ${shortenDate(endDate)}`;
}

/** Cap bullets for PDF density without inventing new content. */
function printHighlights(highlights: string[], max = 4): string[] {
  if (highlights.length <= max) return highlights;
  return highlights.slice(0, max);
}

function toPrintExperience(entry: ExperienceEntry): PrintExperienceEntry {
  return {
    role: entry.role,
    company: entry.company,
    location: entry.location,
    dates: formatRange(entry.startDate, entry.endDate),
    progression: entry.roles?.map((role) => ({
      role: role.role,
      dates: formatRange(role.startDate, role.endDate),
    })),
    highlights: printHighlights(entry.highlights),
  };
}

export function getPrintResume(variant: ResumeVariant = "general"): PrintResume {
  const resume = getResume(variant);

  return {
    header: resume.header,
    summary: resume.summary,
    experience: resume.experience.map(toPrintExperience),
    earlierRoles: (resume.previousExperience ?? []).map(
      (entry) =>
        `${entry.role} — ${entry.company} · ${entry.location} · ${formatRange(
          entry.startDate,
          entry.endDate,
        )}`,
    ),
    education: resume.education,
    skills: resume.skills,
    certifications: resume.certifications,
    languages: resume.languages,
  };
}
