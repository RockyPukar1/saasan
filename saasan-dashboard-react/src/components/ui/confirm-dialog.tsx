import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "success";
  middleButton?: {
    text: string;
    onClick: () => void;
  };
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  warning: "bg-yellow-600 text-white hover:bg-yellow-700",
  success: "bg-green-600 text-white hover:bg-green-700",
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  middleButton,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelText}
            </Button>
          )}
          {middleButton && (
            <Button
              variant="secondary"
              onClick={middleButton.onClick}
              disabled={loading}
            >
              {middleButton.text}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={variantStyles[variant]}
          >
            {loading ? "Please wait..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using confirm dialog
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    props: ConfirmDialogProps | null;
  }>({
    open: false,
    props: null,
  });

  const confirm = React.useCallback(
    (options: Omit<ConfirmDialogProps, "open" | "onOpenChange">) => {
      setDialogState({
        open: true,
        props: {
          ...options,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) {
              setDialogState({ open: false, props: null });
            }
          },
        },
      });
    },
    [],
  );

  const ConfirmDialogComponent = React.useCallback(
    ({ loading }: { loading?: boolean } = {}) => {
      if (!dialogState.props) return null;

      return (
        <ConfirmDialog
          {...dialogState.props}
          open={dialogState.open}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setDialogState({ open: false, props: null });
            }
          }}
          loading={loading}
        />
      );
    },
    [dialogState],
  );

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
};
