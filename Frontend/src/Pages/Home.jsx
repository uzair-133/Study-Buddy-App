import Hero from "../Components/Hero"
import ProblemStatement from "../Components/ProblemStatement"
import Feature from "../Components/Feature"
import Work from "../Components/Work"
import Footer from "../Components/common/Footer"
import Cta from "../Components/Cta"
import Navbar from "../Components/common/Navbar"
const Home = () => {
  return (
    <>
      <div className='bg-paper min-h-screen m-2 pt-6   md:pt-8 md:m-2'>
      <Navbar />
      <Hero />
      <hr className="mt-4 mx-10  border-gray-300" />
      <ProblemStatement />
      <Feature />
      <Work />
      <Cta />
      <Footer />
    </div >
    </>
  )
}

export default Home