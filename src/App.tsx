import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import TokenInfoProduct from "./pages/TokenInfoProduct.tsx";
import TokenInfoOrder from "./pages/TokenInfoOrder.tsx";
import AdProduct from "./pages/AdProduct.tsx";
import AdOrder from "./pages/AdOrder.tsx";
import TrendingBarProduct from "./pages/TrendingBarProduct.tsx";
import TrendingBarOrder from "./pages/TrendingBarOrder.tsx";
import CommunityTakeoverOrder from "./pages/CommunityTakeoverOrder.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/token-info" element={<TokenInfoProduct />} />
          <Route path="/product/token-info/order" element={<TokenInfoOrder />} />
          <Route path="/product/ad" element={<AdProduct />} />
          <Route path="/product/ad/order" element={<AdOrder />} />
          <Route path="/product/trending-bar-ad" element={<TrendingBarProduct />} />
          <Route path="/product/trending-bar-ad/order" element={<TrendingBarOrder />} />
          <Route path="/product/community-takeover/order" element={<CommunityTakeoverOrder />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
