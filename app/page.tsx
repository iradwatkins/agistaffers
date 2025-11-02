import HeroRotator from '@/components/home/HeroRotator'
import ServicesSection from '@/components/home/ServicesSection'
import Image from 'next/image'

const features = [
  {
    title: "Built for Scale",
    description: "Our AI solutions grow with your business. Start small, scale infinitely.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
  },
  {
    title: "Human-Like Intelligence",
    description: "AI that understands context, nuance, and your brand voice perfectly.",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80"
  },
  {
    title: "Always Learning",
    description: "Our AI systems continuously improve and adapt to your needs.",
    imageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&q=80"
  }
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Unsplash Background */}
      <div
        className="relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <HeroRotator />
      </div>

      {/* Services Section */}
      <ServicesSection />

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why AGI Staffers?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're not just another AI vendor. We're your partner in building a smarter, more efficient business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="group">
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Client Testimonials */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by Businesses Like Yours
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-background rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
                    alt="Client testimonial"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">CEO, TechStart Inc</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-4">★★★★★</div>
              <p className="text-muted-foreground">
                "AGI Staffers transformed our customer service. We went from 12-hour response times to instant, accurate AI responses. Our customer satisfaction jumped 45% in just 3 months."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-background rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"
                    alt="Client testimonial"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Founder, EcoShop</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-4">★★★★★</div>
              <p className="text-muted-foreground">
                "The pre-built store was live in 48 hours exactly as promised. Sales started flowing immediately. Best investment we made this year - ROI in the first month!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-background rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
                    alt="Client testimonial"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">James Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Director, AutomateNow</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-4">★★★★★</div>
              <p className="text-muted-foreground">
                "Their workflow automation saved us 200+ hours per month. Tasks that took our team days now complete automatically overnight. Game changer!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section with Images */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Real Results, Real Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Here's how we've helped businesses scale with AI
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Result 1 */}
            <div className="group">
              <div className="relative h-80 rounded-lg overflow-hidden mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
                  alt="E-commerce growth dashboard"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-4xl font-bold mb-2">340% Revenue Growth</div>
                  <div className="text-lg opacity-90">E-commerce Store in 6 Months</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">From Zero to $50K/Month</h3>
              <p className="text-muted-foreground">
                Fashion retailer launched with our pre-built store solution. AI-powered product recommendations and automated marketing drove explosive growth.
              </p>
            </div>

            {/* Result 2 */}
            <div className="group">
              <div className="relative h-80 rounded-lg overflow-hidden mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
                  alt="Analytics dashboard showing improvement"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-4xl font-bold mb-2">85% Time Saved</div>
                  <div className="text-lg opacity-90">Marketing Agency Automation</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">200+ Hours Reclaimed Monthly</h3>
              <p className="text-muted-foreground">
                Marketing agency automated client reporting, social media scheduling, and content generation. Team now focuses on strategy, not busy work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About/Team Section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                alt="AGI Staffers Team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Meet Your AI Dream Team
              </h2>
              <p className="text-xl text-muted-foreground">
                We're a team of AI engineers, automation specialists, and digital strategists who believe technology should work for you, not the other way around.
              </p>
              <p className="text-lg text-muted-foreground">
                Our mission is simple: give every business access to enterprise-grade AI solutions without the enterprise price tag or complexity. Whether you're a solopreneur or scaling a startup, we're here to help you compete with the big guys.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Businesses Served
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    10k+
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Hours Automated
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    98%
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 px-4 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the AI Revolution?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Stop working harder. Start working smarter with AI solutions built specifically for your business.
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
            Get Started Today
          </button>
        </div>
      </section>
    </main>
  )
}
