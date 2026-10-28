import {useState} from 'react';

const faqs = [
  {
    question: 'What products does Rosavita offer?',
    answer:
      'Rosavita offers a range of whole-food wellness supplements including Organic Beetroot Capsules for circulation and stamina support, Moringa Capsules and Gummies for daily nutritional support, and Fast Hydration Electrolyte Powder for everyday hydration. All products are manufactured in a GMP-certified facility in the USA.*',
  },
  {
    question: 'What ingredients are in Rosavita products?',
    answer:
      'Every Rosavita product is built around whole-food ingredients with minimal excipients. Full ingredient lists and Supplement Facts panels are available on each product page. We believe in transparency — what you see on the label is what you get.',
  },
  {
    question: 'Where can I buy Rosavita?',
    answer:
      'Rosavita products are available on our website and on Amazon.',
  },
  {
    question: 'Is Rosavita safe to take with my current medications?',
    answer:
      'We recommend consulting your healthcare provider before starting any new supplement, particularly if you are taking medication, pregnant, breastfeeding, or have a known medical condition.',
  },
  {
    question: 'How should I store Rosavita products?',
    answer:
      'Store all products in a cool, dry place, away from direct sunlight and moisture, to maintain freshness and shelf life.',
  },
  {
    question: 'How often should I take Rosavita supplements?',
    answer:
      'Suggested use varies by product — check the label on your specific product for directions. All of our supplements are designed for consistent daily use.',
  },
  {
    question: 'How many servings are in each container?',
    answer:
      "All Rosavita products contain approximately 30 servings per container, providing a full month's supply when taken as directed.",
  },
  {
    question: "What if I'm not satisfied?",
    answer:
      "Rosavita offers a 90-day satisfaction guarantee across all products. If you're not completely satisfied for any reason, simply return the product within 90 days of delivery and we'll refund your purchase price. Return shipping is the customer's responsibility. Email <a href=\"mailto:help@tryrosavita.com\">help@tryrosavita.com</a> to initiate the return process.",
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
                      <div
                className="rv-faq__answer"
                dangerouslySetInnerHTML={{__html: faq.answer}}
              />
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
