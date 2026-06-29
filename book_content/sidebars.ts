import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  courseSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Foundations of Physical AI',
      items: ['foundations/physical-ai-and-embodiment'],
    },
    {
      type: 'category',
      label: 'The Robotic Nervous System',
      items: ['ros-2/robotic-nervous-system'],
    },
    {
      type: 'category',
      label: 'Digital Twins and Simulation',
      items: ['simulation/digital-twins-gazebo-unity'],
    },
    {
      type: 'category',
      label: 'The AI-Robot Brain',
      items: ['nvidia-isaac/ai-robot-brain'],
    },
    {
      type: 'category',
      label: 'Vision-Language-Action',
      items: ['vla/vision-language-action'],
    },
    {
      type: 'category',
      label: 'Humanoid Systems',
      items: ['humanoids/humanoid-development'],
    },
    {
      type: 'category',
      label: 'Capstone Studio',
      items: ['capstone/autonomous-humanoid'],
    },
  ],
};

export default sidebars;
