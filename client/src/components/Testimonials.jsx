import React from "react";
import { assets, testimonialsData } from "../assets/assets";
import {motion} from "framer-motion"


const Testimonials = () => {

  return (

    <motion.div 
      initial={{opacity:0.2,y:100}}
      whileInView={{opacity:1,y:0}}
      transition={{duration:1}}
      viewport={{once:true}}
    className="flex flex-col items-center justify-center my-20 py-12">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Customer testimonials
      </h1>
      <p className="text-gray-500 mb-8 ">What Our Users Are Saying...</p>

      <div className="flex flex-wrap gap-6">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={index}
            className="bg-blue-50 p-12 rounded-lg shadow-md order w-80 m-auto cursor-pointer hover:scale-105 transition-all"
          >
            <div>
              <div className="flex justify-center">
                <img src={testimonial.image} className="w-14" />
              </div>
              <h2 className="flex justify-center items-centertext-xl font-semibold mt-3">
                {testimonial.name}
              </h2>
              <p className="flex justify-center items-centertext-gray-500 mb-4">
                {testimonial.role}
              </p>
              <div className="flex mb-4 justify-center">
                {Array(testimonial.stars)
                  .fill()
                  .map((item, index) => (
                    <img key={index} src={assets.rating_star} />
                  ))}
              </div>
              <p className="text-gray-500 text-sm text-center">
                {testimonial.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonials;
