import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";

export default function Community() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
      const topicId = "0.0.4839813";

      try {
        const topicMessages = await mirrorNodeClient.getTopicMessages(topicId);
        setMessages(topicMessages.reverse()); // Newest first
      } catch (error) {
        console.error("Error fetching topic messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white">
        Hbargotchi Community Feed
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "#2d2d2d",
                  color: "white",
                  padding: 2,
                  margin: "10px 0",
                  borderRadius: "8px",
                  width: "100%",
                  maxWidth: "800px",
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {message.content}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {new Date(Number(message.timestamp) * 1000).toLocaleString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No messages found.</Typography>
          )}
        </>
      )}
    </Stack>
  );
}
