import Image from 'next/image';
import s from './Hero.module.scss';

export default function Hero() {
  return (
    <div className={s.hero}>
      <div className={s.hero_content}>
        <h1 className={s.hero_content_title}>THE BEST WEBSITE EVER</h1>
        <h2 className={s.hero_content_subtitle}>Scalable</h2>
        <p className={s.hero_content_description}>
          Our technology performing fast blockchain (120K TPS) and it has guaranteed AI-based data
          security. Proof of Stake, its consensus algorithm enables unlimited speeds.
        </p>

        <div className={s.hero_content_buttons}>
          <button className={`${s.hero_content_buttons_button} ${s.hero_content_buttons_button1}`}>
            Get started
          </button>
          <button className={s.hero_content_buttons_button}>Read more</button>
        </div>
      </div>
      <Image
        src="/main-img.png"
        alt="Foto"
        width={1605}
        height={619}
        className={s.hero_content_image}
      />
    </div>
  );
}
