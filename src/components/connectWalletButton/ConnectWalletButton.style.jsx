import styled, { css } from "styled-components";

const ConnectWalletButtonStyleWrapper = styled.div`
  .connect-wallet-btn {
    border: 0;
    padding: 12px;
    min-width: 185px;
    border-radius: 25px;
    background: ${({ theme }) => theme.colors.white}26;
    backdrop-filter: blur(10px);
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: 700;
    font-size: 16px;
    line-height: 26px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: 0.3s;

    &:hover {
      background: ${({ theme }) => theme.colors.white}33;
    }

    .short-address {
      display: none;
    }
  }

  ${({ variant }) =>
    variant === "v2" &&
    css`
      .connect-wallet-btn {
        background: #07e6f5;
        color: ${({ theme }) => theme.colors.black};

        &:hover {
          background: #07e6f5;
        }
      }
    `}

  ${({ variant }) =>
    variant === "yellow" &&
    css`
      .connect-wallet-btn {
        background: ${({ theme }) => theme.colors.yellow};
        color: ${({ theme }) => theme.colors.black};

        &:hover {
          background: ${({ theme }) => theme.colors.yellow};
        }
      }
    `}

    ${({ variant }) =>
    variant === "gradient" &&
    css`
      .connect-wallet-btn {
        background: linear-gradient(90deg, #1dff96 0%, #bcff7b 100%);
        color: ${({ theme }) => theme.colors.black};

        &:hover {
          background: linear-gradient(90deg, #1dff96 0%, #bcff7b 100%);
        }
      }
    `}

    ${({ variant }) =>
    variant === "v5" &&
    css`
      .connect-wallet-btn {
        background: linear-gradient(90deg, #1dff96 0%, #bcff7b 100%);
        color: ${({ theme }) => theme.colors.black};

        &:hover {
          background: linear-gradient(90deg, #1dff96 0%, #bcff7b 100%);
        }
      }
    `}

    ${({ variant }) =>
    variant === "v6" &&
    css`
      .connect-wallet-btn {
        background: linear-gradient(90deg, #3c38ff 0%, #7838ff 100%);
        color: ${({ theme }) => theme.colors.white};

        &:hover {
          background: linear-gradient(90deg, #3c38ff 0%, #7838ff 100%);
        }
      }
    `}

    ${({ variant }) =>
    variant === "v7" &&
    css`
      .custom-btn {
        border: 0;
        padding: 0;
        min-width: unset;
        border-radius: 0;
        background: transparent;
        width: 100%;
        padding: 26px 0 26px 30px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.white}1a;
        display: flex;
        align-items: center;
        position: relative;
        transition: 0.3s;

        &:before {
          position: absolute;
          content: "";
          bottom: -1px;
          left: 0;
          width: 0%;
          height: 1px;
          background-color: ${({ theme }) => theme.colors.primary};
          transition: 0.3s;
        }

        &:hover {
          &:before {
            width: 100%;
          }
          span {
            color: ${({ theme }) => theme.colors.white};
          }
        }

        span {
          width: 100%;
          font-family: ${({ theme }) => theme.fonts.primary};
          font-size: 16px;
          font-weight: 500;
          line-height: 26px;
          color: ${({ theme }) => theme.colors.white}cc;
        }

        .icon {
          margin-right: 20px;
          width: 18px;
          height: 18px;
        }

        .name {
          text-align: left;
        }

        .icon-text {
          text-align: center;
        }

        .url {
          text-align: right;
        }
      }
    `}
   
  @media screen and (max-width: 991px) {
    ${({ variant }) =>
      variant === "v7" &&
      css`
        .custom-btn {
          padding: 26px 0;
        }
      `}
  }

  @media screen and (max-width: 767px) {
    .connect-wallet-btn {
      padding: 10px 20px;
      min-width: auto;
      span {
        display: none;
      }
      .short-address {
        display: block;
      }
    }
  }
`;

export default ConnectWalletButtonStyleWrapper;
