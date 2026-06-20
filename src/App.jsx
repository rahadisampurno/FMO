import React, { useState, useEffect } from 'react';

const slideCount = 25;

const Header = ({ onOpenPackage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPackagesHovered, setIsPackagesHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.presentation-container');
      if (container && container.scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const container = document.querySelector('.presentation-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSlide = (e, target) => {
    e.preventDefault();
    const element = document.querySelector(target);
    const container = document.querySelector('.presentation-container');
    if (element && container) {
      container.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-logo" onClick={(e) => scrollToSlide(e, '#slide-1')} style={{cursor: 'pointer'}}>
        FMO <span className="header-logo-sub">wedding specialist.</span>
      </div>
      <nav className="header-nav">
        <a href="#slide-3" onClick={(e) => scrollToSlide(e, '#slide-3')} className="header-link">Prologue</a>
        
        {/* Packages Dropdown */}
        <div 
          className="header-link-wrapper" 
          onMouseEnter={() => setIsPackagesHovered(true)}
          onMouseLeave={() => setIsPackagesHovered(false)}
        >
          <a href="#" onClick={(e) => e.preventDefault()} className="header-link packages-link">
            Packages ▼
          </a>
          {isPackagesHovered && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => onOpenPackage('100')}>100 pax</button>
              <button className="dropdown-item" onClick={() => onOpenPackage('350')}>350 pax</button>
              <button className="dropdown-item" onClick={() => onOpenPackage('500')}>500 pax</button>
              <button className="dropdown-item" onClick={() => onOpenPackage('1000')}>1000 pax</button>
              <button className="dropdown-item" onClick={() => onOpenPackage('akad_masjid')}>Akad Di Masjid</button>
              <button className="dropdown-item" onClick={() => onOpenPackage('addons')}>Add-ons</button>
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

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log("Autoplay prevented by browser until interaction.");
        });
      }
    };
    
    // Play on first interaction if autoplay fails initially
    document.body.addEventListener('click', playAudio, { once: true });
    
    // Also try to play immediately (works in some browsers if previously interacted)
    playAudio();

    return () => {
      document.body.removeEventListener('click', playAudio);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="/music/Sebusur%20Pelangi.mp3" preload="auto" />
      <button 
        className={`audio-btn ${isPlaying ? 'playing' : ''}`} 
        onClick={togglePlay}
        aria-label="Toggle Music"
      >
        <span className="audio-icon">🎵</span>
      </button>
    </>
  );
};

function App() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="presentation-container">
      <Header onOpenPackage={handleOpenPackage} />
      <AudioPlayer />
      
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
            
            {/* Clickable Overlay for Contact Us Slide (Slide 24 is index 23, but id is 24) */}
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
  );
}

export default App;
