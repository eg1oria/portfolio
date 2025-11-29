import s from './AboutMe.module.css';
import { FaGithub } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';

export default function AboutMePage() {
  return (
    <div className={s.content}>
      <div className={s.container}>
        <div className={s.cols}>
          <div className={s.leftCol}>
            <div className={s.leftWrap}>
              <h1 className={s.title}>
                <span className={s.tag}>{'<h1>'}</span>about me
                <span className={s.tag}>{'</h1>'}</span>
              </h1>

              <p className={s.text}>
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
              </p>
            </div>
            <div className={s.contacts}>
              <h2 className={s.contactsTitle}>contacts</h2>
              <div className={s.contactLinks}>
                <a href="https://github.com/eg1oria" target="_blank">
                  <FaGithub size={30} />
                </a>
                <a href="https://wa.me/77054424389" target="_blank">
                  <FaWhatsapp size={30} />
                </a>
                <a href="https://t.me/eg1oria" target="_blank">
                  <FaTelegram size={30} />
                </a>
              </div>
            </div>
          </div>
          <div className={s.rightCol}>
            <div className={s.part}>
              <h2 className={s.rightTitle}>Education</h2>
              <div className={s.eds}>
                <div className={s.ed}>
                  <span className={s.edDate}>2024-2025</span>
                  <div className={s.edInfo}>
                    <h4 className={s.edTitle}>SKILLBOX</h4>
                    <div className={s.edNamecontainer}>
                      <p className={s.edName}>
                        Profession <span className={s.green}>Frontend Developer</span>, completed a
                        course at Skillbox
                      </p>
                    </div>
                  </div>
                </div>
                <div className={s.ed}>
                  <span className={s.edDate}>2023-2026</span>
                  <div className={s.edInfo}>
                    <h4 className={s.edTitle}>ALT Univercity</h4>
                    <div className={s.edNamecontainer}>
                      <p className={s.edName}>Profession Data analyst, degree student</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={s.part}>
              <h2 className={s.rightTitle}>experience && projects</h2>
              <div className={s.eds}>
                <div className={s.ed}>
                  <span className={s.edDate}>2025 - . . .</span>
                  <div className={s.edInfo}>
                    <h4 className={s.edTitle}>MiAmore</h4>
                    <div className={s.edNamecontainer}>
                      <p className={s.edName}>Pet зroject - flower shop</p>
                    </div>
                  </div>
                </div>
                <div className={s.ed}>
                  <span className={s.edDate}>2023-2024</span>
                  <div className={s.edInfo}>
                    <h4 className={s.edTitle}>Starting projects</h4>
                    <div className={s.edNamecontainer}>
                      <p className={s.edName}>
                        Layout only using HTML && CSS based on figma layouts, and using{' '}
                        <span className={s.green}>pixel perfect</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={s.ed}>
                  <span className={s.edDate}>2025 - 2025</span>
                  <div className={s.edInfo}>
                    <h4 className={s.edTitle}>Hegg</h4>
                    <div className={s.edNamecontainer}>
                      <p className={s.edName}>Heggsfield hackathon project</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
