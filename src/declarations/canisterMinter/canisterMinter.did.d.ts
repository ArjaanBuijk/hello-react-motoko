import type { Principal } from '@dfinity/principal';
export interface Dip721Nft {
  'approve' : (arg_0: Principal, arg_1: TokenId) => Promise<undefined>,
  'balanceOf' : (arg_0: Principal) => Promise<[] | [bigint]>,
  'doIOwn' : (arg_0: bigint) => Promise<boolean>,
  'getApproved' : (arg_0: TokenId) => Promise<[] | [Principal]>,
  'isApprovedForAll' : (arg_0: Principal, arg_1: Principal) => Promise<boolean>,
  'mint' : (arg_0: string) => Promise<Result>,
  'name' : () => Promise<string>,
  'ownerOf' : (arg_0: TokenId) => Promise<[] | [Principal]>,
  'setApprovalForAll' : (arg_0: Principal, arg_1: boolean) => Promise<
      undefined
    >,
  'symbol' : () => Promise<string>,
  'tokenURI' : (arg_0: TokenId) => Promise<[] | [string]>,
  'transferFrom' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: TokenId,
    ) => Promise<undefined>,
}
export type Result = { 'ok' : TokenId } |
  { 'err' : string };
export type TokenId = bigint;
export interface _SERVICE extends Dip721Nft {}
