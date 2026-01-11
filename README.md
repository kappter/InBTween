# InBTween

_InBTween – A gentle space for hard conversations._

InBTween is a tiny browser-based prototype for exploring a communication pattern where two people speak through “representatives” (personas) about a shared topic. The app visualizes a topic as a circle in the center, with each person’s representative around it, and guides them through a couple of structured dialogue rounds.

This repo is a minimal HTML/CSS/JavaScript proof of concept suitable for GitHub Pages deployment.

---

## What it does

- Lets you enter:
  - Person A’s name
  - Person B’s name
  - A topic word/phrase (e.g. _“feeling left out”_)
- Shows:
  - A central “topic circle” with a simple pulse + orbit animation
  - Two representative cards (Rep A, Rep B) flanking the circle
- Guides you through:
  - **Round 1:** Rep A shares what is happening for Person A around the topic (in third person)
  - **Round 2:** Rep B mirrors what they heard about Person A

The intent is to create a visual and conversational “middle space” _in between_ two people where difficult topics can feel safer and more structured, inspired by structured couples dialogues and nonviolent communication. [web:10][web:13][web:28]

---

## Tech stack

- **HTML** – single-page layout with two screens (setup + circle)
- **CSS** – responsive layout, pulsing topic circle, orbiting “satellite” dot using keyframe animations [web:39][web:57]
- **JavaScript** – no dependencies:
  - Small state machine for the two dialogue rounds
  - Animation controls (Start / Pause / Stop) via `animation-play-state` and a `.animating` class [web:44][web:52]

---

## Getting started

1. Clone or download this repository.
2. Open `index.html` directly in a browser, or serve it with a simple static server.
3. For GitHub Pages:
   - Push to a public repo.
   - In repo settings, enable **GitHub Pages** on the `main` branch, root folder.
   - Visit the published URL to use InBTween.

---

## Usage flow

1. **Setup**
   - Enter Person A, Person B, and the topic.
   - Click **Continue**.

2. **Circle view**
   - See the topic in the center and each person’s representative on the sides.
   - The app shows which round you’re in and provides a prompt for what to write.
   - Type as the current representative and click **Send**.
   - The conversation log grows under the circle.

3. **Animation controls**
   - **Start**: start or restart the pulsing + orbit animations from the beginning.
   - **Pause**: pause or resume the animations without resetting.
   - **Stop**: stop the animations and reset so the next **Start** begins from the top. [web:44][web:47][web:51]

---

## Ideas for future iterations

- Persona creation step (name, age, “role,” short bio).
- Additional rounds:
  - Validation/empathy
  - Needs and requests (inspired by nonviolent communication). [web:25][web:28]
- A final “drop the personas” reflection phase where each person speaks in first person.
- Local storage of sessions.
- Optional remote sync for long-distance couples.

---

## License

TBD – choose a license (e.g. MIT) depending on how you want others to use or extend InBTween.
