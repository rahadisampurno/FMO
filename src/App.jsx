import React, { useState, useEffect } from 'react';

const slideCount = 25;

const Header = ({ onOpenPackage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPackagesHovered, setIsPackagesHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.presentation-container');
      if (container) {
        setIsScrolled(container.scrollTop > 50);
      }
    };
    
    const container = document.querySelector('.presentation-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSlide = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePackageClick = (size) => {
    setIsMobileMenuOpen(false);
    setIsPackagesHovered(false);
    onOpenPackage(size);
  };

  return (
    <header className={`app-header ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="header-logo" onClick={(e) => scrollToSlide(e, '#slide-1')} style={{cursor: 'pointer'}}>
        FMO <span className="header-logo-sub">wedding specialist.</span>
      </div>
      
      {/* Mobile Hamburger Button */}
      <button 
        className="hamburger" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <a href="#slide-3" onClick={(e) => scrollToSlide(e, '#slide-3')} className="header-link">Prologue</a>
        
        {/* Packages Dropdown */}
        <div 
          className="header-link-wrapper" 
          onMouseEnter={() => setIsPackagesHovered(true)}
          onMouseLeave={() => setIsPackagesHovered(false)}
        >
          <a href="#" onClick={(e) => { e.preventDefault(); setIsPackagesHovered(!isPackagesHovered); }} className="header-link packages-link">
            Packages ▼
          </a>
          {isPackagesHovered && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => handlePackageClick('100')}>100 pax</button>
              <button className="dropdown-item" onClick={() => handlePackageClick('350')}>350 pax</button>
              <button className="dropdown-item" onClick={() => handlePackageClick('500')}>500 pax</button>
              <button className="dropdown-item" onClick={() => handlePackageClick('1000')}>1000 pax</button>
              <button className="dropdown-item" onClick={() => handlePackageClick('akad_masjid')}>Akad Di Masjid</button>
              <button className="dropdown-item" onClick={() => handlePackageClick('addons')}>Add-ons</button>
            </div>
          )}
        </div>

        <a href="#slide-5" onClick={(e) => scrollToSlide(e, '#slide-5')} className="header-link">Workflow</a>
        <a href="#slide-9" onClick={(e) => scrollToSlide(e, '#slide-9')} className="header-link">Your Wedding Specialist</a>
        <a href="#slide-20" onClick={(e) => scrollToSlide(e, '#slide-20')} className="header-link">Testimonials</a>
        <a href="#slide-19" onClick={(e) => scrollToSlide(e, '#slide-19')} className="header-link">FAQ</a>
        <a href="#slide-24" onClick={(e) => scrollToSlide(e, '#slide-24')} className="header-link">Contact</a>
      </nav>
    </header>
  );
};

const PackageModal = ({ isOpen, onClose, packageSize }) => {
  if (!isOpen) return null;

  let content;
  if (packageSize === 'addons') {
    content = <img src="/slides/slide-18.png" alt="Add-ons" className="modal-image" />;
  } else if (packageSize === 'akad_masjid') {
    content = (
      <>
        <img src="/packages/15_M.png" alt="Akad Di Masjid 1" className="modal-image" />
        <img src="/packages/16_M.png" alt="Akad Di Masjid 2" className="modal-image" />
        <img src="/packages/17_M.png" alt="Akad Di Masjid 3" className="modal-image" />
        <img src="/packages/18_M.png" alt="Akad Di Masjid 4" className="modal-image" />
        <img src="/packages/19_M.png" alt="Akad Di Masjid 5" className="modal-image" />
      </>
    );
  } else {
    const letterMap = {
      '100': 'A',
      '350': 'B',
      '500': 'C',
      '1000': 'D'
    };
    const letter = letterMap[packageSize];
    content = (
      <>
        <img src="/slides/slide-14.png" alt="Package Intro" className="modal-image" />
        <img src={`/packages/15${letter}.png`} alt={`Package ${packageSize} pax part 1`} className="modal-image" />
        <img src={`/packages/16${letter}.png`} alt={`Package ${packageSize} pax part 2`} className="modal-image" />
        <img src="/slides/slide-17.png" alt="Package closing quote" className="modal-image" />
        <img src="/slides/slide-18.png" alt="Add-ons" className="modal-image" />
      </>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-scroll-area">
          {content}
        </div>
      </div>
    </div>
  );
};

const AudioPlayer = ({ hasEntered }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef(null);

  useEffect(() => {
    if (hasEntered && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.log("Autoplay prevented by browser:", err);
      });
    }
  }, [hasEntered]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
      
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => console.log(e));
      }
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        loop 
        autoPlay 
        src="/music/Sebusur%20Pelangi.mp3" 
        preload="auto" 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button 
        className={`audio-btn ${isPlaying && !isMuted ? 'playing' : ''}`} 
        onClick={toggleMute}
        aria-label="Toggle Mute"
      >
        <span className="audio-icon">{isMuted ? '🔇' : '🎵'}</span>
      </button>
    </>
  );
};

const WelcomeOverlay = ({ onEnter }) => {
  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <div className="welcome-logo">
          FMO <span className="welcome-logo-sub">wedding specialist.</span>
        </div>
        <p className="welcome-text">Turn on your sound for the best experience.</p>
        <button className="welcome-btn" onClick={onEnter}>
          Enter Website
        </button>
      </div>
    </div>
  );
};

function App() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Exclude slides 14, 15, 16, 17, and 18 from main scroll
  const excludeSlides = [14, 15, 16, 17, 18];
  const slides = [];
  for (let i = 1; i <= slideCount; i++) {
    if (!excludeSlides.includes(i)) {
      const index = i.toString().padStart(2, '0');
      slides.push({
        id: i,
        src: `/slides/slide-${index}.png`
      });
    }
  }

  const handleOpenPackage = (size) => {
    setSelectedPackage(size);
    setIsModalOpen(true);
  };

  return (
    <>
      {!hasEntered && <WelcomeOverlay onEnter={() => setHasEntered(true)} />}

      <div className={`presentation-container ${!hasEntered ? 'locked' : ''}`}>
        <Header onOpenPackage={handleOpenPackage} />
        
        <AudioPlayer hasEntered={hasEntered} />
        
        <PackageModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          packageSize={selectedPackage} 
        />

        {slides.map((slide, index) => (
          <section 
            key={index}
          id={`slide-${slide.id}`}
          className="slide-section" 
        >
          <div className="slide-content">
            <img src={slide.src} alt={`FMO Slide ${slide.id}`} className="slide-image" />
            
            {/* Clickable Overlay for Your Personal Wedding Specialist (Slide 9) */}
            {slide.id === 9 && (
              <div className="specialist-links-overlay">
                <a 
                  href="https://instagram.com/byzackyjalaluddin" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="specialist-link"
                  aria-label="Zacky Instagram"
                ></a>
                <a 
                  href="https://instagram.com/byfauziahwindi" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="specialist-link"
                  aria-label="Windi Instagram"
                ></a>
              </div>
            )}

            {/* Clickable Overlay for Contact Us Slide (Slide 24) */}
            {slide.id === 24 && (
              <div className="contact-links-overlay">
                <a 
                  href="https://instagram.com/fmo_weddingspecialist" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="contact-link"
                  aria-label="Instagram"
                ></a>
                <a 
                  href="https://tiktok.com/@fmo_weddingspecialist" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="contact-link"
                  aria-label="TikTok"
                ></a>
                <a 
                  href="https://wa.me/6281221212877" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="contact-link"
                  aria-label="WhatsApp"
                ></a>
              </div>
            )}
            
          </div>
        </section>
      ))}
      
      </div>
    </>
  );
}

export default App;
