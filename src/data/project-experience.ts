import type { ProjectRecord } from "@/components/site/project-records-carousel";

// Curated from the owner's 2016–2026 project register, checked 2026-10-24.
// Periods describe the register's grouping, not a verified completion date.
// A brand's presence records project experience, not a direct client endorsement.
// Source-page and original-name mapping: content/project-experience/sources.json.
export const projectBrands = [
  { name: "Tiffany & Co.", src: "/brand/project-brands/tiffany.svg", width: 180, height: 42 },
  { name: "Cartier", src: "/brand/project-brands/cartier.svg", width: 136, height: 48 },
  { name: "Louis Vuitton", src: "/brand/project-brands/louis-vuitton.svg", width: 162, height: 40 },
  { name: "Dior", src: "/brand/project-brands/dior.svg", width: 100, height: 48 },
  { name: "Ferragamo", src: "/brand/project-brands/ferragamo.svg", width: 166, height: 40 },
  { name: "Valentino", src: "/brand/project-brands/valentino.svg", width: 146, height: 72 },
  { name: "Moncler", src: "/brand/project-brands/moncler.svg", width: 146, height: 72 },
  { name: "Prada", src: "/brand/project-brands/prada.svg", width: 138, height: 44 },
] as const;

export const projectRecords = [
  { id: "2025-2026-shanghai-ifc-tiffany", brand: "Tiffany & Co.", place: "Shanghai IFC", location: "Shanghai", period: "2025–2026" },
  { id: "2025-2026-beijing-skp-lv", brand: "Louis Vuitton", place: "SKP", location: "Beijing", period: "2025–2026" },
  { id: "2025-2026-hong-kong-prada", brand: "Prada", place: "Alexandra House", location: "Hong Kong", period: "2025–2026", scope: "Store hoarding" },
  { id: "2024-las-vegas-tiffany", brand: "Tiffany & Co.", place: "Las Vegas", location: "United States", period: "2024" },
  { id: "2023-shanghai-qiantan-tiffany", brand: "Tiffany & Co.", place: "Taikoo Li Qiantan", location: "Shanghai", period: "2023" },
  { id: "2023-beijing-daxing-tiffany", brand: "Tiffany & Co.", place: "Daxing Airport", location: "Beijing", period: "2023" },
  { id: "2023-macau-four-seasons-tiffany", brand: "Tiffany & Co.", place: "Four Seasons", location: "Macau", period: "2023" },
  { id: "2022-hangzhou-cartier", brand: "Cartier", place: "Hangzhou Tower", location: "Hangzhou", period: "2022" },
  { id: "2021-shenzhen-mixc-lv", brand: "Louis Vuitton", place: "The MixC", location: "Shenzhen", period: "2021" },
  { id: "2020-chengdu-ifs-dior", brand: "Dior", place: "IFS", location: "Chengdu", period: "2020" },
  { id: "2019-delhi-tiffany", brand: "Tiffany & Co.", place: "The Chanakya", location: "Delhi", period: "2019" },
  { id: "2018-sydney-tiffany", brand: "Tiffany & Co.", place: "Sydney", location: "Australia", period: "2018" },
  { id: "2017-hong-kong-tiffany", brand: "Tiffany & Co.", place: "Harbour City", location: "Hong Kong", period: "2017" },
  { id: "2016-hong-kong-moncler", brand: "Moncler", place: "Harbour City · Gateway Arcade", location: "Hong Kong", period: "2016" },
  { id: "2016-hong-kong-valentino", brand: "Valentino", place: "Lee Gardens", location: "Hong Kong", period: "2016" },
  { id: "2016-changsha-ferragamo", brand: "Ferragamo", place: "Yunda Central Plaza", location: "Changsha", period: "2016" },
] satisfies ProjectRecord[];
