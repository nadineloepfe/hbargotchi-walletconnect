import { useNavigate } from "react-router-dom";

const useNavigateTo = () => {
  const navigate = useNavigate();

  const goToFeed = () => navigate("/feed");
  const goToHome = () => navigate("/home");
  const goToAdopt = () => navigate("/adopt");
  const goToFaq = () => navigate("/faq");
  const goToCommunity = () => navigate("/community");

  return { goToFeed, goToHome, goToAdopt, goToFaq, goToCommunity };
};

export default useNavigateTo;
