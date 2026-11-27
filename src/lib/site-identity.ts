export const SITE_NAME = "GUOYAO METAL";
export const SITE_ALTERNATE_NAME = "Guoyao";
export const COMPANY_NAME = "广州市国耀高薪材料科技有限公司";
export const DEFAULT_SITE_URL = "https://www.guoyaometal.com";

export const PRIMARY_NAVIGATION = [
  { href: "/", label: "Home" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/case-studies", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export const SALES_EMAIL = "sales@guoyaometal.com";
export const SALES_TELEPHONES = ["+86 186 8875 7773", "+86 188 2591 3441"] as const;
export const SALES_WHATSAPP_CONTACTS = SALES_TELEPHONES.map((phone) => ({
  phone,
  href: `https://wa.me/${phone.replace(/\D/g, "")}`,
}));

