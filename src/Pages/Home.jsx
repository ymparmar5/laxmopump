import HeroSection from '../Components/HeroSection';
import Category from '../Components/Category';
import HomeProductCard from '../Components/HomeProductCard';




const Home = () => {
    


    return <div  className="main-content min-h-screen" >
       

       <HeroSection />
    
       <Category />
  
      <HomeProductCard />
      {/* <HomeAbout />      */}
       {/* <Testimonial /> */}
    </div>;

};


export default Home;

