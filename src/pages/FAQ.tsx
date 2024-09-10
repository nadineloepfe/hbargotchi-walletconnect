import { Accordion, AccordionSummary, AccordionDetails, Typography, Container } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack } from "@mui/system";

export default function FAQ() {
  return (
    <Container maxWidth="md" sx={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <Stack alignItems="center" spacing={4}>
        <Typography variant="h4" color="white" sx={{ marginBottom: '30px' }}>
          Hbargotchi FAQ
        </Typography>
<br></br>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h6" color="white">1. What is Hbargotchi?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="white">
              Hbargotchi is a Web3-based virtual pet project where users can create, mint, and take care
              of their own digital pets using blockchain technology. It combines the nostalgia of virtual
              pets with the modern functionality of decentralized technology.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
            <Typography variant="h6" color="white">2. How does Hbargotchi work?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="white">
              Users can connect their wallets, mint unique digital pets, and interact with them through
              a set of on-chain actions. Each pet has its unique traits and can be nurtured through
              various activities, much like traditional virtual pets.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
            <Typography variant="h6" color="white">3. What ledger is Hbargotchi built on?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="white">
              Hbargotchi is built on Hedera Hashgraph, leveraging its speed, security, and
              low-cost transactions to manage ownership and interactions with your digital pets.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4a-content" id="panel4a-header">
            <Typography variant="h6" color="white">4. How do I mint a pet?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="white">
              To mint a pet, connect your Hedera-compatible wallet using WalletConnect. Once connected, you 
              can mint a new pet by following the steps provided on the platform and paying the required transaction fee.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Add more questions similarly */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5a-content" id="panel5a-header">
            <Typography variant="h6" color="white">5. What is the role of the wallet in Hbargotchi?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="white">
              Your wallet is used to securely store your digital pets on ledger. You’ll need a
              compatible wallet to interact with the platform, mint new pets, and manage your existing ones.
            </Typography>
          </AccordionDetails>
        </Accordion>

      </Stack>
    </Container>
  );
}
