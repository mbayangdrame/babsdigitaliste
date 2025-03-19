import AboutSection from "../components/AboutIndex";
import HeaderFull from "../components/HeaderFull";
import AboutComponent from "../components/AboutCompoonent";
import TeamSection from "../components/teamMembers";
function About() {
    return(
        <>
       <HeaderFull titre="À propos" paragraphe="Créer des histoires grâce à des photos et des vidéos époustouflantes" />
       
       <AboutSection />
       <TeamSection />
       {/* <AboutComponent /> */}
        </>
    )
}
export default About;