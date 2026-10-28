export default function FaqCard({ question, answer }) {
  return (
    <article className="faq-card" tabIndex={0}>
      <h3 className="faq-card__q">{question}</h3>
      <p className="faq-card__a">{answer}</p>
    </article>
  );
}