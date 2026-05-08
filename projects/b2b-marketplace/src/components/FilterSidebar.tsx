import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES, ATTRIBUTES, DELIVERY_OPTIONS } from '../data/mockData';

export function FilterSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Category: true,
    Attributes: true,
    Price: true,
    Delivery: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const Accordion = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="border-b border-slate-100 py-4">
      <button 
        className="flex items-center justify-between w-full text-left font-semibold text-slate-800"
        onClick={() => toggleSection(title)}
      >
        <span>{title}</span>
        {openSections[title] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {openSections[title] && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-1">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-64 flex-shrink-0 pr-6">
      <div className="sticky top-24 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          <button className="text-xs font-medium text-brand-600 hover:text-brand-700">Clear all</button>
        </div>

        <Accordion title="Category">
          <div className="space-y-2">
            {CATEGORIES.map(category => (
              <label key={category} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center w-5 h-5 mr-3 border border-slate-300 rounded bg-white group-hover:border-brand-500 transition-colors">
                  <input type="checkbox" className="peer sr-only" defaultChecked={category === 'All'} />
                  <div className="hidden peer-checked:block w-3 h-3 bg-brand-500 rounded-sm"></div>
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900">{category}</span>
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Attributes">
          <div className="space-y-2">
            {ATTRIBUTES.map(attr => (
              <label key={attr} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center w-5 h-5 mr-3 border border-slate-300 rounded bg-white group-hover:border-brand-500 transition-colors">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="hidden peer-checked:block w-3 h-3 bg-brand-500 rounded-sm"></div>
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900">{attr}</span>
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Price">
          <div className="px-1 py-2">
            <input type="range" min="0" max="5000" className="w-full accent-brand-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>฿0</span>
              <span>฿5,000+</span>
            </div>
          </div>
        </Accordion>

        <Accordion title="Delivery">
          <div className="space-y-2">
            {DELIVERY_OPTIONS.map(opt => (
              <label key={opt} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center w-5 h-5 mr-3 border border-slate-300 rounded-full bg-white group-hover:border-brand-500 transition-colors">
                  <input type="radio" name="delivery" className="peer sr-only" />
                  <div className="hidden peer-checked:block w-2.5 h-2.5 bg-brand-500 rounded-full"></div>
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900">{opt}</span>
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Stock Status">
          <label className="flex items-center group cursor-pointer mt-1">
            <div className="relative flex items-center justify-center w-10 h-5 mr-3 bg-slate-200 rounded-full transition-colors peer-checked:bg-brand-500">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
            <span className="text-sm text-slate-600 font-medium">In Stock Only</span>
          </label>
        </Accordion>
      </div>
    </div>
  );
}
