import { CreateCategoryCard } from "@/components/categories/CreateCategoryCard";
import { CategoriesList } from "@/components/categories/CategoriesList";

export default function CategoriesPage() {
  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-slate-600 mt-1">
          Create categories to organize your interview questions.
        </p>
      </div>

      <CreateCategoryCard />
      <CategoriesList />
    </main>
  );
}
