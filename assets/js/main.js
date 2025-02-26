/*===== SHOW MENU =====*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')


/*---MENU SHOW---*/
/*Validate if constant exists*/
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}


/*---MENU HIDDEN---*/
/*Validate if constant exists*/
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== ADD BLUR HEADER ====================*/
const blurHeader = () =>{
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewpoint height, add the blur-header class to the header tag
    this.scrollY >= 50 ? header.classList.add('blur-header')
                        : header.classList.remove('blur-header')
}
window.addEventListener('scroll', blurHeader)

/*==================== EMAIL JS ====================*/
const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message')

const sendEmail = (e) =>{
    e.preventDefault()

    //serviceID - templateID - #form - piblickey
    emailjs.sendForm('service_9ombexc', 'template_bwbd8t8', '#contact-form', 'xti1CuiQTBsveHzvIctGs')
        .then(() =>{
            //show message that's been sent
            contactMessage.textContent = 'Message Sent Successfully✔️ '

            //Set message timeout after 5secs
            setTimeout(() =>{
                contactMessage.textContent = ''
            }, 5000)

            //clear input fields
            contactForm.reset()
        }, () =>{
            //show error message
            contactMessage.textContent = 'Message not sent (service error)❌'
        })
}

contactForm.addEventListener('submit', sendEmail)


/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 200,
//     reset: true
})

sr.reveal('.home__data, .home__social, .contact__container, .footer__container',{}); 
sr.reveal('.home__image',{origin: 'bottom'}); 
sr.reveal('.about__data, .skills__data',{origin: 'left'}); 
sr.reveal('.services__card, .projects__card, .cert__img',{interval: 100}); 
sr.reveal('.about__image, .skills__content, .cert__container',{origin: 'right'}); 

/*=============== SHOW SCROLL UP ===============*/
const scrollup = () =>{
    const scrollup = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollup.classList.add('show-scroll')
                                            : scrollup.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollup)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
                sectionTop = current.offsetTop - 58,
                sectionId = current.getAttribute('id'),
                sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        } else{
            sectionsClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*================ scroll reveal =========== */
const typed = new Typed('.multiple__text', {
    strings: ['Statistician', 'Data Analyst', 'Quantitative Researcher'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop:true
});

const navDark = document.getElementById('nav-dark');
const navLight = document.getElementById('nav-light');

// Function to toggle dark/light theme
navDark.addEventListener('click', () => {
  document.body.classList.add('dark-theme');
  document.body.classList.remove('light-theme');
  navDark.style.display = 'none'; // Hide dark mode icon
  navLight.style.display = 'block'; // Show light mode icon
});

navLight.addEventListener('click', () => {
  document.body.classList.add('light-theme');
  document.body.classList.remove('dark-theme');
  navLight.style.display = 'none'; // Hide light mode icon
  navDark.style.display = 'block'; // Show dark mode icon
});


/* --- Cursor ---*/
let mouseCursor = document.querySelector(".cursor");
let navLinks = document.querySelectorAll(".nav__link");

window.addEventListener('mousemove', cursor);

function cursor(e) {
    mouseCursor.style.top = e.pageY + 'px';
    mouseCursor.style.left = e.pageX + 'px';
}

navLinks.forEach(link => {
    link.addEventListener("mouseleave", () => {
        mouseCursor.classList.remove("link-grow");
        link.classList.remove("hovered-link");
    });
    link.addEventListener("mouseover", () => {
        mouseCursor.classList.add("link-grow");
        link.classList.add("hovered-link");

    });
});