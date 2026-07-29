import Hero from "../Components/Hero"
import ProblemStatement from "../Components/ProblemStatement"
import Feature from "../Components/Feature"
import Work from "../Components/Work"
import Footer from "../Components/common/Footer"
import Cta from "../Components/Cta"
const Home = () => {
  return (
   <>
   <Hero/>
   <hr className="mt-4 mx-10  border-gray-300" />
  <ProblemStatement/>
  <Feature/>
  <Work/>
  <Cta/>
  <Footer/>
   </>
  )
}

export default Home