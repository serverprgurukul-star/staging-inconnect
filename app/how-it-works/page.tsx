import { Metadata } from "next";
import { HowItWorksAnimatedContent } from "@/components/how-it-works/animated-content";

export const metadata: Metadata = {
    title: "How NFC Business Cards Work | Instant Connect India",
    description:
        "Learn how Instant Connect NFC cards work and how to set them up.",
};

export default function HowItWorksPage() {
    return <HowItWorksAnimatedContent />;
}
