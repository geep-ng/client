'use client'
import useUser from '@/hooks/useUser';
import PlansGrid from '@/shared/components/pricing/PlanGrid'
import React from 'react'

const Page = () => {

    const { user } = useUser();
    if (!user) return <p className='text-center mt-20'>Loading...</p>
  return (
    <PlansGrid userId={user._id}  />
  )
}

export default Page
