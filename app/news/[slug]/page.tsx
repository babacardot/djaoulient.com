import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { CalendarDays, User, Tag } from "lucide-react";

import { getNewsPostBySlug } from "@/lib/queries/news";
import type { NewsPost } from "@/lib/types/news";
import { Separator } from "@/components/ui/separator";

// Category type is now handled by NewsPost type

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: NewsPost | null = await getNewsPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Djaouli Entertainment Blog`,
    description: post.excerpt,
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: NewsPost | null = await getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex flex-wrap gap-4 text-muted-foreground mb-8">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </div>

        {post.author && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author.name}</span>
          </div>
        )}

        {post.categories && post.categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>
              {post.categories?.map((cat) => cat.title).join(", ") || ""}
            </span>
          </div>
        )}
      </div>

      {post.mainImage && (
        <div className="relative aspect-video mb-8 rounded-sm overflow-hidden">
          <Image
            src={post.mainImage?.asset?.url || "/placeholder.webp"}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <PortableText value={post.body} />
      </div>

      <Separator className="my-8" />

      <div className="bg-muted p-6 rounded-sm">
        <h2 className="text-xl font-bold mb-4">About the Author</h2>
        {post.author ? (
          <div className="flex items-center gap-4">
            {post.author.image && (
              <Image
                src={post.author.image?.asset?.url || "/placeholder.webp"}
                alt={post.author.name}
                width={60}
                height={60}
                className="rounded-sm"
              />
            )}
            <div>
              <h3 className="font-medium">{post.author.name}</h3>
              <p className="text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>
        ) : (
          <p>Djaouli Entertainment Team</p>
        )}
      </div>
    </article>
  );
}

// Optional: Generate static paths
// export async function generateStaticParams() {
//   const posts = await getAllBlogPosts();
//   return posts.map((post: any) => ({ slug: post.slug?.current || post.slug }));
// }
