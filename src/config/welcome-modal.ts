import { WA_LINKS } from "@/data/results";

/** Settings for the homepage welcome pop-up (see components/WelcomeModal.tsx). */
export const welcomeModalConfig = {
  enabled: true,
  expiresOn: "2026-08-30",
  storageKey: "welcome-modal-dismissed",
  // TODO: swap src with the actual competition poster
  image: {
    src: "/images/welcome-popup.webp",
    alt: "EISD Laboratory competition poster",
  },
  buttonText: "Learn More",
  buttonHref: "https://linktr.ee/eisdcompetition",
};
