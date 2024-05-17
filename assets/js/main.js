/*===== SHOW MENU =====*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')


/*---MENU SHOW---*/
/*Validate if constant exists*/
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMen.classList.add('show-menu')
    })
}


/*---MENU HIDDEN---*/
/*Validate if constant exists*/
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
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
    emailjs.sendForm('service_9ombexc', 'template_bwbd8t8', '#contact-form', 'EfgvsnSpW5d7hHzUIy')
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
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/*=============== SHOW SCROLL UP ===============*/
const scrollup = () =>{
    const scrollup = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollup.classList.add('show-scroll')
                                            : scrollup.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollup)

/*=============== SCROLL SECTIONS ZCTIVE LINK ===============*/
const sections = document.getElementById('section[id]')

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