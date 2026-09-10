✨ Aleeza 3D Showcase

«A premium interactive 3D portfolio showcase designed to present creative work, projects, skills, and digital experiences through immersive motion, modern UI, and cinematic visual design.»

🚀 Overview

Aleeza 3D Showcase is a modern portfolio experience built to go beyond a traditional website.

The project combines 3D motion, interactive visuals, modern web design, smooth animations, and cinematic presentation to create an engaging digital experience.

The goal is simple:

Don't just show your work — make people experience it.

---

✨ Features

- 🎬 Cinematic 3D motion experience
- 💜 Premium dark & purple visual aesthetic
- 🖥️ Modern responsive portfolio interface
- ✨ Smooth animations and transitions
- 🎨 Creative UI/UX presentation
- 📂 Featured projects showcase
- 🧑‍💻 Skills & technology presentation
- 📱 Responsive design for different screen sizes
- ⚡ Fast and interactive user experience
- 🌐 Modern developer portfolio structure

---

🎨 Design Concept

The visual direction focuses on a premium futuristic aesthetic combining:

- Dark backgrounds
- Purple neon accents
- Glowing UI elements
- Glassmorphism-inspired surfaces
- 3D depth
- Cinematic lighting
- Smooth motion
- Minimal and modern typography

The result is a portfolio experience designed to feel more like a digital product showcase than a traditional portfolio.

---

🛠️ Technologies

Depending on the implementation, the project can be built and extended using modern web technologies such as:

- HTML5
- CSS3
- JavaScript
- 3D / Motion Design
- Responsive Web Design
- Modern UI/UX principles

---

📸 Showcase

The project was also presented as a cinematic 3D motion showcase, transforming the portfolio interface into an immersive visual experience.

The showcase focuses on:

Website → Depth → Motion → Lighting → Cinematic Presentation

---

🎯 Purpose

This project was created to demonstrate how a personal portfolio can be transformed into a strong visual identity and memorable digital experience.

It can be adapted for:

- 👨‍💻 Developer portfolios
- 🎨 Designer portfolios
- 🚀 Startup landing pages
- 💼 Personal brands
- 🏢 Business websites
- 📱 Product showcases
- 🎬 Creative agencies

---

🌟 Why 3D Motion?

Traditional portfolio websites are often static.

This project explores how motion and 3D presentation can make digital content more engaging while maintaining a clean and professional interface.

The objective is to combine:

«Design + Technology + Motion + Storytelling»

into one cohesive experience.

---

📂 Project Structure

aleeza-3d-showcase/
│
├── assets/
├── images/
├── styles/
├── scripts/
├── index.html
└── README.md

«Project structure may vary depending on the implementation.»

---

🚀 Getting Started

Clone the repository:

git clone https://github.com/Aleezy-code/aleeza-3d-showcase.git

Navigate to the project:

cd aleeza-3d-showcase

Then open the project in your preferred local development environment.

---

💡 Future Improvements

Possible future enhancements include:

- Advanced WebGL 3D interactions
- More cinematic camera transitions
- Interactive 3D project previews
- Scroll-based 3D animations
- Enhanced mobile interactions
- Performance optimization
- More interactive portfolio sections

---

👩‍💻 Author

Aleeza Kaz

Full Stack Developer & Creative Problem Solver

I enjoy building modern digital experiences that combine clean development, creative design, interactive experiences, and visual storytelling.

---

🤝 Let's Connect

If you're interested in:

- Web Development
- Creative Websites
- 3D Motion Experiences
- Portfolio Websites
- UI/UX Design
- Digital Experiences

Feel free to connect and collaborate.

---

⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.

It helps support the project and encourages more creative experiments with modern web experiences.

---

✨ Clean Code. Creative Design. Real Impact.


Main wrapper has overflowX: 'clip'



SECTION ORDER



HeroSection



MarqueeSection



AboutSection



ServicesSection



ProjectsSection



1. HERO SECTION



Full viewport height (h-screen), flex column layout with overflowX: clip.



Navbar: Horizontal nav bar with 4 links -- "About", "Price", "Projects", "Contact" -- evenly spaced with justify-between. Text color #D7E2EA, font-medium, uppercase, tracking-wider. Sizes: text-sm md:text-lg lg:text-[1.4rem]. Padding: px-6 md:px-10 pt-6 md:pt-8. Hover: opacity 70% with 200ms transition.



Hero Heading: Massive h1 with text "Hi, i'm jack" (lowercase "i", curly apostrophe via &apos;). Uses the .hero-heading gradient text class. Font-black, uppercase, tracking-tight, leading-none, whitespace-nowrap, w-full. Font sizes: text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]. Margin top: mt-6 sm:mt-4 md:-mt-5. Wrapped in overflow-hidden container.



Bottom bar: Flexbox justify-between items-end with pb-7 sm:pb-8 md:pb-10:



Left: paragraph text "a 3d creator driven by crafting striking and unforgettable projects", color #D7E2EA, font-light, uppercase, tracking-wide, leading-snug. Font size: clamp(0.75rem, 1.4vw, 1.5rem). Max-width: max-w-[160px] sm:max-w-[220px] md:max-w-[260px].



Right: ContactButton component (see below)



Hero Portrait: Centered absolutely. Uses a Magnet component (mouse-following magnetic effect) wrapping an image. Image URL: https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png. Magnet settings: padding 150, strength 3, activeTransition "transform 0.3s ease-out", inactiveTransition "transform 0.6s ease-in-out". Positioning: absolute left-1/2 -translate-x-1/2 z-10. Width: w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]. On mobile: top-1/2 -translate-y-1/2. On sm+: sm:top-auto sm:translate-y-0 sm:bottom-0.



FadeIn animations: Navbar fades in with delay 0, y -20. Heading: delay 0.15, y 40. Left text: delay 0.35, y 20. Contact button: delay 0.5, y 20. Portrait: delay 0.6, y 30.



2. MARQUEE SECTION



Two rows of images that scroll horizontally based on page scroll position. Background #0C0C0C. Padding: pt-24 sm:pt-32 md:pt-40 pb-10.



21 GIF images from motionsites.ai (exact URLs):



https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif



https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif



https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif



https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif



https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif



https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif



https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif



https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif



https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif



https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif



https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif



https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif



https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif



https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif



https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif



https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif



https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif



https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif



https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif



https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif



https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif



Row 1: first 11 images, tripled for seamless scrolling. Moves RIGHT on scroll (translateX(offset - 200)).



Row 2: remaining 10 images, tripled. Moves LEFT on scroll (translateX(-(offset - 200))).



Scroll offset calculated as: (window.scrollY - sectionTop + window.innerHeight) * 0.3



Each image tile: 420px x 270px, rounded-2xl, object-cover, lazy loaded.



Gap between tiles: gap-3. Gap between rows: gap-3.



Uses willChange: 'transform' for performance. Scroll listener is passive.



3. ABOUT SECTION



Full-height centered section with min-h-screen, padding px-5 sm:px-8 md:px-10 py-20.



Four decorative 3D images positioned absolutely in corners:



Top-left: Moon icon -- https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png -- w-[120px] sm:w-[160px] md:w-[210px], positioned top-[4%] left-[1%] sm:left-[2%] md:left-[4%]. FadeIn: delay 0.1, x -80, y 0, duration 0.9.



Bottom-left: 3D object -- https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png -- w-[100px] sm:w-[140px] md:w-[180px], positioned bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]. FadeIn: delay 0.25, x -80, y 0, duration 0.9.



Top-right: Lego icon -- https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png -- w-[120px] sm:w-[160px] md:w-[210px], positioned top-[4%] right-[1%] sm:right-[2%] md:right-[4%]. FadeIn: delay 0.15, x 80, y 0, duration 0.9.



Bottom-right: 3D group -- https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png -- w-[130px] sm:w-[170px] md:w-[220px], positioned bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]. FadeIn: delay 0.3, x 80, y 0, duration 0.9.



Heading: "About me" using .hero-heading gradient text, font-black, uppercase, leading-none, tracking-tight, centered. Font size: clamp(3rem, 12vw, 160px). FadeIn: delay 0, y 40.



Animated paragraph: Uses a character-by-character scroll-driven opacity animation. Text: "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!" -- color #D7E2EA, font-medium, centered, leading-relaxed, max-w-[560px], font size clamp(1rem, 2vw, 1.35rem). Each character animates from opacity 0.2 to 1 based on scroll progress, with scroll offset ['start 0.8', 'end 0.2'].



Contact button below the text block. Gap between heading/text: gap-10 sm:gap-14 md:gap-16. Gap between text block and button: gap-16 sm:gap-20 md:gap-24.



4. SERVICES SECTION



White background (#FFFFFF), with rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] top corners. Padding: px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32.



Heading: "Services" in #0C0C0C, font-black, uppercase, centered, font size clamp(3rem, 12vw, 160px). Margin bottom: mb-16 sm:mb-20 md:mb-28.



5 service items in a vertical list, max-w-5xl, centered:



01 - 3D Modeling: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations."



02 - Rendering: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life."



03 - Motion Design: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences."



04 - Branding: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence."



05 - Web Design: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience."



Each item: horizontal layout with number (font-black, font size clamp(3rem, 10vw, 140px), color #0C0C0C) on the left and name + description stacked vertically on the right. Name: font-medium, uppercase, font size clamp(1rem, 2.2vw, 2.1rem). Description: font-light, leading-relaxed, max-w-2xl, font size clamp(0.85rem, 1.6vw, 1.25rem), opacity 0.6. Items separated by 1px borders (rgba(12, 12, 12, 0.15)). Padding: py-8 sm:py-10 md:py-12. Staggered FadeIn: each item delays by i * 0.1.



5. PROJECTS SECTION



Dark background (#0C0C0C), rounded top corners rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px], pulled up with -mt-10 sm:-mt-12 md:-mt-14, z-10.



Heading: "Project" (singular) using .hero-heading gradient, same styling as other headings.



3 sticky-stacking project cards that scale down as you scroll past them (card stacking effect using Framer Motion useScroll and useTransform). Each card is sticky top-24 md:top-32 inside an h-[85vh] container.



Scale calculation: targetScale = 1 - (totalCards - 1 - index)  0.03. Each card offset by top: ${index  28}px.



Each card has: rounded-[40px] sm:rounded-[50px] md:rounded-[60px], border-2 border-[#D7E2EA], background #0C0C0C, padding p-4 sm:p-6 md:p-8.



Card layout:



Top row: Number (huge, same style as services), category label, project name, and a "Live Project" ghost button (rounded-full, border-2 #D7E2EA, uppercase, tracking-widest).



Bottom row: Two-column image grid -- left column (40% width) has 2 stacked images, right column (60%) has 1 tall image. All images have heavy border radius rounded-[40px] sm:rounded-[50px] md:rounded-[60px]. Left top image height: clamp(130px, 16vw, 230px). Left bottom image height: clamp(160px, 22vw, 340px).



Project data with CloudFront image URLs:



Project 01 - "Nextlevel Studio" (Client):



Col1 image 1: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85



Col1 image 2: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85



Col2 image: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85



Project 02 - "Aura Brand Identity" (Personal):



Col1 image 1: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85



Col1 image 2: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85



Col2 image: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85



Project 03 - "Solaris Digital" (Client):



Col1 image 1: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85



Col1 image 2: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85



Col2 image: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85



REUSABLE COMPONENTS



ContactButton: Rounded-full pill button with gradient background linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%), inner box-shadow 0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset, white 2px outline with -3px offset. Text: white, font-medium, uppercase, tracking-widest. Sizes: px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4, text text-xs sm:text-sm md:text-base. Label: "Contact Me".



LiveProjectButton: Ghost/outline pill button. Rounded-full, border-2 border-[#D7E2EA], text color #D7E2EA, font-medium, uppercase, tracking-widest. Sizes: px-8 py-3 sm:px-10 sm:py-3.5, text text-sm sm:text-base. Hover: bg-[#D7E2EA]/10. Label: "Live Project".



FadeIn: Framer Motion wrapper using whileInView with viewport={{ once: true, margin: "50px", amount: 0 }}. Accepts delay, duration (default 0.7), x (default 0), y (default 30). Easing: [0.25, 0.1, 0.25, 1]. Uses motion.create() for dynamic element types.



Magnet: Mouse-following magnetic hover effect. Tracks mouse position relative to element center, applies translate3d transform divided by strength factor. Activates when cursor is within padding distance of element edge. Smooth transition in (0.3s ease-out) and out (0.6s ease-in-out). Uses willChange: 'transform'.



AnimatedText: Character-by-character scroll-reveal text animation. Each character goes from opacity 0.2 to 1 based on its position in the text relative to scroll progress. Uses Framer Motion useScroll targeting the paragraph element with offset ['start 0.8', 'end 0.2']. Each character uses invisible placeholder + absolute positioned animated span.



KEY DEPENDENCIES



react, react-dom (^18.3.1)



framer-motion (^12.38.0)



lucide-react (^0.344.0)



tailwindcss (^3.4.1)



vite, typescript



RESPONSIVE BREAKPOINTS



All sections use Tailwind's default breakpoints (sm: 640px, md: 768px, lg: 1024px) with mobile-first approach. Heavy use of clamp() for fluid typography. The entire design scales gracefully from mobile to ultra-wide screens.







You can use this as a master prompt for ChatGPT, Claude, Gemini, Cursor, Windsurf, or any AI coding assistant:





---



Senior Software Engineer Prompt



Act as a Senior Software Engineer, Software Architect, and Technical Lead.



Write production-ready code that could be deployed to a real-world enterprise application.



General Requirements



Follow SOLID Principles



Follow Clean Architecture



Follow Domain Driven Design (DDD) whenever appropriate



Follow DRY



Follow KISS



Follow YAGNI



Follow Separation of Concerns



Use proper dependency injection where appropriate.



Never create large monolithic components.



Code should be highly reusable.



Components should be loosely coupled.



Every function should have a single responsibility.







---



Code Quality



Write code that is:



Clean



Readable



Maintainable



Scalable



Extensible



Well documented



Production ready





Avoid hacks, shortcuts, duplicated logic, and code smells.





---



Error Handling



Implement robust error handling.



Include:



try/catch where appropriate



Custom Error Classes



Error Boundaries (React)



Validation



Graceful fallback UI



Loading states



Empty states



Retry mechanisms



Timeout handling







---



Performance



Optimize for performance.



Include:



Lazy loading



Code splitting



Memoization



React.memo



useMemo



useCallback



Image optimization



Dynamic imports



Efficient rendering



Virtualization if required



Avoid unnecessary re-renders







---



Folder Structure



Generate scalable folder structures.



Example:



src/



app/



components/



features/



hooks/



services/



api/



store/



utils/



types/



constants/



config/



assets/



layouts/



pages/



styles/



providers/



context/



routes/



animations/



lib/



validators/



models/



interfaces/



repositories/





---



React Requirements



Use



React 18+



TypeScript



Functional Components



Hooks only



Custom Hooks



Context API where appropriate



Strong typing everywhere





Avoid



any



class components



prop drilling



duplicated state







---



TypeScript



Use strict typing.



Prefer



interfaces



utility types



generics



enums only when necessary



discriminated unions



reusable types





Never use any unless absolutely unavoidable.





---



Styling



Use



Tailwind CSS



Responsive Design



Mobile First



Reusable UI components





Follow consistent spacing, typography, and color systems.





---



State Management



Use the simplest solution possible.



Priority:



1. Local State





2. Context





3. Zustand (if global state is needed)







Avoid unnecessary complexity.





---



API Layer



Create a dedicated API layer.



Include:



Axios instance



Interceptors



Authentication



Refresh Token Logic



Generic API methods



Request cancellation



Error normalization







---



Authentication



Implement:



JWT



Refresh Tokens



Protected Routes



Role Based Access



Session Persistence







---



Forms



Use:



React Hook Form



Zod validation





Include:



reusable inputs



validation



accessibility



error messages







---



Accessibility



Follow WCAG guidelines.



Include:



semantic HTML



aria labels



keyboard navigation



focus management



screen reader support







---



Animations



Use:



Framer Motion





Animations should be:



smooth



optimized



non-blocking







---



Testing



Generate:



Unit Tests



Integration Tests



Component Tests





Use:



Vitest



React Testing Library







---



Documentation



Every exported function should include JSDoc.



Document:



Props



Parameters



Return types



Examples where useful







---



Security



Follow best practices.



Include:



Input sanitization



XSS prevention



CSRF considerations



Secure authentication



Environment variable usage



Never expose secrets







---



Logging



Implement structured logging.



Differentiate:



info



warning



error



debug







---



If Using @Codebase



When @Codebase is available:



Understand the existing architecture first.



Follow existing naming conventions.



Reuse existing utilities.



Reuse existing components.



Avoid rewriting working code.



Maintain consistency across the project.



Only modify files that require changes.



Explain architectural decisions before implementing.







---



Response Format



For every implementation:



1. Explain the architecture.





2. Explain why the chosen approach is scalable.





3. List affected files.





4. Provide complete production-ready code.





5. Explain trade-offs.





6. Suggest future improvements.





7. Mention any assumptions made.









---



Primary Objective: Produce enterprise-grade, scalable, maintainable, secure, performant, and production-ready code that adheres to modern software engineering best practices.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ab09cef6-315f-475c-920e-3df1b7845011).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
