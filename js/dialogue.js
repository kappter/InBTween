export function canAdvancePhase(state) {
  switch (state.phase) {
    case "intro":
      return allParticipantsIntroduced(state);
    case "persona":
      return allPersonasHaveSpoken(state);
    case "clarification":
      return allAcknowledgementsGiven(state);
    case "direct":
      return false;
    default:
      return false;
  }
}
