import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NavigationBar from "@/components/navigation-bar";
import Home from "@/pages/home";
import PostFavor from "@/pages/post-favor";
import Profile from "@/pages/profile";
import FavorDetails from "@/pages/favor-details";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/post" component={PostFavor} />
        <Route path="/profile" component={Profile} />
        <Route path="/favors/:id" component={FavorDetails} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;