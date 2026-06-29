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
      <svg viewBox="0 0 560 620" role="img" aria-labelledby="blueprint-title">
        <title id="blueprint-title">Humanoid robot schematic connected to course systems</title>
        <g className={styles.gridLines}>
          {Array.from({length: 10}).map((_, index) => (
            <line key={`h-${index}`} x1="0" x2="560" y1={40 + index * 58} y2={40 + index * 58} />
          ))}
          {Array.from({length: 8}).map((_, index) => (
            <line key={`v-${index}`} y1="0" y2="620" x1={35 + index * 70} x2={35 + index * 70} />
          ))}
        </g>
        <g className={styles.robotLines}>
          <circle cx="280" cy="92" r="48" />
          <path d="M222 174h116l28 166h-172l28-166Z" />
          <path d="M220 200l-92 88 34 34 70-56" />
          <path d="M340 200l92 88-34 34-70-56" />
          <path d="M232 340l-38 166 52 12 34-142" />
          <path d="M328 340l38 166-52 12-34-142" />
          <path d="M248 91h64" />
          <path d="M258 126h44" />
          <path d="M235 223h90" />
          <path d="M250 272h60" />
        </g>
        <g className={styles.callouts}>
          <path d="M328 88h120" />
          <text x="456" y="92">Voice intent</text>
          <path d="M366 214h118" />
          <text x="492" y="218">ROS 2 actions</text>
          <path d="M370 306h112" />
          <text x="490" y="310">VSLAM / Nav2</text>
          <path d="M194 214H72" />
          <text x="18" y="218">Sensors</text>
          <path d="M198 370H62" />
          <text x="14" y="374">Simulation</text>
        </g>
      </svg>
      <div className={styles.blueprintPlate}>
        <span>Capstone target</span>
        <strong>Listen - Plan - Navigate - See - Manipulate</strong>
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





