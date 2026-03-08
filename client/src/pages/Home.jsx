import React from 'react'
import Navbar from '../components/Navbar'
import Banner from './Banner';
import Title from '../title/Title';

import OurBooks from './OurBooks';
const Home = () => {
  return (
    <div>
      <Navbar/>
      <Banner/>
      <Title text1="OUR" text2="BOOKS" />
      <OurBooks/>
    </div>
  )
}

export default Home