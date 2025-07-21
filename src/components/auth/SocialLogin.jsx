import { useAlchemyAccount } from "@alchemy/aa-react";

export const SocialLogin = () => {
  const { account, login, logout } = useAlchemyAccount();

  return (
    <div>
      {account ? (
        <div>
          <p>Logged in as: {account.address}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login({ type: "email" })}>Login with Email</button>
      )}
    </div>
  );
};
