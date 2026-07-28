/* ============================================================
   INVISIBLE CITY — front-end logic (no backend, all data is
   simulated for demonstration purposes)
   ============================================================ */

/* ---------- Tab navigation ---------- */
const tabBtns = document.querySelectorAll('.tabbtn');
const views   = document.querySelectorAll('.view');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected','false'); });
    btn.classList.add('is-active'); btn.setAttribute('aria-selected','true');

    const target = btn.dataset.view;
    views.forEach(v => v.classList.remove('is-active'));
    document.getElementById('view-' + target).classList.add('is-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ---------- Live clock ---------- */
function tickClock(){
  const el = document.getElementById('clock');
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-GB', { hour12:false });
}
tickClock();
setInterval(tickClock, 1000);
document.getElementById('footYear').textContent = new Date().getFullYear();

/* ---------- Terminal readout (mirrors the physical model's LCD panel) ---------- */
const TERMINAL_MESSAGES = [
  'SYSTEM ACTIVE',
  'EVERYTHING UNDER CONTROL',
  'SEGREGATION: 4 STREAMS NOMINAL',
  'SMART ELEVATOR: IN SERVICE',
  'GRID EXPORT: 61% SURPLUS'
];
(function runTerminal(){
  const el = document.getElementById('terminalText');
  if (!el) return;
  let msgIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const full = TERMINAL_MESSAGES[msgIndex];
    if (!deleting){
      charIndex++;
      el.textContent = full.slice(0, charIndex);
      if (charIndex === full.length){ deleting = false; setTimeout(() => { deleting = true; tick(); }, 1800); return; }
    } else {
      charIndex--;
      el.textContent = full.slice(0, charIndex);
      if (charIndex === 0){ deleting = false; msgIndex = (msgIndex + 1) % TERMINAL_MESSAGES.length; }
    }
    setTimeout(tick, deleting ? 28 : 48);
  }
  tick();
})();

/* ---------- Helpers ---------- */
function rand(min, max){ return Math.random() * (max - min) + min; }
function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function animateNumber(el, to, opts = {}){
  const { duration = 1200, decimals = 0, suffix = '' } = opts;
  const from = 0;
  const start = performance.now();
  function frame(t){
    const p = clamp((t - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = from + (to - from) * eased;
    el.textContent = val.toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- Hero metrics ---------- */
animateNumber(document.getElementById('heroWaste'), 187.4, { decimals:1 });
animateNumber(document.getElementById('heroUptime'), 99.6, { decimals:1 });
animateNumber(document.getElementById('heroEnergy'), 412, { decimals:0 });

/* subtle live jitter on the core load readout */
const coreLoadEl = document.getElementById('coreLoad');
setInterval(() => {
  const v = Math.round(rand(88, 96));
  coreLoadEl.textContent = v + '%';
}, 4000);

/* ============================================================
   STATUS CARDS
   ============================================================ */
const STATUS_CARDS = [
  {
    id: 'waste', icon: '🗑', accent: 'var(--teal)', accentDim: 'var(--teal-dim)',
    title: 'Waste Processed Today', value: 187.4, unit: ' t', pct: 74,
    pill: 'On Target', foot: ['Intake rate: 8.2 t/hr', 'Peak at 09:40']
  },
  {
    id: 'recycling', icon: '♻', accent: 'var(--teal)', accentDim: 'var(--teal-dim)',
    title: 'Recycling Plant Status', value: 91, unit: '%', pct: 91,
    pill: 'Operational', foot: ['Sorting accuracy 97.2%', '3 lines active']
  },
  {
    id: 'composting', icon: '⚘', accent: 'var(--teal)', accentDim: 'var(--teal-dim)',
    title: 'Composting Plant Status', value: 68, unit: '%', pct: 68,
    pill: 'Operational', foot: ['Batch cycle: day 12 / 21', 'Temp 58°C']
  },
  {
    id: 'water', icon: '≋', accent: 'var(--blue)', accentDim: 'var(--blue-dim)',
    title: 'Water Treatment Status', value: 96, unit: '%', pct: 96,
    pill: 'Optimal', foot: ['Output: 340,000 L/day', 'Purity 99.4%']
  },
  {
    id: 'air', icon: '❋', accent: 'var(--blue)', accentDim: 'var(--blue-dim)',
    title: 'Air Filtration Status', value: 88, unit: '%', pct: 88,
    pill: 'Operational', foot: ['PM2.5 removal 99.1%', '4 scrubbers online']
  },
  {
    id: 'energy', icon: '⚡', accent: 'var(--amber)', accentDim: 'rgba(255,176,32,0.16)',
    title: 'Energy Generation', value: 412, unit: ' MWh', pct: 82,
    pill: 'Feeding Grid', foot: ['From biogas + heat recovery', 'Grid export: 61%']
  },
  {
    id: 'disposal', icon: '⛔', accent: 'var(--red)', accentDim: 'var(--red-dim)',
    title: 'Non-Recyclable Disposal', value: 12, unit: '%', pct: 12,
    pill: 'Minimised', foot: ['Of total intake', 'Down 4% this month']
  },
  {
    id: 'ewaste', icon: '⌁', accent: 'var(--violet)', accentDim: 'var(--violet-dim)',
    title: 'E-Waste Recovery', value: 79, unit: '%', pct: 79,
    pill: 'Operational', foot: ['Components reclaimed', '2 recovery bays active']
  },
  {
    id: 'elevator', icon: '⬆', accent: 'var(--teal)', accentDim: 'var(--teal-dim)',
    title: 'Smart Elevator Status', value: 100, unit: '%', pct: 97,
    pill: 'In Service', foot: ['1,240 cycles today', 'Load sensor: nominal']
  }
];

const cardGrid = document.getElementById('statusCards');

STATUS_CARDS.forEach((c, i) => {
  const card = document.createElement('div');
  card.className = 'stat-card';
  card.style.setProperty('--card-accent', c.accent);
  card.style.setProperty('--card-accent-dim', c.accentDim);
  card.innerHTML = `
    <div class="stat-top">
      <div class="stat-icon">${c.icon}</div>
      <span class="stat-pill">${c.pill}</span>
    </div>
    <div class="stat-value mono"><span class="cv">0</span>${c.unit}</div>
    <div class="stat-title">${c.title}</div>
    <div class="bar-track"><div class="bar-fill"></div></div>
    <div class="stat-foot"><span>${c.foot[0]}</span><span>${c.foot[1]}</span></div>
  `;
  cardGrid.appendChild(card);

  const valEl = card.querySelector('.cv');
  const barEl = card.querySelector('.bar-fill');

  // stagger the reveal animation
  setTimeout(() => {
    animateNumber(valEl, c.value, { decimals: c.value % 1 !== 0 ? 1 : 0 });
    barEl.style.width = c.pct + '%';
  }, i * 120);

  // gentle periodic re-fluctuation to feel "live"
  setInterval(() => {
    const jitter = clamp(c.pct + rand(-3, 3), 40, 99);
    barEl.style.width = jitter + '%';
  }, 5000 + i * 700);
});

/* ============================================================
   INTERACTIVE CITY MAP  (built entirely from data, so new
   nodes/edges can be added without hand-drawing SVG paths)
   ============================================================ */
const SVGNS = 'http://www.w3.org/2000/svg';

const MAP_NODES = [
  { id:'inlet',        x:100,  y:320, r:25, icon:'⇩', label:'Waste Inlet',              cls:'' },
  { id:'transport',    x:250,  y:320, r:22, icon:'⇄', label:'Underground Transport',    cls:'' },
  { id:'segregation',  x:400,  y:320, r:26, icon:'⚙', label:'Automatic Segregation',    cls:'node-circle-b' },
  { id:'recycling',    x:640,  y:90,  r:26, icon:'♻', label:'Recycling Plant',          cls:'node-circle-a' },
  { id:'composting',   x:640,  y:250, r:26, icon:'⚘', label:'Composting / Biogas',      cls:'node-circle-a' },
  { id:'disposal',     x:640,  y:410, r:26, icon:'⛔', label:'Non-Recyclable Disposal',  cls:'node-circle-d' },
  { id:'ewaste',       x:640,  y:570, r:26, icon:'⌁', label:'E-Waste Recovery Unit',    cls:'node-circle-e' },
  { id:'energy',       x:880,  y:160, r:26, icon:'⚡', label:'Energy Recovery',          cls:'node-circle-c' },
  { id:'water',        x:880,  y:340, r:26, icon:'≋', label:'Water Treatment',          cls:'node-circle-b' },
  { id:'air',          x:880,  y:520, r:24, icon:'❋', label:'Air Filtration',           cls:'node-circle-b' },
  { id:'elevator',     x:1020, y:340, r:28, icon:'⬆', label:'Smart Elevator',           cls:'node-circle-a' },
  { id:'grid',         x:1020, y:40,  r:22, icon:'☍', label:'City Grid & Utilities',    cls:'node-circle-c' },
];

const MAP_EDGES = [
  ['inlet','transport'], ['transport','segregation'],
  ['segregation','recycling'], ['segregation','composting'], ['segregation','disposal'], ['segregation','ewaste'],
  ['recycling','air'], ['composting','energy'], ['composting','water'],
  ['disposal','energy'], ['disposal','air'], ['ewaste','water'],
  ['energy','elevator'], ['water','elevator'], ['air','elevator'],
  ['elevator','grid']
];

function elbowPath(a, b){
  if (a.x === b.x || a.y === b.y) return `M${a.x},${a.y} L${b.x},${b.y}`;
  const mx = (a.x + b.x) / 2;
  return `M${a.x},${a.y} L${mx},${a.y} L${mx},${b.y} L${b.x},${b.y}`;
}

function svgEl(tag, attrs){
  const el = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function buildCityMap(){
  const svg = document.getElementById('citymapSvg');
  const byId = Object.fromEntries(MAP_NODES.map(n => [n.id, n]));

  // strata bands
  svg.appendChild(svgEl('rect', { x:0, y:0, width:1160, height:70, class:'strata strata-surface' }));
  svg.appendChild(svgEl('rect', { x:0, y:70, width:1160, height:570, class:'strata strata-sub' }));
  const surfLabel = svgEl('text', { x:20, y:45, class:'strata-label' }); surfLabel.textContent = 'SURFACE — STREET LEVEL';
  svg.appendChild(surfLabel);
  const subLabel = svgEl('text', { x:20, y:95, class:'strata-label strata-label-dim' }); subLabel.textContent = '−12m SUBSTRATUM';
  svg.appendChild(subLabel);

  // decorative rooftop skyline along the surface band
  const skyline = svgEl('g', { class:'skyline' });
  const buildingSpecs = [
    [230,26,18,44],[256,20,16,50],[430,30,20,40],[600,24,17,46],
    [770,28,18,42],[820,18,15,52],[900,26,19,44]
  ];
  buildingSpecs.forEach(([x, y, w, h]) => {
    skyline.appendChild(svgEl('rect', { x, y, width:w, height:h, class:'skyline-b' }));
    skyline.appendChild(svgEl('rect', { x:x+4, y:y+6, width:4, height:4, class:'skyline-window' }));
    skyline.appendChild(svgEl('rect', { x:x+w-8, y:y+16, width:4, height:4, class:'skyline-window' }));
  });
  [300, 520, 700, 960].forEach(x => {
    skyline.appendChild(svgEl('line', { x1:x, y1:70, x2:x, y2:30, class:'skyline-lamp-pole' }));
    skyline.appendChild(svgEl('circle', { cx:x, cy:28, r:3, class:'skyline-lamp-glow' }));
  });
  [365, 655, 1040].forEach(x => {
    skyline.appendChild(svgEl('line', { x1:x, y1:70, x2:x, y2:44, class:'skyline-tree-trunk' }));
    skyline.appendChild(svgEl('circle', { cx:x, cy:38, r:9, class:'skyline-tree-leaf' }));
  });
  svg.appendChild(skyline);

  // decorative inlet chute + grid return rects
  svg.appendChild(svgEl('rect', { x:55, y:14, width:110, height:38, rx:6, class:'node-surface' }));
  const inletT = svgEl('text', { x:110, y:38, class:'node-surface-text' }); inletT.textContent = 'WASTE INLET'; svg.appendChild(inletT);
  svg.appendChild(svgEl('line', { x1:110, y1:52, x2:110, y2:294, class:'node-drop' }));

  svg.appendChild(svgEl('rect', { x:955, y:14, width:130, height:38, rx:6, class:'node-surface' }));
  const gridT = svgEl('text', { x:1020, y:38, class:'node-surface-text' }); gridT.textContent = 'CITY GRID / UTILITIES'; svg.appendChild(gridT);

  // edges (base pipe + animated flow, drawn before nodes)
  const edgeLayer = svgEl('g', {});
  MAP_EDGES.forEach(([fromId, toId]) => {
    const a = byId[fromId], b = byId[toId];
    const d = elbowPath(a, b);
    edgeLayer.appendChild(svgEl('path', { d, class:'tunnel-line' }));
    edgeLayer.appendChild(svgEl('path', { d, class:'tunnel-line tunnel-line-flow' }));
  });
  svg.appendChild(edgeLayer);

  // nodes
  const nodeLayer = svgEl('g', {});
  MAP_NODES.forEach(n => {
    const g = svgEl('g', { class:'node', 'data-node':n.id, tabindex:'0', role:'button', 'aria-label':n.label });
    g.appendChild(svgEl('circle', { cx:n.x, cy:n.y, r:n.r, class:`node-circle ${n.cls}` }));
    const icon = svgEl('text', { x:n.x, y:n.y + 6, class:'node-icon' }); icon.textContent = n.icon; g.appendChild(icon);
    const label = svgEl('text', { x:n.x, y:n.y + n.r + 20, class:'node-label' }); label.textContent = n.label; g.appendChild(label);
    nodeLayer.appendChild(g);
  });
  svg.appendChild(nodeLayer);

  // single delegated listener handles clicks/keys for every node, including future ones
  svg.addEventListener('click', e => {
    const g = e.target.closest('.node');
    if (g) openModal(g.dataset.node);
  });
  svg.addEventListener('keydown', e => {
    const g = e.target.closest('.node');
    if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(g.dataset.node); }
  });
}
buildCityMap();

/* ---------- Map legend ---------- */
const MAP_LEGEND = [
  ['var(--teal)',   'Recyclable → Recycling Plant'],
  ['var(--teal)',   'Organic → Compost / Biogas'],
  ['var(--red)',    'Non-Recyclable → Safe Disposal'],
  ['var(--violet)', 'E-Waste → E-Waste Unit'],
  ['var(--amber)',  'Energy → Power for Utilities'],
  ['var(--blue)',   'Water → Clean Water for City'],
  ['var(--blue)',   'Air → Clean Air for City'],
];
document.getElementById('mapLegend').innerHTML = MAP_LEGEND.map(([color, label]) =>
  `<span class="map-legend-item"><span class="map-legend-dot" style="background:${color}"></span>${label}</span>`
).join('');

/* ---------- Node info for popups ---------- */
const NODE_INFO = {
  inlet: {
    icon: '⇩', eyebrow: 'STAGE 01 · SURFACE INTERFACE', title: 'Waste Inlet',
    body: 'Street-level chutes and collection hubs where household and commercial waste enters the underground network. Sensors weigh each load and gate its entry before it drops into the transport tunnels below.',
    stats: [['1,140', 'Inlets citywide'], ['8.2 t/hr', 'Avg intake rate'], ['24/7', 'Operating window']]
  },
  transport: {
    icon: '⇄', eyebrow: 'STAGE 02 · LOGISTICS', title: 'Underground Transport',
    body: 'A network of pneumatic and rail-guided tunnels moves sealed waste containers from inlets to the segregation hub, replacing surface garbage trucks entirely and cutting street-level traffic and emissions.',
    stats: [['62 km', 'Tunnel network'], ['3.4 m/s', 'Avg transit speed'], ['0', 'Surface trucks needed']]
  },
  segregation: {
    icon: '⚙', eyebrow: 'STAGE 03 · AUTOMATIC SORTING', title: 'Automatic Segregation',
    body: 'Ultrasonic and IR sensors identify each item as it passes through, while servo-controlled gates route it into one of four streams: recyclable, organic, non-recyclable, or e-waste — no manual sorting required.',
    stats: [['4', 'Sorted streams'], ['96.8%', 'Detection accuracy'], ['< 2 s', 'Per-item sort time']]
  },
  recycling: {
    icon: '♻', eyebrow: 'STAGE 04 · MATERIAL RECOVERY', title: 'Recycling Plant',
    body: 'Optical, magnetic and density sorters further separate metal, glass, plastic and paper from the recyclable stream. Recovered materials are baled and routed to manufacturing partners for reuse.',
    stats: [['97.2%', 'Sorting accuracy'], ['3', 'Sorting lines active'], ['41%', 'Of intake recovered']]
  },
  composting: {
    icon: '⚘', eyebrow: 'STAGE 04 · ORGANIC RECOVERY', title: 'Composting / Biogas Plant',
    body: 'Organic waste is shredded, aerated and broken down under controlled temperature and humidity over a 21-day cycle, producing both nutrient-rich compost and biogas for the Energy Recovery Unit.',
    stats: [['21 days', 'Cycle length'], ['58°C', 'Core temperature'], ['26 t/wk', 'Compost output']]
  },
  disposal: {
    icon: '⛔', eyebrow: 'STAGE 04 · SAFE DISPOSAL', title: 'Non-Recyclable Disposal',
    body: 'Material that cannot be recycled, composted or recovered is compacted and safely contained here, with residual heat captured for energy recovery. The goal is to keep this the smallest of the four streams.',
    stats: [['12%', 'Of total intake'], ['↓ 4%', 'Change this month'], ['0', 'Sent to open landfill']]
  },
  ewaste: {
    icon: '⌁', eyebrow: 'STAGE 04 · ELECTRONICS RECOVERY', title: 'E-Waste Recovery Unit',
    body: 'Circuit boards, batteries and small electronics are disassembled to recover metals and components, with any hazardous parts isolated and processed under stricter containment than general waste.',
    stats: [['79%', 'Components reclaimed'], ['2', 'Recovery bays active'], ['Sealed', 'Hazard containment']]
  },
  energy: {
    icon: '⚡', eyebrow: 'STAGE 05 · POWER RECOVERY', title: 'Energy Recovery Unit',
    body: 'Biogas from composting and residual heat from disposal are converted into electricity and district heating, powering the network itself with the surplus exported back to the city grid.',
    stats: [['412 MWh', 'Generated today'], ['61%', 'Exported to grid'], ['39%', 'Powers the network']]
  },
  water: {
    icon: '≋', eyebrow: 'STAGE 05 · WATER RECOVERY', title: 'Water Treatment Plant',
    body: 'Leachate from composting and runoff from e-waste processing are filtered through multi-stage membrane and UV treatment, returning clean, potable-grade water to the city supply and irrigation network.',
    stats: [['340,000 L', 'Treated per day'], ['99.4%', 'Output purity'], ['4-stage', 'Filtration process']]
  },
  air: {
    icon: '❋', eyebrow: 'STAGE 05 · AIR RECOVERY', title: 'Air Filtration Unit',
    body: 'Scrubbers and activated-carbon filters capture particulates from the recycling line and emissions from disposal, venting only treated air back to the surface through monitored stacks.',
    stats: [['99.1%', 'PM2.5 removed'], ['4', 'Scrubbers online'], ['12', 'Surface vent points']]
  },
  elevator: {
    icon: '⬆', eyebrow: 'STAGE 06 · VERTICAL LOGISTICS', title: 'Smart Elevator',
    body: 'A sensor-guided shaft that moves recovered water, filtered air, compost and stored power between every underground level and the surface, coordinating handoffs so nothing has to travel back through the tunnels.',
    stats: [['1,240', 'Cycles today'], ['4', 'Levels served'], ['Nominal', 'Load sensor status']]
  },
  grid: {
    icon: '☍', eyebrow: 'STAGE 07 · RETURN TO CITY', title: 'City Grid & Utilities',
    body: 'The finished outputs of the substratum — clean water, filtered air, compost and electricity — return to the surface city here, closing the loop between what residents discard and what they receive back.',
    stats: [['4', 'Resources returned'], ['99.6%', 'Network uptime'], ['0', 'Waste to landfill']]
  }
};

const modalBackdrop = document.getElementById('modalBackdrop');
const modalIcon = document.getElementById('modalIcon');
const modalEyebrow = document.getElementById('modalEyebrow');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalStats = document.getElementById('modalStats');

function openModal(nodeId){
  const info = NODE_INFO[nodeId];
  if (!info) return;
  modalIcon.textContent = info.icon;
  modalEyebrow.textContent = info.eyebrow;
  modalTitle.textContent = info.title;
  modalBody.textContent = info.body;
  modalStats.innerHTML = info.stats.map(([v, l]) =>
    `<div><span class="msv">${v}</span><span class="msl">${l}</span></div>`
  ).join('');
  modalBackdrop.classList.add('is-open');
}
function closeModal(){ modalBackdrop.classList.remove('is-open'); }

document.getElementById('modalClose').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ============================================================
   WASTE JOURNEY TIMELINE
   ============================================================ */
const JOURNEY_STEPS = [
  {
    time: '07:14', title: 'Curbside Collection', tags: ['Surface', 'Sensor-weighed'],
    body: 'A mixed load of household waste is dropped at the neighbourhood inlet. On-board sensors record weight and estimated composition before it enters the chute.'
  },
  {
    time: '07:16', title: 'Descent to Substratum', tags: ['Pneumatic transport', '−12m'],
    body: 'The sealed container is drawn into the tunnel network and dispatched toward the nearest sorting facility at roughly 3.4 metres per second.'
  },
  {
    time: '07:29', title: 'Automatic Segregation', tags: ['Ultrasonic sensing', 'IR detection', 'Servo gates'],
    body: 'At the Segregation Hub, ultrasonic and IR sensors identify each item as it passes, and servo-controlled gates route it into one of four streams: recyclable, organic, non-recyclable, or e-waste.'
  },
  {
    time: '07:34', title: 'Four-Way Processing', tags: ['Recycling', 'Composting', 'Safe Disposal', 'E-Waste Recovery'],
    body: 'Recyclables move to baling for resale, organics begin their 21-day composting cycle, non-recyclables are safely compacted and contained, and e-waste is disassembled for component recovery.'
  },
  {
    time: '07:41', title: 'Run-off Capture', tags: ['Water Treatment', '4-stage filtration'],
    body: 'Leachate from composting and runoff from e-waste processing are routed to the Water Treatment Plant, filtered through membrane and UV stages to potable-grade purity.'
  },
  {
    time: '07:45', title: 'Air Scrubbing', tags: ['Air Filtration', '99.1% PM2.5 removal'],
    body: 'Dust from recycling and emissions from disposal pass through activated-carbon scrubbers before venting to the surface through monitored, low-emission stacks.'
  },
  {
    time: '08:02', title: 'Power Recovery', tags: ['Biogas', 'Heat exchange'],
    body: 'Biogas released during composting and residual heat from disposal are captured by the Energy Recovery Unit and converted into electricity for the network and the city grid.'
  },
  {
    time: '08:09', title: 'Smart Elevator Handoff', tags: ['Vertical logistics', 'Sensor-guided'],
    body: 'Recovered water, filtered air, compost and stored power are gathered and lifted by the Smart Elevator, coordinating the return trip to street level without re-entering the transport tunnels.'
  },
  {
    time: '08:12', title: 'Return to the City', tags: ['Clean water', 'Clean air', 'Compost', 'Power'],
    body: 'What began as one tonne of mixed waste returns to the surface as potable water, filtered air, nutrient-rich compost and grid electricity — closing the loop.'
  }
];

const journeyTrack = document.getElementById('journeyTrack');
JOURNEY_STEPS.forEach((s, i) => {
  const step = document.createElement('div');
  step.className = 'jstep';
  step.dataset.n = String(i + 1).padStart(2, '0');
  step.style.animationDelay = (i * 0.09) + 's';
  step.innerHTML = `
    <div class="jstep-card">
      <div class="jstep-top">
        <h3>${s.title}</h3>
        <span class="jstep-time mono">${s.time}</span>
      </div>
      <p>${s.body}</p>
      <div class="jstep-tags">${s.tags.map(t => `<span class="jtag">${t}</span>`).join('')}</div>
    </div>
  `;
  journeyTrack.appendChild(step);
});

/* ============================================================
   SYSTEM CORE VIEW
   ============================================================ */
const HOW_IT_WORKS = [
  'Waste is inserted at a street-level inlet.',
  'The system transports it to the underground network.',
  'Sensors automatically segregate it by type.',
  'Recyclable waste is sent for recycling and reuse.',
  'Organic waste is sent for composting and biogas.',
  'Non-recyclable waste is safely contained for disposal.',
  'Energy is generated and used to power the utilities.',
  'Clean water, air, compost and power support the city above.'
];
document.getElementById('howWorksList').innerHTML =
  HOW_IT_WORKS.map(step => `<li>${step}</li>`).join('');

const FEATURES = [
  'Underground waste collection from sealed street-level inlets',
  'Automatic segregation using ultrasonic and IR sensing',
  'Resource recovery, recycling and material baling',
  'Composting and biogas-based energy generation',
  'Multi-stage water treatment and reuse',
  'Activated-carbon air filtration before venting',
  'Sensor-guided smart elevator for vertical logistics',
  'Live telemetry across every subsystem, end to end',
  'Designed to support a cleaner, quieter surface city'
];
document.getElementById('featureList').innerHTML =
  FEATURES.map(f => `<li>${f}</li>`).join('');

const ZONES = [
  ['var(--teal)',   'Recyclable Waste', '→ Recycling Plant'],
  ['var(--teal)',   'Organic Waste',    '→ Compost / Biogas'],
  ['var(--red)',    'Non-Recyclable',   '→ Safe Disposal'],
  ['var(--violet)', 'E-Waste',          '→ E-Waste Recovery Unit'],
  ['var(--amber)',  'Energy',           '→ Power for Utilities'],
  ['var(--blue)',   'Water',            '→ Clean Water for City'],
  ['var(--blue)',   'Air',              '→ Clean Air for City'],
];
document.getElementById('zoneList').innerHTML = ZONES.map(([color, name, dest]) =>
  `<li><span class="zone-dot" style="background:${color}"></span><b>${name}</b>&nbsp;${dest}</li>`
).join('');

const TECH = [
  'Arduino Uno control boards', 'Ultrasonic level sensors', 'IR object-detection sensors',
  'Servo motors (gate control)', 'DC motors (conveyor drive)', '16×2 LCD status display',
  'Status LEDs & indicator lighting', 'Push-button manual overrides', 'Breadboard & wiring harnesses',
  'Reclaimed circuit boards for electro-art'
];
document.getElementById('techList').innerHTML =
  TECH.map(t => `<span>${t}</span>`).join('');

const OUTPUTS = [
  'A cleaner surface environment with waste fully processed underground',
  'Renewable energy generated from biogas and recovered heat',
  'Water conservation through treated, reusable output',
  'Cleaner air through filtered, low-emission venting',
  'A more sustainable, self-sufficient city footprint'
];
document.getElementById('outputList').innerHTML =
  OUTPUTS.map(o => `<li>${o}</li>`).join('');
