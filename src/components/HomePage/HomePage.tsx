import s from './homePage.module.css';
import { CiStar } from 'react-icons/ci';

export default function HomePage() {
  return (
    <div className={s.home}>
      <div className={s.container}>
        <h1 className={s.title}>Hi, my name is Egor</h1>
        <div className={s.authorSkill}>
          <span>{'{'}</span>
          <span>{`work`}</span>
          <span>?</span>
          <span>{'<Frontend Developer />'}</span>
          <span className={s.bold}>:</span>
          <span>{'<UX Desinger />'}</span>
          <span>{'}'}</span>
        </div>
        <div className={s.year}>
          <span>20</span>
          <span>
            <CiStar />
          </span>
          <span>25</span>
        </div>
      </div>
    </div>
  );
}
