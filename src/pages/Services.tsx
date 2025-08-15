import ServicesComponent from '../components/Servicescomponent';
import HeaderFull from '../components/HeaderFull';
import PricingSection from '../components/PricingSection';

const Service = () => {
    return(
        <>
        <HeaderFull titre='Services' paragraphe='Nous proposons des services de photographie professionnelle.' />
       <ServicesComponent />
       <PricingSection />
        </>
    )

}
export default Service;