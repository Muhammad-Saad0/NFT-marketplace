import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { web3State, createWeb3State } from "./utils";
import { providers } from "ethers";

type Web3ProviderProps = {
  children: ReactNode;
};

const web3Context = createContext<web3State>(createWeb3State());

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<web3State>(createWeb3State());

  useEffect(() => {
    function web3init() {
      const provider = new providers.Web3Provider(window.ethereum as any);

      setWeb3Api({
        ethereum: window.ethereum,
        contract: null,
        isloading: true,
        provider,
      });
    }

    web3init();
  }, []);

  return (
    <web3Context.Provider value={web3Api}>{children}</web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(web3Context);
}

export default Web3Provider;
