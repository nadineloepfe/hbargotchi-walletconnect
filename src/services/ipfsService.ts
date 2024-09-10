import axios from "axios";

// Function to upload JSON metadata to Pinata
export const uploadJsonToPinata = async (metadata: any) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    const headers = {
        "Content-Type": "application/json",
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY!,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET!,
        
    };

    const body = {
        pinataMetadata: {
            name: `metadata-${new Date().toISOString()}.json`,
        },
        pinataContent: metadata,
    };

    try {
        const response = await axios.post(url, body, { headers });
        console.log("Uploaded to Pinata:", response.data);
        return response.data.IpfsHash; // Return the IPFS hash
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw new Error("Failed to upload metadata to Pinata");
    }
};
