import { Link } from 'react-router-dom';
import MotionPage from '../components/MotionPage';

const plans = [
  {
    name: 'Demo',
    price: 'Free',
    text: 'Enough to show the complete readiness-to-workout loop.',
    points: ['Check-in flow', 'Workout logging', 'Dashboard preview'],
  },
  {
    name: 'Athlete',
    price: 'Soon',
    text: 'Personal training context for repeat weekly use.',
    points: ['Templates', 'Recovery signals', 'Progress insights'],
  },
  {
    name: 'Coach',
    price: 'Soon',
    text: 'A future layer for managing multiple athletes.',
    points: ['Client overview', 'Shared notes', 'Training trends'],
  },
];

export default function Plans() {
  return (
    <MotionPage className="info-page">
      <section className="info-hero">
        <p className="info-kicker">Plans</p>
        <h1>Clear product packaging for the hackathon story.</h1>
        <span>
          Pricing is intentionally lightweight, but the page gives judges a sense of where the MVP
          can grow.
        </span>
      </section>

      <section className="info-grid info-grid-3">
        {plans.map((plan) => (
          <article className="info-card info-plan-card" key={plan.name}>
            <p>{plan.name}</p>
            <h2>{plan.price}</h2>
            <span>{plan.text}</span>
            <ul>
              {plan.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link to="/register">Start here</Link>
          </article>
        ))}
      </section>
    </MotionPage>
  );
}
