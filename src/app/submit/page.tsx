"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Step1Url } from "@/components/submit/step-1-url";
import { Step2Edit } from "@/components/submit/step-2-edit";
import { Step3Week } from "@/components/submit/step-3-week";
import { Step4Confirm } from "@/components/submit/step-4-confirm";
import { ProductFormData, defaultFormData } from "@/components/submit/types";

const STEPS = [
  { id: 1, name: "Paste URL" },
  { id: 2, name: "Review" },
  { id: 3, name: "Launch Week" },
  { id: 4, name: "Confirm" },
];

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  const handleNext = (stepData: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Stepper Header */}
        <div className="mb-12">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center justify-between">
              {STEPS.map((step, stepIdx) => (
                <li key={step.name} className={`relative ${stepIdx !== STEPS.length - 1 ? "pr-8 sm:pr-20 w-full" : ""}`}>
                  {stepIdx !== STEPS.length - 1 && (
                    <div className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full bg-border" aria-hidden="true">
                      <div 
                        className={`h-full bg-primary transition-all duration-500 ease-in-out ${currentStep > step.id ? 'w-full' : 'w-0'}`} 
                      />
                    </div>
                  )}
                  <div className="relative flex h-8 items-center group">
                    <span className="flex items-center gap-3">
                      <span className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                        currentStep > step.id 
                          ? "bg-primary border-primary" 
                          : currentStep === step.id 
                            ? "border-primary text-primary" 
                            : "border-muted bg-background text-muted-foreground"
                      }`}>
                        {currentStep > step.id ? (
                          <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                        ) : (
                          <span className="text-sm font-semibold">{step.id}</span>
                        )}
                      </span>
                      <span className={`hidden sm:block text-sm font-semibold tracking-wide ${
                        currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {step.name}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="bg-background rounded-3xl pb-12 transition-all">
          {currentStep === 1 && (
            <Step1Url onNext={handleNext} initialUrl={formData.url} />
          )}
          {currentStep === 2 && (
            <Step2Edit data={formData} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 3 && (
            <Step3Week data={formData} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 4 && (
            <Step4Confirm data={formData} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
}
