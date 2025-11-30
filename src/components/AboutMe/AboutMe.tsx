'use client';

import { motion } from 'framer-motion';
import s from './AboutMe.module.css';
import { FaGithub, FaWhatsapp, FaTelegram } from 'react-icons/fa';

export default function AboutMePage() {
  return (
    <motion.div
      className={s.content}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}>
      <div className={s.container}>
        <div className={s.cols}>
          <motion.div
            className={s.leftCol}
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <div className={s.leftWrap}>
              <h1 className={s.title}>
                <span className={s.tag}>{'<h1>'}</span>
                about me
                <span className={s.tag}>{'</h1>'}</span>
              </h1>

              <motion.p
                className={s.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}>
                Hello, my name is Egor, and I am a passionate{' '}
                <span className={s.green}>Front-End Developer</span> specializing in and modern
                React. I focus on building complex, scalable, and high-performance user interfaces
                using modern frontend stacks and best engineering practices. I continuously learn
                new technologies, experiment with approaches, and refine my skills to stay
                up-to-date with industry standards. I have strong experience in developing reusable
                components, managing complex state, working with{' '}
                <span className={s.green}>asynchronous logic</span>, and building thoughtful{' '}
                <span className={s.green}>UI architecture</span>. I follow a product-oriented
                mindset: I strive not only to write code, but to create user-friendly, fast, and
                reliable digital products that bring real value to users and businesses. I am open
                to commercial projects, <span className={s.green}>teamwork</span>, and long-term
                collaboration. I communicate well in a team, take responsibility for tasks, and
                always aim for high-quality results. I constantly improve my stack, explore new
                tools and architectural patterns, and invest in my professional growth.
              </motion.p>
            </div>

            <div className={s.contacts}>
              <h2 className={s.contactsTitle}>contacts</h2>

              <div className={s.contactLinks}>
                {[
                  { icon: <FaGithub size={30} />, link: 'https://github.com/eg1oria' },
                  { icon: <FaWhatsapp size={30} />, link: 'https://wa.me/77054424389' },
                  { icon: <FaTelegram size={30} />, link: 'https://t.me/eg1oria' },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.link}
                    target="_blank"
                    whileHover={{ scale: 1.25, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}>
                    {item.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className={s.rightCol}
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <motion.div
              className={s.part}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}>
              <h2 className={s.rightTitle}>Education</h2>

              <div className={s.ed}>
                <span className={s.edDate}>2024 – 2025</span>
                <div className={s.edInfo}>
                  <h4 className={s.edTitle}>SKILLBOX</h4>
                  <p className={s.edName}>
                    Profession <span className={s.green}>Frontend Developer</span>
                  </p>
                </div>
              </div>

              <div className={s.ed}>
                <span className={s.edDate}>2023 – 2026</span>
                <div className={s.edInfo}>
                  <h4 className={s.edTitle}>ALT University</h4>
                  <p className={s.edName}>Data Analyst</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={s.part}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}>
              <h2 className={s.rightTitle}>experience && projects</h2>

              <div className={s.ed}>
                <span className={s.edDate}>2025 – . . .</span>
                <div className={s.edInfo}>
                  <h4 className={s.edTitle}>MiAmore</h4>
                  <p className={s.edName}>Pet project — flower shop</p>
                </div>
              </div>

              <div className={s.ed}>
                <span className={s.edDate}>2023 – 2024</span>
                <div className={s.edInfo}>
                  <h4 className={s.edTitle}>Starting projects</h4>
                  <p className={s.edName}>HTML + CSS + Pixel Perfect</p>
                </div>
              </div>

              <div className={s.ed}>
                <span className={s.edDate}>2025 - 2025</span>
                <div className={s.edInfo}>
                  <h4 className={s.edTitle}>Hegg</h4>
                  <p className={s.edName}>Heggsfield hackathon</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
