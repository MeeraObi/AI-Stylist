"use client";

import Shell from "@/components/Shell";
import SplashScreen from "@/components/Splash";
import OnboardingScreen from "@/components/Onboarding";
import StylistUpload from "@/components/StylistUpload";
import SignUp from "@/components/SignUp";
import SignIn from "@/components/SignIn";
import InitialCheck from "@/components/InitialCheck";
import Dashboard from "@/components/Dashboard";
import Wardrobe from "@/components/Wardrobe";
import ShopIndia from "@/components/ShopIndia";
import Grooming from "@/components/Grooming";
import Lookbook from "@/components/Lookbook";
import TrialRoom from "@/components/TrialRoom";
import StyleQuiz from "@/components/StyleQuiz";
import Results from "@/components/Results";
import { useStylistStore } from "@/store/use-stylist-store";

export default function Home() {
  const { currentScreen } = useStylistStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen />;
      case "onboarding":
        return <OnboardingScreen />;
      case "upload":
        return <StylistUpload />;
      case "initial-check":
        return <InitialCheck />;
      case "signup":
        return <SignUp />;
      case "signin":
        return <SignIn />;
      case "dashboard":
        return <Dashboard />;
      case "wardrobe":
        return <Wardrobe />;
      case "shop":
        return <ShopIndia />;
      case "grooming":
        return <Grooming />;
      case "lookbook":
        return <Lookbook />;
      case "trial":
        return <TrialRoom />;
      case "quiz":
        return <StyleQuiz />;
      case "results":
        return <Results />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <Shell>
      {renderScreen()}
    </Shell>
  );
}
