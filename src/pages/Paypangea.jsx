import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import BannerPaypangea from "../sections/banner/v3/BannerPaypangea";

const Home = () => {
  return (
    <Layout pageTitle="Battery - paypangea">
      <Header variant="paypangea" />
      <BannerPaypangea />
    </Layout>
  );
};

export default Home;
