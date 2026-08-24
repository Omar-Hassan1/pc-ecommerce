export interface SiteConfig {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  currencySymbol: string;
  address: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

export const siteConfig: SiteConfig = {
  storeName: 'NEXORA COMPUTERS',
  tagline: 'Power Your World. Premium Gaming PCs, Laptops & Global Tech Repair.',
  contactEmail: 'support@nexoracomputers.com',
  contactPhone: '+1 (800) 555-NEXORA',
  currency: 'USD',
  currencySymbol: '$',
  address: '100 Technology Parkway, Suite 500, Tech City, USA',
  socialLinks: {
    twitter: 'https://twitter.com/nexoracomputers',
    facebook: 'https://facebook.com/nexoracomputers',
    instagram: 'https://instagram.com/nexoracomputers',
    youtube: 'https://youtube.com/nexoracomputers'
  }
};

export default siteConfig;
