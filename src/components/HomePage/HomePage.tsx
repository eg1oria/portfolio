'use client';

import { motion } from 'framer-motion';
import s from './homePage.module.css';
import { CiStar } from 'react-icons/ci';

const skills = ['<Frontend Developer />', '<UX Designer />'];

export default function HomePage() {
  return (
    <div className={s.home}>
      <div className={s.container}>
        <motion.h1
          className={s.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          Hi, my name is <span className={s.name}>Egor</span>
        </motion.h1>

        <motion.div
          className={s.authorSkill}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}>
          {['{', 'work', '?', skills[0], ':', skills[1], '}'].map((item, i) => (
            <motion.span
              key={i}
              className={item === ':' ? s.bold : ''}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}>
              {item}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className={s.year}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}>
          20
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}>
            <CiStar />
          </motion.span>
          25
        </motion.div>
      </div>
      
      <div className={s.glow} />
    </div>
  );
}
