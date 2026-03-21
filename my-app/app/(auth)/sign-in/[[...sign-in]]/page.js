import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex-grow flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Artistic Elements (Editorial Aesthetic) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-container/10 rounded-full blur-[100px]"></div>
      
      <div className="w-full max-w-md z-10">
        {/* Brand Identity */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-editorial-gradient mb-6 shadow-2xl">
            <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Digital Editorial</h1>
          <p className="text-on-surface-variant font-medium tracking-tight">Curating the future of social connection.</p>
        </div>

        {/* Clerk SignIn Component Styled with custom CSS in globals.css if needed, 
            but for now we wrap it in the design card */}
        <div className="flex justify-center">
            <SignIn 
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "bg-surface-container-low border border-outline-variant/10 shadow-2xl rounded-xl",
                        headerTitle: "font-headline text-2xl font-bold text-on-surface",
                        headerSubtitle: "text-on-surface-variant",
                        formButtonPrimary: "bg-editorial-gradient border-none hover:opacity-90 transition-all",
                        footerActionLink: "text-primary hover:text-primary/80 font-bold",
                        socialButtonsBlockButton: "bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-colors text-on-surface",
                        formFieldInput: "bg-surface-container-highest border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary/50",
                        formFieldLabel: "text-on-surface-variant font-semibold",
                    }
                }}
            />
        </div>
      </div>
    </main>
  );
}
