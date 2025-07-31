"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import YoutubeFill16 from './icons/ytIcon'
import InstagramFill16 from './icons/inIcon'
import YoutubeFill16Selected from './icons/selected/yt'
import InstagramFill16Selected from './icons/selected/in'
import YtSection from './sections/ytSection'
import InSection from './sections/inSection'

type ExtContainerProps = {
  selectedPlatform?: 'youtube' | 'instagram'
}

export default function ExtContainer({ selectedPlatform }: ExtContainerProps) {
  const router = useRouter()

  const handleYTClick = () => {
    router.push('/youtube')
  }

  const handleINClick = () => {
    router.push('/instagram')
  }

  return (
    <div className='flex'>
        <div className='flex flex-col bg-[#cccccc]/30 pl-8 justify-center'>
            <div className='w-16 h-48 rounded-3xl bg-gray-500/90 flex flex-col items-center justify-around'>
                <div onClick={handleYTClick} className="text-white cursor-pointer">
                  {selectedPlatform === 'youtube' ? <YoutubeFill16Selected size='32'/> : <YoutubeFill16 size='32'/>}
                </div>
                <div onClick={handleINClick} className="text-white cursor-pointer">
                  {selectedPlatform === 'instagram' ? <InstagramFill16Selected size='32' /> : <InstagramFill16 size='32' />}
                </div>
            </div>
        </div>
        <div className='flex-1 bg-[#CCCCCC]/30 pr-6 min-h-screen'>
          {selectedPlatform === 'youtube' && <YtSection />}
          {selectedPlatform === 'instagram' && <InSection />}
          {!selectedPlatform && (
            <div className='flex items-center justify-center h-full'>
              <p className='text-lg text-gray-700'>Select a platform to get started</p>
            </div>
          )}
        </div>
    </div>
  )
}

