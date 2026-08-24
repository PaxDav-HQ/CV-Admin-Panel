import React from "react";
import { Typography, Paper, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

const RecentActivityModule = ({ recentActivity = [] }) => {
  return (
    <Paper elevation={0} className="p-4 border h-100 d-flex flex-column" sx={{ borderRadius: "20px", bgcolor: "#fff" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", mb: 2 }}>
        Recent Activity
      </Typography>
      <List disablePadding sx={{ flexGrow: 1 }}>
        {recentActivity.length > 0 ? (
          recentActivity.slice(0, 5).map((act, idx) => (
            <ListItem key={act.id || idx} disableGutters sx={{ py: 1.2, alignItems: "flex-start" }}>
              <ListItemAvatar sx={{ minWidth: "38px" }}>
                <Avatar sx={{ bgcolor: "#F3F4F6", color: "#374151", width: 28, height: 28, fontSize: "11px", fontWeight: 700 }}>
                  {act.type?.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827", fontSize: "12.5px" }}>
                    {act.description || act.type}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" className="text-muted" style={{ fontSize: "11px" }}>
                    {act.time}
                  </Typography>
                }
              />
            </ListItem>
          ))
        ) : (
          <div className="text-center py-4 text-muted small">No recent activity.</div>
        )}
      </List>
      <Button sx={{ textTransform: "none", color: "#16A34A", fontWeight: 700, mt: "auto", fontSize: "13px", alignSelf: "center" }}>
        View all activity &rarr;
      </Button>
    </Paper>
  );
};

export default RecentActivityModule;