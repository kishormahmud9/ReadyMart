import HeroCarousel from "@/components/home/HeroCarousel";
import CategorySection from "@/components/home/CategorySection";
import OfferSection from "@/components/home/OfferSection";
import ProductSection from "@/components/home/ProductSection";

export default function Home() {
    return (
        <div className="flex flex-col">
            <HeroCarousel />
            <CategorySection />
            <OfferSection />
            <ProductSection />
        </div>
    );
}
