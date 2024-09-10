import { Accordion, AccordionSummary, AccordionDetails, Typography, Container } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack } from "@mui/system";

const faqData = [
  {
    question: "1. What is Hbargotchi?",
    answer: "Hbargotchi is a Web3-based virtual pet project where users can create, mint, and take care of their own digital pets using blockchain technology. It combines the nostalgia of virtual pets with the modern functionality of decentralized technology."
  },
  {
    question: "2. How does Hbargotchi work?",
    answer: "Users can connect their wallets, mint unique digital pets, and interact with them through a set of on-chain actions. Each pet has its unique traits and can be nurtured through various activities, much like traditional virtual pets."
  },
  {
    question: "3. What ledger is Hbargotchi built on?",
    answer: "Hbargotchi is built on Hedera Hashgraph, leveraging its speed, security, and low-cost transactions to manage ownership and interactions with your digital pets."
  },
  {
    question: "4. How do I mint a pet?",
    answer: "To mint a pet, connect your Hedera-compatible wallet using WalletConnect. Once connected, you can mint a new pet by following the steps provided on the platform and paying the required transaction fee."
  },
  {
    question: "5. What is the role of the wallet in Hbargotchi?",
    answer: "Your wallet is used to securely store your digital pets on ledger. You’ll need a compatible wallet to interact with the platform, mint new pets, and manage your existing ones."
  },
];

export default function FAQ() {
  return (
    <Container maxWidth="md" sx={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <Stack alignItems="center" spacing={4}>
        <Typography variant="h4" color="primary" sx={{ marginBottom: '30px' }}>
          Hbargotchi FAQ
        </Typography>
        <br></br>
        {faqData.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
              <Typography variant="h6" color="white">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="white">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Container>
  );
}
