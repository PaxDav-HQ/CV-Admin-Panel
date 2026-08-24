import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

const UserConfirmModal = ({ confirmModal, onClose, onConfirm }) => {
  return (
    <Dialog
      open={confirmModal.open}
      onClose={() => !confirmModal.loading && onClose()}
      PaperProps={{
        sx: { borderRadius: "16px", p: 1, maxWidth: "440px", width: "100%" },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: "18px",
          color: "#111827",
          pb: 1,
        }}
      >
        {confirmModal.title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          sx={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.5 }}
        >
          {confirmModal.description}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          variant="outlined"
          disabled={confirmModal.loading}
          onClick={onClose}
          sx={{
            textTransform: "none",
            borderColor: "#D1D5DB",
            color: "#374151",
            fontWeight: 600,
            borderRadius: "8px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color={confirmModal.confirmColor}
          disabled={confirmModal.loading}
          onClick={onConfirm}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "8px",
            px: 3,
            bgcolor:
              confirmModal.confirmColor === "error"
                ? "#EF4444"
                : confirmModal.confirmColor === "warning"
                ? "#F59E0B"
                : "#111827",
            "&:hover": {
              bgcolor:
                confirmModal.confirmColor === "error"
                  ? "#DC2626"
                  : confirmModal.confirmColor === "warning"
                  ? "#D97706"
                  : "#1F2937",
            },
          }}
        >
          {confirmModal.loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserConfirmModal;