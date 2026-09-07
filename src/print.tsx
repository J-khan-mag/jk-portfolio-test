import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BookCtx, PageBody } from './components/Pages';
import { buildPages } from './lib/pages';
import './styles.css';
import './print.css';

const { pages, leafCount } = buildPages();

const noop = {
  spreadOf: {},
  spreadOfLevel: {},
  goTo: () => {},
  openLightbox: () => {},
};

function PrintSheets() {
  const spreads = Array.from({ length: leafCount + 1 }, (_, i) => i);

  return (
    <BookCtx.Provider value={noop}>
      <div className="print-root">
        {spreads.map((s) => {
          const left = s > 0 ? pages[s * 2 - 1] : undefined;
          const right = pages[s * 2];
          return (
            <div className={`sheet${s === 0 ? ' cover-sheet' : ''}`} data-sheet={s} key={s}>
              <div className={`half left${left ? '' : ' empty'}`}>
                {left && <PageBody page={left} />}
              </div>
              <div className={`half right${right ? '' : ' empty'}`}>
                {right && <PageBody page={right} />}
              </div>
            </div>
          );
        })}
      </div>
    </BookCtx.Provider>
  );
}

const el = document.getElementById('root');
if (el) {
  createRoot(el).render(
    <StrictMode>
      <PrintSheets />
    </StrictMode>
  );
}
