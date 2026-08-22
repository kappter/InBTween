/**
 * Baseline Reading Capture
 * 
 * Captures each person's initial take/opinion/feeling on the topic
 * before the conversation begins.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useConversation } from '@/contexts/ConversationContext';
import { Silhouette } from '@/components/Silhouette';
import { PERSONA_ROLES } from '@/types/conversation';

interface BaselineReadingCaptureProps {
  onComplete: () => void;
}

export const BaselineReadingCapture: React.FC<BaselineReadingCaptureProps> = ({ onComplete }) => {
  const { session, addBaselineReading, startConversation } = useConversation();
  const [person1Reading, setPerson1Reading] = useState('');
  const [person2Reading, setPerson2Reading] = useState('');
  const [person1Complete, setPerson1Complete] = useState(false);
  const [person2Complete, setPerson2Complete] = useState(false);

  const handlePerson1Submit = () => {
    if (person1Reading.trim()) {
      addBaselineReading({
        personId: 'person1',
        timestamp: Date.now(),
        text: person1Reading,
      });
      setPerson1Complete(true);
    }
  };

  const handlePerson2Submit = () => {
    if (person2Reading.trim()) {
      addBaselineReading({
        personId: 'person2',
        timestamp: Date.now(),
        text: person2Reading,
      });
      setPerson2Complete(true);
    }
  };

  const handleBeginConversation = () => {
    startConversation();
    onComplete();
  };

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-2">Take Your Pulse</h1>
          <p className="text-lg text-muted-foreground">
            Record your initial take on <span className="font-semibold text-foreground">{session.topic}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            This is your baseline. We'll compare it to your perspective after the conversation.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Person 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-lg p-6 border border-border"
          >
            <div className="flex flex-col items-center mb-6">
              <Silhouette size="md" variant="solid" />
              <div className="mt-4 text-center">
                <div className="font-semibold">You</div>
                {session.person1.persona.role && (
                  <div className="inline-block bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded mt-2">
                    {PERSONA_ROLES[session.person1.persona.role]}
                  </div>
                )}
                {session.person1.persona.title && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {session.person1.persona.title}
                  </div>
                )}
              </div>
            </div>

            {!person1Complete ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    What's your initial take?
                  </label>
                  <Textarea
                    placeholder="Share your current perspective, feelings, or thoughts on this topic..."
                    value={person1Reading}
                    onChange={(e) => setPerson1Reading(e.target.value)}
                    className="min-h-32 resize-none"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={handlePerson1Submit}
                  disabled={!person1Reading.trim()}
                  className="w-full"
                >
                  Record Baseline
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-primary/10 rounded-lg p-4 border border-primary/30"
              >
                <div className="text-sm text-muted-foreground mb-2">Your baseline recorded:</div>
                <p className="text-sm text-foreground italic">{person1Reading}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Person 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-lg p-6 border border-border"
          >
            <div className="flex flex-col items-center mb-6">
              <Silhouette size="md" variant="solid" />
              <div className="mt-4 text-center">
                <div className="font-semibold">Your Partner</div>
                {session.person2.persona.role && (
                  <div className="inline-block bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded mt-2">
                    {PERSONA_ROLES[session.person2.persona.role]}
                  </div>
                )}
                {session.person2.persona.title && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {session.person2.persona.title}
                  </div>
                )}
              </div>
            </div>

            {!person2Complete ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    What's their initial take?
                  </label>
                  <Textarea
                    placeholder="Share their current perspective, feelings, or thoughts on this topic..."
                    value={person2Reading}
                    onChange={(e) => setPerson2Reading(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                </div>
                <Button
                  onClick={handlePerson2Submit}
                  disabled={!person2Reading.trim()}
                  className="w-full"
                >
                  Record Baseline
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-primary/10 rounded-lg p-4 border border-primary/30"
              >
                <div className="text-sm text-muted-foreground mb-2">Baseline recorded:</div>
                <p className="text-sm text-foreground italic">{person2Reading}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Action buttons */}
        {person1Complete && person2Complete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4"
          >
            <Button
              variant="outline"
              onClick={() => {
                setPerson1Complete(false);
                setPerson2Complete(false);
              }}
            >
              Edit Baselines
            </Button>
            <Button onClick={handleBeginConversation} className="px-8">
              Begin Conversation
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BaselineReadingCapture;
