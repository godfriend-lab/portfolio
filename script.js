// 1. MATRIX RAIN
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let columns, drops;
const chars = 'アイウエオカキクケコ0123456789ABCDEF';
const fontSize = 14;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00d4ff';
    ctx.font = fontSize + 'px "JetBrains Mono"';
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// 2. NAVBAR SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// 3. MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});
function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
}

// 4. TYPING EFFECT
const texts = ['I build scalable full-stack applications.', 'I integrate AI into digital solutions.', 'I architect secure cloud platforms.', 'CTO @ MATUNEQHYD SARL U.'];
let textIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function type() {
    const current = texts[textIdx];
    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
    }
    let speed = isDeleting ? 30 : 50;
    if (!isDeleting && charIdx === current.length) { speed = 2000; isDeleting = true; }
    else if (isDeleting && charIdx === 0) { isDeleting = false; textIdx = (textIdx + 1) % texts.length; speed = 500; }
    setTimeout(type, speed);
}
setTimeout(type, 1000);

// 5. SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 6. COUNTER ANIMATION
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = +el.dataset.target;
            let current = 0;
            const inc = target / 40;
            const timer = setInterval(() => {
                current += inc;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = Math.floor(current) + '+';
            }, 30);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// 7. LIGHTBOX FUNCTIONS
function openLightbox(imageSrc, projectName) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = projectName;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// 8. FORMSPREE FORM HANDLER (NO REDIRECTION)
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // ⛔ EMPÊCHE LA REDIRECTION
        
        const originalBtnText = submitBtn.innerHTML;
        
        // État de chargement
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        formStatus.style.display = 'none';

        try {
            // Envoi des données en arrière-plan via Fetch API
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Succès
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
                formStatus.textContent = "Thank you! Your message has been sent successfully to agbevivigodfriend7@gmail.com.";
                formStatus.style.color = "var(--success)";
                formStatus.style.display = "block";
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    formStatus.style.display = 'none';
                }, 4000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Erreur
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            submitBtn.style.background = 'linear-gradient(135deg, #ff4757, #ff6b81)';
            formStatus.textContent = "Oops! There was a problem sending your message. Please try again or email me directly.";
            formStatus.style.color = "#ff4757";
            formStatus.style.display = "block";
            submitBtn.disabled = false;
        }
    });
}