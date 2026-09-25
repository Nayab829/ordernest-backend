import { prisma } from "../lib/prisma";





type CreateBannerInput = {
  businessId: number;
  title?: string;
  desktopImage: string;
  mobileImage: string;
  link?: string;
};

export async function createBanner(input: CreateBannerInput) {
  return prisma.banner.create({ data: input });
}

export async function getBanners(businessId: number) {
  // Only active banners, most recently created first — typical for a public-facing storefront
  return prisma.banner.findMany({
    where: { businessId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllBannersForAdmin(businessId: number) {
  // Admin dashboard likely wants to see inactive ones too, to toggle them back on
  return prisma.banner.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  });
}
export async function getBannerById(id: number, businessId: number) {
  return prisma.banner.findFirst({
    where: { id, businessId },
  });
}
type UpdateBannerInput = Partial<CreateBannerInput> & { isActive?: boolean };

export async function updateBanner(id: number, businessId: number, input: UpdateBannerInput) {
  // Scope the update to businessId too — prevents editing another business's banner by guessing an id
  const banner = await prisma.banner.findFirst({ where: { id, businessId } });
  if (!banner) throw new Error("Banner not found");

  return prisma.banner.update({ where: { id }, data: input });
}

export async function deleteBanner(id: number, businessId: number) {
  const banner = await prisma.banner.findFirst({ where: { id, businessId } });
  if (!banner) throw new Error("Banner not found");

  return prisma.banner.delete({ where: { id } });
}