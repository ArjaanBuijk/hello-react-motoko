import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import P "mo:base/Prelude";
import D "mo:base/Debug";

//
// Adapted from: https://github.com/SuddenlyHazel/DIP721/blob/main/src/DIP721/DIP721.mo
//
// Comments were adapted from this article, describing the equivalent for Ethereum 
// standard ERC 721, where smartcontracts are written in Solidity:
// https://www.quicknode.com/guides/solidity/how-to-create-and-deploy-an-erc-721-nft
//
shared (msg) actor class Dip721Nft () = {
    ///////////////////////////////////////////////////////////////////////
    // Access Control
    //
    // The principal that deployed this actor to the canister
    // - local: `dfx identity use <name>`
    // - prod: set in ci/cd on GitHub
    //
    // stable var deployer : Principal = msg.caller;

    // public shared ({ caller }) func getDeployer () : async Principal {
    //     return deployer;
    // };

    ///////////////////////////////////////////////////////////////////////
	public shared query (doIOwn__msg) func doIOwn(tokenId : Nat) : async Bool {
		let caller = doIOwn__msg.caller; // First input
		_ownerOf(tokenId) == ?caller;
	};
	
    // Name & symbol of the NFTs, often confusingly referred to as the `token name` & `token symbol`:
    // -> this name & symbol applies to all the NFTs managed by this smart contract
    // -> in addition, each individually minted NFT receives a unique token ID
	stable var name_ : Text = "ArjaanBuijkMotokoBootcamp";
	stable var symbol_ : Text = "ABMB";
	
	// private type TokenAddress = Principal;
	
	
    // 
    // As each DIP-721 token is unique and non-fungible, they are represented 
    // on the blockchain by a token ID (1, 2, 3, ...).
    //
    // Other users, contracts, apps can use this token ID to determine the owner of the token.
    // 

    //
    // - `TokenId`: a new type, as an equivalent to the build in type Nat
    //   -> This is used for every variable that represents a token ID, and not just a number.
    //
    // - `tokenPk`: the ID of the last minted token
    //   -> a private, stable variable, which means that the value will be saved, using orthogonal persistence
    //   -> of type `TokenId`
    //   -> initialized as `0`
    //   -> incremented with 1 upon minting (see the method `mint`).
    //   -> the first minted NFT will get the value `1`
    //
    private type TokenId = Nat;
	private stable var tokenPk : TokenId = 0;
	

    // stable arrays used during canister upgrades.
    // (https://smartcontracts.org/docs/language-guide/upgrades.html#_preupgrade_and_postupgrade_system_methods)
    //
    // The HashMaps that contain all the data can not be defined as stable, because they're objects that contain methods
    // In order to carry over the data during a canister upgrade, the following is done:
    // -> In the `preupgrade` system method (see below), the data is temporarily copied into stable arrays
    // -> the upgrade will then take place, and the arrays will be carried over
    // -> In the `postupgrade` system function (see below), the temporary stable arrays are reset to empty
    //    

    // The stable arrays, only used during a canister upgrade, are initialized to empty arrays
	private stable var tokenURIEntries : [(TokenId, Text)] = [];
	private stable var ownersEntries : [(TokenId, Principal)] = [];
	private stable var balancesEntries : [(Principal, Nat)] = [];
	private stable var tokenApprovalsEntries : [(TokenId, Principal)] = [];
	private stable var operatorApprovalsEntries : [(Principal, [Principal])] = [];
	
    // HashMaps in which all the data is stored:
    // -> saved between calls to the canister
    // -> not saved during canister a upgrade, but carried over as described above, in `preupgrade` & `postupgrade` system functions
    //
    // - `tokenURIs <TokenId, Text>`                   : for each minted NFT, the text string representation of it's URI hash
    // - `owners    <TokenId, Principal>`              : for each minted NFT, the principal of its owner
    // - `balances  <Principal, Nat>`                  : for a Principal that succesfully owned at least 1 NFT at some point, 
    //                                                   the number of minted NFTs it currently owns. 
    //                                                   -> an NFT can be owned either after minting it, or after receiving it 
    //                                                      through a transfer 
    //                                                   -> the balance can be 0 if all NFTs owned were since transferred to another 
    //                                                      principal, or burned
    // - `tokenApprovals <TokenId, Principal>`         : for each minted NFT, optionally, one principal that is given approval to take ownership of the NFT in the future.
    // - `operatorApprovals <Principal, [Principals]>` : for each principal, optionally, a list of principals that can call these functions
    //                                                   -> approve()
    //                                                   -> transferFrom()

	private let tokenURIs : HashMap.HashMap<TokenId, Text> = HashMap.fromIter<TokenId, Text>(tokenURIEntries.vals(), 10, Nat.equal, Hash.hash);
	private let owners : HashMap.HashMap<TokenId, Principal> = HashMap.fromIter<TokenId, Principal>(ownersEntries.vals(), 10, Nat.equal, Hash.hash);
	private let balances : HashMap.HashMap<Principal, Nat> = HashMap.fromIter<Principal, Nat>(balancesEntries.vals(), 10, Principal.equal, Principal.hash);
	private let tokenApprovals : HashMap.HashMap<TokenId, Principal> = HashMap.fromIter<TokenId, Principal>(tokenApprovalsEntries.vals(), 10, Nat.equal, Hash.hash);
	private let operatorApprovals : HashMap.HashMap<Principal, [Principal]> = HashMap.fromIter<Principal, [Principal]>(operatorApprovalsEntries.vals(), 10, Principal.equal, Principal.hash);
	
	private func _unwrap<T>(x : ?T) : T {
		switch x {
			case null { P.unreachable() };
			case (?x_) { x_ };
		};
	};
	
    public shared query func balanceOf(p : Principal) : async ?Nat {
        // Returns the number of our NFTs owned by a Principal.
        //
        // idl return example: 
        //  (opt (1 : nat))
		return balances.get(p);
	};
	
	public shared query func ownerOf(tokenId : TokenId) : async ?Principal {
        // Returns the Principal of the owner of a minted NFT, identifed by it's TokenId
        //
        // idl return example: 
        //   ( opt principal "xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxx",)
		return _ownerOf(tokenId);
	};
	
	public shared query func tokenURI(tokenId : TokenId) : async ?Text {
        // Returns the text string representation of a minted NFT's URI hash
		return _tokenURI(tokenId);
	};
	
	public shared query func name() : async Text {
        // Returns the name of the NFTs managed by this smart contract
		return name_;
	};
	
	public shared query func symbol() : async Text {
        // Returns the symbol of the NFTs managed by this smart contract
		return symbol_;
	};
	
	public shared func isApprovedForAll(owner : Principal, op : Principal) : async Bool {
        // Returns true if principal (owner) has given operatorApprovals privileges to principal (op)
        // -> These privileges are given/removed with the function setApprovalForAll
		return _isApprovedForAll(owner, op);
	};
	
	public shared(msg) func approve(to : Principal, tokenId : TokenId) : async () {
        // Another principal is given approval to take ownership of a token in the future.
        //
        // -> This does NOT transfer the token, and this approval can be removed.
        // -> There is only 1 principal approved to take ownership. 
        //    -> An existing approved principal will be replaced
        //
        // The caller of this function must either:
        // - be the current owner
        // - belong to the list of principals in the `operatorApprovals` HashMap
        //
		switch(_ownerOf(tokenId)) {
			case (?owner) {
				assert to != owner;
				assert msg.caller == owner or _isApprovedForAll(owner, msg.caller);
				_approve(to, tokenId);
			};
			case (null) {
				throw Error.reject("No owner for token")
			};
		}
	};
	
	public shared func getApproved(tokenId : TokenId) : async ?Principal {
        // Returns the principal that is given approval to take ownership of a token in the future.
        // Returns null if there is none
		switch(_getApproved(tokenId)) {
			case (?v) { return ?v };
			case null { return null };
            // case null { throw Error.reject("None approved") }
		}
	};
	
	public shared(msg) func setApprovalForAll(op : Principal, isApproved : Bool) : () {
        // The caller gives or removes operatorApprovals privileges to another principal (op)
		assert msg.caller != op;
		
		switch (isApproved) {
			case true {
				switch (operatorApprovals.get(msg.caller)) {
					case (?opList) {
						var array = Array.filter<Principal>(opList,func (p) { p != op });
						array := Array.append<Principal>(array, [op]);
						operatorApprovals.put(msg.caller, array);
					};
					case null {
						operatorApprovals.put(msg.caller, [op]);
					};
				};
			};
			case false {
				switch (operatorApprovals.get(msg.caller)) {
					case (?opList) {
						let array = Array.filter<Principal>(opList, func(p) { p != op });
						operatorApprovals.put(msg.caller, array);
					};
					case null {
						operatorApprovals.put(msg.caller, []);
					};
				};
			};
		};
		
	};
	
	public shared(msg) func transferFrom(from : Principal, to : Principal, tokenId : TokenId) : () {
        // Transfers ownership of a Minted NFT
        // Caller must be either:
        // - owner of the NFT
        // - an approved principal to take ownership of the NFT
        // - received operator approvals from the owner
		assert _isApprovedOrOwner(msg.caller, tokenId);
		
		_transfer(from, to, tokenId);
	};
	
	public shared(msg) func mint(uri : Text) : async Result.Result<TokenId, Text> {
        // Mints a new NFT:
        // - identified with a uri, which is defined in the frontend
        //
        D.print(debug_show(msg.caller));
        if (Principal.isAnonymous(msg.caller)) {
            return #err("Anonymous Identity cannot mint an NFT. Please login first.")
        };

		tokenPk += 1;
		_mint(msg.caller, tokenPk, uri);
		return #ok(tokenPk);
	};
    // public shared(msg) func mint(uri : Text) : async Nat {
	// 	tokenPk += 1;
	// 	_mint(msg.caller, tokenPk, uri);
	// 	return tokenPk;
	// };
	
	
	// Internal
	
	private func _ownerOf(tokenId : TokenId) : ?Principal {
		return owners.get(tokenId);
	};
	
	private func _tokenURI(tokenId : TokenId) : ?Text {
		return tokenURIs.get(tokenId);
	};
	
	private func _isApprovedForAll(owner : Principal, op : Principal) : Bool {
		switch (operatorApprovals.get(owner)) {
			case(?whiteList) {
				for (allow in whiteList.vals()) {
					if (allow == op) {
						return true;
					};
				};
			};
			case null {return false;};
		};
		return false;
	};
	
	private func _approve(to : Principal, tokenId : TokenId) : () {
		tokenApprovals.put(tokenId, to);
	};
	
	private func _removeApprove(tokenId : TokenId) : () {
		ignore tokenApprovals.remove(tokenId);
	};
	
	private func _exists(tokenId : TokenId) : Bool {
		return Option.isSome(owners.get(tokenId));
	};
	
	private func _getApproved(tokenId : TokenId) : ?Principal {
		assert _exists(tokenId) == true;
		switch(tokenApprovals.get(tokenId)) {
			case (?v) { return ?v };
			case null {
				return null;
			};
		}
	};
	
	private func _hasApprovedAndSame(tokenId : TokenId, spender : Principal) : Bool {
		switch(_getApproved(tokenId)) {
			case (?v) {
				return v == spender;
			};
			case null { return false }
		}
	};
	
	private func _isApprovedOrOwner(spender : Principal, tokenId : TokenId) : Bool {
		assert _exists(tokenId);
		let owner = _unwrap(_ownerOf(tokenId));
		return spender == owner or _hasApprovedAndSame(tokenId, spender) or _isApprovedForAll(owner, spender);
	};
	
	private func _transfer(from : Principal, to : Principal, tokenId : TokenId) : () {
		assert _exists(tokenId);
		assert _unwrap(_ownerOf(tokenId)) == from;
		
		// Bug in HashMap https://github.com/dfinity/motoko-base/pull/253/files
		// this will throw unless you patch your file
		_removeApprove(tokenId);
		
		_decrementBalance(from);
		_incrementBalance(to);
		owners.put(tokenId, to);
	};
	
	private func _incrementBalance(address : Principal) {
		switch (balances.get(address)) {
			case (?v) {
				balances.put(address, v + 1);
			};
			case null {
				balances.put(address, 1);
			}
		}
	};
	
	private func _decrementBalance(address : Principal) {
		switch (balances.get(address)) {
			case (?v) {
				balances.put(address, v - 1);
			};
			case null {
				balances.put(address, 0);
			}
		}
	};
	
	private func _mint(to : Principal, tokenId : TokenId, uri : Text) : () {
		assert not _exists(tokenId);
		
		_incrementBalance(to);
		owners.put(tokenId, to);
		tokenURIs.put(tokenId,uri)
	};
	
	private func _burn(tokenId : TokenId) {
		let owner = _unwrap(_ownerOf(tokenId));
		
		_removeApprove(tokenId);
		_decrementBalance(owner);
		
		ignore owners.remove(tokenId);
	};
	
	system func preupgrade() {
		tokenURIEntries := Iter.toArray(tokenURIs.entries());
		ownersEntries := Iter.toArray(owners.entries());
		balancesEntries := Iter.toArray(balances.entries());
		tokenApprovalsEntries := Iter.toArray(tokenApprovals.entries());
		operatorApprovalsEntries := Iter.toArray(operatorApprovals.entries());
		
	};
	
	system func postupgrade() {
		tokenURIEntries := [];
		ownersEntries := [];
		balancesEntries := [];
		tokenApprovalsEntries := [];
		operatorApprovalsEntries := [];
	};

}
