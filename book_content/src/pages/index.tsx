import type {ReactNode} from 'react';
import {useEffect, useRef} from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';

import styles from './index.module.css';

type Pillar = {
  code: string;
  title: string;
  text: string;
};

type ModulePreview = {
  week: string;
  title: string;
  text: string;
  href: string;
};

const pillars: Pillar[] = [
  {
    code: 'EMB',
    title: 'Embodied intelligence',
    text: 'Why agents need bodies, sensors, timing, space, force, and feedback before they can act in the real world.',
  },
  {
    code: 'ROS',
    title: 'Robot middleware',
    text: 'ROS 2 nodes, topics, services, actions, parameters, launch files, and Python control paths with rclpy.',
  },
  {
    code: 'SIM',
    title: 'Digital twin labs',
    text: 'Gazebo, Unity, URDF, SDF, collision, gravity, depth cameras, LiDAR, IMUs, and testable robot scenes.',
  },
  {
    code: 'ISA',
    title: 'Isaac acceleration',
    text: 'Isaac Sim, Isaac ROS, synthetic data, VSLAM, Nav2, GPU constraints, and sim-to-real transfer habits.',
  },
  {
    code: 'VLA',
    title: 'Vision-language-action',
    text: 'Speech and natural language become bounded robot goals through perception, planning, navigation, and checks.',
  },
  {
    code: 'CAP',
    title: 'Humanoid capstone',
    text: 'A simulated robot listens, plans, navigates, identifies an object, and manipulates it inside one integrated demo.',
  },
];

const publicSiteUrl = (process.env.NODE_ENV === 'production' && typeof window !== 'undefined')
  ? window.location.origin
  : 'https://marjan-ahmed.github.io/humanoid-textbook';

const modules: ModulePreview[] = [
  {
    week: 'Weeks 1-2',
    title: 'Physical AI Foundations',
    text: 'Embodied intelligence, sensors, physical laws, and the shift from software agent to acting system.',
    href: '/docs/foundations/physical-ai-and-embodiment',
  },
  {
    week: 'Weeks 3-5',
    title: 'ROS 2 Control Layer',
    text: 'Nodes, topics, services, actions, launch files, parameters, and Python bridges into robot behavior.',
    href: '/docs/ros-2/robotic-nervous-system',
  },
  {
    week: 'Weeks 6-7',
    title: 'Gazebo and Unity Twins',
    text: 'Physics simulation, visual environments, robot descriptions, and sensor testing before hardware risk.',
    href: '/docs/simulation/digital-twins-gazebo-unity',
  },
  {
    week: 'Weeks 8-10',
    title: 'NVIDIA Isaac Brain',
    text: 'Isaac Sim, Isaac ROS, VSLAM, Nav2, synthetic data, and edge deployment tradeoffs.',
    href: '/docs/nvidia-isaac/ai-robot-brain',
  },
  {
    week: 'Week 13',
    title: 'Conversational Robotics',
    text: 'Voice-to-action workflows that turn natural language into grounded, validated robot movement.',
    href: '/docs/vla/vision-language-action',
  },
];

function BlueprintFigure() {
  return (
    <div className={styles.blueprint} aria-label="Humanoid robotics course blueprint">
      <svg viewBox="0 0 600 700" role="img" aria-labelledby="blueprint-title">
        <title id="blueprint-title">Humanoid robot schematic connected to course systems</title>
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c6773d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c6773d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6dd5fa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6dd5fa" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scanLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c6773d" stopOpacity="0" />
            <stop offset="50%" stopColor="#c6773d" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c6773d" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Blueprint grid */}
        <g className={styles.gridLines}>
          {Array.from({length: 12}).map((_, i) => (
            <line key={`h-${i}`} x1="0" x2="600" y1={30 + i * 55} y2={30 + i * 55} />
          ))}
          {Array.from({length: 9}).map((_, i) => (
            <line key={`v-${i}`} y1="0" y2="700" x1={30 + i * 70} x2={30 + i * 70} />
          ))}
        </g>

        {/* Circuit traces from robot to callouts */}
        <g className={styles.circuitTraces}>
          {/* Head → Voice intent */}
          <path d="M340 105 Q420 105 480 105" />
          <circle cx="480" cy="105" r="4" />
          {/* Shoulder → ROS 2 */}
          <path d="M370 230 Q440 230 500 230" />
          <circle cx="500" cy="230" r="4" />
          {/* Torso → VSLAM */}
          <path d="M370 320 Q440 320 500 320" />
          <circle cx="500" cy="320" r="4" />
          {/* Hip → Sensors */}
          <path d="M230 370 Q150 370 80 370" />
          <circle cx="80" cy="370" r="4" />
          {/* Knee → Simulation */}
          <path d="M230 470 Q150 470 80 470" />
          <circle cx="80" cy="470" r="4" />
          {/* Chest → Isaac */}
          <path d="M300 280 Q300 200 300 140" strokeDasharray="4 6" />
        </g>

        {/* Scan line animation */}
        <rect className={styles.scanLine} x="140" y="60" width="320" height="580" />

        {/* Humanoid robot - detailed schematic */}
        <g className={styles.robotLines}>
          {/* Head */}
          <ellipse cx="300" cy="100" rx="52" ry="58" />
          {/* Visor / face plate */}
          <path d="M268 88 Q300 78 332 88" />
          <path d="M268 108 Q300 118 332 108" />
          {/* Eyes */}
          <circle cx="282" cy="98" r="8" className={styles.eyeGlow} />
          <circle cx="318" cy="98" r="8" className={styles.eyeGlow} />
          {/* Antenna */}
          <line x1="300" y1="42" x2="300" y2="26" />
          <circle cx="300" cy="22" r="5" className={styles.antennaPulse} />

          {/* Neck */}
          <rect x="288" y="156" width="24" height="20" rx="4" />

          {/* Torso - chest plate */}
          <path d="M240 176 L360 176 L370 220 L370 340 L340 360 L260 360 L230 340 L230 220 Z" />
          {/* Chest reactor */}
          <circle cx="300" cy="260" r="22" className={styles.chestReactor} />
          <circle cx="300" cy="260" r="12" />
          <circle cx="300" cy="260" r="5" className={styles.coreGlow} />
          {/* Chest detail lines */}
          <path d="M252 220 L300 240 L348 220" />
          <path d="M252 300 L300 280 L348 300" />
          <line x1="300" y1="176" x2="300" y2="240" />
          <line x1="230" y1="260" x2="278" y2="260" />
          <line x1="322" y1="260" x2="370" y2="260" />

          {/* Left shoulder joint */}
          <circle cx="222" cy="190" r="16" />
          <circle cx="222" cy="190" r="8" />
          {/* Left upper arm */}
          <path d="M208 204 L186 290" />
          <path d="M236 204 L214 290" />
          {/* Left elbow joint */}
          <circle cx="200" cy="296" r="12" />
          <circle cx="200" cy="296" r="6" />
          {/* Left forearm */}
          <path d="M190 308 L170 390" />
          <path d="M210 308 L190 390" />
          {/* Left hand */}
          <path d="M166 390 L156 410 L174 414 L194 410 L190 390" />

          {/* Right shoulder joint */}
          <circle cx="378" cy="190" r="16" />
          <circle cx="378" cy="190" r="8" />
          {/* Right upper arm */}
          <path d="M392 204 L414 290" />
          <path d="M364 204 L386 290" />
          {/* Right elbow joint */}
          <circle cx="400" cy="296" r="12" />
          <circle cx="400" cy="296" r="6" />
          {/* Right forearm */}
          <path d="M410 308 L430 390" />
          <path d="M390 308 L410 390" />
          {/* Right hand */}
          <path d="M434 390 L444 410 L426 414 L406 410 L410 390" />

          {/* Hip joint */}
          <path d="M260 360 Q300 380 340 360" />
          <circle cx="300" cy="365" r="14" />

          {/* Left thigh */}
          <path d="M266 378 L244 480" />
          <path d="M286 378 L264 480" />
          {/* Left knee */}
          <circle cx="254" cy="488" r="14" />
          <circle cx="254" cy="488" r="7" />
          {/* Left shin */}
          <path d="M244 502 L230 590" />
          <path d="M264 502 L250 590" />
          {/* Left foot */}
          <path d="M222 590 L210 610 L268 610 L260 590" />

          {/* Right thigh */}
          <path d="M334 378 L356 480" />
          <path d="M314 378 L336 480" />
          {/* Right knee */}
          <circle cx="346" cy="488" r="14" />
          <circle cx="346" cy="488" r="7" />
          {/* Right shin */}
          <path d="M356 502 L370 590" />
          <path d="M336 502 L350 590" />
          {/* Right foot */}
          <path d="M378 590 L390 610 L332 610 L340 590" />

          {/* Joint sensor dots */}
          <circle cx="222" cy="190" r="3" className={styles.sensorDot} />
          <circle cx="378" cy="190" r="3" className={styles.sensorDot} />
          <circle cx="200" cy="296" r="3" className={styles.sensorDot} />
          <circle cx="400" cy="296" r="3" className={styles.sensorDot} />
          <circle cx="254" cy="488" r="3" className={styles.sensorDot} />
          <circle cx="346" cy="488" r="3" className={styles.sensorDot} />
        </g>

        {/* Callout labels */}
        <g className={styles.callouts}>
          <text x="496" y="100">Voice intent</text>
          <text x="496" y="112" className={styles.calloutSub}>NLU → goal grounding</text>
          <text x="516" y="226">ROS 2 actions</text>
          <text x="516" y="238" className={styles.calloutSub}>Nav2 / MoveIt</text>
          <text x="516" y="316">VSLAM + Nav2</text>
          <text x="516" y="328" className={styles.calloutSub}>Spatial mapping</text>
          <text x="14" y="366">Sensor suite</text>
          <text x="14" y="378" className={styles.calloutSub}>LiDAR / IMU / RGB-D</text>
          <text x="14" y="466">Digital twin</text>
          <text x="14" y="478" className={styles.calloutSub}>Gazebo + Isaac Sim</text>
        </g>

        {/* Data flow particles */}
        <g className={styles.particles}>
          <circle cx="420" cy="105" r="2" />
          <circle cx="450" cy="105" r="1.5" />
          <circle cx="440" cy="230" r="2" />
          <circle cx="470" cy="230" r="1.5" />
          <circle cx="440" cy="320" r="2" />
          <circle cx="160" cy="370" r="2" />
          <circle cx="130" cy="370" r="1.5" />
          <circle cx="160" cy="470" r="2" />
          <circle cx="130" cy="470" r="1.5" />
        </g>
      </svg>

      <div className={styles.blueprintPlate}>
        <span>Capstone target</span>
        <strong>Listen → Plan → Navigate → See → Manipulate</strong>
      </div>
    </div>
  );
}

function PillarCard({pillar}: {pillar: Pillar}) {
  return (
    <article className={styles.pillarCard}>
      <span>{pillar.code}</span>
      <h3>{pillar.title}</h3>
      <p>{pillar.text}</p>
    </article>
  );
}

function ModuleCard({module}: {module: ModulePreview}) {
  return (
    <Link className={styles.moduleCard} to={module.href}>
      <span>{module.week}</span>
      <h3>{module.title}</h3>
      <p>{module.text}</p>
      <em>Open module</em>
    </Link>
  );
}

export default function Home(): ReactNode {
  const modulesSectionRef = useRef<HTMLElement>(null);
  const moduleViewportRef = useRef<HTMLDivElement>(null);
  const moduleRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = modulesSectionRef.current;
    const viewport = moduleViewportRef.current;
    const rail = moduleRailRef.current;

    if (!section || !viewport || !rail) {
      return undefined;
    }

    const updateModuleParallax = () => {
      if (window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches) {
        rail.style.transform = '';
        section.style.setProperty('--module-progress', '0');
        return;
      }

      const start = section.offsetTop;
      const end = start + section.offsetHeight - window.innerHeight;
      const distance = Math.max(1, end - start);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      const maxTranslate = Math.max(0, rail.scrollWidth - viewport.clientWidth);

      section.style.setProperty('--module-progress', progress.toFixed(3));
      rail.style.transform = `translate3d(${-maxTranslate * progress}px, 0, 0)`;
    };

    updateModuleParallax();
    window.addEventListener('scroll', updateModuleParallax, {passive: true});
    window.addEventListener('resize', updateModuleParallax);

    return () => {
      window.removeEventListener('scroll', updateModuleParallax);
      window.removeEventListener('resize', updateModuleParallax);
    };
  }, []);

  return (
    <Layout
      title="Physical AI & Humanoid Robotics Textbook"
      description="An AI-native textbook for learning Physical AI, ROS 2, Gazebo, Unity, NVIDIA Isaac, VLA systems, and autonomous humanoid robotics. 13-week structured course from embodied foundations to simulated humanoid deployment.">
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'Physical AI & Humanoid Robotics Textbook',
            description:
              'A comprehensive AI-native textbook for Physical AI, Humanoid Robotics, ROS 2, Gazebo, Unity, NVIDIA Isaac, Vision-Language-Action systems, and autonomous humanoid capstone projects.',
            provider: {
              '@type': 'Organization',
              name: 'Physical AI Textbook',
              url: `${publicSiteUrl}/`,
            },
            url: `${publicSiteUrl}/`,
            inLanguage: 'en',
            educationalLevel: 'Advanced',
            timeRequired: 'P13W',
            numberOfCredits: 7,
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'online',
              courseWorkload: 'P13W',
            },
            about: [
              'Physical AI',
              'Humanoid Robotics',
              'ROS 2',
              'Gazebo',
              'Unity',
              'NVIDIA Isaac',
              'Vision-Language-Action',
              'Embodied Intelligence',
            ],
            author: {
              '@type': 'Person',
              name: 'Marjan Ahmed',
            },
          })}
        </script>
        <meta property="og:image" content={`${publicSiteUrl}/img/og-image.svg`} />
        <meta name="twitter:image" content={`${publicSiteUrl}/img/og-image.svg`} />
        <link rel="canonical" href={`${publicSiteUrl}/`} />
      </Head>
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <BlueprintFigure />
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Physical AI field manual</p>
            <h1>Teach robots to understand the room, not just the prompt.</h1>
            <p className={styles.heroLead}>
              A technical textbook for the jump from AI agents to embodied systems:
              ROS 2 control, simulation, Isaac workflows, VLA planning, hardware
              constraints, and an autonomous humanoid capstone.
            </p>
            <dl className={styles.heroMetrics} aria-label="Course highlights">
              <div><dt>13</dt><dd>week course path</dd></div>
              <div><dt>7</dt><dd>robotics modules</dd></div>
              <div><dt>1</dt><dd>humanoid capstone</dd></div>
            </dl>
            <div className={styles.heroActions}>
              <Link className={styles.primaryAction} to="/docs/intro">
                Start the textbook
              </Link>
              <a className={styles.secondaryAction} href="#course-map">
                Inspect the course map
              </a>
            </div>
          </div>
        </section>

        <section id="course-map" className={styles.panelSection} aria-labelledby="pillars-title">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Course map</p>
            <h2 id="pillars-title">Six systems a humanoid must coordinate before a demo is credible.</h2>
          </div>
          <div className={styles.systemLabel}>Core robotics systems / textbook architecture</div>
          <div className={styles.pillarGrid}>
            {pillars.map((pillar) => (
              <PillarCard key={pillar.code} pillar={pillar} />
            ))}
          </div>
        </section>

        <section className={styles.sequenceSection} aria-labelledby="sequence-title">
          <div className={styles.sequenceCopy}>
            <p className={styles.kicker}>Learning sequence</p>
            <h2 id="sequence-title">The book follows the signal from speech to physical consequence.</h2>
          </div>
          <div className={styles.sequenceTrack}>
            <article><span>01</span><strong>Command</strong><p>Capture intent without trusting language blindly.</p></article>
            <article><span>02</span><strong>Plan</strong><p>Convert the goal into bounded robot actions.</p></article>
            <article><span>03</span><strong>Simulate</strong><p>Test physics, sensors, scenes, and failure modes first.</p></article>
            <article><span>04</span><strong>Deploy</strong><p>Move only validated behavior toward edge hardware.</p></article>
          </div>
        </section>

        <section id="modules" ref={modulesSectionRef} className={styles.modulesSection} aria-labelledby="modules-title">
          <div className={styles.modulesSticky}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>Module deck</p>
              <h2 id="modules-title">A 13-week route from embodied foundations to a simulated humanoid.</h2>
            </div>
            <div className={styles.deckHeader}><span>Scroll to advance</span><strong>Module cards move horizontally as the page moves downward</strong></div>
            <div ref={moduleViewportRef} className={styles.moduleViewport}>
              <div
                ref={moduleRailRef}
                className={styles.moduleRail}
                aria-label="Course module previews">
                {modules.map((module) => (
                  <ModuleCard key={module.title} module={module} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.capstone} aria-labelledby="capstone-title">
          <p className={styles.kicker}>Final studio</p>
          <h2 id="capstone-title">The capstone is not a page of theory. It is a robot workflow under constraints.</h2>
          <p>
            Students design a simulated humanoid that receives a voice command,
            plans a path, avoids obstacles, identifies an object, and manipulates it.
            The book keeps the engineering boundaries visible: simulation first,
            local control for physical motion, and safety notes at every hardware edge.
          </p>
          <Link className={styles.primaryAction} to="/docs/capstone/autonomous-humanoid">
            Preview the capstone
          </Link>
        </section>
      </main>
    </Layout>
  );
}





