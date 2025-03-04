import { type Favor } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Dog, CircleDot, ShoppingBag, Wrench } from "lucide-react";
import { useLocation } from "wouter";

const categoryIcons = {
  delivery: Package,
  "pet-care": Dog,
  cleaning: CircleDot,
  errands: ShoppingBag,
  handyman: Wrench,
};

interface FavorCardProps {
  favor: Favor;
  onHelp: (favorId: number) => void;
}

export default function FavorCard({ favor, onHelp }: FavorCardProps) {
  const [, navigate] = useLocation();
  const Icon = categoryIcons[favor.category as keyof typeof categoryIcons];

  const handleHelp = () => {
    onHelp(favor.id);
    navigate(`/favors/${favor.id}`);
  };

  return (
    <Card className="bg-[#BBDEFB] shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5" />}
              <h3 className="font-medium">{favor.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">{favor.location}</p>
          </div>
          <div className="bg-[#4CAF50] text-white rounded-full w-12 h-12 flex items-center justify-center">
            ${favor.price}
          </div>
        </div>
        <Button
          onClick={handleHelp}
          className="w-full mt-4 bg-[#FFCA28] hover:bg-[#FFB300] text-black"
        >
          Help Out
        </Button>
      </CardContent>
    </Card>
  );
}