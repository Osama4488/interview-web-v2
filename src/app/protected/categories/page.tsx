import { CreateCategoryCard } from "@/components/categories/CreateCategoryCard";
import { CategoriesList } from "@/components/categories/CategoriesList";
import { PageHeader } from "@/components/ui/page-header";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your interview questions by topic or technology."
      />
      <CreateCategoryCard />
      <CategoriesList />
    </div>
  );
}
