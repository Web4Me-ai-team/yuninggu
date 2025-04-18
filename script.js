'use strict';

// Cartoon Template JavaScript

// Initialize popup functionality
function initPopups() {
  const popupTriggers = document.querySelectorAll('.popup-trigger');
  const popupClose = document.querySelectorAll('.popup-close');
  const popups = document.querySelectorAll('.popup');

  popupTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const popupId = trigger.getAttribute('data-popup');
      const popup = document.getElementById(popupId);
      popup.classList.add('active');
      document.body.classList.add('popup-open');
    });
  });

  popupClose.forEach(close => {
    close.addEventListener('click', () => {
      const popup = close.closest('.popup');
      popup.classList.remove('active');
      document.body.classList.remove('popup-open');
    });
  });

  window.addEventListener('click', (e) => {
    popups.forEach(popup => {
      if (e.target === popup) {
        popup.classList.remove('active');
        document.body.classList.remove('popup-open');
      }
    });
  });
}

// Carousel functionality for the projects section
function initCarousel() {
  const carousel = document.querySelector('.project-carousel');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const cardWidth = document.querySelector('.project-card').offsetWidth + 20; // card width + margin
  let currentIndex = 0;

  if (!carousel || !prevBtn || !nextBtn) return;

  // Update carousel position
  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  // Next slide
  nextBtn.addEventListener('click', () => {
    const totalCards = document.querySelectorAll('.project-card').length;
    const maxVisibleCards = Math.floor(carousel.parentElement.offsetWidth / cardWidth);
    
    if (currentIndex < totalCards - maxVisibleCards) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Previous slide
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    // Reset position
    currentIndex = 0;
    updateCarousel();
  });
}

// 确保URL有http或https前缀
function ensureHttpPrefix(url) {
  if (!url) return '';
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

// Handle publication links from resume data
function handlePublicationLinks() {
  const resumeDataParam = new URLSearchParams(window.location.search).get('resumeData');
  
  if (resumeDataParam) {
    try {
      const resumeData = JSON.parse(decodeURIComponent(resumeDataParam));
      
      if (resumeData.publications && resumeData.publications.length) {
        const publicationsContainer = document.getElementById('publications-container');
        if (!publicationsContainer) return;

        publicationsContainer.innerHTML = '';
        
        resumeData.publications.forEach((pub, index) => {
          const pubItem = document.createElement('div');
          pubItem.className = 'publication-item';
          
          let authorText = '';
          if (pub.authors && pub.authors.length) {
            authorText = pub.authors.join(', ');
          }
          
          pubItem.innerHTML = `
            <h3 class="publication-title">${pub.title || 'Publication ' + (index + 1)}</h3>
            <p class="publication-venue">${pub.journal || ''} ${pub.year ? `(${pub.year})` : ''}</p>
            <p class="publication-authors">${authorText}</p>
            ${pub.links ? `
            <div class="publication-links">
              <a href="${ensureHttpPrefix(pub.links)}" target="_blank">
                <i class="fas fa-external-link-alt"></i> View Publication
              </a>
            </div>` : ''}
          `;
          
          publicationsContainer.appendChild(pubItem);
        });
      }
    } catch (error) {
      console.error('Error parsing resume data:', error);
    }
  }
}

// 修复所有外部链接
function fixExternalLinks() {
  // 找到所有具有href属性的a标签
  const allLinks = document.querySelectorAll('a[href]');
  
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // 跳过内部链接（以#或/开头）和mailto/tel链接
    if (!href || href.startsWith('#') || href.startsWith('/') || 
        href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    
    // 跳过已经有协议的链接
    if (href.match(/^https?:\/\//)) {
      return;
    }
    
    // 对外部链接添加https://前缀
    link.setAttribute('href', `https://${href}`);
  });
}

// Initialize UI elements with animation
function initAnimations() {
  const animatedElements = document.querySelectorAll('.animated-element');
  
  // Add observer for animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize UI components
  initPopups();
  initCarousel();
  initAnimations();
  
  // Handle data and links
  handlePublicationLinks();
  fixExternalLinks();

  // Function to parse URL parameters for resume data
  function getResumeData() {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeDataParam = urlParams.get('resumeData');
    
    if (resumeDataParam) {
      try {
        return JSON.parse(decodeURIComponent(resumeDataParam));
      } catch (error) {
        console.error('Error parsing resume data:', error);
        return null;
      }
    }
    return null;
  }

  // Function to populate sections with resume data
  function populateResumeData() {
    const resumeData = getResumeData();
    if (!resumeData) return;
    
    // Update Personal Info
    if (resumeData.personalInfo) {
      const info = resumeData.personalInfo;
      // Update name, email, phone, location, summary
      if (info.name) document.querySelector('.name').textContent = info.name;
      if (info.email) {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => link.href = `mailto:${info.email}`);
        document.querySelector('.contact-link').textContent = info.email;
      }
      if (info.phone) {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => link.href = `tel:${info.phone}`);
        document.querySelectorAll('.contact-link')[1].textContent = info.phone;
      }
      if (info.location) document.querySelector('address').textContent = info.location;
      
      // Update social links
      if (info.socialLinks) {
        const socialLinks = document.querySelectorAll('.social-link');
        if (info.socialLinks.linkedin) socialLinks[2].href = info.socialLinks.linkedin;
        if (info.socialLinks['Social Media']) socialLinks[1].href = info.socialLinks['Social Media'];
        if (info.socialLinks['Google Scholar']) socialLinks[0].href = info.socialLinks['Google Scholar'];
      }
    }
    
    // Update Research Interests
    if (resumeData.researchInterests && resumeData.researchInterests.length) {
      const container = document.getElementById('research-interests-container');
      container.innerHTML = '';
      
      resumeData.researchInterests.forEach(interest => {
        const interestEl = document.createElement('div');
        interestEl.className = 'research-interest';
        interestEl.innerHTML = `
          <p class="research-field">${interest.field || ''}</p>
          <p class="research-description">${interest.description || ''}</p>
        `;
        container.appendChild(interestEl);
      });
    }
    
    // Update Education
    if (resumeData.education && resumeData.education.length) {
      const container = document.getElementById('education-container');
      const timeline = container.querySelector('.timeline-list');
      timeline.innerHTML = '';
      
      resumeData.education.forEach(edu => {
        const eduEl = document.createElement('li');
        eduEl.className = 'timeline-item';
        eduEl.innerHTML = `
          <h4 class="h4 timeline-item-title">${edu.school || ''}</h4>
          <span class="graduation-date">${edu.graduationDate || ''}</span>
          <p class="degree">${edu.degree || ''}</p>
          <p class="field">${edu.field || ''}</p>
          ${edu.thesis ? `<p class="thesis"><strong>Thesis:</strong> "${edu.thesis}"</p>` : ''}
        `;
        timeline.appendChild(eduEl);
      });
    }
    
    // Update Work Experience
    if (resumeData.workExperience && resumeData.workExperience.length) {
      const container = document.getElementById('experience-container');
      const timeline = container.querySelector('.timeline-list');
      timeline.innerHTML = '';
      
      resumeData.workExperience.forEach(exp => {
        const expEl = document.createElement('li');
        expEl.className = 'timeline-item';
        
        let descriptionHTML = '';
        if (exp.description && exp.description.length) {
          descriptionHTML = `
            <div class="description-container">
              <ul class="description-list">
                ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
              </ul>
            </div>
          `;
        }
        
        let techniquesHTML = '';
        if (exp.techniques && exp.techniques.length) {
          techniquesHTML = `
            <div class="techniques-container">
              ${exp.techniques.map(tech => `<span class="technique-tag">${tech}</span>`).join('')}
            </div>
          `;
        }
        
        expEl.innerHTML = `
          <h4 class="h4 timeline-item-title">${exp.position || ''}</h4>
          <span class="duration">${exp.duration || ''}</span>
          <p class="institution">${exp.institution || ''}</p>
          ${descriptionHTML}
          ${techniquesHTML}
        `;
        timeline.appendChild(expEl);
      });
    }
    
    // Update Projects
    if (resumeData.projects && resumeData.projects.length) {
      const container = document.getElementById('projects-container');
      const timeline = container.querySelector('.timeline-list');
      timeline.innerHTML = '';
      
      resumeData.projects.forEach(proj => {
        const projEl = document.createElement('li');
        projEl.className = 'timeline-item project-item';
        
        let techHTML = '';
        if (proj.technologies && proj.technologies.length) {
          techHTML = `
            <div class="project-tech">
              ${proj.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
          `;
        }
        
        let outcomesHTML = '';
        if (proj.outcomes && proj.outcomes.length) {
          outcomesHTML = `
            <div class="project-outcomes">
              <h4>Outcomes:</h4>
              <ul>
                ${proj.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
              </ul>
            </div>
          `;
        }
        
        projEl.innerHTML = `
          <h4 class="h4 project-title">${proj.title || ''}</h4>
          <p class="project-duration">${proj.duration || ''}</p>
          <p class="project-description">${proj.description || ''}</p>
          ${techHTML}
          ${outcomesHTML}
        `;
        timeline.appendChild(projEl);
      });
    }
    
    // Update Publications
    if (resumeData.publications && resumeData.publications.length) {
      const container = document.getElementById('publications-container');
      container.innerHTML = '';
      
      resumeData.publications.forEach(pub => {
        const pubEl = document.createElement('li');
        pubEl.className = 'timeline-item publication-item';
        
        let authorsText = '';
        if (pub.authors && pub.authors.length) {
          authorsText = pub.authors.join(', ');
        }
        
        pubEl.innerHTML = `
          <h4 class="h4 publication-title">${pub.title || ''}</h4>
          <p class="publication-journal">${pub.journal || ''}</p>
          <p class="publication-year">${pub.year || ''}</p>
          <p class="publication-authors">${authorsText}</p>
          ${pub.links ? `
          <div class="publication-link">
            <a href="${pub.links}" target="_blank">
              <ion-icon name="open-outline"></ion-icon> View Paper
            </a>
          </div>` : ''}
        `;
        container.appendChild(pubEl);
      });
    }
    
    // Update Technical Skills
    if (resumeData.technicalSkills && resumeData.technicalSkills.length) {
      const container = document.getElementById('technical-skills-container');
      const skillsList = container.querySelector('.skills-list') || container;
      skillsList.innerHTML = '';
      
      resumeData.technicalSkills.forEach(skill => {
        const skillEl = document.createElement('li');
        skillEl.className = 'skill-item';
        skillEl.textContent = skill;
        skillsList.appendChild(skillEl);
      });
    }
    
    // Update Teaching Experience
    if (resumeData.teachingExperience && resumeData.teachingExperience.length) {
      const container = document.getElementById('teaching-container');
      const timeline = container.querySelector('.timeline-list');
      timeline.innerHTML = '';
      
      resumeData.teachingExperience.forEach(teach => {
        const teachEl = document.createElement('li');
        teachEl.className = 'timeline-item teaching-item';
        
        let coursesHTML = '';
        if (teach.courses && teach.courses.length) {
          coursesHTML = `
            <div class="courses-container">
              <h4>Courses:</h4>
              <ul>
                ${teach.courses.map(course => `<li>${course}</li>`).join('')}
              </ul>
            </div>
          `;
        }
        
        teachEl.innerHTML = `
          <h4 class="h4 teaching-role">${teach.role || ''}</h4>
          <p class="teaching-institution">${teach.institution || ''}</p>
          <p class="teaching-duration">${teach.duration || ''}</p>
          ${coursesHTML}
        `;
        timeline.appendChild(teachEl);
      });
    }
    
    // Update Honors & Awards
    if (resumeData.honorsAndAwards && resumeData.honorsAndAwards.length) {
      const container = document.getElementById('awards-container');
      const timeline = container.querySelector('.timeline-list');
      timeline.innerHTML = '';
      
      resumeData.honorsAndAwards.forEach(award => {
        const awardEl = document.createElement('li');
        awardEl.className = 'timeline-item award-item';
        awardEl.innerHTML = `
          <h4 class="h4 award-name">${award.name || ''}</h4>
          <p class="award-year">${award.year || ''}</p>
          <p class="award-issuer">${award.issuer || ''}</p>
        `;
        timeline.appendChild(awardEl);
      });
    }
  }

  // Call the function to populate data
  populateResumeData();
  
  // Handle sidebar toggle
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  const sidebarMore = document.querySelector("[data-sidebar-more]");

  if (sidebarBtn && sidebarMore) {
    sidebarBtn.addEventListener("click", function () {
      sidebarMore.classList.toggle("active");
      sidebarBtn.querySelector("span").textContent = sidebarMore.classList.contains("active") ? "Hide Contacts" : "Show Contacts";
    });
  }

  // Handle navigation
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navigationLinks.forEach(navLink => navLink.classList.remove("active"));
      this.classList.add("active");

      const pageName = this.textContent.toLowerCase().trim();
      pages.forEach(page => page.classList.remove("active"));
      const targetPage = document.querySelector(`[data-page="${pageName}"]`);
      if (targetPage) {
        targetPage.classList.add("active");
        window.scrollTo(0, 0);
      }
    });
  });
  
  // Fix external links
  fixExternalLinks();
  
  // Other functions...
}); 