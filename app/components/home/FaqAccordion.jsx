import {useState} from 'react';

const faqs = [
  {
    question: 'What products does Rosabella offer?',
    answer:
      'Rosabella offers organic beetroot capsules and moringa supplements in various forms including capsules, gummies, and powders.',
  },
  {
    question: 'What ingredients are in Rosabella products?',
    answer:
      'Our products contain single-ingredient formulas with organic beetroot or moringa leaf as the primary ingredient, with minimal additional ingredients as needed for capsule or powder formulation.',
  },
  {
    question: 'Where can I buy Rosabella?',
    answer:
      'Rosabella products are available for purchase on our official website and select retail partners.',
  },
  {
    question: 'Is Rosabella safe to take with my current medications?',
    answer:
      'Please consult your healthcare provider before taking any supplement if you are on medication or have existing health conditions.',
  },
  {
    question: 'How should I store Rosabella products?',
    answer:
      'Store in a cool, dry place away from direct sunlight. Keep containers tightly sealed.',
  },
  {
    question: 'How often should I take Rosabella supplements?',
    answer:
      'Follow the recommended dosage on the product label. Typically 1-2 servings per day as directed.',
  },
  {
    question: 'How many servings are in each container?',
    answer:
      'Each container contains the number of servings as indicated on the label - typically 30 days of use.',
  },
  {
    question: "What if I'm not satisfied?",
    answer:
      'Every order is covered by our 90-day money-back guarantee. Contact our customer service team for assistance.',
  },
];

function ChevronIcon() {
  return (
    <svg
      className="rv-faq__chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="rv-faq">
      <div className="rv-container">
        <div className="rv-faq__inner">
          <h2 className="rv-faq__title">FAQs</h2>

          <div>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  className="rv-faq__item"
                  key={faq.question}
                  data-open={isOpen}
                >
                  <button
                    type="button"
                    className="rv-faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`rv-faq-panel-${index}`}
                    id={`rv-faq-trigger-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="rv-faq__question">{faq.question}</span>
                    <ChevronIcon />
                  </button>
                  <div
                    className="rv-faq__panel"
                    id={`rv-faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`rv-faq-trigger-${index}`}
                    aria-hidden={!isOpen}
                  >
                    <div>
                      <p className="rv-faq__answer">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
