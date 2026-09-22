export function PortfolioIntro({ phase, introRef, onSkip }) {
  if (phase === "done") return null;

  return (
    <div className={`portfolio-intro portfolio-intro--${phase}`} ref={introRef} role="dialog" aria-modal="true" aria-label="Portfolio introduction">
      <div className="portfolio-intro__top">
        <div className="portfolio-intro__mark"><strong>AM</strong><span>/</span><span>26</span></div>
        <span className="portfolio-intro__edition">ARDIAN MEHAJ · PORTFOLIO</span>
        <button className="portfolio-intro__skip" type="button" onClick={onSkip}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>

      <div className="portfolio-intro__center">
        <div className="portfolio-intro__copy">
          <p className="portfolio-intro__eyebrow">FROM IDEA TO WORKING SOFTWARE</p>
          <p className="portfolio-intro__headline"><span>Frame.</span><span>Build.</span><span>Verify.</span></p>
        </div>
        <div className="portfolio-intro__art" aria-hidden="true">
          <div className="portfolio-intro__axis portfolio-intro__axis--horizontal" />
          <div className="portfolio-intro__axis portfolio-intro__axis--vertical" />
          <div className="portfolio-intro__plane portfolio-intro__plane--blue" />
          <div className="portfolio-intro__plane portfolio-intro__plane--orange" />
          <div className="portfolio-intro__plane portfolio-intro__plane--paper"><span>IDEA</span><span>SOFTWARE</span></div>
        </div>
      </div>

      <div className="portfolio-intro__bottom">
        <div className="portfolio-intro__progress"><span /></div>
        <p role="status">Opening portfolio</p>
        <span>BRUSSELS, BELGIUM</span>
      </div>
    </div>
  );
}
