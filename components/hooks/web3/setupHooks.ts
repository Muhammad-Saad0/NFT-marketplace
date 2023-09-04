import { Web3Dependencies } from "@/types/hookTypes";
import {
  UseAccountHook,
  hookFactory as createAccountHook,
} from "./useAccount";

export type Web3Hooks = {
  useAccount: UseAccountHook;
};

type SetpHooksFunction = {
  (d: Partial<Web3Dependencies>): Web3Hooks;
};

export const setupHooks: SetpHooksFunction = (deps) => {
  return {
    useAccount: createAccountHook(deps),
  };
};
