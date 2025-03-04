import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function FavorDetails() {
  const [location] = useLocation();
  const { toast } = useToast();
  const favorId = location.split('/')[2];

  const { data: favor, isLoading } = useQuery({
    queryKey: ["/api/favors", favorId],
    queryFn: async () => {
      const res = await fetch(`/api/favors/${favorId}`);
      return res.json();
    },
  });

  const handleUpload = () => {
    toast({
      title: "Coming soon!",
      description: "Photo upload feature is not yet implemented.",
    });
  };

  const handleMarkDone = () => {
    toast({
      title: "Coming soon!",
      description: "Mark as done feature is not yet implemented.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 pb-20 pt-4">
      <Card className="bg-[#BBDEFB] mb-6">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">{favor?.title}</h1>
          <p className="text-gray-600 mb-4">{favor?.location}</p>
          <div className="bg-[#4CAF50] text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
            ${favor?.price}
          </div>
          <p className="text-gray-700 mb-4">Status: {favor?.status}</p>
          {favor?.helperId && <p className="text-gray-700">Claimed by Jamie</p>}
        </CardContent>
      </Card>

      <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-6">
        <span className="text-gray-600">Photo Placeholder</span>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleUpload}
          className="w-full bg-[#2196F3] hover:bg-[#1976D2] h-10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Proof
        </Button>
        <Button
          onClick={handleMarkDone}
          className="w-full bg-[#FFCA28] hover:bg-[#FFB300] text-black h-10"
        >
          Mark as Done
        </Button>
      </div>
    </div>
  );
}
