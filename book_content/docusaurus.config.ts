import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'An AI-native textbook for building embodied intelligence from ROS 2 to autonomous humanoids.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://marjan-ahmed.github.io',
  baseUrl: '/humanoid-textbook/',

  organizationName: 'marjan-ahmed',
  projectName: 'humanoid-textbook',

  onBrokenLinks: 'throw',

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap',
      type: 'text/css',
      rel: 'stylesheet',
    },
  ],

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
    image: 'img/logo.svg',
    metadata: [
      {
        name: 'description',
        content:
          'A premium AI-native textbook for Physical AI, Humanoid Robotics, ROS 2, Gazebo, Unity, NVIDIA Isaac, VLA systems, and autonomous humanoid capstones.',
      },
      {
        name: 'keywords',
        content:
          'Physical AI, Humanoid Robotics, ROS 2, Gazebo, Unity, NVIDIA Isaac, Vision-Language-Action, AI-native textbook',
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



