"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import SelectPlan from '../onboarding/steps/SelectPlan';

export default function PricingPage() {
    const router = useRouter();

    const handleNext = (data: any) => {
        router.push(`/onboarding?plan=${data.plan}`);
    };

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SelectPlan 
                onNext={handleNext}
                onBack={handleBack}
            />
        </div>
    );
}
