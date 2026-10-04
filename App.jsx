import { useEffect, useState } from 'react';

const STORAGE_KEY = 'june-25-journal-v1';
const starterEntries = [{ id: 'first', text: 'Small beginnings make great stories.', done: false }];

function loadEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === 'string' && typeof item.text === 'string' && typeof item.done === 'boolean') : starterEntries;
  } catch {
    return starterEntries;
  }
}

export default function App() {
  const [entries, setEntries] = useState(loadEntries);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch { /* Browser storage may be disabled. */ }
  }, [entries]);

  function addEntry(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setEntries((current) => [...current, { id: crypto.randomUUID(), text, done: false }]);
    setDraft('');
  }

  function toggleEntry(id) {
    setEntries((current) => current.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  }

  function removeEntry(id) {
    setEntries((current) => current.filter((item) => item.id !== id));
  }

  const completed = entries.filter((item) => item.done).length;

  return (
    <main className="page">
      <header className="topbar"><a className="brand" href="#home" aria-label="Day Notes home"><span className="brand-mark">✳</span> day notes</a><span className="edition">A LITTLE SPACE TO REMEMBER</span></header>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> TUESDAY · JUNE 25, 2024</div>
          <h1 id="hero-title">A day worth<br /><em>remembering.</em></h1>
          <p>Every moment is a little piece of the story. Save a thought, celebrate a win, or simply note what matters today.</p>
          <a href="#journal" className="hero-link">Open your journal <span aria-hidden="true">↗</span></a>
        </div>
        <div className="date-card" aria-label="June 25, 2024, Tuesday">
          <div className="card-top"><span>YOUR DAILY PAGE</span><span>NO. 177 / 366</span></div>
          <div className="card-body"><span className="card-month">JUNE</span><strong>25</strong><span className="card-day">TUESDAY, 2024</span></div>
          <div className="card-bottom"><span>MAKE THE ORDINARY COUNT</span><span aria-hidden="true">✳</span></div>
        </div>
      </section>
      <section className="journal" id="journal" aria-labelledby="journal-title">
        <div className="section-head"><div><div className="section-label">01 / THE JOURNAL</div><h2 id="journal-title">Notes from this day<span className="accent">.</span></h2></div><span className="count">{completed} OF {entries.length} REMEMBERED</span></div>
        <form className="entry-form" onSubmit={addEntry}>
          <label className="sr-only" htmlFor="entry">Add a note about the day</label>
          <input id="entry" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={180} placeholder="What would you like to remember?" />
          <button type="submit" disabled={!draft.trim()}>Add note <span aria-hidden="true">↗</span></button>
        </form>
        <ul className="entry-list">
          {entries.map((item) => <li className={item.done ? 'entry complete' : 'entry'} key={item.id}>
            <button className="check" type="button" onClick={() => toggleEntry(item.id)} aria-label={`${item.done ? 'Unmark' : 'Mark'} ${item.text} as remembered`} aria-pressed={item.done}>{item.done ? '✓' : ''}</button>
            <span className="entry-text">{item.text}</span>
            <button className="remove" type="button" onClick={() => removeEntry(item.id)} aria-label={`Remove ${item.text}`}>×</button>
          </li>)}
          {entries.length === 0 && <li className="empty">Your page is blank. Add the first thought above.</li>}
        </ul>
        <p className="storage-note">Your notes stay in this browser. They aren’t sent anywhere.</p>
      </section>
      <footer className="footer"><span>DAY NOTES <span aria-hidden="true">✳</span> JUNE 25, 2024</span><span>ONE DAY, ONE STORY.</span></footer>
    </main>
  );
}
