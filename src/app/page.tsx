import AboutMePage from '@/components/AboutMe/AboutMe';
import HomePage from '@/components/HomePage/HomePage';
import Stack from '@/components/Stack/Stack';

export default function Home() {
  return (
    <div className="content">
      <HomePage />
      <AboutMePage />
      <Stack />
    </div>
  );
}
