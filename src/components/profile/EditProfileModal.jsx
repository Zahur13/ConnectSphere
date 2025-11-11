import { useState, useRef } from "react";
import { X, Camera, Upload } from "lucide-react";
import userService from "../../services/api/userService";

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile.name || "",
    bio: profile.bio || "",
    profilePicture: profile.profilePicture || "",
    coverImage: profile.coverImage || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profilePicInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleImageSelect = (field, file) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex sticky top-0 justify-between items-center p-4 bg-white border-b">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full transition-colors hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Cover Image */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <div
              className="overflow-hidden relative h-32 bg-gradient-to-r to-purple-600 rounded-lg cursor-pointer from-primary-400 group"
              onClick={() => coverInputRef.current?.click()}
            >
              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="object-cover w-full h-full"
                />
              )}
              <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="text-center text-white">
                  <Upload className="mx-auto mb-2 w-8 h-8" />
                  <span className="text-sm">Change Cover Photo</span>
                </div>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleImageSelect("coverImage", e.target.files[0])
                }
              />
            </div>
          </div>

          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div
                className="overflow-hidden relative w-24 h-24 bg-gradient-to-br to-purple-600 rounded-full cursor-pointer from-primary-400 group"
                onClick={() => profilePicInputRef.current?.click()}
              >
                <img
                  src={formData.profilePicture}
                  alt={formData.name}
                  className="object-cover w-full h-full"
                />
                <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input
                  ref={profilePicInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageSelect("profilePicture", e.target.files[0])
                  }
                />
              </div>
              <p className="text-sm text-gray-500">
                Click to upload a new profile picture
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input-field"
              required
              maxLength={50}
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label
              htmlFor="bio"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="resize-none input-field"
              rows="4"
              placeholder="Tell us about yourself..."
              maxLength={150}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.bio.length}/150 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
