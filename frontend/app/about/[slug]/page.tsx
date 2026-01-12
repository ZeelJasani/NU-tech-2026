import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getFeatureData } from "@/lib/features";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function FeaturePage({ params }: PageProps) {
    const { slug } = await params;
    const featureData = await getFeatureData(slug);

    if (!featureData) {
        notFound();
    }

    return (
        <div className="container max-w-4xl mx-auto px-6 pt-12 pb-24 space-y-8 min-h-screen">
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="pl-0 h-auto py-1 hover:bg-transparent hover:text-primary transition-colors group" asChild>
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </Link>
                </Button>
            </div>

            {/* Content Container */}
            <article className="markdown-content animate-in fade-in slide-in-from-bottom-4 duration-700">
                <MDXRemote
                    source={featureData.content}
                    components={{
                        Image: (props: any) => (
                            <Image
                                {...props}
                                className="rounded-lg border border-border my-8"
                                alt={props.alt || "Image"}
                            />
                        )
                    }}
                />
            </article>

        </div>
    );
}

export async function generateStaticParams() {
    const slugs = ["earthquakes", "floods", "wildfires", "cyclones", "landslides", "heatwaves"];
    return slugs.map((slug) => ({
        slug,
    }));
}
