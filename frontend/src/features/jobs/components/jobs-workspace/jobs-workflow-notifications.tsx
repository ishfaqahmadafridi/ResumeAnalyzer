interface Props {
  notifications?: string[];
}

export function JobsWorkflowNotifications({ notifications = [] }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-stone-900">Notifications</p>
      {notifications.length > 0 ? (
        <ul className="mt-2 space-y-2 text-sm text-stone-600">
          {notifications.map((notification) => (
            <li key={notification}>{notification}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-stone-500">No notifications available.</p>
      )}
    </div>
  );
}
