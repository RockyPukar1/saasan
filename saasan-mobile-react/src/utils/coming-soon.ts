import toast from "react-hot-toast";

export const showComingSoon = (feature: string) => {
  toast(`${feature} coming soon!`, {
    icon: "🚧",
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};
