"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { useLang } from "../../../src/LanguageContext";

export default function LearnPage() {
  const { t } = useLang();

  const faqData = [
    {
      question: t.faqWhatIsStableFoundation,
      answer: t.faqWhatIsStableFoundationAnswer,
    },
    {
      question: t.faqWhatIsCryptocurrency,
      answer: t.faqWhatIsCryptocurrencyAnswer,
    },
    {
      question: t.faqWhatIsBlockchain,
      answer: t.faqWhatIsBlockchainAnswer,
    },
    {
      question: t.faqHowToKeepWalletSecure,
      answer: t.faqHowToKeepWalletSecureAnswer,
    },
    {
      question: t.faqWhatAreTransactionFees,
      answer: t.faqWhatAreTransactionFeesAnswer,
    },
    {
      question: t.faqWhatIsDao,
      answer: t.faqWhatIsDaoAnswer,
    },
    {
      question: t.faqHowToParticipateGovernance,
      answer: t.faqHowToParticipateGovernanceAnswer,
    },
    {
      question: t.faqWhatIsDefi,
      answer: t.faqWhatIsDefiAnswer,
    },
  ];
  return (
    <Box
      sx={{
        minHeight: "unset",
        height: "auto",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <PageChildrenTitleBar title={t.learnTitle} />

      <Box sx={{ width: "100%", maxWidth: 480, px: 2 }}>
        {/* FAQ Section */}
        <Card
          sx={{
            boxShadow: "0 2px 16px rgba(153, 50, 204, 0.08)",
            border: "1px solid rgba(153, 50, 204, 0.05)",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#333",
                fontWeight: 600,
                mb: 2,
                textAlign: "center",
              }}
            >
              {t.frequentlyAskedQuestions}
            </Typography>

            {faqData.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 1,
                  "&:before": { display: "none" },
                  boxShadow: "none",
                  border: "1px solid rgba(153, 50, 204, 0.1)",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: "#fafbfc",
                    "&:hover": { bgcolor: "#f5f6fa" },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: "#fff" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
