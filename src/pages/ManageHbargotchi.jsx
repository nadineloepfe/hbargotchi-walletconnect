import React, { useState } from "react";
import treatTokenMintFcn from "./hedera/foodTokenMint";  
import feedHbargotchi from "./hedera/feedHbargotchi";  

function ManageHbargotchi({ walletData, accountId, hbargotchiTokenId }) {
    const [feedTextSt, setFeedTextSt] = useState("");

    const feedNFT = async () => {
        try {
            await feedHbargotchi(walletData, accountId, hbargotchiTokenId);
            setFeedTextSt("Your Hbargotchi is now fed and happy! ✅");
        } catch (error) {
            console.error("Error feeding Hbargotchi:", error);
            setFeedTextSt("Failed to feed Hbargotchi. Please try again. 🛑");
        }
    };

    return (
        <div>
            <h2>Manage Hbargotchi</h2>
            <button onClick={feedNFT}>Feed Hbargotchi</button>
            {feedTextSt && <p>{feedTextSt}</p>}
        </div>
    );
}

export default ManageHbargotchi;
