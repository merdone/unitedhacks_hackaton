import MotionPage from '../components/MotionPage';

const questions = [
  {
    q: 'Does FitPulse replace a coach?',
    a: 'No. It helps users bring better context into a workout and make safer day-to-day adjustments.',
  },
  {
    q: 'Is the AI live in this MVP?',
    a: 'The frontend is built around the AI flow, while the backend currently supports a recommendation endpoint and can be upgraded later.',
  },
  {
    q: 'What makes the product different?',
    a: 'It starts from readiness instead of treating every workout day as identical.',
  },
  {
    q: 'Can users train without templates?',
    a: 'Yes. The workout page supports free-form sessions and custom exercises.',
  },
];

export default function Faq() {
  return (
    <MotionPage className="info-page">
      <section className="info-hero">
        <p className="info-kicker">FAQ</p>
        <h1>Quick answers for the demo table.</h1>
        <span>Short, judge-friendly answers for the most likely product questions.</span>
      </section>

      <section className="info-list">
        {questions.map((item) => (
          <article className="info-card" key={item.q}>
            <h2>{item.q}</h2>
            <span>{item.a}</span>
          </article>
        ))}
      </section>
    </MotionPage>
  );
}
