import FloatingNavbar from "@/components/floating-navbar"
import Footer from "@/components/footer"
import { Target, Eye } from "lucide-react"

export default function AboutPage() {
  const milestones = [
    { year: "2020", title: "Company Founded", description: "Started with a vision to revolutionize maintenance" },
    { year: "2021", title: "IoT Integration", description: "Launched predictive maintenance technology" },
    { year: "2022", title: "Regional Expansion", description: "Expanded services across Latin America" },
    { year: "2023", title: "10,000+ Clients", description: "Reached major milestone in customer satisfaction" },
  ]

  const faqs = [
    {
      question: "What areas do you serve?",
      answer:
        "We provide services across major cities in Latin America, with a focus on Argentina, Brazil, Chile, and Colombia.",
    },
    {
      question: "How does IoT monitoring work?",
      answer:
        "We install smart sensors that continuously monitor your systems and alert us to potential issues before they become problems.",
    },
    {
      question: "What is your response time?",
      answer: "We offer 24/7 support with emergency response times of under 2 hours for critical issues.",
    },
    {
      question: "Do you offer maintenance contracts?",
      answer: "Yes, we offer flexible maintenance contracts with preventive care plans tailored to your needs.",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <FloatingNavbar />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              About <span className="text-[#FF6B35]">DOLT</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing maintenance services in Latin America by combining expert technicians with
              cutting-edge IoT technology and predictive analytics.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-[#FF6B35]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-neutral-600 leading-relaxed">
                To provide reliable, technology-driven maintenance solutions that prevent problems before they occur,
                ensuring maximum uptime and peace of mind for our clients across Latin America.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-[#FF6B35]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-neutral-600 leading-relaxed">
                To become the leading maintenance platform in Latin America, setting new standards for predictive
                maintenance and customer service through innovation and excellence.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="bg-white rounded-2xl p-12 shadow-sm mb-20">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-neutral-600 leading-relaxed">
              <p>
                DOLT was founded in 2020 with a simple yet powerful idea: maintenance shouldn't be reactive. By the time
                something breaks, it's already too late and too expensive.
              </p>
              <p>
                Our founders, experienced engineers and technicians, saw an opportunity to combine traditional
                maintenance expertise with modern IoT technology. This vision led to the creation of a platform that
                predicts issues before they happen.
              </p>
              <p>
                Today, we serve thousands of homes and businesses across Latin America, preventing costly breakdowns and
                ensuring 99.9% uptime for our clients. Our team of certified technicians and data scientists work
                together to deliver the most advanced maintenance solutions in the region.
              </p>
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="text-4xl font-bold text-[#FF6B35] mb-3">{milestone.year}</div>
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-neutral-600 text-sm">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                  <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
