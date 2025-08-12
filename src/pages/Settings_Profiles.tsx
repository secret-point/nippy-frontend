import { useEffect, useState } from "react";
import { ProfileFormData } from "../types";
import { authAPI, usersAPI } from "../services";
import { AvatarSelectionModal } from "../components/AvatarSelectionModal";

export const Settings_Profiles: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.com",
    phoneNumber: "+1 (555) 123-4567",
    businessType: "Cafe",
    country: "US",
    city: "San Francisco",
    timezone: "America/Los_Angeles",
    language: "en",
  });

  // Location & Language options from backend
  const [locationOptions] = useState({
    countries: [
      { code: "US", name: "United States" },
      { code: "CA", name: "Canada" },
      { code: "GB", name: "United Kingdom" },
      { code: "AU", name: "Australia" },
      { code: "DE", name: "Germany" },
      { code: "FR", name: "France" },
      { code: "JP", name: "Japan" },
      { code: "KR", name: "South Korea" },
      { code: "SG", name: "Singapore" },
      { code: "IN", name: "India" },
      { code: "BR", name: "Brazil" },
      { code: "MX", name: "Mexico" },
    ],
    timezones: [
      {
        id: "America/New_York",
        label: "(GMT-05:00) Eastern Time (US & Canada)",
      },
      {
        id: "America/Chicago",
        label: "(GMT-06:00) Central Time (US & Canada)",
      },
      {
        id: "America/Denver",
        label: "(GMT-07:00) Mountain Time (US & Canada)",
      },
      {
        id: "America/Los_Angeles",
        label: "(GMT-08:00) Pacific Time (US & Canada)",
      },
      { id: "Europe/London", label: "(GMT+00:00) Greenwich Mean Time" },
      { id: "Europe/Paris", label: "(GMT+01:00) Central European Time" },
      {
        id: "Europe/Berlin",
        label: "(GMT+01:00) Central European Time (Berlin)",
      },
      { id: "Asia/Tokyo", label: "(GMT+09:00) Japan Standard Time" },
      { id: "Asia/Seoul", label: "(GMT+09:00) Korea Standard Time" },
      { id: "Asia/Singapore", label: "(GMT+08:00) Singapore Time" },
      { id: "Australia/Sydney", label: "(GMT+10:00) Australian Eastern Time" },
      {
        id: "Pacific/Auckland",
        label: "(GMT+12:00) New Zealand Standard Time",
      },
    ],
    languages: [
      { code: "en", name: "English" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "pt", name: "Portuguese" },
      { code: "ja", name: "Japanese" },
      { code: "ko", name: "Korean" },
      { code: "zh", name: "Chinese" },
      { code: "ar", name: "Arabic" },
      { code: "ru", name: "Russian" },
      { code: "hi", name: "Hindi" },
    ],
  });

  // Store initial data for reset functionality
  const [initialProfileData, setInitialProfileData] = useState<ProfileFormData>(
    {
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      phoneNumber: "+1 (555) 123-4567",
      businessType: "Cafe",
      country: "United States",
      city: "San Francisco",
      timezone: "(GMT-08:00) Pacific Time (US & Canada)",
      language: "English",
    }
  );
  // Function to reset profile data to initial state
  const [isLoadingBasicInfo, setIsLoadingBasicInfo] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoadingLocationLanguage, setIsLoadingLocationLanguage] =
    useState(false);
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };
  const openAvatarModal = () => {
    setShowAvatarModal(true);
  };

  const closeAvatarModal = () => {
    setShowAvatarModal(false);
  };

  // Separate handlers for Profile sections
  const handleSaveBasicInfo = async () => {
    setIsLoadingBasicInfo(true);
    setSaveMessage(null);
    try {
      // Get current user
      const currentUser = authAPI.getCurrentUser();
      if (!currentUser) throw new Error("User not found");
      // Call backend API to update user info
      await usersAPI.updateUserBasic(currentUser.id, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        businessType: profileData.businessType,
      });
      // Update initial data to current data for basic info only
      setInitialProfileData((prev) => ({
        ...prev,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        businessType: profileData.businessType,
      }));
      setSaveMessage("Basic information saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage("Failed to save basic information. Please try again.");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoadingBasicInfo(false);
    }
  };

  const handleSaveLocationLanguage = async () => {
    setIsLoadingLocationLanguage(true);
    setSaveMessage(null);
    try {
      await usersAPI.updateLocation({
        country: profileData.country,
        city: profileData.city,
        timezone: profileData.timezone,
        language: profileData.language,
      });
      setInitialProfileData((prev) => ({
        ...prev,
        country: profileData.country,
        city: profileData.city,
        timezone: profileData.timezone,
        language: profileData.language,
      }));
      setSaveMessage("Location & language preferences saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage(
        "Failed to save location & language preferences. Please try again."
      );
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoadingLocationLanguage(false);
    }
  };

  const handleResetBasicInfo = () => {
    setProfileData((prev) => ({
      ...prev,
      firstName: initialProfileData.firstName,
      lastName: initialProfileData.lastName,
      phoneNumber: initialProfileData.phoneNumber,
      businessType: initialProfileData.businessType,
    }));
    setSaveMessage("Basic information reset to saved values.");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleResetLocationLanguage = () => {
    setProfileData((prev) => ({
      ...prev,
      country: initialProfileData.country,
      city: initialProfileData.city,
      timezone: initialProfileData.timezone,
      language: initialProfileData.language,
    }));
    setSaveMessage("Location & language preferences reset to saved values.");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Load current user's avatar on component mount
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser?.avatar) {
      // Convert relative URL to absolute URL if needed
      const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const fullAvatarUrl = currentUser.avatar.startsWith("http")
        ? currentUser.avatar
        : `${baseURL}${currentUser.avatar}`;
      setAvatarUrl(fullAvatarUrl);
    }

    // Also update profile data with current user info
    if (currentUser) {
      const updatedProfileData = {
        ...profileData,
        firstName: currentUser.firstName || profileData.firstName,
        lastName: currentUser.lastName || profileData.lastName,
        email: currentUser.email || profileData.email,
      };
      setProfileData(updatedProfileData);

      // Initialize the initial data states with current data
      setInitialProfileData(updatedProfileData);
    } else {
      // Initialize with current state if no user
      setInitialProfileData(profileData);
    }
  }, []);

  // Load Basic Information and Location & Language Information on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) return;
        const profile = await usersAPI.getProfile();
        const profileData = {
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          phoneNumber: profile.phone || "",
          businessType: profile.businessType || "",
          email: profile.email || "",
          country: profile.country || "",
          city: profile.city || "",
          timezone: profile.timezone || "",}

        setProfileData((prev) => ({
          ...prev,
          ...profileData,
        }));
        setInitialProfileData((prev) => ({
          ...prev,
          ...profileData,
        }));
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-8">
      {/* Save Message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg border ${
            saveMessage.includes("successfully") ||
            saveMessage.includes("reset")
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {saveMessage}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Basic Information
          </h2>

          {/* Profile Image */}
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={() => {
                    console.error("Failed to load avatar:", avatarUrl);
                    // Fallback to show default avatar if image fails to load
                    setAvatarUrl(null);
                  }}
                />
              ) : (
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={openAvatarModal}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Change Avatar
              </button>
              <p className="text-sm text-gray-500">
                We recommend an image of at least 128x128. Larger images will be
                resized to fit.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="relative">
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <label className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">
                First Name
              </label>
            </div>

            {/* Last Name */}
            <div className="relative">
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <label className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">
                Last Name
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-500">
                Email Address
              </label>
            </div>
            <div className="text-xs text-gray-500 w-20">Cannot be changed</div>
          </div>

          {/* Phone Number */}
          <div className="relative">
            <input
              type="tel"
              value={profileData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              pattern="^\\+?[1-9]\\d{1,14}$"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="+1234567890"
            />
            <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-500">
              Phone Number
            </label>
            <small className="text-xs text-gray-500">
              Enter phone in international format, e.g. +1234567890
            </small>
          </div>

          {/* Business Type - Combo Box */}
          <div className="relative">
            <select
              value={profileData.businessType}
              onChange={(e) =>
                handleInputChange("businessType", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="">Select Business Type</option>
              <option value="cafe">Cafe</option>
              <option value="saloon">Saloon</option>
              <option value="clothing_store">Clothing Store</option>
              <option value="food_business">Food Business</option>
              <option value="other">Other</option>
            </select>
            <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-500">
              Business Type
            </label>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11.9995 16.8C11.2995 16.8 10.5995 16.53 10.0695 16L3.54953 9.48001C3.25953 9.19001 3.25953 8.71001 3.54953 8.42001C3.83953 8.13001 4.31953 8.13001 4.60953 8.42001L11.1295 14.94C11.6095 15.42 12.3895 15.42 12.8695 14.94L19.3895 8.42001C19.6795 8.13001 20.1595 8.13001 20.4495 8.42001C20.7395 8.71001 20.7395 9.19001 20.4495 9.48001L13.9295 16C13.3995 16.53 12.6995 16.8 11.9995 16.8Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleResetBasicInfo}
              disabled={isLoadingBasicInfo}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              onClick={handleSaveBasicInfo}
              disabled={isLoadingBasicInfo}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingBasicInfo && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Location & Language */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Location & Language
          </h2>

          {/* Location Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country */}
            <div className="relative">
              <select
                value={profileData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="">Select Country</option>
                {locationOptions.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-500">
                Country
              </label>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.9995 16.8C11.2995 16.8 10.5995 16.53 10.0695 16L3.54953 9.48001C3.25953 9.19001 3.25953 8.71001 3.54953 8.42001C3.83953 8.13001 4.31953 8.13001 4.60953 8.42001L11.1295 14.94C11.6095 15.42 12.3895 15.42 12.8695 14.94L19.3895 8.42001C19.6795 8.13001 20.1595 8.13001 20.4495 8.42001C20.7395 8.71001 20.7395 9.19001 20.4495 9.48001L13.9295 16C13.3995 16.53 12.6995 16.8 11.9995 16.8Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* City */}
            <div className="relative">
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-500">
                City
              </label>
            </div>
          </div>

          {/* Language Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timezone */}
            <div className="relative">
              <select
                value={profileData.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="">Select Timezone</option>
                {locationOptions.timezones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-500">
                Timezone
              </label>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.9995 16.8C11.2995 16.8 10.5995 16.53 10.0695 16L3.54953 9.48001C3.25953 9.19001 3.25953 8.71001 3.54953 8.42001C3.83953 8.13001 4.31953 8.13001 4.60953 8.42001L11.1295 14.94C11.6095 15.42 12.3895 15.42 12.8695 14.94L19.3895 8.42001C19.6795 8.13001 20.1595 8.13001 20.4495 8.42001C20.7395 8.71001 20.7395 9.19001 20.4495 9.48001L13.9295 16C13.3995 16.53 12.6995 16.8 11.9995 16.8Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Language */}
            <div className="relative">
              <select
                value={profileData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="">Select Language</option>
                {locationOptions.languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-500">
                Language Preference
              </label>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.9995 16.8C11.2995 16.8 10.5995 16.53 10.0695 16L3.54953 9.48001C3.25953 9.19001 3.25953 8.71001 3.54953 8.42001C3.83953 8.13001 4.31953 8.13001 4.60953 8.42001L11.1295 14.94C11.6095 15.42 12.3895 15.42 12.8695 14.94L19.3895 8.42001C19.6795 8.13001 20.1595 8.13001 20.4495 8.42001C20.7395 8.71001 20.7395 9.19001 20.4495 9.48001L13.9295 16C13.3995 16.53 12.6995 16.8 11.9995 16.8Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleResetLocationLanguage}
              disabled={isLoadingLocationLanguage}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              onClick={handleSaveLocationLanguage}
              disabled={isLoadingLocationLanguage}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingLocationLanguage && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {showAvatarModal && (
        <AvatarSelectionModal
          isOpen={showAvatarModal}
          onClose={closeAvatarModal}
          onAvatarSelected={(newAvatarUrl) => {
            setAvatarUrl(newAvatarUrl);
            closeAvatarModal();
          }}
        />
      )}
    </div>
  );
};
