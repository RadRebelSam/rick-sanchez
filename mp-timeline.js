(function(){
window.MOTIONPAGE_FRONT=window.MOTIONPAGE_FRONT||{};
var _mp_init=function(){
Motion('Flask Pour', [
  { target: '#flaskImg', from: { y: '0%', rotate: 0 }, to: { y: '-12%', rotate: -100 }, duration: 1, ease: 'power1.inout', position: 0 },
  { target: '#screenFlask .pour-stream', from: { scaleY: 0, transformOrigin: '50% 0%' }, to: { scaleY: 1, transformOrigin: '50% 0%' }, duration: 0.6, ease: 'power2.out', position: 0.55 },
  { target: '#screenFlask .pour-drop', from: { opacity: 0, y: '0px' }, to: { opacity: 1, y: '170px' }, duration: 0.7, ease: 'power1.in', stagger: 0.12, position: 0.75 },
  { target: '#screenFlask .puddle', from: { opacity: 0, scaleX: 0 }, to: { opacity: 0.95, scaleX: 1 }, duration: 0.6, ease: 'power2.out', position: 0.95 },
  { target: '#flaskLiquid', from: { rotate: 0 }, to: { rotate: 100 }, duration: 1, ease: 'power1.inout', position: 0 },
  { target: '#flaskLiquid', from: { x: '0%', y: '0%' }, to: { x: '-36%', y: '-6.5%' }, duration: 0.5, ease: 'power4.in', position: 0.5 }
]).onScroll({ target: '#screenWrap', start: 'center 60%', end: 'bottom 15%', scrub: 1 })

Motion('Hero Scroll', [
  { target: '#heroName', from: { opacity: 1, y: '0%' }, to: { opacity: 0, y: '-40%' }, duration: 1, ease: 'none', position: 0 },
  { target: '#headFace', from: { y: '0%' }, to: { y: '-30%' }, duration: 1, ease: 'none', position: 0 },
  { target: '#portalGlow', from: { opacity: 0.55, scale: 1 }, to: { opacity: 0.1, scale: 1.7 }, duration: 1, ease: 'none', position: 0 },
  { target: '#propShip', from: { y: '0%', rotate: 0 }, to: { y: '-160%', rotate: -14 }, duration: 1, ease: 'none', position: 0 },
  { target: '#propBrain', from: { y: '0%' }, to: { y: '-100%' }, duration: 1, ease: 'none', position: 0 },
  { target: '#propGun', from: { y: '0%', rotate: 0 }, to: { y: '-130%', rotate: 18 }, duration: 1, ease: 'none', position: 0 },
  { target: '#propFlask', from: { y: '0%', rotate: 0 }, to: { y: '-90%', rotate: -10 }, duration: 1, ease: 'none', position: 0 },
  { target: '#propBox', from: { y: '0%', rotate: 0 }, to: { y: '-120%', rotate: 12 }, duration: 1, ease: 'none', position: 0 },
  { target: '#heroLinks', from: { opacity: 1, y: '0px' }, to: { opacity: 0, y: '30px' }, duration: 0.4, ease: 'none', position: 0 },
  { target: '#wordmark', from: { opacity: 0, y: '-10px' }, to: { opacity: 1, y: '0px' }, duration: 0.3, ease: 'none', position: 0.6 },
  { target: '.widget-marquee-track', from: { x: '0%' }, to: { x: '-50%' }, duration: 1, ease: 'none', position: 0 }
]).onScroll({ target: '#top', start: 'top 0%', end: 'bottom 0%', scrub: 1 })

Motion('Hero Intro', [
  { target: '#heroName .name-char', from: { opacity: 0, y: '80%', rotateX: 45 }, to: { opacity: 1, y: '0%', rotateX: 0 }, duration: 0.9, ease: 'power3.out', stagger: 0.045, position: 0.1 },
  { target: '#portalGlow', from: { opacity: 0, scale: 0.2, rotate: -90 }, to: { opacity: 0.55, scale: 1, rotate: 0 }, duration: 1.4, ease: 'power3.out', position: 0.3 },
  { target: '#headFace', from: { opacity: 0, y: '14%' }, to: { opacity: 1, y: '0%' }, duration: 1, ease: 'power3.out', position: 0.45 },
  { target: '#propShip', from: { opacity: 0, y: '70%', scale: 0.5, rotate: -20 }, to: { opacity: 1, y: '0%', scale: 1, rotate: 0 }, duration: 1.1, ease: 'back.out(1.7)', position: 1.3 },
  { target: '#propBrain', from: { opacity: 0, y: '70%', scale: 0.5 }, to: { opacity: 1, y: '0%', scale: 1 }, duration: 1.1, ease: 'back.out(1.7)', position: 1.4 },
  { target: '#propGun', from: { opacity: 0, y: '70%', scale: 0.5, rotate: 25 }, to: { opacity: 1, y: '0%', scale: 1, rotate: 0 }, duration: 1.1, ease: 'back.out(1.7)', position: 1.5 },
  { target: '#propFlask', from: { opacity: 0, y: '70%', scale: 0.5, rotate: 15 }, to: { opacity: 1, y: '0%', scale: 1, rotate: 0 }, duration: 1.1, ease: 'back.out(1.7)', position: 1.6 },
  { target: '#propBox', from: { opacity: 0, y: '70%', scale: 0.5, rotate: -15 }, to: { opacity: 1, y: '0%', scale: 1, rotate: 0 }, duration: 1.1, ease: 'back.out(1.7)', position: 1.7 },
  { target: '#latestCard', from: { opacity: 0, y: '40px' }, to: { opacity: 1, y: '0px' }, duration: 0.8, ease: 'power3.out', position: 1.9 },
  { target: '#heroLinks .pill', from: { opacity: 0, y: '20px', scale: 0.9 }, to: { opacity: 1, y: '0px', scale: 1 }, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.08, position: 2 },
  { target: '#siteHeader .nav-wrap', from: { opacity: 0, y: '-16px' }, to: { opacity: 1, y: '0px' }, duration: 0.7, ease: 'power2.out', position: 1.6 }
]).onPageLoad()

Motion('About Floaters', [
  { target: '#aboutHead', from: { y: '12%', rotate: -4 }, to: { y: '-16%', rotate: 4 }, duration: 1, ease: 'none', position: 0 },
  { target: '#aboutPortal', from: { scale: 0.8, rotate: 0 }, to: { scale: 1.4, rotate: 240 }, duration: 1, ease: 'none', position: 0 }
]).onScroll({ target: '#about', start: 'top 100%', end: 'bottom 0%', scrub: 1 })

Motion('Eye Track', [
  { target: '#headFace .pupil', from: { x: '-110%' }, to: { x: '110%' }, duration: 1, ease: 'none', axis: 'x', position: 0 },
  { target: '#headFace .pupil', from: { y: '-70%' }, to: { y: '70%' }, duration: 1, ease: 'none', axis: 'y', position: 0 }
]).onMouseMove({ type: 'axis', smooth: 0.018 })

Motion('Wubba Marquee', [
  { target: '#wubbaTrack', from: { x: '0%' }, to: { x: '-50%' }, duration: 1, ease: 'none', position: 0 },
  { target: '#wubba .band-note', from: { opacity: 0, y: '10px' }, to: { opacity: 1, y: '0px' }, duration: 0.3, ease: 'none', position: 0.35 }
]).onScroll({ target: '#wubba', start: 'top 100%', end: 'bottom 0%', scrub: 1 })

Motion('Widget Hover', [
  { target: '#latestCard .widget-card', from: { opacity: 0, y: '24%', scale: 0.7, rotate: -6 }, to: { opacity: 1, y: '0%', scale: 1, rotate: 0 }, duration: 0.55, ease: 'back.out(1.6)', position: 0 },
  { target: '#latestCard .widget-tag', from: { scale: 1 }, to: { scale: 1.08 }, duration: 0.4, ease: 'power2.out', position: 0 }
]).onHover({ target: '#latestCard', onLeave: 'reverse' })

Motion('Play Reveal', [
  { target: '#play .section-title .line', from: { y: '110%' }, to: { y: '0%' }, duration: 0.9, ease: 'power3.out', stagger: 0.1, position: 0 },
  { target: '#playIntro', from: { opacity: 0, y: '16px' }, to: { opacity: 1, y: '0px' }, duration: 0.7, ease: 'power2.out', position: 0.3 },
  { target: '#playGrid .play-card', from: { opacity: 0, y: '18%', scale: 0.9, rotate: 8 }, to: { opacity: 1, y: '0%', scale: 1, rotate: 0 }, duration: 0.9, ease: 'back.out(1.5)', stagger: 0.12, position: 0.4 }
]).onScroll({ target: '#play', start: 'top 75%' })

Motion('Menu Open', [
  { target: '.menu-link', from: { opacity: 0, y: '110%' }, to: { opacity: 1, y: '0%' }, duration: 0.8, ease: 'power3.out', stagger: 0.07, position: 0.15 },
  { target: '.menu-face', from: { opacity: 0, y: '40%' }, to: { opacity: 1, y: '0%' }, duration: 0.9, ease: 'power3.out', position: 0.2 },
  { target: '.menu-bubble', from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1 }, duration: 0.6, ease: 'back.out(2)', position: 0.7 },
  { target: '.menu-foot', from: { opacity: 0 }, to: { opacity: 1 }, duration: 0.6, ease: 'power2.out', position: 0.8 }
]).onClick({ target: '#menuToggle', toggle: 'reverse' })

Motion('Footer Face', [
  { target: '#footerHead', from: { opacity: 0, y: '60%' }, to: { opacity: 1, y: '0%' }, duration: 1, ease: 'power3.out', position: 0 },
  { target: '.footer-bubble', from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1 }, duration: 0.6, ease: 'back.out(2)', position: 0.7 },
  { target: '.footer-link', from: { opacity: 0, y: '40%' }, to: { opacity: 1, y: '0%' }, duration: 0.8, ease: 'power3.out', stagger: 0.08, position: 0.2 },
  { target: '.footer-foot', from: { opacity: 0 }, to: { opacity: 1 }, duration: 0.8, ease: 'power2.out', position: 0.9 }
]).onScroll({ target: '#siteFooter', start: 'top 80%' })

Motion('Books Fan', [
  { target: '#books .section-title .line', from: { y: '110%' }, to: { y: '0%' }, duration: 0.5, ease: 'power2.out', stagger: 0.1, position: 0 },
  { target: '.book.b1', from: { x: '-50%', rotate: 0 }, to: { x: '-92%', rotate: -14 }, duration: 1, ease: 'power2.out', position: 0.3 },
  { target: '.book.b2', from: { x: '-50%', rotate: 0 }, to: { x: '-64%', rotate: -5 }, duration: 1, ease: 'power2.out', position: 0.3 },
  { target: '.book.b3', from: { x: '-50%', rotate: 0 }, to: { x: '-36%', rotate: 5 }, duration: 1, ease: 'power2.out', position: 0.3 },
  { target: '.book.b4', from: { x: '-50%', rotate: 0 }, to: { x: '-8%', rotate: 14 }, duration: 1, ease: 'power2.out', position: 0.3 }
]).onScroll({ target: '#books', start: 'top 80%', end: 'center 40%', scrub: 1 })

Motion('Quote Reveal', [
  { target: '#quoteIcon', from: { opacity: 0, scale: 0, rotate: -25 }, to: { opacity: 1, scale: 1, rotate: 0 }, duration: 0.9, ease: 'back.out(2)', position: 0 },
  { target: '#quoteBlock .line', from: { y: '110%', rotate: 2 }, to: { y: '0%', rotate: 0 }, duration: 1.1, ease: 'power3.out', stagger: 0.12, position: 0.2 },
  { target: '.quote-meta', from: { opacity: 0, y: '20px' }, to: { opacity: 1, y: '0px' }, duration: 0.8, ease: 'power2.out', position: 0.9 },
  { target: '#quoteHead', from: { opacity: 0, y: '60%', rotate: 40 }, to: { opacity: 1, y: '0%', rotate: 8 }, duration: 1, ease: 'back.out(1.4)', position: 0.6 }
]).onScroll({ target: '#quote', start: 'top 70%' })

Motion('News Reveal', [
  { target: '#news .section-title .line', from: { y: '110%' }, to: { y: '0%' }, duration: 0.9, ease: 'power3.out', stagger: 0.1, position: 0 },
  { target: '.news-line', from: { scaleX: 0, transformOrigin: '0% 50%' }, to: { scaleX: 1, transformOrigin: '0% 50%' }, duration: 1.2, ease: 'power3.inout', stagger: 0.12, position: 0.2 },
  { target: '.news-row', from: { opacity: 0, y: '40px' }, to: { opacity: 1, y: '0px' }, duration: 0.9, ease: 'power3.out', stagger: 0.12, position: 0.4 }
]).onScroll({ target: '#news', start: 'top 75%' })

Motion('About Reveal', [
  { target: '#about .section-title .line', from: { y: '110%' }, to: { y: '0%' }, duration: 0.9, ease: 'power3.out', stagger: 0.1, position: 0 },
  { target: '#aboutStatement .line', from: { y: '110%', rotate: 3 }, to: { y: '0%', rotate: 0 }, duration: 1.1, ease: 'power3.out', stagger: 0.12, position: 0.3 },
  { target: '#aboutLabel', from: { opacity: 0, x: '-20px' }, to: { opacity: 1, x: '0px' }, duration: 0.8, ease: 'power2.out', position: 0.9 },
  { target: '#aboutBio p', from: { opacity: 0, y: '24px' }, to: { opacity: 1, y: '0px' }, duration: 0.8, ease: 'power2.out', position: 1 },
  { target: '#aboutCta', from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 }, duration: 0.7, ease: 'back.out(1.7)', position: 1.2 }
]).onScroll({ target: '#about', start: 'top 70%' })

Motion('Card Tilt', '.card-peel', { from: { y: '0%', scale: 1, rotateY: 0 }, to: { y: '-5%', scale: 1.08, rotateY: -12 }, duration: 0.5, ease: 'power2.out' }).onHover({ target: '.card-peel', each: true, onLeave: 'reverse' })

Motion('Media Scene', [
  { target: '#media .section-title .line', from: { y: '110%' }, to: { y: '0%' }, duration: 0.5, ease: 'power2.out', stagger: 0.1, position: 0 },
  { target: '#screenPlayer', from: { opacity: 0, y: '20%', scale: 0.6 }, to: { opacity: 1, y: '0%', scale: 1 }, duration: 1, ease: 'power2.out', position: 0.2 },
  { target: '#mediaCard1', from: { opacity: 0, x: '120%', y: '70%', rotate: 0 }, to: { opacity: 1, x: '0%', y: '0%', rotate: -8 }, duration: 1, ease: 'power2.out', position: 0.5 },
  { target: '#mediaCard2', from: { opacity: 0, x: '90%', y: '-50%', rotate: 0 }, to: { opacity: 1, x: '0%', y: '0%', rotate: 6 }, duration: 1, ease: 'power2.out', position: 0.7 },
  { target: '#mediaCard3', from: { opacity: 0, x: '-120%', y: '70%', rotate: 0 }, to: { opacity: 1, x: '0%', y: '0%', rotate: 7 }, duration: 1, ease: 'power2.out', position: 0.6 },
  { target: '#mediaCard4', from: { opacity: 0, x: '-90%', y: '-50%', rotate: 0 }, to: { opacity: 1, x: '0%', y: '0%', rotate: -5 }, duration: 1, ease: 'power2.out', position: 0.8 },
  { target: '#screenFlask', from: { opacity: 0, y: '80%', rotate: 25 }, to: { opacity: 1, y: '0%', rotate: 0 }, duration: 0.8, ease: 'back.out(1.5)', position: 1.1 }
]).onScroll({ target: '#media', start: 'top 85%', end: 'center 45%', scrub: 1 })

Motion('Statement Reveal', '#statementText .line', { from: { y: '110%', rotate: 3 }, to: { y: '0%', rotate: 0 }, duration: 1.1, ease: 'power3.out', stagger: 0.12 }).onScroll({ target: '#statement', start: 'top 75%' })

Motion('Prop Parallax', [
  { target: '#propShip', from: { x: '-10%' }, to: { x: '10%' }, duration: 1, ease: 'none', axis: 'x', position: 0 },
  { target: '#propShip', from: { y: '-6%' }, to: { y: '6%' }, duration: 1, ease: 'none', axis: 'y', position: 0 },
  { target: '#propBrain', from: { x: '-6%' }, to: { x: '6%' }, duration: 1, ease: 'none', axis: 'x', position: 0 },
  { target: '#propBrain', from: { y: '-4%' }, to: { y: '4%' }, duration: 1, ease: 'none', axis: 'y', position: 0 },
  { target: '#propGun', from: { x: '-12%' }, to: { x: '12%' }, duration: 1, ease: 'none', axis: 'x', position: 0 },
  { target: '#propGun', from: { y: '-8%' }, to: { y: '8%' }, duration: 1, ease: 'none', axis: 'y', position: 0 },
  { target: '#propFlask', from: { x: '-8%' }, to: { x: '8%' }, duration: 1, ease: 'none', axis: 'x', position: 0 },
  { target: '#propFlask', from: { y: '-5%' }, to: { y: '5%' }, duration: 1, ease: 'none', axis: 'y', position: 0 },
  { target: '#propBox', from: { x: '-7%' }, to: { x: '7%' }, duration: 1, ease: 'none', axis: 'x', position: 0 },
  { target: '#propBox', from: { y: '-9%' }, to: { y: '9%' }, duration: 1, ease: 'none', axis: 'y', position: 0 },
  { target: '#headFace', from: { x: '-2%' }, to: { x: '2%' }, duration: 1, ease: 'none', axis: 'x', position: 0 },
  { target: '#headFace', from: { y: '-1%' }, to: { y: '1%' }, duration: 1, ease: 'none', axis: 'y', position: 0 },
  { target: '#portalGlow', from: { x: '4%' }, to: { x: '-4%' }, duration: 1, ease: 'none', axis: 'x', position: 0 },
  { target: '#portalGlow', from: { y: '3%' }, to: { y: '-3%' }, duration: 1, ease: 'none', axis: 'y', position: 0 }
]).onMouseMove({ type: 'axis', smooth: 0.012 })
};
if(typeof Motion!=="undefined"&&typeof Motion.context==="function"){
try{
MOTIONPAGE_FRONT._ctx=Motion.context(_mp_init);
MOTIONPAGE_FRONT.reinit=function(){MOTIONPAGE_FRONT._ctx&&MOTIONPAGE_FRONT._ctx.refresh()};
}catch(e){
if(e&&e.__motionContextInitializerRan===true){console.error("[Motion] context initializer failed",e);}else{_mp_init();}
MOTIONPAGE_FRONT.reinit=function(){};
}
}else{
_mp_init();
MOTIONPAGE_FRONT.reinit=function(){};
}
})();