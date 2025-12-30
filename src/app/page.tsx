import { EmailGenerator } from "@/components/EmailGenerator";
import { Mail, Shield, Zap, Lock, Globe, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <Mail className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">MailTurbo</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">How it works</a>
            <a href="#extension" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Extension</a>
          </div>
          <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black">
            Get Extension
          </button>
        </div>
      </nav>

      <main className="relative pt-32 pb-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 -z-10 h-[600px] w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white dark:from-indigo-950/20 dark:via-black dark:to-black"></div>
        
        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400 mb-8">
            <Sparkles className="h-4 w-4" />
            <span>New: Chrome Extension Released</span>
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl">
            Temporary Email for <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Privacy Junkies.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Generate disposable email addresses instantly, receive messages in real-time, and keep your primary inbox clutter-free. No registration, no tracking, just privacy.
          </p>
        </div>

        {/* App Preview / Main Tool */}
        <div className="mx-auto mt-20 max-w-7xl px-6">
          <EmailGenerator />
        </div>

        {/* Features Section */}
        <div id="features" className="mx-auto mt-40 max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">Built for the Modern Web</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Everything you need to stay anonymous online.</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Zap className="h-6 w-6 text-indigo-600" />,
                title: "Instant Generation",
                desc: "Get a fresh email address in under 100ms. No forms, no wait times."
              },
              {
                icon: <Shield className="h-6 w-6 text-indigo-600" />,
                title: "Anti-Spam Shield",
                desc: "Automatically filter out trackers and suspicious attachments before they reach you."
              },
              {
                icon: <Lock className="h-6 w-6 text-indigo-600" />,
                title: "Self-Destructing",
                desc: "Emails and accounts are automatically wiped after 24 hours of inactivity."
              },
              {
                icon: <Globe className="h-6 w-6 text-indigo-600" />,
                title: "Global Domains",
                desc: "Choose from multiple high-reputation domains to bypass common temp-mail filters."
              },
              {
                icon: <Mail className="h-6 w-6 text-indigo-600" />,
                title: "Rich Content",
                desc: "Full support for HTML emails, images, and attachments directly in your browser."
              },
              {
                icon: <Sparkles className="h-6 w-6 text-indigo-600" />,
                title: "Dark Mode Ready",
                desc: "Beautiful, eye-straining-free interface designed for both day and night use."
              }
            ].map((feature, i) => (
              <div key={i} className="group relative rounded-3xl border border-zinc-100 p-8 transition-all hover:border-indigo-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-zinc-900 dark:text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <div id="how-it-works" className="mx-auto mt-40 max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">How it Works</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Privacy in three simple steps.</p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-zinc-100 dark:bg-zinc-800 lg:block"></div>
            
            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Generate",
                  desc: "One click to get a unique, anonymous email address instantly.",
                  icon: <Zap className="h-6 w-6" />
                },
                {
                  step: "02",
                  title: "Receive",
                  desc: "Use your new email anywhere. Messages appear in your inbox in real-time.",
                  icon: <Mail className="h-6 w-6" />
                },
                {
                  step: "03",
                  title: "Dispose",
                  desc: "Your email and data are automatically deleted after 24 hours.",
                  icon: <Lock className="h-6 w-6" />
                }
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                      {item.icon}
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extension Section */}
        <div id="extension" className="mx-auto mt-40 max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-20 text-white sm:px-16 lg:py-24">
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Take Privacy Everywhere</h2>
              <p className="mt-6 text-lg text-indigo-100">
                Install our Chrome extension to generate and auto-fill temporary emails directly in any website's registration form.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button className="rounded-full bg-white px-8 py-4 text-sm font-bold text-indigo-600 shadow-xl transition-transform hover:scale-105">
                  Install Chrome Extension
                </button>
                <button className="rounded-full border-2 border-indigo-400 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-indigo-500">
                  View on GitHub
                </button>
              </div>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-purple-500/50 blur-3xl"></div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Mail className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-zinc-900 dark:text-white">MailTurbo</span>
          </div>
          <p className="text-sm text-zinc-500">© 2025 MailTurbo. Protecting your digital identity one email at a time.</p>
        </div>
      </footer>
    </div>
  );
}
