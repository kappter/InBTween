/**
 * Favor Tracker
 * 
 * Visualizes relational alignment between two people during a conversation.
 * Shows two converging/diverging curves representing movement toward or away from favor.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MotionMoment } from '@/types/conversation';

interface FavorTrackerProps {
  motionMoments: MotionMoment[];
}

export const FavorTracker: React.FC<FavorTrackerProps> = ({ motionMoments }) => {
  // Calculate cumulative favor scores for each person
  const scores = useMemo(() => {
    let person1Total = 0;
    let person2Total = 0;
    const timeline: Array<{ person1: number; person2: number; time: number }> = [];

    motionMoments.forEach((moment) => {
      if (moment.personId === 'person1') {
        person1Total += moment.favorScore || 0;
      } else {
        person2Total += moment.favorScore || 0;
      }
      timeline.push({
        person1: person1Total,
        person2: person2Total,
        time: moment.timestamp,
      });
    });

    return { person1Total, person2Total, timeline };
  }, [motionMoments]);

  // Normalize scores to 0-100 range for visualization
  const maxScore = Math.max(Math.abs(scores.person1Total), Math.abs(scores.person2Total), 10);
  const person1Normalized = ((scores.person1Total / maxScore) * 50) + 50;
  const person2Normalized = ((scores.person2Total / maxScore) * 50) + 50;

  // Generate SVG path for curves
  const generatePath = (data: typeof scores.timeline, personIndex: 0 | 1) => {
    if (data.length === 0) return '';

    const width = 600;
    const height = 200;
    const padding = 20;

    const points = data.map((point, idx) => {
      const x = padding + (idx / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const value = personIndex === 0 ? point.person1 : point.person2;
      const normalized = ((value / maxScore) * 50) + 50;
      const y = height - (normalized / 100) * (height - padding * 2) - padding;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const path1 = generatePath(scores.timeline, 0);
  const path2 = generatePath(scores.timeline, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-lg p-6 border border-border mb-8"
    >
      <h2 className="text-lg font-semibold mb-6">Relational Alignment</h2>

      {motionMoments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Motion moments will appear here as you capture insight shifts</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SVG Chart */}
          <div className="overflow-x-auto">
            <svg width="100%" height="250" viewBox="0 0 640 250" className="min-w-full">
              {/* Grid lines */}
              <line x1="20" y1="50" x2="620" y2="50" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="20" y1="100" x2="620" y2="100" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="20" y1="150" x2="620" y2="150" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="20" y1="200" x2="620" y2="200" stroke="currentColor" strokeOpacity="0.1" />

              {/* Center line (neutral) */}
              <line x1="20" y1="125" x2="620" y2="125" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="5,5" />

              {/* Person 1 curve */}
              {path1 && (
                <path
                  d={path1}
                  fill="none"
                  stroke="rgb(217, 119, 6)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Person 2 curve */}
              {path2 && (
                <path
                  d={path2}
                  fill="none"
                  stroke="rgb(79, 70, 229)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {scores.timeline.map((point, idx) => {
                const x = 20 + (idx / Math.max(scores.timeline.length - 1, 1)) * 600;
                const y1 = 200 - (((point.person1 / maxScore) * 50 + 50) / 100) * 150;
                const y2 = 200 - (((point.person2 / maxScore) * 50 + 50) / 100) * 150;

                return (
                  <g key={idx}>
                    <circle cx={x} cy={y1} r="4" fill="rgb(217, 119, 6)" opacity="0.7" />
                    <circle cx={x} cy={y2} r="4" fill="rgb(79, 70, 229)" opacity="0.7" />
                  </g>
                );
              })}

              {/* Axes */}
              <line x1="20" y1="50" x2="20" y2="200" stroke="currentColor" strokeOpacity="0.2" />
              <line x1="20" y1="200" x2="620" y2="200" stroke="currentColor" strokeOpacity="0.2" />
            </svg>
          </div>

          {/* Legend and Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(217, 119, 6)' }} />
                <span className="text-sm font-semibold">You</span>
              </div>
              <div className={`text-2xl font-bold ${scores.person1Total > 0 ? 'text-green-600' : scores.person1Total < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {scores.person1Total > 0 ? '+' : ''}{scores.person1Total}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {scores.person1Total > 0 ? 'Moving into favor' : scores.person1Total < 0 ? 'Moving out of favor' : 'Neutral'}
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(79, 70, 229)' }} />
                <span className="text-sm font-semibold">Partner</span>
              </div>
              <div className={`text-2xl font-bold ${scores.person2Total > 0 ? 'text-green-600' : scores.person2Total < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {scores.person2Total > 0 ? '+' : ''}{scores.person2Total}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {scores.person2Total > 0 ? 'Moving into favor' : scores.person2Total < 0 ? 'Moving out of favor' : 'Neutral'}
              </div>
            </div>
          </div>

          {/* Gap indicator */}
          <div className="bg-muted rounded-lg p-4">
            <div className="text-sm font-semibold mb-2">Alignment Gap</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    Math.abs(scores.person1Total - scores.person2Total) < 5
                      ? 'bg-green-500'
                      : Math.abs(scores.person1Total - scores.person2Total) < 15
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min((Math.abs(scores.person1Total - scores.person2Total) / 30) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                {Math.abs(scores.person1Total - scores.person2Total)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {Math.abs(scores.person1Total - scores.person2Total) < 5
                ? 'Highly aligned'
                : Math.abs(scores.person1Total - scores.person2Total) < 15
                ? 'Moderately aligned'
                : 'Diverging'}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FavorTracker;
