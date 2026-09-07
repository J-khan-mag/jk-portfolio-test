import {
  TITLE,
  SUMMARY,
  CAPABILITIES,
  SCOPE,
  AUTHORITIES,
  SOFTWARE,
  EDUCATION,
  MEMBERSHIPS,
  LANGUAGES,
} from '../data/profile';

/**
 * The record, set as a spec sheet rather than prose — what the role turns on,
 * then the plain facts underneath it. Sits between the last floor of work and
 * the basement.
 */
export default function Practice() {
  return (
    <section className="practice" aria-label="Practice">
      <header className="floor-head practice-floorhead rise">
        <div className="floor-key">G</div>
        <div className="floor-meta">
          <h2>The Record</h2>
          <div className="label" style={{ color: 'var(--on-room-3)' }}>
            Profile &amp; capabilities · {TITLE}
          </div>
          <p>{SUMMARY}</p>
        </div>
      </header>

      <div className="practice-turns rise">
        <div className="label" style={{ color: 'var(--on-room-3)' }}>What the role turns on</div>
        <dl>
          {CAPABILITIES.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>{c.note}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="sheet-grid">
        <div className="sheet-col rise">
          <div className="label sheet-h">Education</div>
          <ul className="sheet-list">
            {EDUCATION.map((e) => (
              <li key={e.primary}>
                <span className="sp-1">{e.primary}</span>
                {e.secondary && <span className="sp-2">{e.secondary}</span>}
                {e.note && <span className="sp-3 num">{e.note}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="sheet-col rise">
          <div className="label sheet-h">Membership &amp; certification</div>
          <ul className="sheet-list">
            {MEMBERSHIPS.map((e) => (
              <li key={e.primary}>
                <span className="sp-1">{e.primary}</span>
                {e.note && <span className="sp-3">{e.note}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="sheet-col rise">
          <div className="label sheet-h">Languages</div>
          <ul className="sheet-list">
            {LANGUAGES.map((e) => (
              <li key={e.primary}>
                <span className="sp-1">{e.primary}</span>
                <span className="sp-3">{e.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sheet-col rise">
          <div className="label sheet-h">Scope</div>
          <ul className="sheet-tags">
            {SCOPE.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="sheet-col rise">
          <div className="label sheet-h">Authority submissions</div>
          <ul className="sheet-tags">
            {AUTHORITIES.map((a) => (
              <li key={a} className="num">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="sheet-col rise">
          <div className="label sheet-h">Software</div>
          <ul className="sheet-tags">
            {SOFTWARE.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
