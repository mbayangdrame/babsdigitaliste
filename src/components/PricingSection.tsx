import React, { useState } from 'react';
import '../css/prix.css';
import { useNavigate } from 'react-router-dom';

// Définition du type de plan tarifaire
type PricingPlan = {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
  category: 'studio' | 'exterieur' | 'evenement';
};

const plans: PricingPlan[] = [
  {
    title: 'Studio',
    price: '50 000 FCFA',
    features: ['2h de shooting', '10 photos retouchées', 'Livraison sous 48h'],
    category: 'studio',
  },
  {
    title: 'Studio',
    price: '100 000 FCFA',
    features: ['4h de shooting', '20 photos retouchées', 'Livraison sous 72h'],
    highlight: true,
    category: 'studio',
  },
  {
    title: 'Studio',
    price: '150 000 FCFA',
    features: ['6h de shooting', '50 photos retouchées', 'Livraison sous 5 jours max'],
    category: 'studio',
  },
  {
    title: 'Exterieur',
    price: '100 000 FCFA',
    features: ['2h de shooting', '10 photos retouchées', 'Livraison sous 48h', 'Transport inclut'],
    highlight: true,
    category: 'exterieur',
  },
  {
    title: 'Evenement',
    price: '250 000 FCFA',
    features: ['Couverture Photos','24h', 'Transport inclut', 'Photos Illimités ', 'Livraison sous 48h maximum'],
    category: 'evenement',
  },
  // {
  //   title: 'Deplacement',
  //   price: '350 000 FCFA',
  //   features: ['Couverture Photos', 'Transport inclut', 'Photos Illimités ', 'Livraison sous 48h maximum'],
  //   highlight: true,
  //   category: 'deplacement',
  // },
];

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'studio' | 'exterieur' | 'evenement'>('studio');

  const handleReserveClick = () => {
    navigate('/contact');
  };

  const filteredPlans = plans.filter(plan => plan.category === selectedCategory);

  return (
    <section className="pricing-section py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Nos Formules Photos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Choisissez la formule qui correspond à vos besoins. Personnalisation possible sur demande.
          </p>

          {/* Boutons de filtre */}
          <div className="flex justify-center gap-4 mb-10 flex-wrap">
            {['studio', 'exterieur', 'evenement'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as 'studio' | 'exterieur' | 'evenement')}
                className={`py-2 px-6 rounded-full border font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#009EAA] text-white border-[#009EAA]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cartes des plans */}
        <div className="flex flex-col md:flex-row justify-center gap-8 items-stretch flex-wrap">
          {filteredPlans.map((plan, index) => (
            <div
            key={index}
            className={`relative rounded-2xl p-8 w-full md:w-[48%] lg:w-[30%] transition-all duration-300 ${
              plan.highlight
                ? 'bg-gradient-to-br from-[#E6F7F9] to-[#f0fdfd] border-2 border-[#009EAA] shadow-xl'
                : 'bg-white border border-gray-200 shadow-md'
            } hover:shadow-xl hover:-translate-y-2`}
          >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#009EAA] text-white text-sm font-bold px-4 py-1 rounded-full">
                  Populaire
                </div>
              )}

              <div className="h-full flex flex-col">
                <h3 className={`text-2xl font-bold mb-3 ${plan.highlight ? 'text-[#009EAA]' : 'text-gray-800'}`}>
                  {plan.title}
                </h3>

                <p className="text-3xl font-extrabold mb-6 text-gray-900">{plan.price}</p>

                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0 text-[#009EAA]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleReserveClick}
                  className={`mt-auto w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-[#009EAA] hover:bg-[#00818a] text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  Réserver maintenant
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
