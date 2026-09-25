import { prisma } from "../lib/prisma";

export interface CreateBannerInput {
  title: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  link?: string | null;
  isActive?: boolean;
  businessId: number;
}

export interface UpdateBannerInput {
  title?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  link?: string | null;
  isActive?: boolean;
}

export const createBanner = async (data: CreateBannerInput) => {
  // TODO: Implement create banner logic
};

export const getBanners = async (businessId: number) => {
  // TODO: Implement get banners logic
};

export const getBannerById = async (id: number, businessId: number) => {
  // TODO: Implement get banner by id logic
};

export const updateBanner = async (
  id: number,
  businessId: number,
  data: UpdateBannerInput
) => {
  // TODO: Implement update banner logic
};

export const deleteBanner = async (id: number, businessId: number) => {
  // TODO: Implement delete banner logic
};
