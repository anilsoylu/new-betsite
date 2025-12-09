# Supabase Auth + Real-time Comments - Web Implementation

## Genel Bakis

**Amac**: Mac detay sayfasinda yorum sistemi
- Uye giris yaparsa yorum yapabilecek
- Herkes (uye olmayanlar dahil) yorumlari gorebilecek
- Real-time guncelleme (Supabase Realtime)

**Auth Yontemleri**: Email/Password + Google OAuth

---

## Maliyet Analizi

| Aylik Ziyaretci | Uye Sayisi | Plan | Aylik Maliyet |
|-----------------|------------|------|---------------|
| 0 - 50K | < 5K | **FREE** | **$0** |
| 50K - 200K | < 50K | PRO | **$25** |
| 200K - 500K | < 75K | PRO | **$25** |
| 500K - 1M | < 150K | PRO | **$25 - $190** |
| 1M+ | 150K+ | PRO | **$190+** |

**FREE Kisitlari**: 1 hafta aktivite yoksa proje duraklatilir

---

## Faz 1: Supabase Kurulum

### 1.1 Paket Kurulumu

```bash
bun add @supabase/supabase-js @supabase/ssr
```

### 1.2 Environment Variables

`.env.local` dosyasina ekle:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 1.3 Database Semasi

Supabase Dashboard > SQL Editor'de calistir:

```sql
-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role queries
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- =============================================
-- COMMENTS TABLE
-- =============================================
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_comments_fixture_id ON public.comments(fixture_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX idx_comments_fixture_created ON public.comments(fixture_id, created_at DESC);

-- =============================================
-- AUTO-UPDATE TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ENABLE REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
```

### 1.4 RLS (Row Level Security) Policies

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Everyone can view profiles
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  TO authenticated, anon
  USING (true);

-- Users can update own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- =============================================
-- COMMENTS POLICIES
-- =============================================

-- Everyone can view comments
CREATE POLICY "comments_select_all"
  ON public.comments FOR SELECT
  TO authenticated, anon
  USING (true);

-- Authenticated users can insert own comments
CREATE POLICY "comments_insert_own"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can update own comments
CREATE POLICY "comments_update_own"
  ON public.comments FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can delete own OR admins can delete any
CREATE POLICY "comments_delete_own_or_admin"
  ON public.comments FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'moderator')
    )
  );
```

---

## Faz 2: Auth Implementasyonu

### 2.1 Dosya Yapisi

```
src/lib/supabase/
├── client.ts      # Browser client (singleton)
├── server.ts      # Server client (RSC/Route Handlers)
└── types.ts       # Generated database types
```

### 2.2 Browser Client

`src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseClient;
}
```

### 2.3 Server Client

`src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component - ignore cookie mutations
          }
        },
      },
    }
  );
}
```

### 2.4 Auth Store (Zustand)

`src/lib/store/auth-store.ts`:

```typescript
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;

  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAdmin: false,

  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  reset: () => set({ user: null, isLoading: false, isAdmin: false }),
}));
```

### 2.5 Supabase Provider

`src/components/providers/supabase-provider.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const { setUser, setIsLoading, setIsAdmin, reset } = useAuthStore();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.role === "admin" || profile?.role === "moderator");
      }

      setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);

          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          setIsAdmin(profile?.role === "admin" || profile?.role === "moderator");
        } else {
          reset();
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser, setIsLoading, setIsAdmin, reset]);

  return <>{children}</>;
}
```

### 2.6 Middleware Guncellemesi

`src/middleware.ts` dosyasina ekle:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session
  await supabase.auth.getUser();

  // Existing security headers...
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}
```

### 2.7 OAuth Callback Handler

`src/app/api/auth/callback/route.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(origin);
}
```

### 2.8 Providers Guncellemesi

`src/lib/providers.tsx`:

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";
import { FavoriteMatchWatcher } from "@/components/providers/favorite-match-watcher";
import { SupabaseProvider } from "@/components/providers/supabase-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <SupabaseProvider>
          <FavoriteMatchWatcher>{children}</FavoriteMatchWatcher>
        </SupabaseProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## Faz 3: Comments Sistemi

### 3.1 Dosya Yapisi

```
src/
├── lib/
│   ├── hooks/use-comments.ts    # TanStack Query + Realtime
│   └── validations/comment.ts   # Zod schema
└── components/comments/
    ├── comments-section.tsx     # Ana container
    ├── comment-list.tsx         # Liste + realtime
    ├── comment-item.tsx         # Tek yorum karti
    ├── comment-form.tsx         # Yeni yorum formu
    └── comment-skeleton.tsx     # Loading state
```

### 3.2 Comment Validation

`src/lib/validations/comment.ts`:

```typescript
import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Yorum bos olamaz")
    .max(500, "Yorum 500 karakterden uzun olamaz")
    .trim(),
});

export type CommentFormData = z.infer<typeof commentSchema>;
```

### 3.3 Comments Hook (Real-time)

`src/lib/hooks/use-comments.ts`:

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface Comment {
  id: string;
  fixture_id: number;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useComments(fixtureId: number) {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  const query = useQuery<Array<Comment>>({
    queryKey: ["comments", fixtureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq("fixture_id", fixtureId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Array<Comment>;
    },
    staleTime: 30 * 1000,
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${fixtureId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `fixture_id=eq.${fixtureId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["comments", fixtureId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fixtureId, queryClient, supabase]);

  return query;
}

export function useCreateComment(fixtureId: number) {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  return useMutation({
    mutationFn: async ({ content, userId }: { content: string; userId: string }) => {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          fixture_id: fixtureId,
          user_id: userId,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", fixtureId] });
    },
  });
}

export function useDeleteComment(fixtureId: number) {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", fixtureId] });
    },
  });
}
```

### 3.4 Comments Section Component

`src/components/comments/comments-section.tsx`:

```typescript
"use client";

import { useComments, useCreateComment, useDeleteComment } from "@/lib/hooks/use-comments";
import { useAuthStore } from "@/lib/store/auth-store";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { CommentSkeleton } from "./comment-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentsSectionProps {
  fixtureId: number;
  className?: string;
}

export function CommentsSection({ fixtureId, className }: CommentsSectionProps) {
  const { user, isLoading: authLoading, isAdmin } = useAuthStore();
  const { data: comments, isLoading, error } = useComments(fixtureId);
  const createComment = useCreateComment(fixtureId);
  const deleteComment = useDeleteComment(fixtureId);

  function handleSubmit(content: string) {
    if (!user) return;
    createComment.mutate({ content, userId: user.id });
  }

  function handleDelete(commentId: string) {
    deleteComment.mutate(commentId);
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Yorumlar
          {comments && (
            <span className="text-sm font-normal text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!authLoading && (
          user ? (
            <CommentForm
              onSubmit={handleSubmit}
              isSubmitting={createComment.isPending}
            />
          ) : (
            <div className="text-center py-4 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground mb-2">
                Yorum yapmak icin giris yapin
              </p>
              <Button variant="outline" size="sm">
                Giris Yap
              </Button>
            </div>
          )
        )}

        {isLoading ? (
          <CommentSkeleton count={3} />
        ) : error ? (
          <p className="text-center text-muted-foreground py-4">
            Yorumlar yuklenemedi
          </p>
        ) : comments && comments.length > 0 ? (
          <CommentList
            comments={comments}
            currentUserId={user?.id}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            isDeleting={deleteComment.isPending}
          />
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Henuz yorum yok. Ilk yorumu sen yap!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

### 3.5 Match Page Entegrasyonu

`src/app/match/[id]/page.client.tsx` dosyasina ekle:

```typescript
import { CommentsSection } from "@/components/comments/comments-section";

// ... existing code ...

// Render icinde (ornegin Tabs'dan sonra):
<CommentsSection fixtureId={fixtureId} className="mt-6" />
```

---

## Olusturulacak Dosyalar Listesi

| Dosya | Aciklama |
|-------|----------|
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/supabase/types.ts` | Database types (generate with CLI) |
| `src/lib/store/auth-store.ts` | Auth Zustand store |
| `src/lib/hooks/use-comments.ts` | Comments + Realtime hook |
| `src/lib/validations/comment.ts` | Zod validation |
| `src/components/providers/supabase-provider.tsx` | Auth provider |
| `src/components/auth/auth-dialog.tsx` | Login/Register modal |
| `src/components/auth/google-button.tsx` | Google OAuth button |
| `src/components/comments/comments-section.tsx` | Main container |
| `src/components/comments/comment-list.tsx` | Comment list |
| `src/components/comments/comment-item.tsx` | Single comment |
| `src/components/comments/comment-form.tsx` | New comment form |
| `src/components/comments/comment-skeleton.tsx` | Loading skeleton |
| `src/app/api/auth/callback/route.ts` | OAuth callback |

## Guncellenecek Dosyalar

| Dosya | Degisiklik |
|-------|------------|
| `src/middleware.ts` | Auth session refresh |
| `src/lib/providers.tsx` | SupabaseProvider ekle |
| `src/app/match/[id]/page.client.tsx` | CommentsSection ekle |

---

## Test Kontrol Listesi

- [ ] Email/sifre ile kayit
- [ ] Email/sifre ile giris
- [ ] Google OAuth ile giris
- [ ] Session persistence
- [ ] Yorumlar yukleniyor
- [ ] Giris yapmis kullanici yorum yapabiliyor
- [ ] Yorumlar real-time guncelleniyor
- [ ] Kullanici kendi yorumunu silebiliyor
- [ ] Anonim kullanicilar yorumlari gorebiliyor ama yazamiyor

---

## Supabase Dashboard Ayarlari

### Google OAuth Aktiflestime

1. Supabase Dashboard > Authentication > Providers
2. Google'i aktifle
3. Google Cloud Console'dan OAuth credentials olustur:
   - Authorized redirect URI: `https://[PROJECT_REF].supabase.co/auth/v1/callback`
4. Client ID ve Secret'i Supabase'e gir

### Site URL Ayari

1. Authentication > URL Configuration
2. Site URL: `http://localhost:3000` (development)
3. Redirect URLs:
   - `http://localhost:3000/api/auth/callback`
   - `https://yoursite.com/api/auth/callback` (production)
