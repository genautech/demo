/**
 * CORPORATE GAMIFICATION SYSTEM
 * Sophisticated corporate levels and professional achievement categories
 */

export type CorporateLevel = "bronze_associate" | "silver_professional" | "gold_executive" | "platinum_leader"

export interface CorporateLevelConfig {
  id: CorporateLevel
  name: string
  description: string
  minPoints: number
  benefits: string[]
  permissions: string[]
  color: string
  gradient: string
  icon: string
  requirements: {
    points: number
    achievements: number
    teamImpact?: number
    leadership?: number
  }
}

export const CORPORATE_LEVELS: Record<CorporateLevel, CorporateLevelConfig> = {
  bronze_associate: {
    id: "bronze_associate",
    name: "Bronze Associate",
    description: "Starting point for corporate excellence journey",
    minPoints: 0,
    benefits: [
      "Access to company store",
      "Basic reward catalog",
      "Monthly recognition newsletter",
      "Team progress tracking"
    ],
    permissions: [
      "view_own_progress",
      "browse_catalog",
      "participate_team_challenges"
    ],
    color: "#CD7F32",
    gradient: "linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)",
    icon: "🏅",
    requirements: {
      points: 0,
      achievements: 0
    }
  },
  
  silver_professional: {
    id: "silver_professional",
    name: "Silver Professional",
    description: "Established contributor with consistent performance",
    minPoints: 2500,
    benefits: [
      "Extended reward catalog (+15% items)",
      "Priority customer support",
      "Quarterly performance bonus eligibility",
      "Mentorship program access",
      "Professional development stipend"
    ],
    permissions: [
      "view_own_progress",
      "browse_catalog",
      "participate_team_challenges",
      "mentor_junior_members",
      "access_advanced_analytics"
    ],
    color: "#C0C0C0",
    gradient: "linear-gradient(135deg, #C0C0C0 0%, #808080 100%)",
    icon: "🥈",
    requirements: {
      points: 2500,
      achievements: 5,
      teamImpact: 100
    }
  },
  
  gold_executive: {
    id: "gold_executive",
    name: "Gold Executive",
    description: "High-performing leader with significant business impact",
    minPoints: 10000,
    benefits: [
      "Premium reward catalog (+30% items)",
      "Exclusive executive experiences",
      "Annual leadership retreat",
      "Increased reward multiplier (1.5x)",
      "Executive coaching sessions",
      "Innovation project funding access"
    ],
    permissions: [
      "view_own_progress",
      "browse_catalog",
      "participate_team_challenges",
      "mentor_junior_members",
      "access_advanced_analytics",
      "lead_department_initiatives",
      "approve_team_recognition",
      "access_executive_dashboard"
    ],
    color: "#FFD700",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    icon: "🥇",
    requirements: {
      points: 10000,
      achievements: 15,
      teamImpact: 500,
      leadership: 3
    }
  },
  
  platinum_leader: {
    id: "platinum_leader",
    name: "Platinum Leader",
    description: "Exceptional leader driving organizational excellence",
    minPoints: 25000,
    benefits: [
      "VIP reward catalog (all items)",
      "Exclusive Platinum experiences",
      "Strategic initiative leadership",
      "Maximum reward multiplier (2x)",
      "Executive advisory board access",
      "Custom reward program design",
      "Company-wide recognition platform"
    ],
    permissions: [
      "view_own_progress",
      "browse_catalog",
      "participate_team_challenges",
      "mentor_junior_members",
      "access_advanced_analytics",
      "lead_department_initiatives",
      "approve_team_recognition",
      "access_executive_dashboard",
      "design_recognition_programs",
      "access_company_metrics",
      "strategic_decision_input"
    ],
    color: "#E5E4E2",
    gradient: "linear-gradient(135deg, #E5E4E2 0%, #BCC6CC 100%)",
    icon: "💎",
    requirements: {
      points: 25000,
      achievements: 30,
      teamImpact: 1500,
      leadership: 10
    }
  }
}

export type AchievementCategory = 
  | "performance_excellence"
  | "leadership_impact" 
  | "innovation_champion"
  | "culture_ambassador"
  | "collaboration_star"
  | "continuous_learning"
  | "sustainability_hero"
  | "customer_excellence"

export interface AchievementCategoryConfig {
  id: AchievementCategory
  name: string
  description: string
  color: string
  icon: string
  focus: string
  examples: string[]
}

export const ACHIEVEMENT_CATEGORIES: Record<AchievementCategory, AchievementCategoryConfig> = {
  performance_excellence: {
    id: "performance_excellence",
    name: "Performance Excellence",
    description: "Outstanding individual and team performance",
    color: "#3B82F6",
    icon: "📈",
    focus: "Exceeding targets and quality standards",
    examples: ["Q1 Sales Target Exceeded", "Perfect Quality Score", "Productivity Champion"]
  },
  
  leadership_impact: {
    id: "leadership_impact",
    name: "Leadership Impact",
    description: "Effective leadership and team development",
    color: "#8B5CF6",
    icon: "👥",
    focus: "Leading teams to success",
    examples: ["Team Leader Excellence", "Mentor of the Year", "Change Management Success"]
  },
  
  innovation_champion: {
    id: "innovation_champion",
    name: "Innovation Champion",
    description: "Driving innovation and creative solutions",
    color: "#10B981",
    icon: "💡",
    focus: "New ideas and process improvements",
    examples: ["Process Innovation", "Digital Transformation", "Creative Problem Solving"]
  },
  
  culture_ambassador: {
    id: "culture_ambassador",
    name: "Culture Ambassador",
    description: "Promoting positive workplace culture",
    color: "#F59E0B",
    icon: "🌟",
    focus: "Living company values",
    examples: ["Values Champion", "Diversity Advocate", "Wellness Ambassador"]
  },
  
  collaboration_star: {
    id: "collaboration_star",
    name: "Collaboration Star",
    description: "Exceptional teamwork and cross-functional collaboration",
    color: "#06B6D4",
    icon: "🤝",
    focus: "Working effectively across teams",
    examples: ["Cross-Functional Excellence", "Team Player Award", "Partnership Success"]
  },
  
  continuous_learning: {
    id: "continuous_learning",
    name: "Continuous Learning",
    description: "Commitment to personal and professional growth",
    color: "#EC4899",
    icon: "📚",
    focus: "Ongoing development and skill acquisition",
    examples: ["Learning Champion", "Certification Earned", "Skill Master"]
  },
  
  sustainability_hero: {
    id: "sustainability_hero",
    name: "Sustainability Hero",
    description: "Environmental responsibility and sustainable practices",
    color: "#22C55E",
    icon: "🌱",
    focus: "Green initiatives and sustainability",
    examples: ["Green Initiative", "Carbon Reduction", "Sustainability Champion"]
  },
  
  customer_excellence: {
    id: "customer_excellence",
    name: "Customer Excellence",
    description: "Outstanding customer service and satisfaction",
    color: "#EF4444",
    icon: "❤️",
    focus: "Customer-centric achievements",
    examples: ["Customer Satisfaction Hero", "Service Excellence", "Customer Success Story"]
  }
}

export interface CorporateAchievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  points: number
  level: CorporateLevel
  icon: string
  requirements: {
    type: "automatic" | "manual" | "team_based"
    criteria: string
    frequency?: "one_time" | "monthly" | "quarterly" | "yearly"
    target?: number
  }
  benefits: string[]
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

export const CORPORATE_ACHIEVEMENTS: CorporateAchievement[] = [
  // Performance Excellence
  {
    id: "sales_champion",
    name: "Sales Champion",
    description: "Exceed sales target by 25% or more",
    category: "performance_excellence",
    points: 500,
    level: "silver_professional",
    icon: "🏆",
    requirements: {
      type: "automatic",
      criteria: "Sales achievement > 125% of target",
      frequency: "quarterly",
      target: 125
    },
    benefits: ["Bonus multiplier increase", "Public recognition"]
  },
  
  {
    id: "productivity_master",
    name: "Productivity Master",
    description: "Maintain 95%+ productivity for 3 consecutive months",
    category: "performance_excellence",
    points: 750,
    level: "gold_executive",
    icon: "⚡",
    requirements: {
      type: "automatic",
      criteria: "Productivity score ≥ 95% for 3 months",
      frequency: "one_time",
      target: 95
    },
    benefits: ["Productivity bonus", "Efficiency tools access"]
  },
  
  // Leadership Impact
  {
    id: "team_builder",
    name: "Team Builder",
    description: "Lead team to achieve 100% goal attainment",
    category: "leadership_impact",
    points: 1000,
    level: "gold_executive",
    icon: "👥",
    requirements: {
      type: "team_based",
      criteria: "Team goal achievement rate = 100%",
      frequency: "quarterly",
      target: 100
    },
    benefits: ["Leadership bonus", "Team development budget"]
  },
  
  {
    id: "mentor_excellence",
    name: "Mentor Excellence",
    description: "Successfully mentor 3 team members to promotion",
    category: "leadership_impact",
    points: 800,
    level: "silver_professional",
    icon: "🎓",
    requirements: {
      type: "manual",
      criteria: "3 mentees promoted",
      frequency: "one_time",
      target: 3
    },
    benefits: ["Mentor recognition", "Advanced training access"]
  },
  
  // Innovation Champion
  {
    id: "innovation_driver",
    name: "Innovation Driver",
    description: "Implement 3 process improvements saving 100+ hours",
    category: "innovation_champion",
    points: 600,
    level: "silver_professional",
    icon: "💡",
    requirements: {
      type: "manual",
      criteria: "3 improvements with 100+ hour savings",
      frequency: "yearly",
      target: 100
    },
    benefits: ["Innovation bonus", "R&D project access"]
  },
  
  // Culture Ambassador
  {
    id: "values_champion",
    name: "Values Champion",
    description: "Demonstrate company values in 5+ initiatives",
    category: "culture_ambassador",
    points: 400,
    level: "bronze_associate",
    icon: "🌟",
    requirements: {
      type: "manual",
      criteria: "Participation in 5+ culture initiatives",
      frequency: "yearly",
      target: 5
    },
    benefits: ["Culture points", "Ambassador badge"]
  },
  
  // Customer Excellence
  {
    id: "customer_hero",
    name: "Customer Hero",
    description: "Achieve 98%+ customer satisfaction rating",
    category: "customer_excellence",
    points: 500,
    level: "silver_professional",
    icon: "❤️",
    requirements: {
      type: "automatic",
      criteria: "Customer satisfaction ≥ 98%",
      frequency: "quarterly",
      target: 98
    },
    benefits: ["Customer service bonus", "Premium tools access"]
  }
]

export interface GamificationAnalytics {
  totalUsers: number
  activeUsers: number
  totalPointsAwarded: number
  achievementsUnlocked: number
  levelDistribution: Record<CorporateLevel, number>
  categoryProgress: Record<AchievementCategory, number>
  engagementRate: number
  retentionRate: number
  monthlyGrowth: number
}

export interface UserGamificationProfile {
  userId: string
  currentLevel: CorporateLevel
  totalPoints: number
  availablePoints: number
  spentPoints: number
  achievements: CorporateAchievement[]
  progress: {
    toNextLevel: number
    achievementsCompleted: number
    categoryProgress: Record<AchievementCategory, number>
  }
  streak: {
    current: number
    longest: number
    lastActive: string
  }
  teamImpact: {
    teamMembersMentored: number
    projectsLed: number
    collaborationScore: number
  }
  lastUpdated: string
}