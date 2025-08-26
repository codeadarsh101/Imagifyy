import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import {motion} from 'framer-motion'
import { AppContext } from "../context/AppContext";
import { useContext } from "react";


const Result = () => {

  const [image, setImage] = useState(assets.sample_img_1)
  const [isImageLoaded, setIsImageLoaded] = useState(false) // loading bar..
  const [loading, setLoading] = useState(false); //Loading Icon..
  const [input, setInput] = useState('')
    
  const {generateImage} = useContext(AppContext) // use it..

  const onSubmitHandler = async(e)=>{
      e.preventDefault();
      setLoading(true)

      if(input){
        const image=await generateImage(input)
        if(image){
          setIsImageLoaded(true)
          setImage(image)
        }
      }
      setLoading(false)


  }


  return (
    <motion.form 
     initial={{opacity:0.2 , y:100}}
     whileInView={{opacity:1,y:0}}
     transition={{duration:1}}
     viewport={{once:true}}
    onSubmit={onSubmitHandler} className="flex justify-center items-center flex-col min-h-[90vh]">
      <div>
        <div className="relative">
          <img src={image} alt="" className="max-w-sm rounded" />
          <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full' : 'w-0'}`} /></div>
        <p className={!loading ? 'hidden':''}>Loading...</p>
      </div>


     {!isImageLoaded && 

      <div className="flex w-full text-white max-w-xl bg-gray-700 text-sm p-0.5 mt-10 rounded-full">
        <input onChange={e=>setInput(e.target.value)} value={input}
         type="text"
          placeholder="Describe what you want to generate"
          className="flex-1 bg-transparent
          outline-none ml-8 max-sm:w-20"/>
        <button type="submit"
          className="bg-zinc-900 text-white py-4 px-6 sm:px-10 rounded-full"
        >Generate</button>
      </div>
   }

   {isImageLoaded && 
       <div className="flex justify-center gap-2 flex-wrap text-white text-sm p-0.5 mt-10 rounded-full">
       <p onClick={()=>{setIsImageLoaded(false)}}
       className="bg-violet-500 border text-black rounded-full cursor-pointer px-8 py-3
         border-zinc-900">Generate Another</p>

       <a href={image} download className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer">Download</a>
      </div>
    }

    </motion.form>
  );
};

export default Result;
