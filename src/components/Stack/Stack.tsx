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
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';

export default function Stack() {
  const techStack = [
    {
      name: 'TypeScript',
      icon: <SiTypescript size={35} />,
      color: '#3178C6',
      description: 'Strongly typed JavaScript for building safe and scalable applications.',
    },
    {
      name: 'JavaScript',
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

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={s.content}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}>
      <motion.h1
        className={s.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        my stack
      </motion.h1>

      <motion.ul
        className={s.list}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.1,
            },
          },
        }}>
        {techStack.map((item, i) => (
          <motion.li
            key={i}
            className={s.listItem}
            onClick={() => handleOpen(i)}
            variants={itemVariants}
            style={{
              background:
                openIndex === i ? 'rgba(168, 253, 71, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              borderLeftColor: openIndex === i ? '#a8fd478e' : 'transparent',
            }}>
            <div className={s.nameWrap}>
              <h4
                className={s.itemName}
                style={{
                  color: openIndex === i ? '#a8fd47a5' : 'white',
                }}>
                {item.name}
              </h4>
              <span
                className={s.icon}
                style={{ color: item.color, opacity: openIndex === i ? 1 : 0.7 }}>
                {item.icon}
              </span>
            </div>

            <div className={`deskWrap ${openIndex === i ? 'deskOpen' : ''}`}>
              <p className={s.description}>{item.description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
