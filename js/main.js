import { sessionState } from "./state.js";
import { renderCircle } from "./ui.js";

// TEMP: seed data so you can see something
sessionState.topic = "Trust";

sessionState.participants = [
  { id: "A", name: "Participant A", type: "participant", isActive: false },
  { id: "B", name: "Participant B", type: "participant", isActive: false }
];

sessionState.personas = [
  { id: "PA", name: "Advocate A", type: "persona", isActive: true },
  { id: "PB", name: "Historian B", type: "persona", isActive: false }
];

// Initial render
renderCircle(sessionState);
