'use client';

import s from './Stack.module.css';
import { SiTypescript } from 'react-icons/si';
import { FaJs } from 'react-icons/fa';
import { FaReact } from 'react-icons/fa';
import { FaHtml5 } from 'react-icons/fa';
import { FaCss3Alt } from 'react-icons/fa';
import { RiTailwindCssFill } from 'react-icons/ri';
import { MdDesignServices } from 'react-icons/md';
import { SiRedux } from 'react-icons/si';
import { SiVite } from 'react-icons/si';
import { SiNextdotjs } from 'react-icons/si';
import { useState } from 'react';
import './Stack.css';

export default function Stack() {
  const techStack = [
    {
      name: 'TypeScript',
      icon: <SiTypescript size={35} />,
      color: '#3178C6',
      description: 'Strongly typed JavaScript for building safe and scalable applications.',
    },
    {
      name: 'JavaScript (ES6+)',
      icon: <FaJs size={35} />,
      color: '#F7DF1E',
      description: 'Modern JavaScript with async/await, modules, and latest language features.',
    },
    {
      name: 'React',
      icon: <FaReact size={35} />,
      color: '#61DAFB',
      description: 'Library for building fast and reusable user interfaces.',
    },
    {
      name: 'Next.js',
      icon: <SiNextdotjs size={35} />,
      color: '#000000',
      description: 'React framework for production with SSR, SSG, and API routes.',
    },
    {
      name: 'HTML5',
      icon: <FaHtml5 size={35} />,
      color: '#E34F26',
      description: 'Semantic and accessible markup for modern web applications.',
    },
    {
      name: 'CSS3',
      icon: <FaCss3Alt size={35} />,
      color: '#1572B6',
      description: 'Styling, animations, layouts, and responsive design.',
    },
    {
      name: 'Tailwind CSS',
      icon: <RiTailwindCssFill size={35} />,
      color: '#38BDF8',
      description: 'Utility-first CSS framework for rapid UI development.',
    },
    {
      name: 'Responsive Design',
      icon: <MdDesignServices size={35} />,
      color: '#8B5CF6',
      description: 'Mobile-first and adaptive UI for all screen sizes.',
    },
    {
      name: 'Redux Toolkit',
      icon: <SiRedux size={35} />,
      color: '#764ABC',
      description:
        'State management library for predictable and scalable application architecture.',
    },
    {
      name: 'Vite',
      icon: <SiVite size={35} />,
      color: '#646CFF',
      description: 'Modern build tool with extremely fast development server.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleOpen(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className={s.content}>
      <h1 className={s.title}>my stack</h1>

      <ul className={s.list}>
        {techStack.map((item, i) => (
          <li key={i} className={s.listItem} onClick={() => handleOpen(i)}>
            <div className={s.nameWrap}>
              <h4 className={s.itemName}>{item.name}</h4>
              <span className={s.icon} style={{ color: item.color }}>
                {item.icon}
              </span>
            </div>

            <div className={`deskWrap ${openIndex === i ? 'deskOpen' : ''}`}>
              <p className={s.description}>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
