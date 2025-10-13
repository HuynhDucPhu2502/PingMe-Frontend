import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BlogReviewResponse } from "@/types/blog";
import { useSelector } from "react-redux";
import type { RootState } from "@/features/store";
import { HeroSection } from "./components/HeroSection";
import { SearchAndFilterSection } from "./components/SearchAndFilterSection";
import { BlogGrid } from "./components/BlogGrid";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_BLOGS: BlogReviewResponse[] = [
  {
    id: 1,
    title: "Getting Started with Real-Time Messaging",
    description:
      "Learn how to build scalable real-time chat applications with WebSocket and modern web technologies.",
    category: "TECHNOLOGY",
    imgPreviewUrl: undefined,
    isApproved: true,
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
    isApproved: true,
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
    isApproved: true,
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
    isApproved: true,
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
    isApproved: true,
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
    isApproved: true,
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
    isApproved: true,
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
    isApproved: true,
    user: {
      id: 8,
      email: "sophie.martin@example.com",
      name: "Sophie Martin",
      avatarUrl: "/travel-and-technology.jpg",
      friendshipSummary: null,
    },
  },
];

const MOCK_MY_BLOGS: BlogReviewResponse[] = [
  {
    id: 101,
    title: "My Journey Building a Chat Application",
    description:
      "A detailed walkthrough of the challenges and solutions I encountered while building my first real-time messaging app.",
    category: "TECHNOLOGY",
    imgPreviewUrl: undefined,
    isApproved: true,
    user: {
      id: 999,
      email: "currentuser@example.com",
      name: "Current User",
      avatarUrl: "",
      friendshipSummary: null,
    },
  },
  {
    id: 102,
    title: "Understanding WebSocket Performance",
    description:
      "Deep dive into optimizing WebSocket connections for better performance and scalability.",
    category: "TECHNOLOGY",
    imgPreviewUrl: undefined,
    isApproved: false,
    user: {
      id: 999,
      email: "currentuser@example.com",
      name: "Current User",
      avatarUrl: "",
      friendshipSummary: null,
    },
  },
  {
    id: 103,
    title: "Best Practices for Team Collaboration",
    description:
      "Lessons learned from managing remote teams using modern communication tools.",
    category: "BUSINESS",
    imgPreviewUrl: undefined,
    isApproved: true,
    user: {
      id: 999,
      email: "currentuser@example.com",
      name: "Current User",
      avatarUrl: "",
      friendshipSummary: null,
    },
  },
  {
    id: 104,
    title: "The Future of Digital Communication",
    description:
      "Exploring emerging trends and technologies that will shape how we communicate online.",
    category: "TECHNOLOGY",
    imgPreviewUrl: undefined,
    isApproved: false,
    user: {
      id: 999,
      email: "currentuser@example.com",
      name: "Current User",
      avatarUrl: "",
      friendshipSummary: null,
    },
  },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  const { isLogin } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const displayBlogs = activeTab === "all" ? MOCK_BLOGS : MOCK_MY_BLOGS;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {isLogin && (
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="lg"
                  className={`rounded-lg px-6 py-3 font-semibold transition-all ${
                    activeTab === "all"
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  Tất cả bài viết
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className={`rounded-lg px-6 py-3 font-semibold transition-all ${
                    activeTab === "my"
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("my")}
                >
                  Bài viết của tôi
                </Button>
              </div>
              <Button
                onClick={() => navigate("/blogs/create")}
                className="gap-2"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Tạo Blog
              </Button>
            </div>
          </div>
        </div>
      )}

      <SearchAndFilterSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-12">
        <BlogGrid
          blogs={displayBlogs}
          showApprovalStatus={activeTab === "my"}
        />
      </div>
    </div>
  );
}
