import type { GraphData, GraphNode, GraphLink } from "../types/graph";
import { NODE_COLORS, LINK_COLOR } from "../types/graph";

/**
 * Dummy career knowledge graph data for development.
 * Represents a sample resume with skills, experiences, education, etc.
 *
 * Node IDs:
 * 1 = Person
 * 2-10 = Skills
 * 11-12 = Technologies
 * 13-18 = Experiences & Companies
 * 19 = Education
 * 20 = Certification
 * 21-22 = Projects
 */

// Node ID constants for readability
const PERSON = 1;
const SKILL_REACT = 2;
const SKILL_TYPESCRIPT = 3;
const SKILL_NEXTJS = 4;
const SKILL_TAILWIND = 5;
const SKILL_NODEJS = 6;
const SKILL_PYTHON = 7;
const SKILL_GRAPHQL = 8;
const SKILL_AWS = 9;
const SKILL_DOCKER = 10;
const TECH_POSTGRES = 11;
const TECH_REDIS = 12;
const EXP_SENIOR = 13;
const COMPANY_TECHCORP = 14;
const EXP_MID = 15;
const COMPANY_DATAFLOW = 16;
const EXP_JUNIOR = 17;
const COMPANY_STARTUP = 18;
const EDU_BS = 19;
const CERT_AWS = 20;
const PROJ_DASHBOARD = 21;
const PROJ_API = 22;

const nodes: GraphNode[] = [
  // Central person node
  {
    id: PERSON,
    labels: ["Person"],
    color: NODE_COLORS.person,
    visible: true,
    data: {
      name: "Alex Chen",
      type: "person",
      description: "Senior Full-Stack Engineer with 8+ years of experience",
    },
  },

  // Skills - Frontend
  {
    id: SKILL_REACT,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "React",
      type: "skill",
      level: "expert",
      years: 6,
      relevanceScore: 95,
    },
  },
  {
    id: SKILL_TYPESCRIPT,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "TypeScript",
      type: "skill",
      level: "expert",
      years: 5,
      relevanceScore: 92,
    },
  },
  {
    id: SKILL_NEXTJS,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "Next.js",
      type: "skill",
      level: "advanced",
      years: 4,
      relevanceScore: 88,
    },
  },
  {
    id: SKILL_TAILWIND,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "Tailwind CSS",
      type: "skill",
      level: "advanced",
      years: 3,
      relevanceScore: 85,
    },
  },

  // Skills - Backend
  {
    id: SKILL_NODEJS,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "Node.js",
      type: "skill",
      level: "expert",
      years: 7,
      relevanceScore: 90,
    },
  },
  {
    id: SKILL_PYTHON,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "Python",
      type: "skill",
      level: "advanced",
      years: 5,
      relevanceScore: 82,
    },
  },
  {
    id: SKILL_GRAPHQL,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "GraphQL",
      type: "skill",
      level: "intermediate",
      years: 3,
      relevanceScore: 75,
    },
  },

  // Skills - Infrastructure
  {
    id: SKILL_AWS,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "AWS",
      type: "skill",
      level: "advanced",
      years: 4,
      relevanceScore: 80,
    },
  },
  {
    id: SKILL_DOCKER,
    labels: ["Skill"],
    color: NODE_COLORS.skill,
    visible: true,
    data: {
      name: "Docker",
      type: "skill",
      level: "intermediate",
      years: 3,
      relevanceScore: 70,
    },
  },

  // Technologies
  {
    id: TECH_POSTGRES,
    labels: ["Technology"],
    color: NODE_COLORS.technology,
    visible: true,
    data: {
      name: "PostgreSQL",
      type: "technology",
      description: "Primary database technology",
    },
  },
  {
    id: TECH_REDIS,
    labels: ["Technology"],
    color: NODE_COLORS.technology,
    visible: true,
    data: {
      name: "Redis",
      type: "technology",
      description: "Caching and session management",
    },
  },

  // Experience 1 - Current
  {
    id: EXP_SENIOR,
    labels: ["Experience"],
    color: NODE_COLORS.experience,
    visible: true,
    data: {
      name: "Senior Full-Stack Engineer",
      type: "experience",
      description:
        "Lead frontend architecture and mentored team of 5 engineers",
      years: 3,
    },
  },
  {
    id: COMPANY_TECHCORP,
    labels: ["Company"],
    color: NODE_COLORS.company,
    visible: true,
    data: {
      name: "TechCorp Inc.",
      type: "company",
      description: "Series B SaaS startup - 150 employees",
    },
  },

  // Experience 2 - Previous
  {
    id: EXP_MID,
    labels: ["Experience"],
    color: NODE_COLORS.experience,
    visible: true,
    data: {
      name: "Software Engineer II",
      type: "experience",
      description: "Built microservices and improved API performance by 40%",
      years: 2,
    },
  },
  {
    id: COMPANY_DATAFLOW,
    labels: ["Company"],
    color: NODE_COLORS.company,
    visible: true,
    data: {
      name: "DataFlow Systems",
      type: "company",
      description: "Enterprise data analytics platform",
    },
  },

  // Experience 3 - Entry
  {
    id: EXP_JUNIOR,
    labels: ["Experience"],
    color: NODE_COLORS.experience,
    visible: true,
    data: {
      name: "Junior Developer",
      type: "experience",
      description: "Developed features for e-commerce platform",
      years: 2,
    },
  },
  {
    id: COMPANY_STARTUP,
    labels: ["Company"],
    color: NODE_COLORS.company,
    visible: true,
    data: {
      name: "ShopEasy",
      type: "company",
      description: "E-commerce startup",
    },
  },

  // Education
  {
    id: EDU_BS,
    labels: ["Education"],
    color: NODE_COLORS.education,
    visible: true,
    data: {
      name: "B.S. Computer Science",
      type: "education",
      institution: "Stanford University",
      date: "2016",
    },
  },

  // Certifications
  {
    id: CERT_AWS,
    labels: ["Certification"],
    color: NODE_COLORS.certification,
    visible: true,
    data: {
      name: "AWS Solutions Architect",
      type: "certification",
      date: "2023",
    },
  },

  // Projects
  {
    id: PROJ_DASHBOARD,
    labels: ["Project"],
    color: NODE_COLORS.project,
    visible: true,
    data: {
      name: "Analytics Dashboard",
      type: "project",
      description: "Real-time analytics platform serving 10K+ users",
    },
  },
  {
    id: PROJ_API,
    labels: ["Project"],
    color: NODE_COLORS.project,
    visible: true,
    data: {
      name: "REST API Platform",
      type: "project",
      description: "High-performance API handling 1M+ requests/day",
    },
  },
];

const links: GraphLink[] = [
  // Person to Skills
  {
    id: 1,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_REACT,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.95 },
  },
  {
    id: 2,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_TYPESCRIPT,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.92 },
  },
  {
    id: 3,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_NEXTJS,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.88 },
  },
  {
    id: 4,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_TAILWIND,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.85 },
  },
  {
    id: 5,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_NODEJS,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.9 },
  },
  {
    id: 6,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_PYTHON,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.82 },
  },
  {
    id: 7,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_GRAPHQL,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.75 },
  },
  {
    id: 8,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_AWS,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.8 },
  },
  {
    id: 9,
    relationship: "HAS_SKILL",
    source: PERSON,
    target: SKILL_DOCKER,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.7 },
  },

  // Person to Experience
  {
    id: 10,
    relationship: "WORKED_AT",
    source: PERSON,
    target: EXP_SENIOR,
    color: LINK_COLOR,
    visible: true,
    data: { startDate: "2021", endDate: "Present" },
  },
  {
    id: 11,
    relationship: "WORKED_AT",
    source: PERSON,
    target: EXP_MID,
    color: LINK_COLOR,
    visible: true,
    data: { startDate: "2019", endDate: "2021" },
  },
  {
    id: 12,
    relationship: "WORKED_AT",
    source: PERSON,
    target: EXP_JUNIOR,
    color: LINK_COLOR,
    visible: true,
    data: { startDate: "2017", endDate: "2019" },
  },

  // Experience to Company
  {
    id: 13,
    relationship: "AT_COMPANY",
    source: EXP_SENIOR,
    target: COMPANY_TECHCORP,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },
  {
    id: 14,
    relationship: "AT_COMPANY",
    source: EXP_MID,
    target: COMPANY_DATAFLOW,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },
  {
    id: 15,
    relationship: "AT_COMPANY",
    source: EXP_JUNIOR,
    target: COMPANY_STARTUP,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },

  // Person to Education
  {
    id: 16,
    relationship: "STUDIED_AT",
    source: PERSON,
    target: EDU_BS,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },

  // Person to Certifications
  {
    id: 17,
    relationship: "CERTIFIED_BY",
    source: PERSON,
    target: CERT_AWS,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },

  // Projects
  {
    id: 18,
    relationship: "COMPLETED_PROJECT",
    source: EXP_SENIOR,
    target: PROJ_DASHBOARD,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },
  {
    id: 19,
    relationship: "COMPLETED_PROJECT",
    source: EXP_MID,
    target: PROJ_API,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },

  // Technology relationships
  {
    id: 20,
    relationship: "USES_TECHNOLOGY",
    source: SKILL_NODEJS,
    target: TECH_POSTGRES,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },
  {
    id: 21,
    relationship: "USES_TECHNOLOGY",
    source: SKILL_NODEJS,
    target: TECH_REDIS,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },

  // Skill relationships
  {
    id: 22,
    relationship: "RELATED_TO",
    source: SKILL_REACT,
    target: SKILL_TYPESCRIPT,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.9 },
  },
  {
    id: 23,
    relationship: "RELATED_TO",
    source: SKILL_REACT,
    target: SKILL_NEXTJS,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.95 },
  },
  {
    id: 24,
    relationship: "RELATED_TO",
    source: SKILL_NEXTJS,
    target: SKILL_TAILWIND,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.8 },
  },
  {
    id: 25,
    relationship: "RELATED_TO",
    source: SKILL_AWS,
    target: SKILL_DOCKER,
    color: LINK_COLOR,
    visible: true,
    data: { weight: 0.85 },
  },

  // Certification to Skill
  {
    id: 26,
    relationship: "RELATED_TO",
    source: CERT_AWS,
    target: SKILL_AWS,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },

  // Project to Technologies
  {
    id: 27,
    relationship: "USES_TECHNOLOGY",
    source: PROJ_DASHBOARD,
    target: SKILL_REACT,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },
  {
    id: 28,
    relationship: "USES_TECHNOLOGY",
    source: PROJ_API,
    target: SKILL_NODEJS,
    color: LINK_COLOR,
    visible: true,
    data: {},
  },
];

export const dummyGraphData: GraphData = { nodes, links };

// Count nodes by type for statistics
export function getNodeCountsByType(data: GraphData): Record<string, number> {
  const counts: Record<string, number> = {};
  data.nodes.forEach((node) => {
    const type = node.data.type;
    counts[type] = (counts[type] || 0) + 1;
  });
  return counts;
}
