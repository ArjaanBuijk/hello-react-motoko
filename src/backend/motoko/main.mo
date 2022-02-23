actor {
    public func greet(name : Text) : async Text {
        return "Hello! " # name # "! Greetings from a Motoko canister.";
    };
};
