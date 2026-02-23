import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type VerifyReceipt = {
    $$type: 'VerifyReceipt';
    hw_id: bigint;
    fw_hash: bigint;
    ex_hash: bigint;
    counter: bigint;
    digest: bigint;
}

export function storeVerifyReceipt(src: VerifyReceipt) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3490704699, 32);
        b_0.storeUint(src.hw_id, 64);
        b_0.storeUint(src.fw_hash, 256);
        b_0.storeUint(src.ex_hash, 256);
        b_0.storeUint(src.counter, 64);
        b_0.storeUint(src.digest, 256);
    };
}

export function loadVerifyReceipt(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3490704699) { throw Error('Invalid prefix'); }
    const _hw_id = sc_0.loadUintBig(64);
    const _fw_hash = sc_0.loadUintBig(256);
    const _ex_hash = sc_0.loadUintBig(256);
    const _counter = sc_0.loadUintBig(64);
    const _digest = sc_0.loadUintBig(256);
    return { $$type: 'VerifyReceipt' as const, hw_id: _hw_id, fw_hash: _fw_hash, ex_hash: _ex_hash, counter: _counter, digest: _digest };
}

export function loadTupleVerifyReceipt(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    const _fw_hash = source.readBigNumber();
    const _ex_hash = source.readBigNumber();
    const _counter = source.readBigNumber();
    const _digest = source.readBigNumber();
    return { $$type: 'VerifyReceipt' as const, hw_id: _hw_id, fw_hash: _fw_hash, ex_hash: _ex_hash, counter: _counter, digest: _digest };
}

export function loadGetterTupleVerifyReceipt(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    const _fw_hash = source.readBigNumber();
    const _ex_hash = source.readBigNumber();
    const _counter = source.readBigNumber();
    const _digest = source.readBigNumber();
    return { $$type: 'VerifyReceipt' as const, hw_id: _hw_id, fw_hash: _fw_hash, ex_hash: _ex_hash, counter: _counter, digest: _digest };
}

export function storeTupleVerifyReceipt(source: VerifyReceipt) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hw_id);
    builder.writeNumber(source.fw_hash);
    builder.writeNumber(source.ex_hash);
    builder.writeNumber(source.counter);
    builder.writeNumber(source.digest);
    return builder.build();
}

export function dictValueParserVerifyReceipt(): DictionaryValue<VerifyReceipt> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVerifyReceipt(src)).endCell());
        },
        parse: (src) => {
            return loadVerifyReceipt(src.loadRef().beginParse());
        }
    }
}

export type AuthorizeDevice = {
    $$type: 'AuthorizeDevice';
    hw_id: bigint;
}

export function storeAuthorizeDevice(src: AuthorizeDevice) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(668197562, 32);
        b_0.storeUint(src.hw_id, 64);
    };
}

export function loadAuthorizeDevice(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 668197562) { throw Error('Invalid prefix'); }
    const _hw_id = sc_0.loadUintBig(64);
    return { $$type: 'AuthorizeDevice' as const, hw_id: _hw_id };
}

export function loadTupleAuthorizeDevice(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    return { $$type: 'AuthorizeDevice' as const, hw_id: _hw_id };
}

export function loadGetterTupleAuthorizeDevice(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    return { $$type: 'AuthorizeDevice' as const, hw_id: _hw_id };
}

export function storeTupleAuthorizeDevice(source: AuthorizeDevice) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hw_id);
    return builder.build();
}

export function dictValueParserAuthorizeDevice(): DictionaryValue<AuthorizeDevice> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuthorizeDevice(src)).endCell());
        },
        parse: (src) => {
            return loadAuthorizeDevice(src.loadRef().beginParse());
        }
    }
}

export type ApproveFirmware = {
    $$type: 'ApproveFirmware';
    fw_hash: bigint;
}

export function storeApproveFirmware(src: ApproveFirmware) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(4048120377, 32);
        b_0.storeUint(src.fw_hash, 256);
    };
}

export function loadApproveFirmware(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4048120377) { throw Error('Invalid prefix'); }
    const _fw_hash = sc_0.loadUintBig(256);
    return { $$type: 'ApproveFirmware' as const, fw_hash: _fw_hash };
}

export function loadTupleApproveFirmware(source: TupleReader) {
    const _fw_hash = source.readBigNumber();
    return { $$type: 'ApproveFirmware' as const, fw_hash: _fw_hash };
}

export function loadGetterTupleApproveFirmware(source: TupleReader) {
    const _fw_hash = source.readBigNumber();
    return { $$type: 'ApproveFirmware' as const, fw_hash: _fw_hash };
}

export function storeTupleApproveFirmware(source: ApproveFirmware) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.fw_hash);
    return builder.build();
}

export function dictValueParserApproveFirmware(): DictionaryValue<ApproveFirmware> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeApproveFirmware(src)).endCell());
        },
        parse: (src) => {
            return loadApproveFirmware(src.loadRef().beginParse());
        }
    }
}

export type RevokeDevice = {
    $$type: 'RevokeDevice';
    hw_id: bigint;
}

export function storeRevokeDevice(src: RevokeDevice) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(791324172, 32);
        b_0.storeUint(src.hw_id, 64);
    };
}

export function loadRevokeDevice(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 791324172) { throw Error('Invalid prefix'); }
    const _hw_id = sc_0.loadUintBig(64);
    return { $$type: 'RevokeDevice' as const, hw_id: _hw_id };
}

export function loadTupleRevokeDevice(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    return { $$type: 'RevokeDevice' as const, hw_id: _hw_id };
}

export function loadGetterTupleRevokeDevice(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    return { $$type: 'RevokeDevice' as const, hw_id: _hw_id };
}

export function storeTupleRevokeDevice(source: RevokeDevice) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hw_id);
    return builder.build();
}

export function dictValueParserRevokeDevice(): DictionaryValue<RevokeDevice> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRevokeDevice(src)).endCell());
        },
        parse: (src) => {
            return loadRevokeDevice(src.loadRef().beginParse());
        }
    }
}

export type VerificationPassed = {
    $$type: 'VerificationPassed';
    hw_id: bigint;
    counter: bigint;
}

export function storeVerificationPassed(src: VerificationPassed) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3953073877, 32);
        b_0.storeUint(src.hw_id, 64);
        b_0.storeUint(src.counter, 64);
    };
}

export function loadVerificationPassed(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3953073877) { throw Error('Invalid prefix'); }
    const _hw_id = sc_0.loadUintBig(64);
    const _counter = sc_0.loadUintBig(64);
    return { $$type: 'VerificationPassed' as const, hw_id: _hw_id, counter: _counter };
}

export function loadTupleVerificationPassed(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    const _counter = source.readBigNumber();
    return { $$type: 'VerificationPassed' as const, hw_id: _hw_id, counter: _counter };
}

export function loadGetterTupleVerificationPassed(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    const _counter = source.readBigNumber();
    return { $$type: 'VerificationPassed' as const, hw_id: _hw_id, counter: _counter };
}

export function storeTupleVerificationPassed(source: VerificationPassed) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hw_id);
    builder.writeNumber(source.counter);
    return builder.build();
}

export function dictValueParserVerificationPassed(): DictionaryValue<VerificationPassed> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVerificationPassed(src)).endCell());
        },
        parse: (src) => {
            return loadVerificationPassed(src.loadRef().beginParse());
        }
    }
}

export type VerificationFailed = {
    $$type: 'VerificationFailed';
    hw_id: bigint;
    reason: bigint;
}

export function storeVerificationFailed(src: VerificationFailed) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2460458340, 32);
        b_0.storeUint(src.hw_id, 64);
        b_0.storeUint(src.reason, 8);
    };
}

export function loadVerificationFailed(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2460458340) { throw Error('Invalid prefix'); }
    const _hw_id = sc_0.loadUintBig(64);
    const _reason = sc_0.loadUintBig(8);
    return { $$type: 'VerificationFailed' as const, hw_id: _hw_id, reason: _reason };
}

export function loadTupleVerificationFailed(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    const _reason = source.readBigNumber();
    return { $$type: 'VerificationFailed' as const, hw_id: _hw_id, reason: _reason };
}

export function loadGetterTupleVerificationFailed(source: TupleReader) {
    const _hw_id = source.readBigNumber();
    const _reason = source.readBigNumber();
    return { $$type: 'VerificationFailed' as const, hw_id: _hw_id, reason: _reason };
}

export function storeTupleVerificationFailed(source: VerificationFailed) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hw_id);
    builder.writeNumber(source.reason);
    return builder.build();
}

export function dictValueParserVerificationFailed(): DictionaryValue<VerificationFailed> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVerificationFailed(src)).endCell());
        },
        parse: (src) => {
            return loadVerificationFailed(src.loadRef().beginParse());
        }
    }
}

export type TonSha$Data = {
    $$type: 'TonSha$Data';
    owner: Address;
    authorized_devices: Dictionary<bigint, boolean>;
    approved_firmware: Dictionary<bigint, boolean>;
    counters: Dictionary<bigint, bigint>;
}

export function storeTonSha$Data(src: TonSha$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.authorized_devices, Dictionary.Keys.BigInt(257), Dictionary.Values.Bool());
        b_0.storeDict(src.approved_firmware, Dictionary.Keys.BigInt(257), Dictionary.Values.Bool());
        b_0.storeDict(src.counters, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
    };
}

export function loadTonSha$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _authorized_devices = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), sc_0);
    const _approved_firmware = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), sc_0);
    const _counters = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_0);
    return { $$type: 'TonSha$Data' as const, owner: _owner, authorized_devices: _authorized_devices, approved_firmware: _approved_firmware, counters: _counters };
}

export function loadTupleTonSha$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _authorized_devices = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), source.readCellOpt());
    const _approved_firmware = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), source.readCellOpt());
    const _counters = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    return { $$type: 'TonSha$Data' as const, owner: _owner, authorized_devices: _authorized_devices, approved_firmware: _approved_firmware, counters: _counters };
}

export function loadGetterTupleTonSha$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _authorized_devices = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), source.readCellOpt());
    const _approved_firmware = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Bool(), source.readCellOpt());
    const _counters = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    return { $$type: 'TonSha$Data' as const, owner: _owner, authorized_devices: _authorized_devices, approved_firmware: _approved_firmware, counters: _counters };
}

export function storeTupleTonSha$Data(source: TonSha$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.authorized_devices.size > 0 ? beginCell().storeDictDirect(source.authorized_devices, Dictionary.Keys.BigInt(257), Dictionary.Values.Bool()).endCell() : null);
    builder.writeCell(source.approved_firmware.size > 0 ? beginCell().storeDictDirect(source.approved_firmware, Dictionary.Keys.BigInt(257), Dictionary.Values.Bool()).endCell() : null);
    builder.writeCell(source.counters.size > 0 ? beginCell().storeDictDirect(source.counters, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    return builder.build();
}

export function dictValueParserTonSha$Data(): DictionaryValue<TonSha$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTonSha$Data(src)).endCell());
        },
        parse: (src) => {
            return loadTonSha$Data(src.loadRef().beginParse());
        }
    }
}

 type TonSha_init_args = {
    $$type: 'TonSha_init_args';
    owner: Address;
}

function initTonSha_init_args(src: TonSha_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
    };
}

async function TonSha_init(owner: Address) {
    const __code = Cell.fromHex('b5ee9c72410215010004f500022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d9010c020378e0020a02014803050155b3a27b51343480006384be903d013500743d013d010c04090408db05263e900040745b5b5b78b6cf1b10600400022302012006080159adc5f6a268690000c7097d207a026a00e87a027a021808120811b60a4c7d200080e8b6b6b6f12a81ed9e3620c0070042810101530250334133f40c6fa19401d70030925b6de2206e923070e0206ef2d0800159ac2276a268690000c7097d207a026a00e87a027a021808120811b60a4c7d200080e8b6b6b6f12a81ed9e3620c00900408101012402714133f40c6fa19401d70030925b6de2206e923070e0206ef2d0800159b90aded44d0d200018e12fa40f404d401d0f404f40430102410236c1498fa400101d16d6d6de25503db3c6c4180b00408101012302714133f40c6fa19401d70030925b6de2206e923070e0206ef2d08004e801d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e12fa40f404d401d0f404f40430102410236c1498fa400101d16d6d6de205925f05e07024d74920c21f953104d31f05de218210d00fed3bbae30221821027d3e2babae302218210f1496a39bae3022182102f2aa60cba0d12131401fc5b03d33fd3ffd3ffd33fd3ff302581010126714133f40c6fa19401d70030925b6de2206e92307f97206ef2d080c000e28e455f0471c859821092a79d645003cb1fcb3fcb07c9c88258c000000000000000000000000101cb67ccc970fb004003c87f01ca0055305034cef40001c8f40012f400cdc9ed54e02781010125710e01fe4133f40c6fa19401d70030925b6de2206e92307f97206ef2d080c000e28e455f0472c859821092a79d645003cb1fcb3fcb07c9c88258c000000000000000000000000101cb67ccc970fb004003c87f01ca0055305034cef40001c8f40012f400cdc9ed54e081010154590052704133f40c6fa19401d70030925b6de270216e0f02feb39630206ef2d0809131e25220bb8e455f0473c859821092a79d645003cb1fcb3fcb07c9c88258c000000000000000000000000101cb67ccc970fb004003c87f01ca0055305034cef40001c8f40012f400cdc9ed54e0c85250cb3f14cbff12cbff5210cb3fc9d09b9320d74a91d5e868f90400da1158bde302810101541600101100883074c859821092a79d645003cb1fcb3fcb07c9c88258c000000000000000000000000101cb67ccc970fb004003c87f01ca0055305034cef40001c8f40012f400cdc9ed5400b0546380216e955b59f45a3098c801cf004133f442e205c8598210eb9f1ed55003cb1fcb3fcb3fc9c88258c000000000000000000000000101cb67ccc970fb004003c87f01ca0055305034cef40001c8f40012f400cdc9ed5400805b03d33f308138c6f84224c705f2f4810101017f71216e955b59f45a3098c801cf004133f442e24003c87f01ca0055305034cef40001c8f40012f400cdc9ed5400825b03d3ff308138c6f84224c705f2f413810101017f71216e955b59f45a3098c801cf004133f442e25003c87f01ca0055305034cef40001c8f40012f400cdc9ed5400f88e405b03d33f308138c6f84224c705f2f4810101017071216e955b59f45a3098c801cf004133f442e24003c87f01ca0055305034cef40001c8f40012f400cdc9ed54e035c00004c12114b08e29f842c8cf8508ce70cf0b6ec98042fb004003c87f01ca0055305034cef40001c8f40012f400cdc9ed54e05f04f2c0821cee4408');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initTonSha_init_args({ $$type: 'TonSha_init_args', owner })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const TonSha_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    14534: { message: "Not owner" },
} as const

export const TonSha_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Not owner": 14534,
} as const

const TonSha_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"VerifyReceipt","header":3490704699,"fields":[{"name":"hw_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"fw_hash","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"ex_hash","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"counter","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"digest","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"AuthorizeDevice","header":668197562,"fields":[{"name":"hw_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ApproveFirmware","header":4048120377,"fields":[{"name":"fw_hash","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"RevokeDevice","header":791324172,"fields":[{"name":"hw_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"VerificationPassed","header":3953073877,"fields":[{"name":"hw_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"counter","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"VerificationFailed","header":2460458340,"fields":[{"name":"hw_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"reason","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"TonSha$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"authorized_devices","type":{"kind":"dict","key":"int","value":"bool"}},{"name":"approved_firmware","type":{"kind":"dict","key":"int","value":"bool"}},{"name":"counters","type":{"kind":"dict","key":"int","value":"int"}}]},
]

const TonSha_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "VerifyReceipt": 3490704699,
    "AuthorizeDevice": 668197562,
    "ApproveFirmware": 4048120377,
    "RevokeDevice": 791324172,
    "VerificationPassed": 3953073877,
    "VerificationFailed": 2460458340,
}

const TonSha_getters: ABIGetter[] = [
    {"name":"isAuthorized","methodId":104516,"arguments":[{"name":"hw_id","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"isApprovedFirmware","methodId":118957,"arguments":[{"name":"fw_hash","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"getCounter","methodId":103307,"arguments":[{"name":"hw_id","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getOwner","methodId":102025,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const TonSha_getterMapping: { [key: string]: string } = {
    'isAuthorized': 'getIsAuthorized',
    'isApprovedFirmware': 'getIsApprovedFirmware',
    'getCounter': 'getGetCounter',
    'getOwner': 'getGetOwner',
}

const TonSha_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"VerifyReceipt"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AuthorizeDevice"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ApproveFirmware"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RevokeDevice"}},
]


export class TonSha implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = TonSha_errors_backward;
    public static readonly opcodes = TonSha_opcodes;
    
    static async init(owner: Address) {
        return await TonSha_init(owner);
    }
    
    static async fromInit(owner: Address) {
        const __gen_init = await TonSha_init(owner);
        const address = contractAddress(0, __gen_init);
        return new TonSha(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new TonSha(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  TonSha_types,
        getters: TonSha_getters,
        receivers: TonSha_receivers,
        errors: TonSha_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | VerifyReceipt | AuthorizeDevice | ApproveFirmware | RevokeDevice) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'VerifyReceipt') {
            body = beginCell().store(storeVerifyReceipt(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AuthorizeDevice') {
            body = beginCell().store(storeAuthorizeDevice(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ApproveFirmware') {
            body = beginCell().store(storeApproveFirmware(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RevokeDevice') {
            body = beginCell().store(storeRevokeDevice(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getIsAuthorized(provider: ContractProvider, hw_id: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(hw_id);
        const source = (await provider.get('isAuthorized', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getIsApprovedFirmware(provider: ContractProvider, fw_hash: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(fw_hash);
        const source = (await provider.get('isApprovedFirmware', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getGetCounter(provider: ContractProvider, hw_id: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(hw_id);
        const source = (await provider.get('getCounter', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getOwner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
}