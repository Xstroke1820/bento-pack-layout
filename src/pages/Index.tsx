import { useState, useEffect } from "react";
import { BentoGrid } from "@/components/BentoGrid";
import { generateBentoLayout, ImageItem, LayoutItem } from "@/utils/bentoLayout";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

// Sample images with various aspect ratios
const SAMPLE_IMAGES: ImageItem[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba", width: 1200, height: 800 },
  { id: "2", src: "https://images.unsplash.com/photo-1682687221038-404cb8830901", width: 800, height: 1200 },
  { id: "3", src: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538", width: 1000, height: 1000 },
  { id: "4", src: "https://images.unsplash.com/photo-1682687220923-c58b9a4592ae", width: 1600, height: 900 },
  { id: "5", src: "https://images.unsplash.com/photo-1682687221080-5cb261c645cb", width: 900, height: 1600 },
  { id: "6", src: "https://images.unsplash.com/photo-1682687220566-5599dbbebf11", width: 1200, height: 800 },
  { id: "7", src: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1", width: 800, height: 800 },
  { id: "8", src: "https://images.unsplash.com/photo-1682687220198-88e9bdea9931", width: 1400, height: 1000 },
  { id: "9", src: "https://images.unsplash.com/photo-1682687220795-796d3f6f7000", width: 1000, height: 1400 },
  { id: "10", src: "https://images.unsplash.com/photo-1682687220801-eef408f95d71", width: 1200, height: 900 },
  { id: "11", src: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6cb", width: 900, height: 1200 },
  { id: "12", src: "https://images.unsplash.com/photo-1682695794947-17061dc284dd", width: 1100, height: 800 },
];

const Index = () => {
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const regenerateLayout = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newLayout = generateBentoLayout(SAMPLE_IMAGES, 6, true);
      setLayout(newLayout);
      setIsGenerating(false);
    }, 300);
  };

  useEffect(() => {
    regenerateLayout();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Smart Bento Grid Layout
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Intelligent grid system that packs images efficiently based on their aspect ratios,
            minimizing gaps while maintaining visual balance.
          </p>
          <Button
            onClick={regenerateLayout}
            disabled={isGenerating}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Shuffle className={`h-5 w-5 ${isGenerating ? "animate-spin" : ""}`} />
            Regenerate Layout
          </Button>
        </header>

        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
          <BentoGrid items={layout} columns={6} />
        </div>

        <div className="mt-16 max-w-3xl mx-auto space-y-6">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">How It Works</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Each image's aspect ratio is analyzed to determine the best grid block size (1x1, 2x1, 1x2, or 2x2)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary font-bold">2.</span>
                <span>Items are placed sequentially, trying the best-fit size first</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">3.</span>
                <span>If a block doesn't fit, smaller sizes are tried to fill gaps efficiently</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>The algorithm ensures no large empty spaces remain in the grid</span>
              </li>
            </ul>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Layout Output</h2>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
              <code>{JSON.stringify(layout.slice(0, 3), null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
