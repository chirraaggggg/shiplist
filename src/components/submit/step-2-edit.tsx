"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, CheckCircle2 } from "lucide-react";
import { ProductFormData } from "./types";
import Image from "next/image";

interface Step2Props {
  data: ProductFormData;
  onNext: (data: Partial<ProductFormData>) => void;
  onBack: () => void;
}

const CATEGORIES = [
  "Developer Tools",
  "Productivity",
  "SaaS",
  "AI",
  "Design Tools",
  "Marketing",
  "Fintech",
  "Health & Fitness",
  "Other",
];

const PRICING_OPTIONS = [
  { value: "free", label: "Free", desc: "Completely free to use" },
  { value: "freemium", label: "Freemium", desc: "Free tier with paid options" },
  { value: "paid", label: "Paid", desc: "Requires payment to use" },
  { value: "open_source", label: "Open Source", desc: "Free & open source code" },
];

export function Step2Edit({ data, onNext, onBack }: Step2Props) {
  const [formData, setFormData] = useState<ProductFormData>(data);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (formData.tags.length >= 5) return;
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Mock upload handlers for visual demonstration
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, favicon: url }));
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 5 - formData.screenshots.length);
      const urls = newFiles.map((f) => URL.createObjectURL(f));
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, ...urls],
      }));
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Review & Edit Details</h2>
        <p className="text-muted-foreground">
          We've drafted your listing using AI. Review, tweak, and add images to make it pop.
        </p>
      </div>

      <div className="space-y-8 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        {/* Logo and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div 
              className="h-24 w-24 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative group cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => logoInputRef.current?.click()}
            >
              {formData.favicon ? (
                <Image src={formData.favicon} alt="Logo" fill className="object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium">
                Change
              </div>
            </div>
            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
            <span className="text-xs text-muted-foreground font-medium">Product Logo</span>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Tagline <span className="text-muted-foreground font-normal ml-1">({60 - formData.tagline.length} chars left)</span>
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                maxLength={60}
                required
                className="w-full h-11 px-4 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
            className="w-full p-4 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y"
          />
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {formData.category && !CATEGORIES.includes(formData.category) && (
                <option value={formData.category}>{formData.category}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Tags <span className="text-muted-foreground font-normal ml-1">(Max 5)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
            {formData.tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter..."
                className="w-full h-11 px-4 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            )}
          </div>
        </div>

        {/* Pricing Type */}
        <div>
          <label className="block text-sm font-semibold mb-3">Pricing Model</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {PRICING_OPTIONS.map((option) => {
              const isSelected = formData.pricingType === option.value;
              return (
                <label
                  key={option.value}
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected ? "border-primary bg-primary/5" : "border-border/50 bg-background hover:border-border/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="pricingType"
                    value={option.value}
                    checked={isSelected}
                    onChange={handleChange}
                    className="sr-only"
                    required
                  />
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{option.desc}</span>
                  {isSelected && (
                    <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Screenshots */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold">Screenshots ({formData.screenshots.length}/5)</label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {formData.screenshots.map((src, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border/50 group">
                <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeScreenshot(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.screenshots.length < 5 && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-lg border-2 border-dashed border-border/60 bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs font-medium text-muted-foreground">Add Image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleScreenshotUpload}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-border/50 font-medium hover:bg-muted transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
