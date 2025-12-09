# Admin Panel - Yorum Moderasyonu

## Genel Bakis

**Amac**: Admin/moderator kullanicilarin yorumlari yonetebilecegi panel
- Tum yorumlari gorebilme
- Herhangi bir yorumu silebilme
- Kullanici yonetimi (rol atama)
- Spam/kotu icerik moderasyonu

**Erisim**: Sadece `admin` veya `moderator` role sahip kullanicilar

---

## Dosya Yapisi

```
src/app/admin/
├── layout.tsx              # Role-based guard
├── page.tsx                # Admin dashboard
└── comments/
    ├── page.tsx            # Yorum listesi
    └── page.client.tsx     # Client component
```

---

## Admin Layout (Route Guard)

`src/app/admin/layout.tsx`:

```typescript
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await getSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Yorum moderasyonu ve kullanici yonetimi</p>
      </div>
      {children}
    </div>
  );
}
```

---

## Admin Dashboard

`src/app/admin/page.tsx`:

```typescript
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Shield } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await getSupabaseServerClient();

  // Get stats
  const { count: commentCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true });

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: todayComments } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date().toISOString().split("T")[0]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Link href="/admin/comments">
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yorum</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commentCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Bugun: {todayComments || 0}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Toplam Kullanici</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userCount || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Moderasyon</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">Aktif</div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Yorum Moderasyon Sayfasi

`src/app/admin/comments/page.tsx`:

```typescript
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminCommentsClient } from "./page.client";

export default async function AdminCommentsPage() {
  const supabase = await getSupabaseServerClient();

  const { data: comments } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        display_name,
        email,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  return <AdminCommentsClient initialComments={comments || []} />;
}
```

`src/app/admin/comments/page.client.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Search, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

interface Comment {
  id: string;
  fixture_id: number;
  content: string;
  created_at: string;
  profiles: {
    display_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

interface AdminCommentsClientProps {
  initialComments: Array<Comment>;
}

export function AdminCommentsClient({ initialComments }: AdminCommentsClientProps) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  const { data: comments } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles (
            display_name,
            email,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as Array<Comment>;
    },
    initialData: initialComments,
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
  });

  const filteredComments = comments?.filter((comment) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      comment.content.toLowerCase().includes(searchLower) ||
      comment.profiles.display_name?.toLowerCase().includes(searchLower) ||
      comment.profiles.email.toLowerCase().includes(searchLower) ||
      comment.fixture_id.toString().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Yorum, kullanici veya mac ID ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredComments?.length || 0} yorum
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanici</TableHead>
              <TableHead>Yorum</TableHead>
              <TableHead>Mac</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="w-[100px]">Islem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComments?.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {comment.profiles.display_name || "Anonim"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {comment.profiles.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate">{comment.content}</p>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/match/${comment.fixture_id}`}
                    target="_blank"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    #{comment.fixture_id}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu yorumu silmek istediginize emin misiniz? Bu islem
                          geri alinamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Iptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(comment.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {(!filteredComments || filteredComments.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">Yorum bulunamadi</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

---

## Middleware Admin Guard

`src/middleware.ts` dosyasina ekle:

```typescript
// Admin routes protection
if (request.nextUrl.pathname.startsWith("/admin")) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
```

---

## Admin Kullanici Olusturma

Supabase Dashboard > SQL Editor'de:

```sql
-- Mevcut kullaniciyi admin yap (email ile)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Veya ID ile
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'user-uuid-here';
```

---

## Olusturulacak Dosyalar

| Dosya | Aciklama |
|-------|----------|
| `src/app/admin/layout.tsx` | Admin layout + role guard |
| `src/app/admin/page.tsx` | Admin dashboard |
| `src/app/admin/comments/page.tsx` | Yorum listesi (server) |
| `src/app/admin/comments/page.client.tsx` | Yorum listesi (client) |

---

## Gelecek Ozellikler (Opsiyonel)

### 1. Toplu Silme
- Checkbox ile birden fazla yorum secme
- Secilenleri toplu silme

### 2. Kullanici Banlama
- Kullaniciyi banla (yorum yapamaz)
- Ban suresi belirleme

### 3. Spam Filtreleme
- Otomatik spam tespiti
- Kelime blacklist
- Rate limiting (dakikada max yorum)

### 4. Raporlama Sistemi
- Kullanicilar yorum raporlayabilir
- Raporlanan yorumlar admin panelde ozel liste

### 5. Moderator Loglari
- Kim, ne zaman, hangi yorumu sildi
- Audit trail

---

## Test Kontrol Listesi

- [ ] Admin olmayan kullanici /admin'e gidemez
- [ ] Moderator /admin'e girebilir
- [ ] Yorum listesi dogru yukleniyor
- [ ] Arama calisiyor
- [ ] Yorum silme calisiyor
- [ ] Mac linkine tiklayinca dogru sayfaya gidiyor
