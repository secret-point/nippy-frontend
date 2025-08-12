import { useState } from "react";
import { NotificationSettings } from "../types";
import { usersAPI } from "../services/usersAPI";
const Toggle: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    className={`relative w-10 h-5 rounded-full transition-colors ${
      disabled
        ? "bg-gray-300 cursor-not-allowed"
        : enabled
        ? "bg-purple-600"
        : "bg-gray-300"
    }`}
    disabled={disabled}
  >
    <div
      className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

export const Settings_Notifications: React.FC = () => {
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      newFreelancerProposals: true,
      jobStatusUpdates: true,
      newMessageAlertsWeb: true,
      newMessageAlertsEmail: true,
      messageReadReceipts: true,
      platformUpdates: false,
      promotionsOffers: false,
      pushNotifications: true,
      desktopNotifications: true,
      mobilePushNotifications: false,
      notificationFrequency: "realtime",
      quietHoursEnabled: false,
      quietHoursWeekends: false,
      quietHoursFrom: "12:00 AM",
      quietHoursTo: "13:00 PM",
      notificationSound: "off",
    });

  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const updateNotificationSetting = (
    key: keyof NotificationSettings,
    value: any
  ) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Handlers for other tabs (notifications, security)
  const handleSaveNotifications = async () => {
    setIsLoadingNotifications(true);
    setSaveMessage(null);
    try {
      await usersAPI.updateNotifications(notificationSettings);
      setSaveMessage("Notification settings saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage("Failed to save notification settings. Please try again.");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoadingNotifications(false);
    }
  };
  // Disable notification toggles if emailNotifications is false
  // const notificationToggleDisabled = !notificationSettings.emailNotifications;
  const [showAddPaymentSimpleModal, setShowAddPaymentSimpleModal] = useState(false);
  console.log(showAddPaymentSimpleModal);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const handleResetNotifications = () => {
    setNotificationSettings(notificationSettings);
    setSaveMessage("Notification settings reset to saved values.");
    setTimeout(() => setSaveMessage(null), 3000);
  };
  // Toggle notification settings
  // const handleNotificationToggle = (key: keyof NotificationSettings) => {
  //   setNotificationSettings((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };
  // Save notification settings to backend
  // const saveNotificationSettings = async () => {
  //   try {
  //     await usersAPI.updateNotifications(notificationSettings);
  //     alert("Notification settings saved successfully!");
  //   } catch (error) {
  //     console.error("Failed to save notification settings:", error);
  //     alert("Failed to save notification settings. Please try again.");
  //   }
  // };
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

      {/* Email Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Main Email Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Email Notifications
              </h2>
              <p className="text-sm text-gray-600">
                You'll receive important notifications via email and in-app. You
                can opt out of non-essential updates below.
              </p>
            </div>
            <Toggle
              enabled={notificationSettings.emailNotifications}
              onChange={(enabled) =>
                updateNotificationSetting("emailNotifications", enabled)
              }
            />
          </div>

          {/* Job Updates Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-600"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M5.75 2H10.25C10.3875 2 10.5 2.1125 10.5 2.25V3.5H5.5V2.25C5.5 2.1125 5.6125 2 5.75 2ZM4 2.25V3.5H2C0.896875 3.5 0 4.39687 0 5.5V8.5H6H10H16V5.5C16 4.39687 15.1031 3.5 14 3.5H12V2.25C12 1.28438 11.2156 0.5 10.25 0.5H5.75C4.78438 0.5 4 1.28438 4 2.25Z"
                  fill="currentColor"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Job Updates</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    New freelancer proposals
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get notified when new jobs matching your skills are posted
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.newFreelancerProposals}
                  onChange={(enabled) =>
                    updateNotificationSetting("newFreelancerProposals", enabled)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Job status updates
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get notified when there are changes to your job applications
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.jobStatusUpdates}
                  onChange={(enabled) =>
                    updateNotificationSetting("jobStatusUpdates", enabled)
                  }
                />
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-600"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M2 0.500351C0.896875 0.500351 0 1.39723 0 2.50035V11.5004C0 12.6035 0.896875 13.5004 2 13.5004H5V16.0004C5 16.191 5.10625 16.3629 5.275 16.4472C5.44375 16.5316 5.64688 16.5128 5.8 16.4004L9.66562 13.5004H14C15.1031 13.5004 16 12.6035 16 11.5004V2.50035C16 1.39723 15.1031 0.500351 14 0.500351H2Z"
                  fill="currentColor"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Messages</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    New message alerts (Web)
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get in-app notifications for new messages
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.newMessageAlertsWeb}
                  onChange={(enabled) =>
                    updateNotificationSetting("newMessageAlertsWeb", enabled)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    New message alerts (Email)
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get email notifications for new messages
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.newMessageAlertsEmail}
                  onChange={(enabled) =>
                    updateNotificationSetting("newMessageAlertsEmail", enabled)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Message read receipts
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get notified when clients read your messages
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.messageReadReceipts}
                  onChange={(enabled) =>
                    updateNotificationSetting("messageReadReceipts", enabled)
                  }
                />
              </div>
            </div>
          </div>

          {/* Marketing Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-600"
                viewBox="0 0 14 17"
                fill="none"
              >
                <path
                  d="M6.9994 0.5C6.44628 0.5 5.9994 0.946875 5.9994 1.5V2.1C3.71815 2.5625 1.9994 4.58125 1.9994 7V7.5875C1.9994 9.05625 1.45878 10.475 0.483777 11.575L0.252527 11.8344C-0.00997317 12.1281 -0.0724732 12.55 0.0869018 12.9094C0.246277 13.2688 0.605652 13.5 0.999402 13.5H12.9994C13.3932 13.5 13.7494 13.2688 13.9119 12.9094C14.0744 12.55 14.0088 12.1281 13.7463 11.8344L13.515 11.575C12.54 10.475 11.9994 9.05937 11.9994 7.5875V7C11.9994 4.58125 10.2807 2.5625 7.9994 2.1V1.5C7.9994 0.946875 7.55253 0.5 6.9994 0.5Z"
                  fill="currentColor"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Marketing</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Platform updates
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get notified about new features and updates
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.platformUpdates}
                  onChange={(enabled) =>
                    updateNotificationSetting("platformUpdates", enabled)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Promotions and offers
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get notified about special promotions and offers
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.promotionsOffers}
                  onChange={(enabled) =>
                    updateNotificationSetting("promotionsOffers", enabled)
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleResetNotifications}
              disabled={isLoadingNotifications}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              onClick={handleSaveNotifications}
              disabled={isLoadingNotifications}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingNotifications && (
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
              Save Notification Settings
            </button>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Push Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  Enable Push Notifications
                </h4>
                <p className="text-xs text-gray-600">
                  Receive notifications even when you're not using the app
                </p>
              </div>
              <Toggle
                enabled={notificationSettings.pushNotifications}
                onChange={(enabled) =>
                  updateNotificationSetting("pushNotifications", enabled)
                }
              />
            </div>

            <div className="pl-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Desktop notifications
                  </h4>
                  <p className="text-xs text-gray-600">
                    Show notifications on your desktop
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.desktopNotifications}
                  onChange={(enabled) =>
                    updateNotificationSetting("desktopNotifications", enabled)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Mobile push notifications
                  </h4>
                  <p className="text-xs text-gray-600">
                    Send push notifications to your mobile device
                  </p>
                </div>
                <Toggle
                  enabled={notificationSettings.mobilePushNotifications}
                  onChange={(enabled) =>
                    updateNotificationSetting(
                      "mobilePushNotifications",
                      enabled
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Notification Preferences
          </h2>

          {/* Notification Frequency */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              Notification Frequency
            </h4>
            <div className="space-y-2">
              {[
                {
                  value: "realtime",
                  label: "Real-time (Receive notifications as they happen)",
                },
                {
                  value: "daily",
                  label: "Daily digest (Receive a daily summary)",
                },
                {
                  value: "weekly",
                  label: "Weekly digest (Receive a weekly summary)",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={
                      notificationSettings.notificationFrequency ===
                      option.value
                    }
                    onChange={(e) =>
                      updateNotificationSetting(
                        "notificationFrequency",
                        e.target.value
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Quiet Hours
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Don't send notifications during these hours
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <select
                    value={notificationSettings.quietHoursFrom}
                    onChange={(e) =>
                      updateNotificationSetting(
                        "quietHoursFrom",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option>12:00 AM</option>
                    <option>1:00 AM</option>
                    <option>2:00 AM</option>
                    <option>11:00 PM</option>
                  </select>
                  <label className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">
                    From
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

                <div className="relative">
                  <select
                    value={notificationSettings.quietHoursTo}
                    onChange={(e) =>
                      updateNotificationSetting("quietHoursTo", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option>13:00 PM</option>
                    <option>6:00 AM</option>
                    <option>7:00 AM</option>
                    <option>8:00 AM</option>
                  </select>
                  <label className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">
                    To
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

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.quietHoursWeekends}
                  onChange={(e) =>
                    updateNotificationSetting(
                      "quietHoursWeekends",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">
                  Apply quiet hours to weekends
                </span>
              </label>
            </div>
          </div>

          {/* Notification Sound */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              Notification Sound
            </h4>
            <div className="space-y-2">
              {[
                { value: "on", label: "Sound on" },
                { value: "off", label: "Sound off" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sound"
                    value={option.value}
                    checked={
                      notificationSettings.notificationSound === option.value
                    }
                    onChange={(e) =>
                      updateNotificationSetting(
                        "notificationSound",
                        e.target.value
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleResetNotifications}
              disabled={isLoadingNotifications}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>

            <button
              onClick={handleSaveNotifications}
              disabled={isLoadingNotifications}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Add Payment Method Button */}
      <button
        onClick={() => setShowAddPaymentSimpleModal(true)}
        className="flex items-center gap-3 text-purple-600 hover:text-purple-700 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
          <path
            d="M11.5385 1.53846C11.5385 0.6875 10.851 0 10 0C9.14904 0 8.46154 0.6875 8.46154 1.53846V8.46154H1.53846C0.6875 8.46154 0 9.14904 0 10C0 10.851 0.6875 11.5385 1.53846 11.5385H8.46154V18.4615C8.46154 19.3125 9.14904 20 10 20C10.851 20 11.5385 19.3125 11.5385 18.4615V11.5385H18.4615C19.3125 11.5385 20 10.851 20 10C20 9.14904 19.3125 8.46154 18.4615 8.46154H11.5385V1.53846Z"
            fill="currentColor"
          />
        </svg>
        <span className="font-medium">Add Payment Method</span>
      </button>
    </div>
  );
};
