import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon, Settings, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";

export default function Profile() {
  const { toast } = useToast();
  const userId = 1; // Hardcoded for demo

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/users", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      return res.json();
    },
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["/api/reviews", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/reviews`);
      return res.json();
    },
  });

  const handleMessage = () => {
    toast({
      title: "Coming soon!",
      description: "Messaging feature is not yet implemented.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Coming soon!",
      description: "Logout feature is not yet implemented.",
    });
  };

  if (isLoadingUser || isLoadingReviews) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 pb-20 pt-4">
      <h1 className="text-2xl font-bold mb-6">Alex</h1>

      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-48 h-48">
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <Button 
          variant="outline" 
          className="mt-4 bg-[#2196F3] text-white hover:bg-[#1976D2] rounded-full h-10"
        >
          Upload Photo
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold mb-2">About Me</h2>
          <Textarea
            placeholder="Hi, I'm Alex! Love helping with pet care and errands in Downtown."
            className="bg-[#BBDEFB]"
            maxLength={200}
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Stats</h2>
          <p className="text-[#4CAF50] font-medium">
            Asked: 10 | Done: 5 | Earned: $50
          </p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Pending Favors</h2>
          <Card className="bg-[#BBDEFB]">
            <CardContent className="p-3">
              <p className="font-medium">Dog walk - $10</p>
              <p className="text-sm text-gray-600">Claimed by Jamie</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Skills</h2>
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-[#4CAF50] p-1.5">Pet Care 🐶</Badge>
            <Badge className="bg-[#4CAF50] p-1.5">Delivery 🚚</Badge>
            <Badge className="bg-[#4CAF50] p-1.5">Errands</Badge>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Reviews</h2>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4].map((i) => (
                <StarIcon key={i} className="w-4 h-4 text-[#FFCA28]" fill="currentColor" />
              ))}
              <StarIcon className="w-4 h-4 text-[#FFCA28]" fill="currentColor" strokeWidth={0.5} />
            </div>
            <span>4.5/5</span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <Card className="bg-[#BBDEFB]">
              <CardContent className="p-3">
                <p>Great walker!</p>
                <p className="text-sm text-gray-600">Mar 1, 2025</p>
              </CardContent>
            </Card>
            <Card className="bg-[#BBDEFB]">
              <CardContent className="p-3">
                <p>Fast delivery</p>
                <p className="text-sm text-gray-600">Feb 28, 2025</p>
              </CardContent>
            </Card>
          </div>
          <Button variant="link" className="text-[#FFCA28] mt-2">
            See All
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleMessage}
            className="w-full bg-[#2196F3] hover:bg-[#1976D2] h-10"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button
            variant="outline"
            className="w-full text-[#757575] h-10"
            onClick={() => {}}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-[#FFCA28] hover:bg-[#FFB300] text-black h-10"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}