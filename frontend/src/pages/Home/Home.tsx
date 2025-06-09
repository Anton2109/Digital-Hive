import styles from './Home.module.css';
import Hero from './components/Hero/Hero';
import FeaturedGames from './components/FeaturedGames/FeaturedGames';
// import Categories from './components/Categories/Categories';
import Features from './components/Features/Features';
import News from './components/News/News';

const Home = () => {
  return (
    <div className={styles.home}>
      <Hero />
      <FeaturedGames />
      {/* <Categories /> */}
      <Features />
      <News />
    </div>
  );
};

export default Home;
