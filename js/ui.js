export function renderCircle(state) {
  const svg = document.getElementById("circleCanvas");
  const center = { x: 300, y: 300 };
  const radius = 200;

  const nodes = [...state.participants, ...state.personas];
  const angleStep = (2 * Math.PI) / nodes.length;

  nodes.forEach((node, index) => {
    const angle = index * angleStep;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);

    drawNode(svg, x, y, node);
  });
}
