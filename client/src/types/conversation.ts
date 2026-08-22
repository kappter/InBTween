/**
 * Conversation Setup & Tracking Types
 * 
 * This module defines the complete data structure for the InBetween States conversation framework.
 * It captures emotional states, personas with roles, readings, and transformations throughout a dialogue.
 */

export type EmotionalState = 'high' | 'meh' | 'low' | null;

export type PersonaRole = 
  | 'teacher'
  | 'student'
  | 'parent'
  | 'child'
  | 'boss'
  | 'employee'
  | 'colleague'
  | 'friend'
  | 'mentor'
  | 'mentee'
  | 'partner'
  | 'spouse'
  | 'sibling'
  | 'relative'
  | 'neighbor'
  | 'client'
  | 'provider'
  | 'other';

export const PERSONA_ROLES: Record<PersonaRole, string> = {
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
  child: 'Child',
  boss: 'Boss',
  employee: 'Employee',
  colleague: 'Colleague',
  friend: 'Friend',
  mentor: 'Mentor',
  mentee: 'Mentee',
  partner: 'Partner',
  spouse: 'Spouse',
  sibling: 'Sibling',
  relative: 'Relative',
  neighbor: 'Neighbor',
  client: 'Client',
  provider: 'Provider',
  other: 'Other',
};

export const ROLE_COMMUNICATION_TIPS: Record<PersonaRole, string> = {
  teacher: 'Listen for learning moments. Ask clarifying questions. Create psychological safety for growth.',
  student: 'Be open to feedback. Ask for clarity. Respect expertise while maintaining your perspective.',
  parent: 'Listen for emotional safety needs. Set boundaries with compassion. Model vulnerability.',
  child: 'Express your needs clearly. Ask questions. Trust your instincts.',
  boss: 'Listen for concerns and opportunities. Provide clarity on expectations. Acknowledge effort.',
  employee: 'Share your perspective professionally. Ask for feedback. Propose solutions.',
  colleague: 'Listen as an equal. Find common ground. Respect different approaches.',
  friend: 'Listen with your whole heart. Be honest and vulnerable. Celebrate and support.',
  mentor: 'Listen for growth edges. Ask powerful questions. Believe in their potential.',
  mentee: 'Be receptive. Ask for guidance. Apply learning and report back.',
  partner: 'Listen without defending. Seek to understand first. Honor the relationship.',
  spouse: 'Listen with intimacy. Be vulnerable. Prioritize the partnership.',
  sibling: 'Listen without judgment. Honor shared history. Find new understanding.',
  relative: 'Listen with respect for family dynamics. Set healthy boundaries.',
  neighbor: 'Listen with courtesy. Be clear about boundaries. Seek mutual respect.',
  client: 'Listen to needs and concerns. Be responsive. Deliver on commitments.',
  provider: 'Listen to expectations. Be professional and reliable. Communicate clearly.',
  other: 'Listen with openness. Clarify the relational context. Adapt your approach.',
};

export interface PersonProfile {
  id: 'person1' | 'person2';
  emotionalState: EmotionalState;
  persona: {
    role: PersonaRole | null; // e.g., 'teacher', 'parent', 'friend'
    title: string; // e.g., "Sarah, 35, anxious but determined"
    optedOut: boolean;
  };
}

export interface BaselineReading {
  personId: 'person1' | 'person2';
  timestamp: number;
  text: string; // Their initial take/opinion/feeling on the topic
}

export interface PostConversationReading {
  personId: 'person1' | 'person2';
  timestamp: number;
  text: string; // Their updated take after conversation
  shiftedFrom: string; // Original baseline for comparison
}

export interface RoleReflection {
  personId: 'person1' | 'person2';
  timestamp: number;
  originalPersona: string;
  currentPersona: string; // How their role has evolved
  roleInverted: boolean; // Did therapist become patient?
  insights: string; // Their reflection on the role shift
}

export interface MotionMoment {
  personId: 'person1' | 'person2';
  timestamp: number;
  insight: string; // What shifted
  stageIndex: number; // Which stage were they in
  favorScore?: number; // -10 to +10: moving out of favor to into favor
}

export interface ConversationSession {
  id: string;
  createdAt: number;
  topic: string;
  tagline: string; // "When roles in a conversation need careful navigation"
  
  // Setup phase
  person1: PersonProfile;
  person2: PersonProfile;
  
  // Readings & reflections
  baselineReadings: BaselineReading[];
  postConversationReadings: PostConversationReading[];
  roleReflections: RoleReflection[];
  
  // Motion tracking
  motionMoments: MotionMoment[];
  
  // Metadata
  status: 'setup' | 'baseline' | 'conversation' | 'reflection' | 'complete';
  currentStep: number;
  conversationStartTime?: number;
  conversationEndTime?: number;
}

export interface ConversationStage {
  index: number;
  title: string;
  description: string;
  suggestedDuration?: number; // in minutes
  guidance: string;
}

export const CONVERSATION_STAGES: ConversationStage[] = [
  {
    index: 0,
    title: 'Opening',
    description: 'Acknowledge the topic and initial feelings',
    suggestedDuration: 5,
    guidance: 'Share your initial perspective without judgment. Listen to understand, not to respond.',
  },
  {
    index: 1,
    title: 'Exploration',
    description: 'Dig deeper into assumptions and beliefs',
    suggestedDuration: 10,
    guidance: 'Ask clarifying questions. Explore the "why" behind each perspective.',
  },
  {
    index: 2,
    title: 'Integration',
    description: 'Find common ground and shared understanding',
    suggestedDuration: 10,
    guidance: 'Look for where your views intersect. Acknowledge valid points from both sides.',
  },
  {
    index: 3,
    title: 'Reflection',
    description: 'Consider how this conversation has shifted you',
    suggestedDuration: 5,
    guidance: 'Notice what has changed in your thinking. What surprised you?',
  },
];
