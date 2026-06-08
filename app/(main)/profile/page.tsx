"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Pencil, Loader2, Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    image: ""
  });
  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Only show loading when fetching
      try {
        const response = await fetch('/api/me');
        const data = await response.json();

        if (response.ok && data.user) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            businessName: data.user.businessName || "",
            image: data.user.image || ""
          });
          setInitialData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            businessName: data.user.businessName || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Check if any changes were made
    const hasChanges = 
      formData.name !== initialData.name ||
      formData.email !== initialData.email ||
      formData.phone !== initialData.phone ||
      formData.businessName !== initialData.businessName;

    if (!hasChanges) {
      router.push("/");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          businessName: formData.businessName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully!');
        // Redirect to home page after a brief delay
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g., 2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      setIsUploading(true);
      try {
        const response = await fetch('/api/auth/profile-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String }),
        });

        const data = await response.json();

        if (response.ok) {
          setFormData(prev => ({ ...prev, image: data.imageUrl }));
          toast.success('Profile photo updated!');
          // Reload to sync Navbar and other components
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          throw new Error(data.message || 'Upload failed');
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (!formData.image) return;
    setIsRemoving(true);
    try {
      const response = await fetch('/api/auth/profile-image', { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        setFormData(prev => ({ ...prev, image: '' }));
        toast.success('Profile photo removed!');
        setTimeout(() => window.location.reload(), 800);
      } else {
        throw new Error(data.message || 'Remove failed');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsRemoving(false);
    }
  };


  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-[40px] font-bold text-[#333333] text-center mb-10 tracking-tight">
            My Profile
          </h1>

          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {/* Avatar Circle */}
              <div className="w-44 h-44 rounded-full border-[6px] border-white shadow-lg overflow-hidden relative bg-gray-100 flex items-center justify-center">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
                    <span className="text-[12px] font-bold text-[#0066FF]">Uploading...</span>
                  </div>
                ) : formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Profile"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0266FF] flex items-center justify-center text-white font-bold text-[64px]">
                    {getInitials(formData.name)}
                  </div>
                )}

                {/* Hover Overlay — Edit */}
                {!isUploading && (
                  <div
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white" />
                    <span className="text-white text-[13px] font-semibold mt-1">Change Photo</span>
                  </div>
                )}
              </div>

              {/* Camera Button */}
              <button
                onClick={handleImageClick}
                disabled={isUploading || isRemoving}
                className="absolute bottom-1 right-1 w-12 h-12 bg-[#0066FF] rounded-full flex items-center justify-center border-4 border-white text-white shadow-xl hover:bg-blue-600 transition-all active:scale-90 disabled:opacity-70"
              >
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6 stroke-[2.5px]" />}
              </button>
            </div>

            {/* Remove Photo Button — only shows when photo exists */}
            {formData.image && (
              <button
                onClick={handleRemoveImage}
                disabled={isRemoving || isUploading}
                className="mt-4 flex items-center gap-2 px-5 py-2 rounded-full border border-red-200 text-red-500 text-[14px] font-semibold hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRemoving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Removing...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Remove Photo</>
                )}
              </button>
            )}
          </div>

          {/* Form Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-10">
            {/* Name */}
            <div className="space-y-3">
             <label className="text-[16px] font-semibold text-[#444444] px-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-[#F3F6F9] border border-transparent rounded-[20px] text-gray-600 font-medium focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                placeholder="Sandra W."
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-[16px] font-semibold text-[#444444] px-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-[#F3F6F9] border border-transparent rounded-[20px] text-gray-600 font-medium focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                placeholder="Sandra.w@sample.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <label className="text-[16px] font-semibold text-[#444444] px-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-[#F3F6F9] border border-transparent rounded-[20px] text-gray-600 font-medium focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                placeholder="+91 9887767216"
              />
            </div>

            {/* Business Name */}
            <div className="space-y-3">
              <label className="text-[16px] font-semibold text-[#444444] px-1">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-[#F3F6F9] border border-transparent rounded-[20px] text-gray-600 font-medium focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                placeholder="Business Inc."
              />
            </div>
          </div>
          

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full max-w-[400px] py-4 bg-[#1E75FF] text-white rounded-full text-[17px] font-semibold hover:bg-[#1565E6] transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : "Continue"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
