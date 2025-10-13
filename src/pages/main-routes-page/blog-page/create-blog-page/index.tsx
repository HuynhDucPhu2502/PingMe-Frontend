import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RichTextEditor from "@/components/custom/RichText";
import { BLOG_CATEGORIES, type BlogCategory } from "@/types/blog";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as BlogCategory | "",
    content: "",
    imgPreviewUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File quá lớn (tối đa 5MB)");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả ngắn");
      return;
    }
    if (!formData.category) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Call API to create blog
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Tạo blog thành công! Đang chờ duyệt...");
      navigate("/blogs");
    } catch {
      toast.error("Tạo blog thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="border-b border-purple-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate("/blogs")}
                  className="text-white/80 hover:text-white transition-colors font-medium cursor-pointer underline-offset-4 hover:underline"
                >
                  Blog
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-white">
                  Tạo Blog mới
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl border-2 border-purple-200 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-10 pb-6 border-b-2 border-purple-100">
            <div className="h-10 w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tạo Blog mới
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-base font-semibold text-gray-700"
              >
                Tiêu đề <span className="text-pink-600">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề blog..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-base font-semibold text-gray-700"
              >
                Mô tả ngắn <span className="text-pink-600">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả ngắn về blog..."
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-base font-semibold text-gray-700"
              >
                Danh mục <span className="text-pink-600">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as BlogCategory })
                }
              >
                <SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Preview URL */}
            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-base font-semibold text-gray-700"
              >
                Ảnh xem trước
              </Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500"
                  >
                    <Upload className="h-4 w-4" />
                    Chọn ảnh
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {imageFile ? imageFile.name : "Chưa chọn file"}
                  </span>
                </div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="relative w-full h-80 rounded-lg overflow-hidden border-2 border-purple-200 shadow-md">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label
                htmlFor="content"
                className="text-base font-semibold text-gray-700"
              >
                Nội dung <span className="text-pink-600">*</span>
              </Label>
              <div className="border-2 border-purple-200 rounded-lg overflow-hidden">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                  placeholder="Nhập nội dung blog..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-6 border-t-2 border-purple-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/blogs")}
                disabled={isSubmitting}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo Blog"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
