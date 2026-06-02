"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { useListCategoriesQuery, useListQuestionsQuery } from "@/services/contentApi";
import {
  Tag,
  HelpCircle,
  CheckCircle2,
  Plus,
  FolderOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  iconColor,
  iconBg,
  loading,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  loading?: boolean;
}) {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            )}
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconBg} shrink-0`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getQuestionsTotal(data: any): number {
  if (typeof data?.total === "number") return data.total;
  if (Array.isArray(data?.items)) return data.items.length;
  if (Array.isArray(data)) return data.length;
  return 0;
}

export default function DashboardPage() {
  const cats = useListCategoriesQuery();
  const qs = useListQuestionsQuery({ page: 1, limit: 1 });

  const loading = cats.isLoading || qs.isLoading;
  const categoriesCount = Array.isArray(cats.data) ? cats.data.length : 0;
  const questionsCount = getQuestionsTotal(qs.data);
  const recentCategories = Array.isArray(cats.data) ? cats.data.slice(0, 6) : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="An overview of your interview prep content."
        action={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/protected/categories">
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                New Category
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/protected/questions">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Question
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Categories"
          value={loading ? "—" : String(categoriesCount)}
          hint="Organize by topic"
          icon={Tag}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          loading={cats.isLoading}
        />
        <StatCard
          title="Total Questions"
          value={loading ? "—" : String(questionsCount)}
          hint="Across all categories"
          icon={HelpCircle}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          loading={qs.isLoading}
        />
        <StatCard
          title="System Status"
          value="Active"
          hint="Auth + API connected"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      <Card className="border border-border shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Recent Categories</h2>
          </div>
          <Link
            href="/protected/categories"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <CardContent className="p-5">
          {cats.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : recentCategories.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="h-5 w-5" />}
              title="No categories yet"
              description="Create your first category to start organizing questions."
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href="/protected/categories">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create category
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentCategories.map((c: any) => (
                <Link
                  key={c._id}
                  href="/protected/categories"
                  className="group flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 hover:bg-muted/60 transition-colors"
                >
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.category}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.slug}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
