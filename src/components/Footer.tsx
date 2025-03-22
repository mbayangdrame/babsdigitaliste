import React from 'react';
import logo from '../img/logobabs.png'

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Colonne 1 - Logo et Description */}
        <div className="space-y-6">
         <img src={logo} alt="" />
          <p className="text-gray-400 mt-6 max-w-md">
          Suivez-moi sur mes réseaux sociaux pour découvrir mes dernières créations, collaborations et projets inspirants.
          </p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/babsdigitaliste/?_rdr" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#009EAA] hover:text-[#fff] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/babsdigitaliste/" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#009EAA] hover:text-[#fff] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
              </svg>
            </a>
            <a href="https://www.snapchat.com/add/babsjallow" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#009EAA] hover:text-[#fff] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.206 0C9.596 0 8.34 1.847 8.34 5.86v1.098c-.124 0-.413-.052-.689-.052-.413 0-.93.052-1.343.31-.31.207-.516.517-.516.88 0 .413.31.827.723.93.207.051.413.103.62.103.258 0 .517-.052.672-.103v.103c-.103.464-2.067 4.292-6.411 4.447a.433.433 0 00-.413.413v.052c0 .258.155.465.413.517 1.136.258 2.067.827 2.79 1.705.775.93 1.188 2.067 1.24 3.41 0 .207.155.413.361.465.155.052.31.052.465.052.827 0 1.808-.31 2.945-.93 1.188-.671 2.376-1.033 3.513-1.033 1.137 0 2.325.362 3.513 1.033 1.137.62 2.118.93 2.945.93.155 0 .31 0 .465-.052.207-.052.362-.258.362-.465.051-1.343.464-2.48 1.24-3.41.723-.878 1.653-1.447 2.79-1.705.258-.052.413-.259.413-.517v-.052a.433.433 0 00-.414-.413c-4.343-.155-6.307-3.983-6.41-4.447v-.103c.155.051.413.103.671.103.207 0 .413-.052.62-.103.413-.103.724-.517.724-.93 0-.363-.207-.673-.517-.88-.413-.258-.93-.31-1.343-.31-.276 0-.565.052-.689.052V5.86C15.657 1.847 14.402 0 11.792 0h.414z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/babsdigitaliste/posts/?feedView=all" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#009EAA] hover:text-[#fff] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Colonne 2 - Liens Rapides */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium mb-6">Liens Rapides</h3>
          <ul className="space-y-4">
            <li>
              <a href="/apropos" className="text-gray-400 hover:text-[#009EAA] flex items-center">
                <span className="mr-2">→</span>
                À propos de nous
              </a>
            </li>
            <li>
              <a href="/services" className="text-gray-400 hover:text-[#009EAA] flex items-center">
                <span className="mr-2">→</span>
                Services
              </a>
            </li>
            
            <li>
              <a href="/portfolio" className="text-gray-400 hover:text-[#009EAA] flex items-center">
                <span className="mr-2">→</span>
                portfolio
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-400 hover:text-[#009EAA] flex items-center">
                <span className="mr-2">→</span>
                Contactez-nous
              </a>
            </li>
          </ul>
        </div>

        {/* Colonne 3 - Contact */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium mb-6">Contactez-nous</h3>
          <div className="space-y-6">
            <p className="text-gray-400">
               Dakar,Senegal
            </p>
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#009EAA]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <div>
                <p className="text-white">+221 77 124 84 67</p>
                <p className="text-[#fff] text-sm">Pour information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#009EAA]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <div>
                <p className="text-white">infos@babsdigitaliste.com</p>
                <p className="text-[#fff] text-sm">Adresse email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
