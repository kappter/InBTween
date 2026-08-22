/**
 * Post-Conversation Reflection
 * 
 * Captures post-conversation readings and role reflections.
 * Allows users to see how their perspective shifted and how roles evolved.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useConversation } from '@/contexts/ConversationContext';
import { Silhouette } from '@/components/Silhouette';
import { PERSONA_ROLES } from '@/types/conversation';

interface PostConversationReflectionProps {
  onComplete: () => void;
}

export const PostConversationReflection: React.FC<PostConversationReflectionProps> = ({
  onComplete,
}) => {
  const { session, addPostConversationReading, addRoleReflection } = useConversation();

  // Post-conversation readings
  const [person1NewReading, setPerson1NewReading] = useState('');
  const [person2NewReading, setPerson2NewReading] = useState('');
  const [person1ReadingComplete, setPerson1ReadingComplete] = useState(false);
  const [person2ReadingComplete, setPerson2ReadingComplete] = useState(false);

  // Role reflections
  const [person1RoleShifted, setPerson1RoleShifted] = useState(false);
  const [person1RoleDescription, setPerson1RoleDescription] = useState('');
  const [person1RoleInverted, setPerson1RoleInverted] = useState(false);
  const [person1RoleInsights, setPerson1RoleInsights] = useState('');
  const [person1RoleComplete, setPerson1RoleComplete] = useState(false);

  const [person2RoleShifted, setPerson2RoleShifted] = useState(false);
  const [person2RoleDescription, setPerson2RoleDescription] = useState('');
  const [person2RoleInverted, setPerson2RoleInverted] = useState(false);
  const [person2RoleInsights, setPerson2RoleInsights] = useState('');
  const [person2RoleComplete, setPerson2RoleComplete] = useState(false);

  const person1Baseline = session?.baselineReadings.find((r) => r.personId === 'person1')?.text || '';
  const person2Baseline = session?.baselineReadings.find((r) => r.personId === 'person2')?.text || '';

  const handlePerson1ReadingSubmit = () => {
    if (person1NewReading.trim()) {
      addPostConversationReading({
        personId: 'person1',
        timestamp: Date.now(),
        text: person1NewReading,
        shiftedFrom: person1Baseline,
      });
      setPerson1ReadingComplete(true);
    }
  };

  const handlePerson2ReadingSubmit = () => {
    if (person2NewReading.trim()) {
      addPostConversationReading({
        personId: 'person2',
        timestamp: Date.now(),
        text: person2NewReading,
        shiftedFrom: person2Baseline,
      });
      setPerson2ReadingComplete(true);
    }
  };

  const handlePerson1RoleSubmit = () => {
    if (person1RoleShifted && person1RoleDescription.trim()) {
      addRoleReflection({
        personId: 'person1',
        timestamp: Date.now(),
        originalPersona: session?.person1.persona.title || 'No persona',
        currentPersona: person1RoleDescription,
        roleInverted: person1RoleInverted,
        insights: person1RoleInsights,
      });
      setPerson1RoleComplete(true);
    } else if (!person1RoleShifted) {
      setPerson1RoleComplete(true);
    }
  };

  const handlePerson2RoleSubmit = () => {
    if (person2RoleShifted && person2RoleDescription.trim()) {
      addRoleReflection({
        personId: 'person2',
        timestamp: Date.now(),
        originalPersona: session?.person2.persona.title || 'No persona',
        currentPersona: person2RoleDescription,
        roleInverted: person2RoleInverted,
        insights: person2RoleInsights,
      });
      setPerson2RoleComplete(true);
    } else if (!person2RoleShifted) {
      setPerson2RoleComplete(true);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!session) return null;

  const allReadingsComplete = person1ReadingComplete && person2ReadingComplete;
  const allRolesComplete = person1RoleComplete && person2RoleComplete;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-2">Reflection & Transformation</h1>
          <p className="text-lg text-muted-foreground">
            How has your perspective shifted? How have your roles evolved?
          </p>
        </div>

        {/* Post-Conversation Readings */}
        {!allReadingsComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-display font-bold mb-8 text-center">Take Your Pulse Again</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Person 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
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
                  </div>
                </div>

                {!person1ReadingComplete ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold block mb-2">
                        Your perspective now:
                      </label>
                      <Textarea
                        placeholder="How has your thinking shifted? What's different now?"
                        value={person1NewReading}
                        onChange={(e) => setPerson1NewReading(e.target.value)}
                        className="min-h-32 resize-none"
                        autoFocus
                      />
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        Your baseline:
                      </div>
                      <p className="text-sm text-foreground/70 italic">{person1Baseline}</p>
                    </div>

                    <Button
                      onClick={handlePerson1ReadingSubmit}
                      disabled={!person1NewReading.trim()}
                      className="w-full"
                    >
                      Record New Reading
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-primary/10 rounded-lg p-4 border border-primary/30"
                  >
                    <div className="text-sm text-muted-foreground mb-2">Your new perspective:</div>
                    <p className="text-sm text-foreground italic">{person1NewReading}</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Person 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
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
                  </div>
                </div>

                {!person2ReadingComplete ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold block mb-2">
                        Their perspective now:
                      </label>
                      <Textarea
                        placeholder="How has their thinking shifted? What's different now?"
                        value={person2NewReading}
                        onChange={(e) => setPerson2NewReading(e.target.value)}
                        className="min-h-32 resize-none"
                      />
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        Their baseline:
                      </div>
                      <p className="text-sm text-foreground/70 italic">{person2Baseline}</p>
                    </div>

                    <Button
                      onClick={handlePerson2ReadingSubmit}
                      disabled={!person2NewReading.trim()}
                      className="w-full"
                    >
                      Record New Reading
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-primary/10 rounded-lg p-4 border border-primary/30"
                  >
                    <div className="text-sm text-muted-foreground mb-2">Their new perspective:</div>
                    <p className="text-sm text-foreground italic">{person2NewReading}</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Role Reflections */}
        {allReadingsComplete && !allRolesComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-display font-bold mb-8 text-center">Role Transformation</h2>
            <p className="text-center text-muted-foreground mb-8">
              Did your roles shift during the conversation? Did the therapist become the patient?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Person 1 Role */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
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
                  </div>
                </div>

                {!person1RoleComplete ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="person1-role-shifted"
                        checked={person1RoleShifted}
                        onCheckedChange={(checked) => setPerson1RoleShifted(checked as boolean)}
                      />
                      <label htmlFor="person1-role-shifted" className="text-sm cursor-pointer">
                        My role shifted during this conversation
                      </label>
                    </div>

                    {person1RoleShifted && (
                      <>
                        <div>
                          <label className="text-sm font-semibold block mb-2">
                            How would you describe your role now?
                          </label>
                          <Textarea
                            placeholder="What role did you end up in? What changed?"
                            value={person1RoleDescription}
                            onChange={(e) => setPerson1RoleDescription(e.target.value)}
                            className="min-h-20 resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="person1-inverted"
                            checked={person1RoleInverted}
                            onCheckedChange={(checked) => setPerson1RoleInverted(checked as boolean)}
                          />
                          <label htmlFor="person1-inverted" className="text-sm cursor-pointer">
                            My role inverted (e.g., teacher became student)
                          </label>
                        </div>

                        <div>
                          <label className="text-sm font-semibold block mb-2">
                            Insights on this shift:
                          </label>
                          <Textarea
                            placeholder="What does this role shift mean? What did you learn?"
                            value={person1RoleInsights}
                            onChange={(e) => setPerson1RoleInsights(e.target.value)}
                            className="min-h-20 resize-none"
                          />
                        </div>
                      </>
                    )}

                    <Button
                      onClick={handlePerson1RoleSubmit}
                      disabled={person1RoleShifted && !person1RoleDescription.trim()}
                      className="w-full"
                    >
                      Record Role Reflection
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-primary/10 rounded-lg p-4 border border-primary/30 text-sm"
                  >
                    {person1RoleShifted ? (
                      <>
                        <div className="font-semibold mb-2">Role shifted</div>
                        <p className="text-foreground/70 mb-2">{person1RoleDescription}</p>
                        {person1RoleInverted && (
                          <p className="text-foreground/70 italic">Role inverted during conversation</p>
                        )}
                      </>
                    ) : (
                      <p className="text-foreground/70">Role remained stable</p>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Person 2 Role */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
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
                  </div>
                </div>

                {!person2RoleComplete ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="person2-role-shifted"
                        checked={person2RoleShifted}
                        onCheckedChange={(checked) => setPerson2RoleShifted(checked as boolean)}
                      />
                      <label htmlFor="person2-role-shifted" className="text-sm cursor-pointer">
                        Their role shifted during this conversation
                      </label>
                    </div>

                    {person2RoleShifted && (
                      <>
                        <div>
                          <label className="text-sm font-semibold block mb-2">
                            How would you describe their role now?
                          </label>
                          <Textarea
                            placeholder="What role did they end up in? What changed?"
                            value={person2RoleDescription}
                            onChange={(e) => setPerson2RoleDescription(e.target.value)}
                            className="min-h-20 resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="person2-inverted"
                            checked={person2RoleInverted}
                            onCheckedChange={(checked) => setPerson2RoleInverted(checked as boolean)}
                          />
                          <label htmlFor="person2-inverted" className="text-sm cursor-pointer">
                            Their role inverted
                          </label>
                        </div>

                        <div>
                          <label className="text-sm font-semibold block mb-2">
                            Insights on this shift:
                          </label>
                          <Textarea
                            placeholder="What does this role shift mean? What did you learn?"
                            value={person2RoleInsights}
                            onChange={(e) => setPerson2RoleInsights(e.target.value)}
                            className="min-h-20 resize-none"
                          />
                        </div>
                      </>
                    )}

                    <Button
                      onClick={handlePerson2RoleSubmit}
                      disabled={person2RoleShifted && !person2RoleDescription.trim()}
                      className="w-full"
                    >
                      Record Role Reflection
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-primary/10 rounded-lg p-4 border border-primary/30 text-sm"
                  >
                    {person2RoleShifted ? (
                      <>
                        <div className="font-semibold mb-2">Role shifted</div>
                        <p className="text-foreground/70 mb-2">{person2RoleDescription}</p>
                        {person2RoleInverted && (
                          <p className="text-foreground/70 italic">Role inverted during conversation</p>
                        )}
                      </>
                    ) : (
                      <p className="text-foreground/70">Role remained stable</p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Complete Button */}
        {allReadingsComplete && allRolesComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Button onClick={handleComplete} className="px-8 py-6 text-lg">
              View Conversation Summary
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PostConversationReflection;
