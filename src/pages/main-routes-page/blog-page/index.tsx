import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BlogCategory, BlogReviewResponse } from "@/types/blog";
import { getUserInitials } from "@/utils/authFieldHandler";

const GRADIENT_COLORS = [
  "from-blue-500 to-purple-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-600",
  "from-yellow-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
];

const getGradientForBlog = (id: number): string => {
  return GRADIENT_COLORS[id % GRADIENT_COLORS.length];
};

const MOCK_BLOGS: BlogReviewResponse[] = [
  {
    id: 1,
    title: "Getting Started with Real-Time Messaging",
    description:
      "Learn how to build scalable real-time chat applications with WebSocket and modern web technologies.",
    category: "TECHNOLOGY",
    imgPreviewUrl: undefined,
    user: {
      id: 1,
      email: "sarah.chen@example.com",
      name: "Sarah Chen",
      avatarUrl: "/modern-tech-workspace.png",
      friendshipSummary: null,
    },
  },
  {
    id: 2,
    title: "The Future of Remote Communication",
    description:
      "Exploring how messaging platforms are reshaping the way teams collaborate across distances.",
    category: "BUSINESS",
    imgPreviewUrl: undefined,
    user: {
      id: 2,
      email: "michael.torres@example.com",
      name: "Michael Torres",
      avatarUrl: "/remote-team-collaboration.png",
      friendshipSummary: null,
    },
  },
  {
    id: 3,
    title: "Building Better User Experiences in Chat Apps",
    description:
      "Design principles and best practices for creating intuitive messaging interfaces that users love.",
    category: "LIFESTYLE",
    imgPreviewUrl: undefined,
    user: {
      id: 3,
      email: "emma.wilson@example.com",
      name: "Emma Wilson",
      avatarUrl: "/modern-chat-interface.jpg",
      friendshipSummary: null,
    },
  },
  {
    id: 4,
    title: "Security Best Practices for Messaging Platforms",
    description:
      "Essential security measures every messaging application should implement to protect user data.",
    category: "TECHNOLOGY",
    imgPreviewUrl: undefined,
    user: {
      id: 4,
      email: "david.kim@example.com",
      name: "David Kim",
      avatarUrl: "/cybersecurity-concept.jpg",
      friendshipSummary: null,
    },
  },
  {
    id: 5,
    title: "How to Stay Productive with Team Chat",
    description:
      "Tips and strategies for using messaging tools effectively without getting overwhelmed.",
    category: "EDUCATION",
    imgPreviewUrl: undefined,
    user: {
      id: 5,
      email: "lisa.anderson@example.com",
      name: "Lisa Anderson",
      avatarUrl: "/productive-workspace.png",
      friendshipSummary: null,
    },
  },
  {
    id: 6,
    title: "The Psychology of Digital Communication",
    description:
      "Understanding how online messaging affects our relationships and mental well-being.",
    category: "LIFESTYLE",
    imgPreviewUrl: undefined,
    user: {
      id: 6,
      email: "james.park@example.com",
      name: "Dr. James Park",
      avatarUrl: "/digital-communication-network.png",
      friendshipSummary: null,
    },
  },
  {
    id: 7,
    title: "Integrating AI into Chat Applications",
    description:
      "Discover how artificial intelligence is transforming messaging platforms with smart features.",
    category: "TECHNOLOGY",
    imgPreviewUrl: undefined,
    user: {
      id: 7,
      email: "alex.rivera@example.com",
      name: "Alex Rivera",
      avatarUrl: "/ai-technology.png",
      friendshipSummary: null,
    },
  },
  {
    id: 8,
    title: "Travel Tips: Staying Connected Abroad",
    description:
      "Essential apps and strategies for maintaining communication while traveling internationally.",
    category: "TRAVEL",
    imgPreviewUrl: undefined,
    user: {
      id: 8,
      email: "sophie.martin@example.com",
      name: "Sophie Martin",
      avatarUrl: "/travel-and-technology.jpg",
      friendshipSummary: null,
    },
  },
];

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  TECHNOLOGY: "Technology",
  LIFESTYLE: "Lifestyle",
  EDUCATION: "Education",
  BUSINESS: "Business",
  TRAVEL: "Travel",
  FOOD: "Food",
  ENTERTAINMENT: "Entertainment",
  OTHER: "Other",
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "url('/bg_office.jpg')",
            backgroundSize: "400px 400px",
            backgroundRepeat: "repeat",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            Discover Our Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
            Insights, tutorials, and stories about modern communication and
            technology.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[200px] h-11">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
                <SelectItem value="EDUCATION">Education</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="TRAVEL">Travel</SelectItem>
                <SelectItem value="FOOD">Food</SelectItem>
                <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BLOGS.map((blog) => (
            <Card
              key={blog.id}
              className="group cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                {blog.imgPreviewUrl ? (
                  <img
                    src={blog.imgPreviewUrl || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getGradientForBlog(
                      blog.id
                    )} group-hover:scale-105 transition-transform duration-300`}
                  />
                )}
              </div>

              <CardHeader className="space-y-3">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {CATEGORY_LABELS[blog.category]}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-balance">
                  {blog.title}
                </h3>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 text-pretty">
                  {blog.description}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={blog.user.avatarUrl || "/placeholder.svg"}
                      alt={blog.user.name}
                    />
                    <AvatarFallback>
                      {getUserInitials(blog.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {blog.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {blog.user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (shown when no results) */}
        {MOCK_BLOGS.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No articles found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
