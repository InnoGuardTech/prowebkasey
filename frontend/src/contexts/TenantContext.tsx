import React, { createContext, useContext, useEffect, useState } from 'react';

interface TenantContextProps {
  tenantName: string;
  tenantLogo: string;
  primaryColor: string;
  secondaryColor: string;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantData, setTenantData] = useState<Omit<TenantContextProps, 'isLoading'>>({
    tenantName: 'Qiyada',
    tenantLogo: '/vite.svg', // Default logo
    primaryColor: '#4338CA', // Indigo
    secondaryColor: '#06B6D4', // Cyan
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get subdomain
    const hostname = window.location.hostname;
    let subdomain = hostname.split('.')[0];
    
    // For local testing: if localhost, check URL params or default
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const params = new URLSearchParams(window.location.search);
      subdomain = params.get('tenant') || 'default';
    }

    // 2. Fetch tenant details from backend based on subdomain
    // For now, mock the API call since the backend route might not be ready
    const fetchTenantTheme = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call: fetch(`/api/v1/tenant/theme?subdomain=${subdomain}`)
        
        // Real API Call to backend
        const response = await fetch(`/api/v1/companies/theme/${subdomain}`);
        let data;
        
        if (response.ok) {
          const companyData = await response.json();
          // parse theme_colors if it exists
          const colors = companyData.theme_colors || {};
          data = {
            tenantName: companyData.name || 'نظام قيادة',
            tenantLogo: companyData.logo_url || '/vite.svg',
            primaryColor: colors.primary || '#4338CA',
            secondaryColor: colors.secondary || '#06B6D4',
          };
        } else {
          // Fallback if company not found or API fails
          data = {
            tenantName: 'نظام قيادة',
            tenantLogo: '/vite.svg',
            primaryColor: '#4338CA',
            secondaryColor: '#06B6D4',
          };
        }

        setTenantData(data);

        // 3. Inject CSS Variables
        document.documentElement.style.setProperty('--tenant-primary', data.primaryColor);
        document.documentElement.style.setProperty('--tenant-secondary', data.secondaryColor);

      } catch (error) {
        console.error('Failed to load tenant theme', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantTheme();
  }, []);

  return (
    <TenantContext.Provider value={{ ...tenantData, isLoading }}>
      {!isLoading && children}
    </TenantContext.Provider>
  );
};
