import React from "react";
import UpdateDetail from "../../../Components/dashboard/shared/UpdateDetail";
import ProfileAccount from "../../../Components/dashboard/shared/ProfileAccount";
import DeleteAccount from "../../../Components/dashboard/shared/DeleteAccount";

const StudentSetting = () => {
  return (
    <section className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-ink font-semibold font-display text-2xl sm:text-3xl">
          Settings
        </h1>
        <p className="text-ink-soft font-sans text-xs sm:text-sm mt-1">
          Manage your account details and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <ProfileAccount />
        <UpdateDetail />
        <div className="md:col-span-2">
          <DeleteAccount />
        </div>
      </div>
    </section>
  );
};

export default StudentSetting;
