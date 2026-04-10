import { HeaderSearchButton } from "./header-search-button";
import { HeaderHelpButton } from "./header-help-button";
import { HeaderNotificationButton } from "./header-notification-button";
import { HeaderProfileButton } from "./header-profile-button";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <HeaderSearchButton />
      <HeaderHelpButton />
      <HeaderNotificationButton />
      <HeaderProfileButton />
    </div>
  );
}
