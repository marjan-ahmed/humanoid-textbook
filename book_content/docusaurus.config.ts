import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const siteUrl = process.env.DOCUSAURUS_SITE_URL ?? 'https://marjan-ahmed.github.io';
const siteBaseUrl = process.env.DOCUSAURUS_BASE_URL ?? '/humanoid-textbook/';
const chatkitApiUrl = process.env.DOCUSAURUS_CHATKIT_API_URL ?? 'https://humanoid-textbook-zeta.vercel.app/chatkit';
const chatkitDomainKey = process.env.DOCUSAURUS_CHATKIT_DOMAIN_KEY ?? 'domain_pk_6a42fec5544c81978c33e5ab4a2965850d8e66366255993f';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Textbook',
  tagline: 'An AI-native textbook for building embodied intelligence from ROS 2 to autonomous humanoids.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  trailingSlash: true,

  url: siteUrl,
  baseUrl: siteBaseUrl,

  organizationName: 'marjan-ahmed',
  projectName: 'humanoid-textbook',

  onBrokenLinks: 'throw',

  plugins: [],

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap',
      type: 'text/css',
      rel: 'stylesheet',
    },
  ],


  scripts: [
    {
      src: 'https://cdn.platform.openai.com/deployments/chatkit/chatkit.js',
      async: true,
    },
  ],
  customFields: {
    chatkitApiUrl,
    chatkitDomainKey,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/marjan-ahmed/humanoid-textbook/tree/main/book_content/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-image.svg',
    metadata: [
      {
        name: 'description',
        content:
          'A comprehensive AI-native textbook for Physical AI, Humanoid Robotics, ROS 2, Gazebo, Unity, NVIDIA Isaac, Vision-Language-Action systems, and autonomous humanoid capstone projects. 13-week structured course from embodied foundations to simulated humanoid deployment.',
      },
      {
        name: 'keywords',
        content:
          'Physical AI, Humanoid Robotics, ROS 2, Gazebo, Unity, NVIDIA Isaac, Vision-Language-Action, VLA, AI textbook, robotics course, embodied intelligence, simulation, digital twins, Nav2, VSLAM, robot middleware, autonomous robots',
      },
      {
        name: 'author',
        content: 'Marjan Ahmed',
      },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        property: 'og:title',
        content: 'Physical AI & Humanoid Robotics Textbook — AI-Native Field Manual',
      },
      {
        property: 'og:description',
        content:
          'Learn Physical AI from ROS 2 to autonomous humanoids. 13-week structured course covering simulation, NVIDIA Isaac, VLA systems, and a humanoid capstone project.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:locale',
        content: 'en_US',
      },
      {
        property: 'og:site_name',
        content: 'Physical AI & Humanoid Robotics Textbook',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:creator',
        content: '@marjanahmed',
      },
      {
        name: 'twitter:title',
        content: 'Physical AI & Humanoid Robotics Textbook — AI-Native Field Manual',
      },
      {
        name: 'twitter:description',
        content:
          'Learn Physical AI from ROS 2 to autonomous humanoids. 13-week structured course covering simulation, NVIDIA Isaac, VLA systems, and a humanoid capstone project.',
      },
      {
        name: 'theme-color',
        content: '#6f4f1f',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'PHYSICAL AI' ,
      logo: {
        alt: 'Physical AI Textbook mark',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'courseSidebar',
          position: 'left',
          label: 'Textbook',
        },
        {to: '/docs/foundations/physical-ai-and-embodiment', label: 'Foundations', position: 'left'},
        {to: '/docs/capstone/autonomous-humanoid', label: 'Capstone Studio', position: 'left'},
        {to: '/signin', label: 'Sign In', position: 'right', className: 'navbar__auth-item'},
        {to: '/signup', label: 'Sign Up', position: 'right', className: 'navbar__cta navbar__auth-item'},
        {
          href: 'https://github.com/marjan-ahmed/humanoid-textbook',
          label: 'Source',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'READING PATH',
          items: [
            {label: 'Start Reading', to: '/docs/intro'},
            {label: 'Course Foundations', to: '/docs/foundations/physical-ai-and-embodiment'},
            {label: 'Autonomous Humanoid Capstone', to: '/docs/capstone/autonomous-humanoid'},
          ],
        },
        {
          title: 'ROBOTICS STACK',
          items: [
            {label: 'ROS 2', to: '/docs/ros-2/robotic-nervous-system'},
            {label: 'Digital Twins', to: '/docs/simulation/digital-twins-gazebo-unity'},
            {label: 'NVIDIA Isaac', to: '/docs/nvidia-isaac/ai-robot-brain'},
          ],
        },
        {
          title: 'BUILD LOG',
          items: [
            {label: 'Repository', href: 'https://github.com/marjan-ahmed/humanoid-textbook'},
          ],
        },
      ],
      copyright: `Physical AI & Humanoid Robotics Field Manual / Built for simulation-first embodied intelligence.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;





