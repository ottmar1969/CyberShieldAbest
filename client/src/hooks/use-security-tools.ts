import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useSecurityTools() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzePassword = async (password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/password-strength", {
        password,
      });
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze password. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const scanWebsite = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/website-security", {
        url,
      });
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scan website. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSSL = async (domain: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/ssl-check", {
        domain,
      });
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check SSL certificate. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const detectPhishing = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/phishing-detector", {
        url,
      });
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze URL. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeHeaders = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/security-headers", {
        url,
      });
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze security headers. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzePassword,
    scanWebsite,
    checkSSL,
    detectPhishing,
    analyzeHeaders,
    isLoading,
  };
}
