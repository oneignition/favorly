import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertFavorSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PostFavor() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertFavorSchema),
    defaultValues: {
      title: "",
      price: "",
      location: "",
      category: "delivery",
      userId: 1, // Hardcoded for demo
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/favors", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your favor has been posted.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-screen-md mx-auto px-4 pb-20 pt-4">
      <h1 className="text-2xl font-bold text-[#4CAF50] mb-6">Ask for a Favor</h1>

      <Card className="bg-[#BBDEFB] rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutate(data))}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's the favor?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Deliver my book"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How much?</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="$ e.g., 5"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 123 Main St"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#FFCA28] hover:bg-[#FFB300] text-black rounded-lg h-10"
              >
                {isPending ? "Posting..." : "Post"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}