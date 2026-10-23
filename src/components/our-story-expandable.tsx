'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OurStoryExpandable() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4 copy text-base leading-relaxed">
      <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-1">
        Pipe Supports and Fixing Systems Private Limited | Established 2026
      </div>

      <p>
        At <strong>Pipe Supports and Fixing Systems Private Limited</strong>, our journey began in 2026 with a clear vision: to provide reliable, innovative, and high-quality pipe support and fixing solutions for modern industrial, commercial, and infrastructure projects.
      </p>

      <p>
        We understand that behind every efficient piping system lies the need for strength, stability, safety, and precision. With this understanding, we are committed to developing products that support critical piping installations while meeting the evolving needs of our customers and the industry.
      </p>

      {/* Expandable full content */}
      <div
        className={`space-y-4 overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p>
          Our product portfolio includes Pipe Clamps, Strut Channels and Accessories, Rubber Support Inserts, and Anti-Vibration Products. Each product category reflects our focus on functionality, durability, installation efficiency, and dependable performance across a wide range of applications.
        </p>

        <p>
          At Pipe Supports and Fixing Systems Private Limited, we believe that quality is the foundation of lasting relationships. We strive to combine engineering excellence, consistent product quality, and customer-focused service to deliver solutions that add value to every project we serve.
        </p>

        <p>
          As a growing company, we are driven by a commitment to continuous improvement, innovation, and responsible business practices. We aim to build long-term partnerships with contractors, consultants, distributors, manufacturers, and industry professionals by understanding their requirements and delivering solutions they can rely on.
        </p>

        <p>
          Looking ahead, our ambition is to establish ourselves as a trusted name in the pipe supports and fixing systems industry, recognized for product reliability, technical competence, and customer satisfaction.
        </p>

        <div className="p-4 rounded-lg bg-muted/70 border border-primary/15 font-semibold text-primary mt-2">
          Pipe Supports and Fixing Systems Private Limited — Supporting Every Connection. Strengthening Every Project.
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
              Read Full Story <ChevronDown size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
