/**
 * Conversation Context
 * 
 * Manages the complete state of a conversation session, including setup,
 * readings, reflections, and motion moments.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConversationSession, PersonProfile, BaselineReading, PostConversationReading, RoleReflection, MotionMoment, EmotionalState } from '@/types/conversation';

interface ConversationContextType {
  session: ConversationSession | null;
  initializeSession: (topic: string) => void;
  updatePersonProfile: (personId: 'person1' | 'person2', updates: Partial<PersonProfile>) => void;
  addBaselineReading: (reading: BaselineReading) => void;
  addPostConversationReading: (reading: PostConversationReading) => void;
  addRoleReflection: (reflection: RoleReflection) => void;
  addMotionMoment: (moment: MotionMoment) => void;
  updateStatus: (status: ConversationSession['status']) => void;
  updateCurrentStep: (step: number) => void;
  startConversation: () => void;
  endConversation: () => void;
  resetSession: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<ConversationSession | null>(null);

  const initializeSession = useCallback((topic: string) => {
    const newSession: ConversationSession = {
      id: `session-${Date.now()}`,
      createdAt: Date.now(),
      topic,
      tagline: 'When roles in a conversation need careful navigation',
      person1: {
        id: 'person1',
        emotionalState: null,
        persona: { role: null, title: '', optedOut: false },
      },
      person2: {
        id: 'person2',
        emotionalState: null,
        persona: { role: null, title: '', optedOut: false },
      },
      baselineReadings: [],
      postConversationReadings: [],
      roleReflections: [],
      motionMoments: [],
      status: 'setup',
      currentStep: 0,
    };
    setSession(newSession);
  }, []);

  const updatePersonProfile = useCallback((personId: 'person1' | 'person2', updates: Partial<PersonProfile>) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [personId]: {
          ...prev[personId],
          ...updates,
        },
      };
    });
  }, [session]);

  const addBaselineReading = useCallback((reading: BaselineReading) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        baselineReadings: [...prev.baselineReadings, reading],
      };
    });
  }, [session]);

  const addPostConversationReading = useCallback((reading: PostConversationReading) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        postConversationReadings: [...prev.postConversationReadings, reading],
      };
    });
  }, [session]);

  const addRoleReflection = useCallback((reflection: RoleReflection) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        roleReflections: [...prev.roleReflections, reflection],
      };
    });
  }, [session]);

  const addMotionMoment = useCallback((moment: MotionMoment) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        motionMoments: [...prev.motionMoments, moment],
      };
    });
  }, [session]);

  const updateStatus = useCallback((status: ConversationSession['status']) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status,
      };
    });
  }, [session]);

  const updateCurrentStep = useCallback((step: number) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentStep: step,
      };
    });
  }, [session]);

  const startConversation = useCallback(() => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'conversation',
        conversationStartTime: Date.now(),
      };
    });
  }, [session]);

  const endConversation = useCallback(() => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conversationEndTime: Date.now(),
      };
    });
  }, [session]);

  const resetSession = useCallback(() => {
    setSession(null);
  }, []);

  const value: ConversationContextType = {
    session,
    initializeSession,
    updatePersonProfile,
    addBaselineReading,
    addPostConversationReading,
    addRoleReflection,
    addMotionMoment,
    updateStatus,
    updateCurrentStep,
    startConversation,
    endConversation,
    resetSession,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};
