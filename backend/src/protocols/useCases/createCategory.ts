export interface createCategoryUsecase {
  create: (name: string) => Promise<void>;
}
