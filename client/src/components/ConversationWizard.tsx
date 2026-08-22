/**
 * Conversation Wizard
 * 
 * Multi-step interface for setting up a conversation:
 * Step 0: Emotional States
 * Step 1: Topic
 * Step 2: Meet the People
 * Step 3: Define Personas
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useConversation } from '@/contexts/ConversationContext';
import { Silhouette } from '@/components/Silhouette';
import { EmotionalState, PersonaRole, PERSONA_ROLES } from '@/types/conversation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATES: Record<string, { label: string; color: string; description: string }> = {
  high: {
    label: 'High',
    color: 'oklch(0.75 0.15 65)',
    description: 'Excited, energized, riding something good',
  },
  meh: {
    label: 'Meh',
    color: 'oklch(0.65 0.02 65)',
    description: 'Average day, present but not inspired',
  },
  low: {
    label: 'Low',
    color: 'oklch(0.35 0.12 280)',
    description: 'Wounded, damaged, dealing with pain',
  },
};

interface ConversationWizardProps {
  onComplete: () => void;
}

export const ConversationWizard: React.FC<ConversationWizardProps> = ({ onComplete }) => {
  const { session, initializeSession, updatePersonProfile, updateCurrentStep, updateStatus } = useConversation();
  const [topic, setTopic] = useState('');
  const [person1State, setPerson1State] = useState<EmotionalState>(null);
  const [person2State, setPerson2State] = useState<EmotionalState>(null);
  const [person1Role, setPerson1Role] = useState<PersonaRole | null>(null);
  const [person1Persona, setPerson1Persona] = useState('');
  const [person1OptOut, setPerson1OptOut] = useState(false);
  const [person2Role, setPerson2Role] = useState<PersonaRole | null>(null);
  const [person2Persona, setPerson2Persona] = useState('');
  const [person2OptOut, setPerson2OptOut] = useState(false);

  const currentStep = session?.currentStep ?? 0;

  const handleTopicSubmit = () => {
    if (topic.trim()) {
      initializeSession(topic);
      updateCurrentStep(1);
    }
  };

  const handleStateSelection = (personId: 'person1' | 'person2', state: EmotionalState) => {
    if (personId === 'person1') {
      setPerson1State(state);
    } else {
      setPerson2State(state);
    }
  };

  const handleStatesComplete = () => {
    if (person1State && person2State) {
      updatePersonProfile('person1', { emotionalState: person1State });
      updatePersonProfile('person2', { emotionalState: person2State });
      updateCurrentStep(2);
    }
  };

  const handlePersonasComplete = () => {
    updatePersonProfile('person1', {
      persona: { role: person1Role, title: person1Persona, optedOut: person1OptOut },
    });
    updatePersonProfile('person2', {
      persona: { role: person2Role, title: person2Persona, optedOut: person2OptOut },
    });
    updateStatus('baseline');
    updateCurrentStep(4);
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <AnimatePresence mode="wait">
        {/* Step 0: Topic */}
        {currentStep === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-bold mb-4">InBetween States</h1>
              <p className="text-lg text-muted-foreground mb-2">
                When roles in a conversation need careful navigation
              </p>
            </div>

            <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
              <h2 className="text-2xl font-display font-bold mb-2">What's the topic?</h2>
              <p className="text-muted-foreground mb-6">
                What do you want to discuss in this conversation?
              </p>

              <div className="flex gap-3">
                <Input
                  placeholder="e.g., Career change, relationship boundaries, family finances..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTopicSubmit()}
                  className="text-base"
                  autoFocus
                />
                <Button
                  onClick={handleTopicSubmit}
                  disabled={!topic.trim()}
                  className="px-8"
                >
                  Next
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground mt-6">
                Step 1 of 4
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Emotional States */}
        {currentStep === 1 && session && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-2">Where are you today?</h2>
              <p className="text-muted-foreground">
                Select your emotional state and your conversation partner's state
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Person 1 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">You</h3>
                <div className="space-y-3">
                  {(['high', 'meh', 'low'] as const).map((state) => (
                    <motion.button
                      key={state}
                      onClick={() => handleStateSelection('person1', state)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        person1State === state
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/50'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: STATES[state].color }}
                        />
                        <div>
                          <div className="font-semibold">{STATES[state].label}</div>
                          <div className="text-xs text-muted-foreground">
                            {STATES[state].description}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Person 2 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your conversation partner</h3>
                <div className="space-y-3">
                  {(['high', 'meh', 'low'] as const).map((state) => (
                    <motion.button
                      key={state}
                      onClick={() => handleStateSelection('person2', state)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        person2State === state
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/50'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: STATES[state].color }}
                        />
                        <div>
                          <div className="font-semibold">{STATES[state].label}</div>
                          <div className="text-xs text-muted-foreground">
                            {STATES[state].description}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => updateCurrentStep(0)}>
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">Step 2 of 4</div>
              <Button
                onClick={handleStatesComplete}
                disabled={!person1State || !person2State}
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Meet the People */}
        {currentStep === 2 && session && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-2">Meet the People</h2>
              <p className="text-muted-foreground mb-8">
                Topic: <span className="font-semibold text-foreground">{session.topic}</span>
              </p>

              <div className="flex items-center justify-center gap-12 mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <Silhouette size="lg" variant="solid" />
                  <div className="mt-4">
                    <div className="font-semibold">You</div>
                    <div
                      className="text-sm font-medium mt-1"
                      style={{ color: STATES[person1State!].color }}
                    >
                      {STATES[person1State!].label}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-4xl font-display font-bold text-muted-foreground mb-4">
                    {session.topic}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center"
                >
                  <Silhouette size="lg" variant="solid" />
                  <div className="mt-4">
                    <div className="font-semibold">Partner</div>
                    <div
                      className="text-sm font-medium mt-1"
                      style={{ color: STATES[person2State!].color }}
                    >
                      {STATES[person2State!].label}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => updateCurrentStep(1)}>
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">Step 3 of 4</div>
              <Button onClick={() => updateCurrentStep(3)}>
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Define Personas */}
        {currentStep === 3 && session && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-2">Define Your Personas</h2>
              <p className="text-muted-foreground">
                What mask or role are you bringing to this conversation? (Optional)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Person 1 Persona */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-lg p-6 border border-border"
              >
                <div className="flex justify-center mb-4">
                  <Silhouette size="md" variant={person1OptOut ? 'ghost' : 'solid'} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">Your Role</label>
                    <Select value={person1Role || ''} onValueChange={(value) => setPerson1Role(value as PersonaRole)}>
                      <SelectTrigger disabled={person1OptOut}>
                        <SelectValue placeholder="Select your role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PERSONA_ROLES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-2">Your Persona</label>
                    <Input
                      placeholder="e.g., Sarah, 35, anxious but determined"
                      value={person1Persona}
                      onChange={(e) => setPerson1Persona(e.target.value)}
                      disabled={person1OptOut}
                      className="text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="person1-optout"
                      checked={person1OptOut}
                      onCheckedChange={(checked) => setPerson1OptOut(checked as boolean)}
                    />
                    <label htmlFor="person1-optout" className="text-sm cursor-pointer">
                      I don't need a persona
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Person 2 Persona */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-card rounded-lg p-6 border border-border"
              >
                <div className="flex justify-center mb-4">
                  <Silhouette size="md" variant={person2OptOut ? 'ghost' : 'solid'} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">Their Role</label>
                    <Select value={person2Role || ''} onValueChange={(value) => setPerson2Role(value as PersonaRole)}>
                      <SelectTrigger disabled={person2OptOut}>
                        <SelectValue placeholder="Select their role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PERSONA_ROLES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-2">Partner's Persona</label>
                    <Input
                      placeholder="e.g., Mike, 38, supportive mentor"
                      value={person2Persona}
                      onChange={(e) => setPerson2Persona(e.target.value)}
                      disabled={person2OptOut}
                      className="text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="person2-optout"
                      checked={person2OptOut}
                      onCheckedChange={(checked) => setPerson2OptOut(checked as boolean)}
                    />
                    <label htmlFor="person2-optout" className="text-sm cursor-pointer">
                      No persona needed
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => updateCurrentStep(2)}>
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">Step 4 of 4</div>
              <Button onClick={handlePersonasComplete}>
                Begin Conversation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversationWizard;
