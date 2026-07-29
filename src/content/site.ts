export const profile = {
  name: 'Mihir Mohite',
  role: 'applied ml engineer · b.tech ai/ml @ mit-wpu · president, codec',
  email: 'mihir.moe@gmail.com',
  location: 'Pune, Maharashtra, India',
  github: 'https://github.com/lawn-mimower',
  linkedin: 'https://www.linkedin.com/in/mihir-mohite/',
  domain: 'mihirmohite.in',
};

export const nowSpecs = [
  { k: 'Role', v: 'ML Intern · <b>BeyondBot</b>' },
  { k: 'Working langs', v: 'Python · C++' },
  { k: 'RAGAS Δ', v: '<b>+0.26</b> hybrid v naive' },
  { k: 'Corpus', v: '1,210 pp · IN law' },
];

export const nowParagraph = `Building a <b>legal-compliance RAG</b> system at BeyondBot over a 1,210-page corpus of Indian industrial, manufacturing and environmental law. Benchmarked five retrieval modes on a 315-query <code>RAGAS</code> harness — hybrid retrieval reached <b>0.77</b> against <b>0.51</b> for the naive baseline.`;

export const nowPipeline = [
  'mistral ocr',
  'regex router',
  'lightrag (kg + vector)',
  'agno · gemini 3 flash',
  'fastapi sse',
];

export const recognitions = `recognitions · <b>sih r2 ′24</b> · <b>circuit heist runner-up ′24</b> · dataquest finalist · hackmitwpu finalist`;

export const work = [
  {
    when: '2025.10 — now',
    title: 'Machine Learning Intern',
    org: 'BeyondBot Technology Pvt. Ltd. · Pune',
    lede: 'Designed legal-compliance RAG over a 1,210pp Indian-law corpus. RAGAS harness across 5 retrieval modes on 315 queries — hybrid <b>0.77 vs 0.51</b> naive. Built a custom OpenCV visual chunker.',
    href: '/work/beyondbot',
  },
  {
    when: '2025.07 — 2025.10',
    title: 'Software Intern',
    org: 'Heera Software Pvt. Ltd. · Pune',
    lede: 'Address-confidence scoring service on the Google Maps API with fuzzy matching and reverse-geocoded cosine similarity. Scored <b>~13,500 records</b> and sharpened address confidence for logistics clients including <b>Red Bull</b>.',
    href: '/work/heera',
  },
];

export const projects = [
  {
    when: 'pilot · 2026',
    title: 'ForeSites — Construction Site Management',
    org: '3-person team · pilot with a Pune real-estate developer',
    lede: 'AWS Lambda agent (Gemini) doing streaming NL-to-SQL over a 9-table Postgres schema, with per-session memory. WhatsApp ingest service (Node + S3, Supabase-backed) for snag reports via text, voice and image.',
    href: '/projects/foresites',
    image: '/media/foresites-arch.png',
  },
  {
    when: '2025',
    title: 'AgroSense — Precision Agriculture (PBL4, MIT-WPU)',
    org: 'team',
    lede: 'UAV photogrammetry pipeline (RGB → orthomosaic → ExG/VARI vegetation indices → K-means zoning) fused with an ESP32 ground module (Modbus soil sensor, GPS waypoint guidance, on-device ML for NPK estimation). Firebase + Vercel dashboard with a multilingual AI assistant.',
    href: '/projects/agrosense',
  },
  {
    when: '2025',
    title: 'EKG — query-driven Neo4j mini-graphs',
    org: 'solo',
    lede: 'Demo ingesting SQL / JSON / TXT into query-driven Neo4j mini-graphs with a Gemini NL-query interface.',
    href: '/projects/ekg',
  },
];

export const earlier = [
  { year: '2024', title: 'scout rover for hazardous environments',
    blurb: 'matlab + lidar slam, mq5 / dht / ultrasonic sensors' },
  { year: '2024', title: 'electric load forecasting (delhi)',
    blurb: 'mlp · keras' },
  { year: '2024', title: 'ldr-based solar tracker',
    blurb: 'arduino + servos' },
  { year: '2024', title: 'sos tracker (lora 433mhz)',
    blurb: 'embedded' },
  { year: '2024', title: 'lidar fan-speed detector',
    blurb: 'matlab fft' },
];

export const leadership = [
  {
    when: '2025.10 — now',
    title: 'President',
    org: 'CoDeC · MIT-WPU',
    lede: 'Ran <b>Trifecta Challenge 2026</b> — a three-day flagship symposium drawing <b>350+ participants (87 teams)</b> from MIT-WPU and external engineering colleges across Full-Stack, ML, and Competitive Programming tracks. Led a core team of <b>15–20</b>; secured GeeksforGeeks, HackerRank and AlgoZenith through direct outreach.',
    href: '/leadership/trifecta-2026',
  },
  {
    when: '2025.01 — now',
    title: 'ML Projects Division Lead',
    org: 'CoDeC · MIT-WPU',
    lede: 'Drive AI/ML project initiatives and run knowledge-sharing sessions for the club.',
    href: undefined as string | undefined,
  },
];

export const education = {
  when: '2023 — 2027 (exp.)',
  title: 'MIT World Peace University, Pune',
  org: 'B.Tech Electronics & Communication Engineering · Specialization in AI & ML',
  lede: 'CGPA <b>8.62 / 10.00</b>',
};

export const skills: Array<{ k: string; v: string[] }> = [
  { k: 'Languages',         v: ['C++', 'Python', 'JavaScript', 'SQL'] },
  { k: 'CS Fundamentals',   v: ['Data Structures', 'Algorithms', 'OOD', 'Complexity', 'Problem Solving'] },
  { k: 'Retrieval / RAG',   v: ['RAG', 'GraphRAG', 'LightRAG', 'RAGAS-style eval', 'Sentence Transformers', 'BGE'] },
  { k: 'Vector DBs',        v: ['Pinecone', 'Milvus'] },
  { k: 'LLM Platforms',     v: ['Vertex AI', 'Gemini API', 'Agno'] },
  { k: 'ML / Vision',       v: ['PyTorch', 'TensorFlow', 'Keras', 'CNN', 'Transformers', 'OpenCV', 'OCR', 'IBM Docling', 'Mistral OCR'] },
  { k: 'Web & Cloud',       v: ['React.js', 'Node.js / Express', 'FastAPI', 'REST', 'SSE', 'AWS (Lambda · S3 · EC2)', 'GCP (Vertex AI)', 'serverless'] },
  { k: 'Databases',         v: ['PostgreSQL (Supabase)', 'MySQL', 'SQLite', 'Neo4j'] },
  { k: 'Tools & Hardware',  v: ['Git', 'MATLAB', 'WhatsApp Business API', 'Meta API', 'Arduino', 'ESP32', 'Raspberry Pi', 'LiDAR'] },
];
