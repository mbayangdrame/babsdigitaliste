import ServicesComponent from '../components/Servicescomponent';
import HeaderFull from '../components/HeaderFull';
import TestimonialSection from '../components/Testimonial';

const Service = () => {
    return(
        <>
        <HeaderFull titre='Services' paragraphe='Nous offrons des services de photographie professionnelle' />
       <ServicesComponent />
       {/* <TestimonialSection /> */}
        </>
    )

}
export default Service;