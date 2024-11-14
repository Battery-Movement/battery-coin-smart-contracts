import styled from "styled-components";

import BannerBgImg from "../../../assets/images/banner/banner3-bg.png";

const BannerWrapper = styled.div`
  padding: 160px 0 100px 0;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  z-index: 0;
  background-image: url(${BannerBgImg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  .banner-title {
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 70px;
    font-weight: 700;
    line-height: 90px;

    span {
      background: ${({ theme }) => theme.colors.bannerv3LinearGradient};
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: ${({ theme }) => theme.fonts.title};
      font-size: 70px;
      font-style: normal;
      font-weight: 700;
      line-height: 90px;
    }
  }

  @media screen and (max-width: 991px) {
    .banner-title {
      font-size: 60px;
      line-height: 80px;

      span {
        font-size: 60px;
        line-height: 80px;
      }
    }
  }

  @media screen and (max-width: 767px) {
    .banner-title {
      font-size: 45px;
      line-height: 70px;

      span {
        font-size: 45px;
        line-height: 70px;
      }
    }
  }

  @media screen and (max-width: 575px) {
    .banner-title {
      font-size: 40px;
      line-height: 60px;

      span {
        font-size: 40px;
        line-height: 60px;
      }
    }
  }

  @media screen and (max-width: 480px) {
    .banner-title {
      font-size: 30px;
      line-height: 50px;

      span {
        font-size: 30px;
        line-height: 50px;
      }
    }
  }
`;

export default BannerWrapper;
