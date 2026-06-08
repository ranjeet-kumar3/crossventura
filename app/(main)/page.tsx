import React from 'react'
import Hero from '@/components/Hero'
import UserSection from '@/components/section/UserSection'
import Section2 from '@/components/section/Section2'
import Section3 from '@/components/section/Section3'
import Section4 from '@/components/section/Section4'
import FounderSection from '@/components/section/FounderSection'
import FaqSection from '@/components/section/FaqSection5'
function page() {
  return (
    <main>
      <Hero />
      <UserSection />
      <Section2 />
      <Section3/>
      <FounderSection/>
      <Section4/>
      <FaqSection/>
    </main>
  )
}

export default page