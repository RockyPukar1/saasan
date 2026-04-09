import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: Toast["type"], duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast["type"], duration = 3000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600";
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg border min-w-[300px] max-w-md animate-in slide-in-from-right-full ${getToastStyles(toast.type)}`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white hover:opacity-80"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// Toast hook for easy usage
export const toast = {
  success: (message: string, duration?: number) => {
    const { addToast } = useToast();
    addToast(message, "success", duration);
  },
  error: (message: string, duration?: number) => {
    const { addToast } = useToast();
    addToast(message, "error", duration);
  },
  warning: (message: string, duration?: number) => {
    const { addToast } = useToast();
    addToast(message, "warning", duration);
  },
  info: (message: string, duration?: number) => {
    const { addToast } = useToast();
    addToast(message, "info", duration);
  },
};
