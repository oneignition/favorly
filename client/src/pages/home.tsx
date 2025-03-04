import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavorCard from "@/components/favor-card";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "all",
  "delivery",
  "pet-care",
  "cleaning",
  "errands",
  "handyman",
];

const dummyFavors = [
  {
    id: 1,
    title: "Pick groceries",
    price: "15",
    location: "Downtown Market",
    category: "delivery",
    status: "open",
    userId: 1,
  },
  {
    id: 2,
    title: "Walk my dog",
    price: "20",
    location: "Central Park",
    category: "pet-care",
    status: "open",
    userId: 1,
  },
  {
    id: 3,
    title: "Fix leaky faucet",
    price: "35",
    location: "123 Main St",
    category: "handyman",
    status: "open",
    userId: 1,
  },
];

export default function Home() {
  const [category, setCategory] = useState("all");
  const { toast } = useToast();

  const { data: favors, isLoading } = useQuery({
    queryKey: ["/api/favors", category],
    queryFn: async () => {
      const url = category === "all" 
        ? "/api/favors"
        : `/api/favors?category=${category}`;
      const res = await fetch(url);
      return res.json();
    },
  });

  const handleHelp = async (favorId: number) => {
    toast({
      title: "Coming soon!",
      description: "This feature is not yet implemented.",
    });
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 pb-20 pt-4">
      <h1 className="text-2xl font-bold text-[#4CAF50] mb-4">Favorly</h1>

      <Input
        type="search"
        placeholder="Search favors..."
        className="mb-4"
      />

      <Tabs value={category} onValueChange={setCategory} className="mb-6">
        <TabsList className="w-full overflow-x-auto">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="capitalize text-[#2196F3]"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="bg-[#B0BEC5] h-48 mb-6 rounded-lg flex items-center justify-center">
        <span className="text-gray-600">Map Placeholder</span>
      </div>

      <h2 className="text-xl font-semibold mb-4">Nearby Favors</h2>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {(favors?.length > 0 ? favors : dummyFavors).map((favor) => (
            <FavorCard
              key={favor.id}
              favor={favor}
              onHelp={handleHelp}
            />
          ))}
        </div>
      )}
    </div>
  );
}