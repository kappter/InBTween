import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EmotionalState = 'high' | 'meh' | 'low';
type SelectableState = EmotionalState | null;

interface StateDescriptor {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  icon: string;
}

interface InteractionDescription {
  title: string;
  description: string;
  dynamics: string[];
  tone: 'positive' | 'neutral' | 'complex' | 'challenging';
}

const STATES: Record<EmotionalState | 'null', StateDescriptor> = {
  high: {
    label: 'High',
    color: 'oklch(0.75 0.15 65)',
    bgColor: 'bg-[oklch(0.75_0.15_65)]',
    description: 'Excited, energized, riding something good',
    icon: '↑',
  },
  meh: {
    label: 'Meh',
    color: 'oklch(0.65 0.02 65)',
    bgColor: 'bg-[oklch(0.65_0.02_65)]',
    description: 'Average day, present but not inspired',
    icon: '→',
  },
  low: {
    label: 'Low',
    color: 'oklch(0.35 0.12 280)',
    bgColor: 'bg-[oklch(0.35_0.12_280)]',
    description: 'Wounded, damaged, dealing with pain',
    icon: '↓',
  },
  null: {
    label: '',
    color: '',
    bgColor: '',
    description: '',
    icon: '',
  },
};

const INTERACTIONS: Record<string, InteractionDescription> = {
  'high-high': {
    title: 'High Meets High',
    description: 'Easy. Good energy.',
    dynamics: [
      'Momentum compounds',
      'Shared excitement creates resonance',
      'Natural alignment',
      'Potential for growth or inspiration',
    ],
    tone: 'positive',
  },
  'high-meh': {
    title: 'High Meets Meh',
    description: 'Usually manageable.',
    dynamics: [
      'Can pull someone out of neutrality',
      'Energy transfer in one direction',
      'Potential to lift or inspire',
      'May leave a mark, though subtle',
    ],
    tone: 'neutral',
  },
  'high-low': {
    title: 'High Meets Low',
    description: 'Friction. Fireworks. Boundaries. Momentum.',
    dynamics: [
      'Real movement and energy',
      'Potential for growth or rupture',
      'Humans reach a point where they won\'t tolerate being pulled',
      '"I was having a perfectly good day until I met you"',
      'Can lift, deflate, harden, or neutralize both people',
    ],
    tone: 'challenging',
  },
  'meh-meh': {
    title: 'Meh Meets Meh',
    description: 'Just meh.',
    dynamics: [
      'Mutual neutrality',
      'Won\'t leave much of a mark',
      'Stable but uninspiring',
      'Comfortable absence',
    ],
    tone: 'neutral',
  },
  'meh-low': {
    title: 'Meh Meets Low',
    description: 'Usually manageable.',
    dynamics: [
      'Can pull someone toward sharper awareness',
      'Energy transfer in one direction',
      'May inspire empathy or concern',
      'Potential for connection or distance',
    ],
    tone: 'neutral',
  },
  'low-low': {
    title: 'Low Meets Low',
    description: 'Surprisingly gentle.',
    dynamics: [
      'Often more empathetic than expected',
      'Shared pain creates understanding',
      '"I\'m sorry you\'re dealing with that"',
      'More likely to listen deeply',
      'Risk: pain redirected into conflict',
    ],
    tone: 'complex',
  },
};

export default function StateVisualization() {
  const [firstState, setFirstState] = useState<SelectableState>(null);
  const [secondState, setSecondState] = useState<SelectableState>(null);
  const [showInteraction, setShowInteraction] = useState(false);

  useEffect(() => {
    if (firstState && secondState) {
      setShowInteraction(true);
    } else {
      setShowInteraction(false);
    }
  }, [firstState, secondState]);

  const getInteractionKey = (): string => {
    if (!firstState || !secondState) return '';
    const states = [firstState, secondState].sort();
    return `${states[0]}-${states[1]}`;
  };

  const interaction = INTERACTIONS[getInteractionKey()];

  const getToneColor = (tone: string): string => {
    switch (tone) {
      case 'positive':
        return 'border-green-300 bg-green-50';
      case 'neutral':
        return 'border-amber-200 bg-amber-50';
      case 'complex':
        return 'border-purple-300 bg-purple-50';
      case 'challenging':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleStateSelect = (state: EmotionalState): void => {
    if (firstState === null) {
      setFirstState(state);
    } else if (secondState === null) {
      setSecondState(state);
    } else {
      // Reset and start over
      setFirstState(state);
      setSecondState(null);
    }
  };

  const handleReset = () => {
    setFirstState(null);
    setSecondState(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-2">InBetween States</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore the dynamics of emotional states when two people meet. Where are you today?
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto w-full">
        {/* Left Sidebar - State Selection */}
        <div className="lg:w-80 flex flex-col gap-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Select Your States
            </h2>
            <div className="space-y-3">
              {(['high', 'meh', 'low'] as const).map((state) => (
                <motion.button
                  key={state}
                  onClick={() => handleStateSelect(state)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    firstState === state || secondState === state
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
                      <div className="font-semibold text-base">{STATES[state].label}</div>
                      <div className="text-xs text-muted-foreground">{STATES[state].description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Selected States Display */}
          {(firstState || secondState) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-card border border-border"
            >
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Your Selection</h3>
              <div className="space-y-2">
                {firstState && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Person A:</span>
                    <span className="font-semibold">{STATES[firstState].label}</span>
                  </div>
                )}
                {secondState && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Person B:</span>
                    <span className="font-semibold">{STATES[secondState].label}</span>
                  </div>
                )}
              </div>
              {(firstState || secondState) && (
                <button
                  onClick={handleReset}
                  className="mt-4 w-full px-3 py-2 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors"
                >
                  Reset
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Canvas - Interaction Visualization */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Visualization Area */}
          <div className="relative h-96 rounded-lg border border-border bg-gradient-to-br from-background to-card overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
              <defs>
                <pattern id="dots" x="20" y="20" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>

            <AnimatePresence>
              {firstState && (
                <motion.div
                  key="first-state"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6 }}
                  className="absolute left-12 top-1/2 -translate-y-1/2"
                >
                  <div
                    className="w-24 h-24 rounded-full shadow-lg"
                    style={{
                      backgroundColor: STATES[firstState].color,
                      boxShadow: `0 0 30px ${STATES[firstState].color}40`,
                    }}
                  />
                  <div className="text-center mt-4 font-semibold">{STATES[firstState].label}</div>
                </motion.div>
              )}

              {secondState && (
                <motion.div
                  key="second-state"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="absolute right-12 top-1/2 -translate-y-1/2"
                >
                  <div
                    className="w-24 h-24 rounded-full shadow-lg"
                    style={{
                      backgroundColor: STATES[secondState].color,
                      boxShadow: `0 0 30px ${STATES[secondState].color}40`,
                    }}
                  />
                  <div className="text-center mt-4 font-semibold">{STATES[secondState].label}</div>
                </motion.div>
              )}

              {firstState && secondState && (
                <motion.svg
                  key="interaction-flow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                >
                  <defs>
                    <linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={STATES[firstState].color} stopOpacity="0.6" />
                      <stop offset="50%" stopColor="oklch(0.85 0.01 65)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor={STATES[secondState].color} stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 96 192 Q 384 100, 672 192"
                    stroke="url(#flow)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>

            {!firstState && (
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium">Select your emotional state to begin</p>
                </div>
              </div>
            )}
          </div>

          {/* Interaction Details */}
          <AnimatePresence>
            {showInteraction && interaction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-6 rounded-lg border-2 ${getToneColor(interaction.tone)}`}
              >
                <h3 className="text-2xl font-display font-bold mb-2">{interaction.title}</h3>
                <p className="text-lg font-medium mb-4 text-foreground/80">{interaction.description}</p>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Dynamics
                  </h4>
                  <ul className="space-y-1">
                    {interaction.dynamics.map((dynamic, idx) => (
                      <motion.li
                        key={`${getInteractionKey()}-dynamic-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1 text-primary">•</span>
                        <span>{dynamic}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            "Hey, where are you today?" — A reflection on the emotional states we bring to each encounter.
          </p>
        </div>
      </footer>
    </div>
  );
}
