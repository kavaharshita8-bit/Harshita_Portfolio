/**
 * Harshita Kava Portfolio - script.js
 * Unique, Premium 3D Interactive Portfolio Engine
 * Implements mouse-tracking 3D card tilt, scroll-based 3D reveal animations,
 * ambient background parallax, skills dashboard filtering, and responsive mobile behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation Header scroll state
    initNavbarScroll();

    // 2. Mobile hamburger drawer menu toggle
    initMobileNav();

    // 3. 3D Scroll-based entry animations (IntersectionObserver)
    initScrollAnimations();

    // 4. Staggered reveal for 3D timeline & image cards
    initStaggeredReveals();

    // 5. Reusable 3D Card Mouse-Tilt Engine
    init3DCardsTilt();

    // 6. Background Parallax & Mouse-following atmosphere
    initMouseParallax();

    // 7. Background canvas starfield & particle engine
    initParticleSystem();

    // 8. Hero section interactive 3D interactions
    initHero3DInteractions();

    // 9. Interactive Skills & Languages Dashboard
    initSkillsDashboard();

    // 10. Contact form submission mock with feedback state
    initContactForm();

    // 11. Scrollspy active link navigation synchronization
    initScrollspy();

    // 12. Full-screen Image Lightbox Modal
    initImageLightbox();

    // 13. Cinematic Scroll Background & Emerging Image Effect (NEW ADDITION)
    initCinematicScrollEffect();
});

/**
 * Adds a modern glass blur class to header upon scrolling down.
 */
function initNavbarScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * Toggles responsive hamburger drawer navigation on mobile screens.
 */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Triggers 3D scroll entrance animations as sections scroll into viewport.
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');
    
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        fadeElements.forEach(el => el.classList.add('active'));
        return;
    }

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
}

/**
 * Adds staggered scroll reveal animations for cards in grids (timeline, certificates, projects, etc.)
 */
function initStaggeredReveals() {
    const gridContainers = document.querySelectorAll('.timeline, .internship-container, .university-life-gallery, .achievements-grid, .certificates-grid, .projects-grid');
    
    gridContainers.forEach(container => {
        const children = container.querySelectorAll('.fade-up');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${(index % 4) * 0.12}s`;
        });
    });

    // Special gradual reveal handler for images
    const imagesToReveal = document.querySelectorAll('.illustration-img, .univ-campus-img, .achievement-badge-img, .certificate-badge-img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('img-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    imagesToReveal.forEach(img => imageObserver.observe(img));
}

/**
 * Reusable 3D Card Mouse-Tilt Engine.
 * Adds interactive 3D perspective tilt to Skills, Education, Internships,
 * Achievements, Certificates, Projects, and Gallery cards on cursor hover.
 */
function init3DCardsTilt() {
    // Disable on touch devices or small screens for performance
    if (window.innerWidth <= 768 || ('ontouchstart' in window)) return;

    const cards = document.querySelectorAll(`
        .glass-card, 
        .skill-card, 
        .timeline-content, 
        .internship-card, 
        .university-life-image, 
        .achievement-card, 
        .certificate-card, 
        .project-card
    `);

    cards.forEach(card => {
        let bounds;

        function rotateToMouse(e) {
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;

            // Calculate normalized cursor position (-1 to 1) from card center
            const xPercent = (mouseX / bounds.width) - 0.5;
            const yPercent = (mouseY / bounds.height) - 0.5;

            // Compute tilt angles (max 10 degrees tilt)
            const rotateX = -yPercent * 12;
            const rotateY = xPercent * 12;

            // Apply 3D transform with subtle translateZ lift
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`;
        }

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
        });

        card.addEventListener('mousemove', rotateToMouse);

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
        });
    });
}

/**
 * Background Mouse Parallax & Atmospheric Motion.
 * Moves ambient glowing blobs and background grid subtly in opposite direction of cursor.
 */
function initMouseParallax() {
    if (window.innerWidth <= 768) return;

    const glow1 = document.querySelector('.glow-1');
    const glow2 = document.querySelector('.glow-2');
    const glow3 = document.querySelector('.glow-3');
    const glow4 = document.querySelector('.glow-4');

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
        // Calculate offset relative to window center (-0.5 to 0.5)
        targetX = (e.clientX / window.innerWidth) - 0.5;
        targetY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    function renderParallax() {
        // Smooth lerp interpolation
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        if (glow1) glow1.style.transform = `translate3d(${currentX * -40}px, ${currentY * -40}px, 0)`;
        if (glow2) glow2.style.transform = `translate3d(${currentX * 35}px, ${currentY * 35}px, 0)`;
        if (glow3) glow3.style.transform = `translate3d(${currentX * -25}px, ${currentY * -25}px, 0)`;
        if (glow4) glow4.style.transform = `translate3d(${currentX * 30}px, ${currentY * 30}px, 0)`;

        requestAnimationFrame(renderParallax);
    }

    renderParallax();
}

/**
 * Canvas particle background engine with 3D depth field projection.
 */
function initParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 25 : 55;
    
    const focalLength = 320;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    resizeCanvas();

    class Particle3D {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = (Math.random() - 0.5) * canvas.width * 2;
            this.y = (Math.random() - 0.5) * canvas.height * 2;
            this.z = initial ? Math.random() * 1000 : 1000;
            this.size = Math.random() * 1.5 + 0.8;
            this.speedZ = -Math.random() * 1.2 - 0.5;
            this.opacity = 0;
        }

        update() {
            this.z += this.speedZ;

            if (this.z <= 0) {
                this.reset(false);
            }

            if (this.z > 800) {
                this.opacity = (1000 - this.z) / 200;
            } else if (this.z < 150) {
                this.opacity = this.z / 150;
            } else {
                this.opacity = 1;
            }
            this.opacity = Math.max(0, Math.min(this.opacity, 0.55));
        }

        draw() {
            const scale = focalLength / (focalLength + this.z);
            const targetX = centerX + (this.x + mouseX * 240 * scale) * scale;
            const targetY = centerY + (this.y + mouseY * 240 * scale) * scale;
            const projectedSize = this.size * scale * 2.5;

            if (targetX >= 0 && targetX <= canvas.width && targetY >= 0 && targetY <= canvas.height) {
                ctx.beginPath();
                ctx.arc(targetX, targetY, projectedSize, 0, Math.PI * 2);
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle3D());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.sort((a, b) => b.z - a.z);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/**
 * Preserved Hero section interactive 3D mouse tracking & floating icons.
 */
function initHero3DInteractions() {
    const homeSection = document.getElementById('home');
    const avatarContainer = document.querySelector('.illustration-container');
    const avatarImg = document.querySelector('.illustration-img');
    const iconWrappers = document.querySelectorAll('.floating-icon-wrapper');
    const codeWindows = document.querySelectorAll('#home .code-window');
    const techIconWrappers = document.querySelectorAll('.tech-icons .icon-wrapper');

    if (!homeSection) return;

    const depths = {
        react: 0.035, js: -0.045, python: 0.025, html: -0.035, css: 0.04, db: -0.03
    };
    const windowDepths = [0.015, -0.022, 0.018, -0.012];

    homeSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;

        const mouseX = clientX - width / 2;
        const mouseY = clientY - height / 2;

        iconWrappers.forEach(wrapper => {
            let depth = 0.02;
            if (wrapper.classList.contains('icon-react-wrapper')) depth = depths.react;
            else if (wrapper.classList.contains('icon-js-wrapper')) depth = depths.js;
            else if (wrapper.classList.contains('icon-python-wrapper')) depth = depths.python;
            else if (wrapper.classList.contains('icon-html-wrapper')) depth = depths.html;
            else if (wrapper.classList.contains('icon-css-wrapper')) depth = depths.css;
            else if (wrapper.classList.contains('icon-db-wrapper')) depth = depths.db;

            wrapper.style.transform = `translate3d(${mouseX * depth}px, ${mouseY * depth}px, 0)`;
        });

        codeWindows.forEach((win, index) => {
            const depth = windowDepths[index % windowDepths.length];
            const xOffset = mouseX * depth;
            const yOffset = mouseY * depth;
            const tiltX = -(mouseY / height) * 12;
            const tiltY = (mouseX / width) * 12;

            win.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        if (avatarContainer && avatarImg) {
            const rect = avatarContainer.getBoundingClientRect();
            const containerCenterX = rect.left + rect.width / 2;
            const containerCenterY = rect.top + rect.height / 2;

            const dx = clientX - containerCenterX;
            const dy = clientY - containerCenterY;

            const rotateY = (dx / (rect.width / 2)) * 9;
            const rotateX = -(dy / (rect.height / 2)) * 9;

            avatarImg.style.transition = 'transform 0.1s ease-out';
            avatarImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
    });

    homeSection.addEventListener('mouseleave', () => {
        iconWrappers.forEach(wrapper => {
            wrapper.style.transition = 'transform 0.6s ease-out';
            wrapper.style.transform = 'translate3d(0, 0, 0)';
        });

        codeWindows.forEach(win => {
            win.style.transition = 'transform 0.7s ease-out';
            win.style.transform = 'translate3d(0, 0, 0) perspective(800px) rotateX(0deg) rotateY(0deg)';
        });

        if (avatarImg) {
            avatarImg.style.transition = 'transform 0.6s ease-out';
            avatarImg.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
    });

    techIconWrappers.forEach(icon => {
        icon.addEventListener('mousemove', (e) => {
            const rect = icon.getBoundingClientRect();
            const cx = e.clientX - rect.left - rect.width / 2;
            const cy = e.clientY - rect.top - rect.height / 2;
            const tiltX = -(cy / (rect.height / 2)) * 14;
            const tiltY = (cx / (rect.width / 2)) * 14;
            icon.style.transform = `perspective(300px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.1, 1.1, 1.1)`;
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = '';
        });
    });
}

/**
 * Interactive Skills & Languages Dashboard.
 * Manages category tab filtering, active pill brand highlights, and detail panel gauges.
 */
function initSkillsDashboard() {
    const skillsData = {
        react: {
            name: "React.js", category: "Frontend Development", percentage: 85, color: "#58c4dc",
            filename: "react_demo.jsx",
            code: `const SkillCard = ({ name, level }) => {\n  return (\n    <div className="skill-card">\n      <h3>{name}</h3>\n      <p>Proficiency: {level}%</p>\n    </div>\n  );\n};`
        },
        python: {
            name: "Python", category: "Programming Languages", percentage: 80, color: "#38bdf8",
            filename: "main.py",
            code: `def get_skill_status(skill_name, confidence):\n    return {\n        "tech": skill_name,\n        "status": f"Comfortable at {confidence}%"\n    }\n\nprint(get_skill_status("Python", 80))`
        },
        javascript: {
            name: "JavaScript", category: "Programming Languages / Frontend", percentage: 85, color: "#ffe675",
            filename: "app.js",
            code: `const updateDashboard = (tech) => {\n  console.log(\`Updating dashboard to \${tech.name}\`);\n  document.getElementById("focused-name").innerText = tech.name;\n};`
        },
        cpp: {
            name: "C++", category: "Programming Languages", percentage: 75, color: "#60a5fa",
            filename: "vector_sum.cpp",
            code: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> data = {1, 2, 3, 4};\n    int sum = 0;\n    for(int val : data) sum += val;\n    std::cout << "Sum: " << sum << std::endl;\n    return 0;\n}`
        },
        mysql: {
            name: "MySQL", category: "Database Management", percentage: 80, color: "#00758f",
            filename: "query.sql",
            code: `SELECT s.student_name, p.portfolio_url \nFROM students s \nJOIN profiles p ON s.id = p.student_id \nWHERE s.cgpa >= 7.91 \nORDER BY s.cgpa DESC;`
        },
        oops: {
            name: "OOPs Concepts", category: "Core Software Concepts", percentage: 80, color: "#a78bfa",
            filename: "oops_design.py",
            code: `class Developer:\n    def __init__(self, name, skills):\n        self.name = name\n        self.skills = skills\n    \n    def develop(self):\n        return f"{self.name} is building the dashboard..."`
        },
        html: {
            name: "HTML5", category: "Frontend Development", percentage: 90, color: "#e34f26",
            filename: "index.html",
            code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <title>Harshita Kava — Portfolio</title>\n</head>\n</html>`
        },
        css: {
            name: "CSS3", category: "Frontend Development", percentage: 85, color: "#2965f1",
            filename: "theme.css",
            code: `:root {\n  --brand-color: #2965f1;\n  --glow-color: rgba(41, 101, 241, 0.25);\n}\n\n.tech-pill:hover {\n  box-shadow: 0 0 20px var(--glow-color);\n}`
        }
    };

    const tabs = document.querySelectorAll('.dashboard-tabs .tab-btn');
    const cards = document.querySelectorAll('.skills-grid .skill-card');
    const focusedIcon = document.getElementById('focused-icon');
    const focusedName = document.getElementById('focused-name');
    const focusedCategory = document.getElementById('focused-category');
    const focusedProgress = document.getElementById('focused-progress');
    const focusedPercentage = document.getElementById('focused-percentage');
    const terminalFilename = document.getElementById('terminal-filename');
    const focusedCode = document.getElementById('focused-code');
    const detailPanel = document.querySelector('.detail-panel');

    function updateFocusedSkill(skillKey) {
        const skill = skillsData[skillKey];
        if (!skill || !focusedName) return;

        focusedName.innerText = skill.name;
        if (focusedCategory) focusedCategory.innerText = skill.category;
        if (terminalFilename) terminalFilename.innerText = skill.filename;
        if (focusedCode) focusedCode.textContent = skill.code;

        if (detailPanel) {
            detailPanel.style.setProperty('--brand-color', skill.color);
        }

        const activeCard = document.querySelector(`.skills-grid .skill-card[data-skill="${skillKey}"]`);
        if (activeCard && focusedIcon) {
            const cardSvg = activeCard.querySelector('.card-icon svg');
            if (cardSvg) {
                focusedIcon.innerHTML = '';
                const clonedSvg = cardSvg.cloneNode(true);
                clonedSvg.setAttribute('width', '38');
                clonedSvg.setAttribute('height', '38');
                focusedIcon.appendChild(clonedSvg);
            }
        }

        if (focusedProgress) {
            const radius = 32;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference * (1 - skill.percentage / 100);
            
            focusedProgress.style.stroke = skill.color;
            focusedProgress.style.strokeDasharray = `${circumference} ${circumference}`;
            focusedProgress.style.strokeDashoffset = offset;
        }

        if (focusedPercentage) {
            focusedPercentage.innerText = `${skill.percentage}%`;
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            updateFocusedSkill(card.dataset.skill);
        });
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            let firstVisibleCard = null;

            cards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    if (!firstVisibleCard) firstVisibleCard = card;
                } else {
                    card.classList.add('hidden');
                }
            });

            if (firstVisibleCard) {
                cards.forEach(c => c.classList.remove('active'));
                firstVisibleCard.classList.add('active');
                updateFocusedSkill(firstVisibleCard.dataset.skill);
            }
        });
    });

    updateFocusedSkill('react');
}

/**
 * Contact form submit handler with animated feedback states.
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';

        setTimeout(() => {
            submitBtn.textContent = 'Message Sent successfully!';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            submitBtn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.boxShadow = '';
            }, 3000);
        }, 1500);
    });
}

/**
 * Updates active navigation menu links as user scrolls through sections.
 */
function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 130;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });
}

/**
 * Full-screen Image Lightbox Modal logic.
 */
function initImageLightbox() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.close-modal');
    
    const clickableImages = document.querySelectorAll('.clickable-badge-img');
    clickableImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            modal.style.display = "block";
            modal.style.opacity = "0";
            
            setTimeout(() => {
                modal.style.opacity = "1";
            }, 10);
            
            const fullSrc = this.getAttribute('data-full') || this.src;
            modalImg.src = fullSrc;
            
            const card = this.closest('.achievement-card, .university-life-image, .certificate-card');
            if (card) {
                const title = card.querySelector('h3');
                captionText.textContent = title ? title.textContent : this.alt;
            } else {
                captionText.textContent = this.alt;
            }
        });
    });
    
    function closeModal() {
        modal.style.opacity = "0";
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
    });
}

/**
 * ==========================================================================
 * CINEMATIC SCROLL BACKGROUND & EMERGING IMAGE ENGINE (NEW ADDITION)
 * ==========================================================================
 * Controls the gradual background transformation and slow 3D emergence of
 * the existing profile/illustration image as the user scrolls down from Hero.
 *
 * 0% Scroll: Background = current Hero background, image opacity = 0, scale = 0.85, blur = 10px, rotateY = -10deg
 * 50% Scroll: Background transition = 50%, image opacity = 0.5, scale = 0.95, blur = 4px
 * 100% Scroll: New background fully visible, image opacity = 0.72 (max), scale = 1.0, blur = 0px, rotateY = 0deg
 */
function initCinematicScrollEffect() {
    const scrollBg = document.querySelector('.scroll-background');
    const scrollImgWrapper = document.querySelector('.scroll-image');
    const scrollImg = scrollImgWrapper ? scrollImgWrapper.querySelector('img') : null;

    if (!scrollBg || !scrollImg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        scrollBg.style.opacity = '0';
        scrollImg.style.opacity = '0';
        return;
    }

    let ticking = false;

    function updateScrollEffect() {
        const scrollY = window.scrollY;
        const heroSection = document.getElementById('home');
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

        // Progress begins as user starts scrolling past 15% of Hero height,
        // reaching full completion as user reaches the main portfolio content (~120% Hero height)
        const startScroll = heroHeight * 0.15;
        const endScroll = heroHeight * 1.25;

        let progress = 0;
        if (scrollY > startScroll) {
            progress = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));
        }

        const isMobile = window.innerWidth <= 768;
        const maxImageOpacity = isMobile ? 0.35 : 0.72;

        // 1. Background Opacity Transition (0% to 100%)
        scrollBg.style.opacity = (progress * 0.85).toFixed(3);

        // 2. Emerging Image Dynamic Interpolation
        const opacity = (progress * maxImageOpacity).toFixed(3);
        const scale = (0.85 + (progress * 0.15)).toFixed(3);
        const blurVal = (10 * (1 - progress)).toFixed(1);
        const rotateY = (-10 * (1 - progress)).toFixed(1);
        
        // Parallax depth movement relative to scroll
        const parallaxOffsetY = (scrollY * 0.04).toFixed(1);

        scrollImg.style.opacity = opacity;
        scrollImg.style.filter = `blur(${blurVal}px) drop-shadow(0 20px 40px rgba(0,0,0,0.45))`;

        if (!isMobile) {
            scrollImg.style.transform = `perspective(1000px) scale(${scale}) translateY(${parallaxOffsetY}px) rotateY(${rotateY}deg)`;
        } else {
            scrollImg.style.transform = `scale(${scale}) translateY(${parallaxOffsetY * 0.5}px)`;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffect);
            ticking = true;
        }
    }, { passive: true });

    // Initial recalculation on load
    updateScrollEffect();
}
