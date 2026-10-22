"use client";
import { useState } from 'react';
import { ArrowUpRight, Building2, Mail, Wrench, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { Layout, Hero, Heading } from '@/components/site';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/site-data';

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    product: 'General enquiry',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          company: '',
          email: '',
          phone: '',
          subject: '',
          product: 'General enquiry',
          message: '',
        });
      } else {
        setErrorMsg(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Hero
        label="LET’S TALK"
        title="Great projects start with a conversation."
        description="Have a project, product requirement or technical question? Let’s find the right solution together."
      />
      <section className="section">
        <div className="container split items-start">
          <div>
            <Heading label="GET IN TOUCH" title="How can we help?" />
            <p className="copy max-w-md">
              Tell us what you’re working on. From product selection to project-specific requirements, we’ll help you take the next step.
            </p>
            {[
              {
                Icon: Building2,
                title: 'PIPE SUPPORTS & FIXING SYSTEMS PVT LTD',
                copy: 'Primary Business: Pipe Clamp Manufacturing & Engineered Fixing Systems. Providing high-performance industrial support solutions.',
              },
              {
                Icon: Mail,
                title: 'Business Email & Correspondence',
                copy: (
                  <span>
                    Direct enquiries:{' '}
                    <a
                      href="mailto:pipesupportsystems@gmail.com"
                      className="text-primary font-semibold underline underline-offset-2 hover:text-secondary transition-colors"
                    >
                      pipesupportsystems@gmail.com
                    </a>
                  </span>
                ),
              },
              {
                Icon: Wrench,
                title: 'Registered Office Address',
                copy: 'F-C/705 Bhagirath Residency, Ganesh Nagar, Badlapur E.D., Ambarnath, Thane – 421503, Maharashtra, India.',
              },
            ].map((c, idx) => (
              <div className="contact-detail" key={idx}>
                <c.Icon size={25} />
                <div>
                  <h3>{c.title}</h3>
                  <p className="copy">{c.copy}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            {submitted ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4 animate-fade-up">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} className="text-primary animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                  <Sparkles size={20} className="text-secondary" />
                  <span className="text-shimmer">Enquiry Saved Successfully!</span>
                </h3>
                <p className="copy max-w-md mx-auto">
                  Thank you for reaching out. Your enquiry has been securely logged in our system. Our engineering and project team will review your requirements and respond shortly.
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="hover-lift"
                  >
                    Send Another Message <ArrowUpRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <label className="field">
                  Full Name *
                  <input
                    name="fullName"
                    required
                    placeholder="Your full name"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </label>
                <label className="field">
                  Company Name
                  <input
                    name="company"
                    placeholder="Your company"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </label>
                <label className="field">
                  Email Address *
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </label>
                <label className="field">
                  Phone Number
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </label>
                <label className="field field-full">
                  Subject *
                  <input
                    name="subject"
                    required
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </label>
                <label className="field field-full">
                  Product / Service
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                  >
                    <option value="General enquiry">General enquiry</option>
                    {products.map(p => (
                      <option key={p.slug} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </label>
                <label className="field field-full">
                  Your Message *
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your project and requirements…"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </label>

                {errorMsg && (
                  <div className="field-full p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                    {errorMsg}
                  </div>
                )}

                <div className="field-full">
                  <Button
                    variant="brand"
                    size="lg"
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 hover-lift"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Enquiry</span>
                        <ArrowUpRight size={16} />
                      </>
                    )}
                  </Button>
                  <p className="notice">
                    Your details are securely delivered to our technical team.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
