import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  Web3State,
  createWeb3State,
  createDefaultWeb3State,
  getContract,
} from "./utils";
import { ethers } from "ethers";
import { Web3Hooks } from "@/components/hooks/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketType } from "@/types/nftMarketType";

type Web3ProviderProps = {
  children: ReactNode;
};

const web3Context = createContext<Web3State>(createDefaultWeb3State());

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged", reload);
};

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener("chainChanged", reload);
};

function reload() {
  window.location.reload();
}

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(
    createDefaultWeb3State()
  );
  useEffect(() => {
    async function web3init() {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const contract = await getContract("NftMarketAddresses", provider);

        const signer = provider.getSigner();
        const signedContract = contract?.connect(signer);

        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            contract: signedContract as unknown as NftMarketType,
            isLoading: false,
          })
        );
        setGlobalListeners(window.ethereum);
      } catch (error: any) {
        setWeb3Api((api) =>
          createWeb3State({
            ...(api as any),
            isLoading: false,
          })
        );
        console.log(error.message);
      }
    }

    web3init();
    return () => {
      removeGlobalListeners(window.ethereum);
    };
  }, []);

  return (
    <web3Context.Provider value={web3Api}>{children}</web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(web3Context);
}

export function getHooks(): Web3Hooks {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;
