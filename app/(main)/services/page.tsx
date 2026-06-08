"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SelectPlan from '../onboarding/steps/SelectPlan';

export default function ServicesPage() {
    const router = useRouter();
    const handleNext = (data: any) => {
        router.push(`/onboarding?plan=${data.plan}`);
    };

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-red-200 bg-slate-50">
            <SelectPlan 
                onNext={handleNext}
                onBack={handleBack} 
            />
        </div>
    );
}