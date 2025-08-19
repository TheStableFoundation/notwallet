import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

type WalletCreatedProps = {
  mnemonic: string;
  pubkey: string;
  privkey: string;
};

export default function WalletCreated({
  mnemonic,
  pubkey,
  privkey,
}: WalletCreatedProps) {
  const [showPrivkeyModal, setShowPrivkeyModal] = React.useState(false);
  const [privkeyVisible, setPrivkeyVisible] = React.useState(false);
  const privkeyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleShowPrivkey = () => {
    setShowPrivkeyModal(true);
    setPrivkeyVisible(true);
    if (privkeyTimeoutRef.current) clearTimeout(privkeyTimeoutRef.current);
    privkeyTimeoutRef.current = setTimeout(() => {
      setPrivkeyVisible(false);
      setShowPrivkeyModal(false);
    }, 10000); // 10 seconds
  };

  const handleClosePrivkeyModal = () => {
    setPrivkeyVisible(false);
    setShowPrivkeyModal(false);
    if (privkeyTimeoutRef.current) clearTimeout(privkeyTimeoutRef.current);
  };

  return (
    <>
      <Typography
        variant="subtitle1"
        align="center"
        fontWeight="medium"
        sx={{ mb: 2 }}
      >
        Your new seed phrase:
      </Typography>
      <Box
        sx={{
          bgcolor: "#f3f4f6",
          borderRadius: 2,
          p: 2,
          mb: 2,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: "1.1rem",
          wordBreak: "break-word",
          userSelect: "all",
        }}
      >
        {mnemonic}
      </Box>
      {pubkey && (
        <Box
          sx={{
            mb: 2,
            bgcolor: "#e3f2fd",
            borderRadius: 1,
            px: 1.5,
            py: 1,
            textAlign: "left",
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
            wordBreak: "break-all",
            whiteSpace: "normal",
          }}
        >
          <Box
            component="pre"
            sx={{
              m: 0,
              fontFamily: "monospace",
              fontSize: "0.95rem",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
              flex: 1,
              background: "none",
              border: "none",
              p: 0,
              userSelect: "all",
              minWidth: 0,
            }}
          >
            {pubkey}
          </Box>
          <Button
            size="small"
            variant="outlined"
            sx={{ minWidth: 0, px: 1 }}
            onClick={() => navigator.clipboard.writeText(pubkey)}
          >
            Copy
          </Button>
        </Box>
      )}
      {/* Show private key for debugging */}
      {privkey && (
        <>
          <Button
            size="small"
            variant="outlined"
            sx={{ minWidth: 0, px: 1, mb: 1 }}
            onClick={handleShowPrivkey}
          >
            Show Private Key
          </Button>
          <Modal
            open={showPrivkeyModal}
            onClose={handleClosePrivkeyModal}
            aria-labelledby="privkey-modal-title"
            aria-describedby="privkey-modal-desc"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "#fff",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                minWidth: 320,
                maxWidth: 480,
                outline: "none",
              }}
            >
              <Typography
                id="privkey-modal-title"
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: "#e53935" }}
              >
                Private Key (hidden in {privkeyVisible ? "10" : "0"}s)
              </Typography>
              {privkeyVisible ? (
                <Box
                  sx={{
                    mb: 2,
                    bgcolor: "#ffe0e0",
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    textAlign: "left",
                    maxWidth: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    wordBreak: "break-all",
                    whiteSpace: "normal",
                  }}
                >
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      fontFamily: "monospace",
                      fontSize: "0.95rem",
                      wordBreak: "break-all",
                      whiteSpace: "pre-wrap",
                      flex: 1,
                      background: "none",
                      border: "none",
                      p: 0,
                      userSelect: "all",
                      minWidth: 0,
                      color: "#e53935",
                    }}
                  >
                    {privkey}
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 0, px: 1 }}
                    onClick={() => navigator.clipboard.writeText(privkey)}
                  >
                    Copy
                  </Button>
                </Box>
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 2 }}
                >
                  Private key is hidden for your safety.
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleClosePrivkeyModal}
              >
                Close
              </Button>
            </Box>
          </Modal>
        </>
      )}
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 1 }}
      >
        Please write down or securely store this seed phrase. It is the only way
        to recover your wallet.
      </Typography>
    </>
  );
}
