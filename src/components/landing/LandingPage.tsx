import React from 'react'
import Navbar from './Navbar'
import Features from './Features'
import Hero from './Hero'
import Testimonials from './Testimonials'
import Footer from './Footer'
import BackgroundGlow from '../ui/BackgroundGlow'

const LandingPage = () => {
    return (
        <div className='relative'>
              <BackgroundGlow />
            <Navbar />
        <div className='md:px-16'>
            <Hero />
            <Features />
            <Testimonials />
        </div>
            <Footer />
        </div>
    )
}

export default LandingPage