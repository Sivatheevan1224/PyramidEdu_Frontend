export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "#ef4444";
    case "MEDIUM":
      return "#f59e0b";
    default:
      return "#3b82f6";
  }
};
