import { createApi } from "@reduxjs/toolkit/query/react";
import { contentBaseQueryWithReauth } from "./baseQuery";



export type CategoryDto = { _id: string; category: string; slug: string };

export type QuestionDto = {
    _id: string;
    user: string;
    category: string;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
};

export type Paged<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
};



export const contentApi = createApi({
    reducerPath: "contentApi",
    baseQuery: contentBaseQueryWithReauth,
    tagTypes: ["Category", "Question"],
    endpoints: (b) => ({
        listCategories: b.query<CategoryDto[], void>({
            query: () => ({ url: "/api/categories", method: "GET" }),
            providesTags: [{ type: "Category", id: "LIST" }],
        }),
        createCategory: b.mutation<CategoryDto, { category: string }>({
            query: (body) => ({ url: "/api/categories", method: "POST", body }),
            invalidatesTags: [{ type: "Category", id: "LIST" }],
        }),

        listQuestions: b.query<Paged<QuestionDto>, { category?: string; search?:string; page: number; limit: number }>({
            query: ({ category,search ,page, limit }) => ({
                url: "/api/questions",
                method: "GET",
                params: { category,search, page, limit },
            }),
            providesTags: [{ type: "Question", id: "LIST" }],
        }),

        createQuestion: b.mutation<
            QuestionDto,
            { category: string; question: string; answer: string }
        >({
            query: (body) => ({ url: "/api/questions", method: "POST", body }),
            invalidatesTags: [{ type: "Question", id: "LIST" }],
        }),

        // add near other question endpoints

        updateQuestion: b.mutation<
            QuestionDto,
            { id: string; category?: string; question?: string; answer?: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/api/questions/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: [{ type: "Question", id: "LIST" }],
        }),

        deleteQuestion: b.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/api/questions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Question", id: "LIST" }],
        }),



        updateCategory: b.mutation<any, { id: string; category: string }>({
            query: ({ id, category }) => ({
                url: `/api/categories/${id}`,
                method: "PATCH",
                body: { category },
            }),
            invalidatesTags: [{ type: "Category", id: "LIST" }],
        }),

        deleteCategory: b.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/api/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Category", id: "LIST" }],
        }),

    }),
});

export const {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useListQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = contentApi;

