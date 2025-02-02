import { useState } from "react";
import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import Banner from "../sections/banner/v3/Banner";

const Home = () => {
  const [isPayPangea, setIsPayPangea] = useState(false);

  return (
    <Layout pageTitle="Battery - Presale">
      <Header
        variant="v2"
        isPayPangea={isPayPangea}
        setIsPayPangea={setIsPayPangea}
      />
      <Banner isPayPangea={isPayPangea} />
    </Layout>
  );
};

export default Home;
