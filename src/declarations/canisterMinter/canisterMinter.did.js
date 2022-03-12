export const idlFactory = ({ IDL }) => {
  const TokenId = IDL.Nat;
  const Result = IDL.Variant({ 'ok' : TokenId, 'err' : IDL.Text });
  const Dip721Nft = IDL.Service({
    'approve' : IDL.Func([IDL.Principal, TokenId], [], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Nat)], ['query']),
    'doIOwn' : IDL.Func([IDL.Nat], [IDL.Bool], ['query']),
    'getApproved' : IDL.Func([TokenId], [IDL.Opt(IDL.Principal)], []),
    'isApprovedForAll' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        [],
      ),
    'mint' : IDL.Func([IDL.Text], [Result], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'ownerOf' : IDL.Func([TokenId], [IDL.Opt(IDL.Principal)], ['query']),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [], ['oneway']),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'tokenURI' : IDL.Func([TokenId], [IDL.Opt(IDL.Text)], ['query']),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenId],
        [],
        ['oneway'],
      ),
  });
  return Dip721Nft;
};
export const init = ({ IDL }) => { return []; };
