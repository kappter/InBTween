/**
 * Home Page
 * 
 * Main entry point for the InBetween States application.
 * Orchestrates the complete conversation flow:
 * 1. Setup (wizard)
 * 2. Baseline readings
 * 3. Conversation with stages
 * 4. Post-conversation reflection
 * 5. Summary
 */

import React, { useState } from 'react';
import { ConversationWizard } from '@/components/ConversationWizard';
import { BaselineReadingCapture } from '@/components/BaselineReadingCapture';
import { ConversationStageGuide } from '@/components/ConversationStageGuide';
import { PostConversationReflection } from '@/components/PostConversationReflection';
import { FavorTracker } from '@/components/FavorTracker';
import { useConversation } from '@/contexts/ConversationContext';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { session, resetSession, addMotionMoment, updateStatus } = useConversation();
  const [wizardComplete, setWizardComplete] = useState(false);
  const [baselineComplete, setBaselineComplete] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [reflectionComplete, setReflectionComplete] = useState(false);

  const handleWizardComplete = () => {
    setWizardComplete(true);
  };

  const handleBaselineComplete = () => {
    setBaselineComplete(true);
  };

  const handleMotionCapture = (personId: 'person1' | 'person2', insight: string) => {
    // Motion capture is now handled directly in ConversationStageGuide
    // This callback is kept for any additional processing if needed
  };

  const handleConversationComplete = () => {
    setConversationComplete(true);
  };

  const handleReflectionComplete = () => {
    setReflectionComplete(true);
    updateStatus('complete');
  };

  const handleStartOver = () => {
    resetSession();
    setWizardComplete(false);
    setBaselineComplete(false);
    setConversationComplete(false);
    setReflectionComplete(false);
  };

  // Step 1: Setup Wizard
  if (!wizardComplete) {
    return <ConversationWizard onComplete={handleWizardComplete} />;
  }

  // Step 2: Baseline Readings
  if (!baselineComplete) {
    return <BaselineReadingCapture onComplete={handleBaselineComplete} />;
  }

  // Step 3: Conversation with Stage Guidance
  if (!conversationComplete) {
    return (
      <ConversationStageGuide
        onMotion={(personId, insight) => handleMotionCapture(personId, insight)}
        onStageComplete={handleConversationComplete}
      />
    );
  }

  // Step 4: Post-Conversation Reflection
  if (!reflectionComplete) {
    return <PostConversationReflection onComplete={handleReflectionComplete} />;
  }

  // Step 5: Summary & Completion
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">Conversation Complete</h1>
          <p className="text-lg text-muted-foreground">
            You've navigated a structured dialogue with awareness and intention.
          </p>
        </div>

        {session && (
          <div className="space-y-8">
            {/* Conversation Summary */}
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-display font-bold mb-6">Conversation Summary</h2>

              <div className="space-y-6">
                {/* Topic */}
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Topic</div>
                  <div className="text-xl font-semibold">{session.topic}</div>
                </div>

                {/* Relational Alignment Chart */}
                <div>
                  <FavorTracker motionMoments={session.motionMoments} />
                </div>

                {/* Person 1: Baseline vs Post-Conversation */}
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(217, 119, 6)' }} />
                    You (Baseline → New Perspective)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">Baseline</div>
                      <div className="bg-muted/50 rounded p-4 text-sm text-foreground/70">
                        {session.baselineReadings.find((r) => r.personId === 'person1')?.text ||
                          'No baseline recorded'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">New Perspective</div>
                      <div className="bg-primary/10 rounded p-4 text-sm text-foreground">
                        {session.postConversationReadings.find((r) => r.personId === 'person1')?.text ||
                          'No reflection recorded'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Person 2: Baseline vs Post-Conversation */}
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(79, 70, 229)' }} />
                    Your Partner (Baseline → New Perspective)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">Baseline</div>
                      <div className="bg-muted/50 rounded p-4 text-sm text-foreground/70">
                        {session.baselineReadings.find((r) => r.personId === 'person2')?.text ||
                          'No baseline recorded'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">New Perspective</div>
                      <div className="bg-primary/10 rounded p-4 text-sm text-foreground">
                        {session.postConversationReadings.find((r) => r.personId === 'person2')?.text ||
                          'No reflection recorded'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motion Moments */}
                {session.motionMoments.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-3">
                      Insights That Shifted
                    </div>
                    <div className="space-y-2">
                      {session.motionMoments.map((moment, idx) => (
                        <div key={idx} className="bg-muted/50 rounded p-3 text-sm">
                          <div className="font-semibold text-foreground mb-1">
                            {new Date(moment.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="text-foreground/70">{moment.insight}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role Reflections */}
                {session.roleReflections.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-3">
                      Role Transformations
                    </div>
                    <div className="space-y-2">
                      {session.roleReflections.map((reflection, idx) => (
                        <div key={idx} className="bg-muted/50 rounded p-3 text-sm">
                          <div className="font-semibold text-foreground mb-1">
                            {reflection.personId === 'person1' ? 'You' : 'Your Partner'}
                          </div>
                          {reflection.roleInverted && (
                            <div className="text-primary font-semibold mb-1">
                              ⚡ Role Inverted
                            </div>
                          )}
                          <div className="text-foreground/70">{reflection.currentPersona}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Session Metadata */}
            <div className="bg-muted/50 rounded-lg p-6 border border-border text-sm text-muted-foreground">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-foreground mb-1">Session ID</div>
                  <div className="font-mono text-xs">{session.id}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">Status</div>
                  <div className="capitalize">{session.status}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleStartOver}>
                Start New Conversation
              </Button>
              <Button disabled>
                Export Summary (Coming Soon)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
