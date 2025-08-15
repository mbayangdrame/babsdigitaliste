import AboutSection from "../components/AboutIndex";
import HeaderFull from "../components/HeaderFull";
import PricingSection from "../components/PricingSection";
import TeamSection from "../components/teamMembers";
function About() {
    return(
        <>
       <HeaderFull titre="À propos" paragraphe="Créer des histoires grâce à des photos et des vidéos époustouflantes" />
       
       <AboutSection />
       <PricingSection />
       <TeamSection />
       {/* <AboutComponent /> */}
        </>
    )
}
export default About;