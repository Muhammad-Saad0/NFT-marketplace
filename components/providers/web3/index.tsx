import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { web3State, createWeb3State, getContract } from "./utils";
import { ethers } from "ethers";
import { setupHooks } from "@/components/hooks/web3/setupHooks";

type Web3ProviderProps = {
  children: ReactNode;
};

const web3Context = createContext<web3State>(createWeb3State());

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<web3State>(createWeb3State());

  useEffect(() => {
    async function web3init() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const contract = await getContract("NftMarketAddresses", provider);

      setWeb3Api({
        ethereum: window.ethereum,
        contract,
        isloading: true,
        provider,
        hooks: setupHooks({}),
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
