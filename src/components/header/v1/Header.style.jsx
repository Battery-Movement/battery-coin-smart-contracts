import styled from "styled-components";

const HeaderWrapper = styled.div`
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  padding: 25px 0;
  transition: 0.3s;

  &.sticky {
    background: ${({ theme }) => theme.colors.bgHeader};
  }

  .gittu-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .gittu-header-left {
    display: flex;
    align-items: center;
    gap: 60px;
  }

  .gittu-header-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .gittu-header-right-menu {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .gittu-header-menu {
    li a {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-weight: 700;
      font-size: 16px;
      line-height: 30px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.white};
    }
  }

  .gittu-header-menu-toggle {
    display: none;

    .menu-toggler {
      border: 0;
      padding: 0;
      background: transparent;
      color: ${({ theme }) => theme.colors.white};
      font-size: 30px;
    }
  }

  .social-links {
    display: flex;
    align-items: center;
    gap: 20px;
    li a {
      flex: 0 0 auto;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.white}26;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s;
      img {
        width: 20px;
        transition: 0.3s;
      }
      &:hover {
        opacity: 0.7;
      }
    }
  }

  .toggle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .toggle-button {
    position: relative;
    width: 180px;
    height: 50px;
    background: #ffffff33;
    border-radius: 25px;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .toggle-slider {
    position: absolute;
    width: 33%;
    height: 100%;
    background: white;
    border-radius: 25px;
    transition: transform 0.3s ease-in-out;
    box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.3);
  }

  .toggle-slider.left {
    transform: translateX(0%);
  }

  .toggle-slider.center {
    transform: translateX(50%);
    margin-left: 16.5%;
  }

  .toggle-slider.right {
    transform: translateX(100%);
    margin-left: 34%;
  }

  .toggle-icons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
    align-items: center;
    position: absolute;
    z-index: 1;
  }

  .bitcoin-icon {
    width: 30px;
    height: 30px;
    margin-left: 5px;
  }

  .visa-icon {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }

  .coinbase-icon {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }

  .toggle-text {
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  @media screen and (max-width: 991px) {
    .gittu-header-menu-toggle {
      display: block;
    }

    .gittu-header-menu {
      display: none;
    }

    .gittu-header-left {
      gap: 30px;
    }

    .gittu-header-right {
      flex-direction: row-reverse;

      .social-links {
        display: none;
      }
    }
  }

  @media screen and (max-width: 480px) {
    .gittu-header-left {
      gap: 15px;
    }

    .gittu-header-logo {
      flex: 0 0 auto;
      max-width: 100px;
    }

    .dropdown-demo {
      display: none;
    }

    .gittu-header-right {
      gap: 10px;
    }
  }
`;

export default HeaderWrapper;
