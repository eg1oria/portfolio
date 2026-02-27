import s from './header.module.scss';
import { FaGithub } from 'react-icons/fa';
import { IoLogoDiscord } from 'react-icons/io5';
import { FaReddit } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';

export default function Header() {
  return (
    <div className={s.header}>
      <div className={s.header_content}>
        <div className={s.header_content_logo}>
          <p className={s.header_content_logo_text}>SITE NAME</p>
        </div>
        <nav className={s.header_content_nav}>
          <ul className={s.header_content_nav_list}>
            <li className={s.header_content_nav_list_item}>Smart Contracts</li>
            <li className={s.header_content_nav_list_item}>Services</li>
            <li className={s.header_content_nav_list_item}>Solutions</li>
            <li className={s.header_content_nav_list_item}>Roadmap</li>
            <li className={s.header_content_nav_list_item}>Whitepaper</li>
          </ul>
        </nav>

        <nav className={s.header_content_socials}>
          <ul className={s.header_content_socials_list}>
            <li className={s.header_content_socials_list_item}>
              <FaGithub size={20} />
            </li>
            <li className={s.header_content_socials_list_item}>
              <IoLogoDiscord size={20} />
            </li>
            <li className={s.header_content_socials_list_item}>
              <FaReddit size={20} />
            </li>
            <li className={s.header_content_socials_list_item}>
              <FaTwitter size={20} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
