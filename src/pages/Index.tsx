import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { Stepper } from "@/components/wizard/Stepper";
import { IdentificationStep, VehicleData } from "@/components/wizard/IdentificationStep";
import { ForeignVehicleStep, ForeignData } from "@/components/wizard/ForeignVehicleStep";
import { VerificationStep } from "@/components/wizard/VerificationStep";
import { ReservationStep } from "@/components/wizard/ReservationStep";

type Path = "tunisian" | "foreign" | null;

const STEPS = [
  { id: 1, label: "Identification" },
  { id: 2, label: "Vérification" },
  { id: 3, label: "Réservation" },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [path, setPath] = useState<Path>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [foreignData, setForeignData] = useState<ForeignData | null>(null);
  const wizardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "VOLT · Réservation borne Tesla Tunisie";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Réservez votre borne de recharge Tesla en Tunisie. Identification OCR carte grise, vérification OTP sécurisée et 247 stations disponibles.');
  }, []);

  const scrollToWizard = () => {
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const startFlow = () => {
    setCurrentStep(0);
    setPath(null);
    setVehicleData(null);
    setForeignData(null);
    scrollToWizard();
  };

  const handleVehicleComplete = (data: VehicleData) => {
    setVehicleData(data);
    setPath("tunisian");
    setCurrentStep(1);
    scrollToWizard();
  };

  const handleForeignComplete = (data: ForeignData) => {
    setForeignData(data);
    setPath("foreign");
    setCurrentStep(1);
    scrollToWizard();
  };

  const handleVerificationComplete = () => {
    setCurrentStep(2);
    scrollToWizard();
  };

  const clientEmail = vehicleData?.email || foreignData?.email || "client@email.com";
  const clientPhone = foreignData?.telephone || "+216 22 345 678";
  const ownerName = vehicleData?.proprietaire || "Client";

  const vehicleInfo = vehicleData
    ? `${vehicleData.marque} ${vehicleData.modele} · ${vehicleData.immatriculation}`
    : foreignData
    ? `Véhicule étranger · ${foreignData.immatriculation} · ${foreignData.paysOrigine}`
    : "Véhicule vérifié";

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Navbar onStart={startFlow} />

      <main className="flex-1">
        <Hero onStart={startFlow} />

        <HowItWorks />

        <Pricing />

        {/* Wizard */}
        <section ref={wizardRef} id="stations" className="py-20 relative scroll-mt-20">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30">
                <span className="text-xs font-mono uppercase tracking-wider text-primary-glow">Wizard de réservation</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Démarrez votre <span className="text-gradient">session</span>
              </h2>
            </div>

            <Stepper steps={STEPS} current={currentStep} />

            <div className="animate-fade-in" key={`${currentStep}-${path}`}>
              {currentStep === 0 && path !== "foreign" && (
                <IdentificationStep
                  onComplete={handleVehicleComplete}
                  onForeign={() => setPath("foreign")}
                />
              )}
              {currentStep === 0 && path === "foreign" && (
                <ForeignVehicleStep
                  onComplete={handleForeignComplete}
                  onBack={() => setPath(null)}
                />
              )}
              {currentStep === 1 && (
                <VerificationStep
                  defaultEmail={clientEmail}
                  defaultPhone={clientPhone}
                  ownerName={ownerName}
                  onComplete={handleVerificationComplete}
                  onBack={() => setCurrentStep(0)}
                />
              )}
              {currentStep === 2 && (
                <ReservationStep
                  vehicleInfo={vehicleInfo}
                  onConfirm={startFlow}
                  onBack={() => setCurrentStep(1)}
                />
              )}
            </div>
          </div>
        </section>

        <Support />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
