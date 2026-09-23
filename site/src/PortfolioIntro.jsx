export function PortfolioIntro({ phase, introRef, onSkip }) {
  if (phase === "done") return null;

  return (
    <div className={`portfolio-intro portfolio-intro--${phase}`} ref={introRef} role="dialog" aria-modal="true" aria-label="Portfolio introduction">
      <div className="portfolio-intro__atmosphere" aria-hidden="true">
        <span className="portfolio-intro__grid" />
        <span className="portfolio-intro__glow" />
        <span className="portfolio-intro__ghost">AM<span>26</span></span>
      </div>
      <div className="portfolio-intro__top">
        <div className="portfolio-intro__mark"><strong>AM</strong><span>/</span><span>26</span></div>
        <span className="portfolio-intro__edition">ARDIAN MEHAJ <span>—</span> SOFTWARE PORTFOLIO</span>
        <button className="portfolio-intro__skip" type="button" onClick={onSkip}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>

      <div className="portfolio-intro__center">
        <div className="portfolio-intro__copy">
          <p className="portfolio-intro__eyebrow"><span className="portfolio-intro__signal" /> FROM IDEA TO WORKING SOFTWARE</p>
          <p className="portfolio-intro__headline"><span><i>Frame.</i></span><span><i>Build.</i></span><span><i>Verify.</i></span></p>
          <p className="portfolio-intro__subline">Real projects. Reviewable decisions.</p>
        </div>
        <div className="portfolio-intro__art" aria-hidden="true">
          <div className="portfolio-intro__axis portfolio-intro__axis--horizontal" />
          <div className="portfolio-intro__axis portfolio-intro__axis--vertical" />
          <div className="portfolio-intro__orbit portfolio-intro__orbit--outer" />
          <div className="portfolio-intro__orbit portfolio-intro__orbit--inner" />
          <div className="portfolio-intro__plane portfolio-intro__plane--blue"><span>01 / QUESTION</span><strong>?</strong><span>INPUT / 001</span></div>
          <div className="portfolio-intro__plane portfolio-intro__plane--orange"><span>02 / BUILD</span><strong>↗</strong><span>SYSTEM / 010</span></div>
          <div className="portfolio-intro__plane portfolio-intro__plane--paper">
            <span className="portfolio-intro__sheet-top">03 / VERIFY <b>✓</b></span>
            <strong>PROOF<span>READY.</span></strong>
            <span className="portfolio-intro__sheet-bottom">CODE · TESTS · LIMITS <b>AM—26</b></span>
          </div>
          <span className="portfolio-intro__spark" />
        </div>
      </div>

      <div className="portfolio-intro__bottom">
        <div className="portfolio-intro__progress"><span /></div>
        <p role="status">Opening the work</p>
        <span>BRUSSELS, BELGIUM</span>
      </div>
    </div>
  );
}
