/**
 * Conversation Stage Guide
 * 
 * Displays the current stage of the conversation with guidance and timing.
 * Includes motion/movement buttons for BOTH participants to capture insight shifts.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useConversation } from '@/contexts/ConversationContext';
import { CONVERSATION_STAGES, PersonaRole } from '@/types/conversation';
import { PERSONA_ROLES } from '@/types/conversation';
import { FavorTracker } from '@/components/FavorTracker';
import { Zap } from 'lucide-react';

interface ConversationStageGuideProps {
  onMotion: (personId: 'person1' | 'person2', insight: string) => void;
  onStageComplete: () => void;
}

export const ConversationStageGuide: React.FC<ConversationStageGuideProps> = ({
  onMotion,
  onStageComplete,
}) => {
  const { session, addMotionMoment } = useConversation();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showMotionDialog, setShowMotionDialog] = useState<'person1' | 'person2' | null>(null);
  const [person1Insight, setPerson1Insight] = useState('');
  const [person1FavorScore, setPerson1FavorScore] = useState(0);
  const [person2Insight, setPerson2Insight] = useState('');
  const [person2FavorScore, setPerson2FavorScore] = useState(0);

  const currentStage = CONVERSATION_STAGES[currentStageIndex];
  const suggestedDurationMs = (currentStage.suggestedDuration || 5) * 60 * 1000;

  // Timer for current stage
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMotionCapture = (personId: 'person1' | 'person2') => {
    const insight = personId === 'person1' ? person1Insight : person2Insight;
    const favorScore = personId === 'person1' ? person1FavorScore : person2FavorScore;
    
    if (insight.trim()) {
      addMotionMoment({
        personId,
        timestamp: Date.now(),
        insight,
        stageIndex: currentStageIndex,
        favorScore,
      });
      
      onMotion(personId, insight);
      
      if (personId === 'person1') {
        setPerson1Insight('');
        setPerson1FavorScore(0);
      } else {
        setPerson2Insight('');
        setPerson2FavorScore(0);
      }
      
      setShowMotionDialog(null);
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex < CONVERSATION_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setTimeElapsed(0);
    } else {
      onStageComplete();
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isTimeWarning = timeElapsed > suggestedDurationMs;

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-4xl w-full">
        {/* Stage Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentStageIndex}
          className="text-center mb-12"
        >
          <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">
              Stage {currentStageIndex + 1} of {CONVERSATION_STAGES.length}
            </span>
          </div>

          <h1 className="text-4xl font-display font-bold mb-2">{currentStage.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{currentStage.description}</p>

          {/* Timer */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={`text-3xl font-mono font-bold transition-colors ${
                isTimeWarning ? 'text-destructive' : 'text-primary'
              }`}
            >
              {formatTime(timeElapsed)}
            </div>
            {currentStage.suggestedDuration && (
              <div className="text-sm text-muted-foreground">
                / {currentStage.suggestedDuration} min suggested
              </div>
            )}
          </div>
        </motion.div>

        {/* Favor Tracker */}
        <FavorTracker motionMoments={session.motionMoments} />

        {/* Guidance Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg p-8 border border-border mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Guidance for this stage</h2>
          <p className="text-base text-foreground/80 leading-relaxed mb-6">
            {currentStage.guidance}
          </p>

          {/* Topic reminder */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-sm font-semibold text-muted-foreground mb-1">Topic</div>
            <div className="text-lg font-semibold text-foreground">{session.topic}</div>
          </div>
        </motion.div>

        {/* Motion/Movement Buttons for Both People */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {/* Person 1 Motion Button */}
          <Button
            variant="outline"
            onClick={() => setShowMotionDialog('person1')}
            className="h-12 border-2 hover:border-primary hover:bg-primary/5"
          >
            <Zap className="w-4 h-4 mr-2" />
            <span>
              <span className="font-semibold">You</span>
              {session.person1.persona.role && (
                <span className="text-xs ml-2">({PERSONA_ROLES[session.person1.persona.role]})</span>
              )}
              {' - My Insight is Shifting'}
            </span>
          </Button>

          {/* Person 2 Motion Button */}
          <Button
            variant="outline"
            onClick={() => setShowMotionDialog('person2')}
            className="h-12 border-2 hover:border-primary hover:bg-primary/5"
          >
            <Zap className="w-4 h-4 mr-2" />
            <span>
              <span className="font-semibold">Partner</span>
              {session.person2.persona.role && (
                <span className="text-xs ml-2">({PERSONA_ROLES[session.person2.persona.role]})</span>
              )}
              {' - Insight is Shifting'}
            </span>
          </Button>
        </motion.div>

        {/* Motion Dialogs */}
        <AnimatePresence>
          {showMotionDialog === 'person1' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card rounded-lg p-6 border border-primary/30 mb-8"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Your Insight Shift
              </h3>

              <Textarea
                placeholder="What's shifting in your thinking? What surprised you? What's becoming clearer?"
                value={person1Insight}
                onChange={(e) => setPerson1Insight(e.target.value)}
                className="min-h-24 resize-none mb-6"
                autoFocus
              />

              <div className="mb-6">
                <label className="text-sm font-semibold block mb-3">
                  How are you moving? (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Out of favor</span>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={person1FavorScore}
                    onChange={(e) => setPerson1FavorScore(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">Into favor</span>
                </div>
                <div className="text-center mt-2">
                  <span className={`text-sm font-semibold ${person1FavorScore > 0 ? 'text-green-600' : person1FavorScore < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {person1FavorScore > 0 ? '+' : ''}{person1FavorScore}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMotionDialog(null);
                    setPerson1Insight('');
                    setPerson1FavorScore(0);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleMotionCapture('person1')}
                  disabled={!person1Insight.trim()}
                  className="flex-1"
                >
                  Record Insight
                </Button>
              </div>
            </motion.div>
          )}

          {showMotionDialog === 'person2' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card rounded-lg p-6 border border-primary/30 mb-8"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Partner's Insight Shift
              </h3>

              <Textarea
                placeholder="What's shifting in their thinking? What are they discovering? What's becoming clearer for them?"
                value={person2Insight}
                onChange={(e) => setPerson2Insight(e.target.value)}
                className="min-h-24 resize-none mb-6"
                autoFocus
              />

              <div className="mb-6">
                <label className="text-sm font-semibold block mb-3">
                  How are they moving? (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Out of favor</span>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={person2FavorScore}
                    onChange={(e) => setPerson2FavorScore(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">Into favor</span>
                </div>
                <div className="text-center mt-2">
                  <span className={`text-sm font-semibold ${person2FavorScore > 0 ? 'text-green-600' : person2FavorScore < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {person2FavorScore > 0 ? '+' : ''}{person2FavorScore}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMotionDialog(null);
                    setPerson2Insight('');
                    setPerson2FavorScore(0);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleMotionCapture('person2')}
                  disabled={!person2Insight.trim()}
                  className="flex-1"
                >
                  Record Insight
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStageIndex > 0) {
                setCurrentStageIndex(currentStageIndex - 1);
                setTimeElapsed(0);
              }
            }}
            disabled={currentStageIndex === 0}
          >
            Previous Stage
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentStageIndex + 1} of {CONVERSATION_STAGES.length}
          </div>

          <Button
            onClick={handleNextStage}
            className={currentStageIndex === CONVERSATION_STAGES.length - 1 ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {currentStageIndex === CONVERSATION_STAGES.length - 1
              ? 'Move to Reflection'
              : 'Next Stage'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationStageGuide;
