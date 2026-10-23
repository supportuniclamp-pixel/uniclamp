'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutUsExpandable() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4 copy text-base leading-relaxed">
      <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
        Pipe Supports and Fixing Systems Private Limited
      </div>

      <div className="font-semibold text-primary">
        Engineered for Strength. Designed for Reliability. Built on Trust.
      </div>

      <p>
        Established in 2026, <strong>Pipe Supports and Fixing Systems Private Limited</strong> is focused on providing dependable, high-quality pipe support and fixing solutions for industrial, commercial, and infrastructure applications. We aim to meet the evolving needs of modern piping installations through reliable products, customer-focused service, and a commitment to quality.
      </p>

      <p>
        Our product range includes <strong>Pipe Clamps, Strut Channels and Accessories, Rubber Support Inserts, and Anti-Vibration Products</strong>. Our solutions are intended to support secure pipe installations, facilitate efficient mounting and fixing, and help address vibration and noise-related challenges in piping systems.
      </p>

      {/* Expandable full text */}
      <div
        className={`space-y-4 overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[1600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p>
          We recognize that every project has unique technical and operational requirements. That is why we emphasize product functionality, durability, dimensional accuracy, and ease of installation. Our objective is to help customers achieve efficient installation, dependable performance, and long-term value through suitable pipe support and fixing solutions.
        </p>

        <p>
          At Pipe Supports and Fixing Systems Private Limited, we believe that strong business relationships are built on trust, transparency, and consistent service. We strive to understand our customers' requirements and provide practical solutions that align with their project needs.
        </p>

        <p>
          As a growing company, we are committed to continuous improvement, product development, and building lasting partnerships with contractors, consultants, distributors, OEMs, and industrial customers.
        </p>

        <p>
          Our ambition is to become a trusted partner in the pipe supports and fixing systems industry by consistently focusing on quality, reliability, innovation, and customer satisfaction.
        </p>

        <div className="p-4 rounded-lg bg-muted/70 border border-primary/15">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Our Core Strengths</h4>
          <ul className="space-y-2.5 list-none pl-0 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
              <span><strong>Quality Commitment:</strong> Focus on dependable products and consistent quality.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
              <span><strong>Product Range:</strong> Pipe clamps, strut channels, accessories, rubber support inserts, and anti-vibration products.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
              <span><strong>Customer Focus:</strong> Solutions tailored to project requirements and application needs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
              <span><strong>Reliable Support:</strong> Responsive service and a commitment to long-term business relationships.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
              <span><strong>Continuous Improvement:</strong> An ongoing focus on better products, processes, and customer value.</span>
            </li>
          </ul>
        </div>

        <div className="p-3.5 rounded-lg bg-primary text-primary-foreground text-xs md:text-sm font-semibold tracking-wide text-center">
          Pipe Supports and Fixing Systems Private Limited — Your Trusted Partner for Pipe Support and Fixing Solutions.
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border-primary/30 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-xs tracking-wider uppercase inline-flex items-center gap-2"
        >
          {isExpanded ? (
            <>
              View Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Read Full Overview <ChevronDown size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
