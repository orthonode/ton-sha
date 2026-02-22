import "@stdlib/deploy";

message VerifyReceipt {
    hw_id: Int as uint64;
    fw_hash: Int as uint256;
    ex_hash: Int as uint256;
    counter: Int as uint64;
    digest: Int as uint256;
}

message AuthorizeDevice {
    hw_id: Int as uint64;
}

message ApproveFirmware {
    fw_hash: Int as uint256;
}

message RevokeDevice {
    hw_id: Int as uint64;
}

message VerificationPassed {
    hw_id: Int as uint64;
    counter: Int as uint64;
}

message VerificationFailed {
    hw_id: Int as uint64;
    reason: Int as uint8;
}

contract TonSha {
    owner: Address;
    authorized_devices: map<Int, Bool>;
    approved_firmware: map<Int, Bool>;
    counters: map<Int, Int>;

    init(owner: Address) {
        self.owner = owner;
    }

    receive() {
        cashback(sender());
    }

    receive(msg: VerifyReceipt) {
        let auth: Bool? = self.authorized_devices.get(msg.hw_id);
        if (auth == null || auth!! == false) {
            emit(VerificationFailed{ hw_id: msg.hw_id, reason: 1 }.toCell());
            return;
        }

        let fw: Bool? = self.approved_firmware.get(msg.fw_hash);
        if (fw == null || fw!! == false) {
            emit(VerificationFailed{ hw_id: msg.hw_id, reason: 2 }.toCell());
            return;
        }

        let last: Int? = self.counters.get(msg.hw_id);
        let lastVal: Int = 0;
        if (last != null) { lastVal = last!!; }
        if (msg.counter <= lastVal) {
            emit(VerificationFailed{ hw_id: msg.hw_id, reason: 3 }.toCell());
            return;
        }

        // Gate 4: digest = sha256 of packed cell (matches on-chain computation)
        let b: Builder = beginCell();
        b = b.storeUint(msg.hw_id, 64);
        b = b.storeUint(msg.fw_hash, 256);
        b = b.storeUint(msg.ex_hash, 256);
        b = b.storeUint(msg.counter, 64);
        let expected: Int = sha256(b.endCell().beginParse());

        if (expected != msg.digest) {
            emit(VerificationFailed{ hw_id: msg.hw_id, reason: 4 }.toCell());
            return;
        }

        self.counters.set(msg.hw_id, msg.counter);
        emit(VerificationPassed{ hw_id: msg.hw_id, counter: msg.counter }.toCell());
    }

    receive(msg: AuthorizeDevice) {
        require(sender() == self.owner, "Not owner");
        self.authorized_devices.set(msg.hw_id, true);
    }

    receive(msg: ApproveFirmware) {
        require(sender() == self.owner, "Not owner");
        self.approved_firmware.set(msg.fw_hash, true);
    }

    receive(msg: RevokeDevice) {
        require(sender() == self.owner, "Not owner");
        self.authorized_devices.set(msg.hw_id, false);
    }

    get fun isAuthorized(hw_id: Int): Bool {
        let v: Bool? = self.authorized_devices.get(hw_id);
        if (v == null) { return false; }
        return v!!;
    }

    get fun isApprovedFirmware(fw_hash: Int): Bool {
        let v: Bool? = self.approved_firmware.get(fw_hash);
        if (v == null) { return false; }
        return v!!;
    }

    get fun getCounter(hw_id: Int): Int {
        let v: Int? = self.counters.get(hw_id);
        if (v == null) { return 0; }
        return v!!;
    }

    get fun getOwner(): Address {
        return self.owner;
    }
}
