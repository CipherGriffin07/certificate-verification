import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var CertificateState;
(function (CertificateState) {
  CertificateState[CertificateState['EMPTY'] = 0] = 'EMPTY';
  CertificateState[CertificateState['VALID'] = 1] = 'VALID';
  CertificateState[CertificateState['REVOKED'] = 2] = 'REVOKED';
})(CertificateState || (CertificateState = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_2 = __compactRuntime.CompactTypeBoolean;

class _Maybe_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_2.fromValue(value_0),
      value: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_some).concat(_descriptor_0.toValue(value_0.value));
  }
}

const _descriptor_3 = new _Maybe_0();

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_5 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

class _Either_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_6 = new _Either_0();

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_8 = new _ContractAddress_0();

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_10 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.issuerSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named issuerSecretKey');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      issueCertificate: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`issueCertificate: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const newCertificateHash_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('issueCertificate',
                                     'argument 1 (as invoked from Typescript)',
                                     'certificate-verification.compact line 27 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(newCertificateHash_0.buffer instanceof ArrayBuffer && newCertificateHash_0.BYTES_PER_ELEMENT === 1 && newCertificateHash_0.length === 32)) {
          __compactRuntime.typeError('issueCertificate',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'certificate-verification.compact line 27 char 1',
                                     'Bytes<32>',
                                     newCertificateHash_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(newCertificateHash_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._issueCertificate_0(context,
                                                  partialProofData,
                                                  newCertificateHash_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      verifyCertificate: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`verifyCertificate: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const givenHash_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 1 (as invoked from Typescript)',
                                     'certificate-verification.compact line 44 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(givenHash_0.buffer instanceof ArrayBuffer && givenHash_0.BYTES_PER_ELEMENT === 1 && givenHash_0.length === 32)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'certificate-verification.compact line 44 char 1',
                                     'Bytes<32>',
                                     givenHash_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(givenHash_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._verifyCertificate_0(context,
                                                   partialProofData,
                                                   givenHash_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revokeCertificate: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`revokeCertificate: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revokeCertificate',
                                     'argument 1 (as invoked from Typescript)',
                                     'certificate-verification.compact line 56 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revokeCertificate_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      publicKey(context, ...args_1) {
        return { result: pureCircuits.publicKey(...args_1), context };
      }
    };
    this.impureCircuits = {
      issueCertificate: this.circuits.issueCertificate,
      verifyCertificate: this.circuits.verifyCertificate,
      revokeCertificate: this.circuits.revokeCertificate
    };
    this.provableCircuits = {
      issueCertificate: this.circuits.issueCertificate,
      verifyCertificate: this.circuits.verifyCertificate,
      revokeCertificate: this.circuits.revokeCertificate
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('issueCertificate', new __compactRuntime.ContractOperation());
    state_0.setOperation('verifyCertificate', new __compactRuntime.ContractOperation());
    state_0.setOperation('revokeCertificate', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(1n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue({ is_some: false, value: new Uint8Array(32) }),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(2n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(3n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._none_0();
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(1n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_10.toValue(2n),
                                                                  alignment: _descriptor_10.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_9.toValue(tmp_1),
                                                                alignment: _descriptor_9.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _some_0(value_0) { return { is_some: true, value: value_0 }; }
  _none_0() { return { is_some: false, value: new Uint8Array(32) }; }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_5, value_0);
    return result_0;
  }
  _issuerSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.issuerSecretKey(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('issuerSecretKey',
                                 'return value',
                                 'certificate-verification.compact line 19 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _issueCertificate_0(context, partialProofData, newCertificateHash_0) {
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_10.toValue(0n),
                                                                                                                  alignment: _descriptor_10.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value)
                            ===
                            0,
                            'A certificate has already been issued');
    const tmp_0 = this._publicKey_0(this._issuerSecretKey_0(context,
                                                            partialProofData),
                                    __compactRuntime.convertFieldToBytes(32,
                                                                         _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                   partialProofData,
                                                                                                                                   [
                                                                                                                                    { dup: { n: 0 } },
                                                                                                                                    { idx: { cached: false,
                                                                                                                                             pushPath: false,
                                                                                                                                             path: [
                                                                                                                                                    { tag: 'value',
                                                                                                                                                      value: { value: _descriptor_10.toValue(2n),
                                                                                                                                                               alignment: _descriptor_10.alignment() } }] } },
                                                                                                                                    { popeq: { cached: true,
                                                                                                                                               result: undefined } }]).value),
                                                                         'certificate-verification.compact line 34 char 34'));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(3n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_1 = this._some_0(newCertificateHash_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(1n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_1),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(1),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _verifyCertificate_0(context, partialProofData, givenHash_0) {
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_10.toValue(0n),
                                                                                                                  alignment: _descriptor_10.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value)
                            ===
                            1,
                            'Certificate is not valid');
    __compactRuntime.assert(this._equal_0(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_10.toValue(1n),
                                                                                                                                alignment: _descriptor_10.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value).value,
                                          givenHash_0),
                            'Certificate does not match');
    return [];
  }
  _revokeCertificate_0(context, partialProofData) {
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_10.toValue(0n),
                                                                                                                  alignment: _descriptor_10.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value)
                            ===
                            1,
                            'Certificate is not currently valid');
    __compactRuntime.assert(this._equal_1(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_10.toValue(3n),
                                                                                                                                alignment: _descriptor_10.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          this._publicKey_0(this._issuerSecretKey_0(context,
                                                                                    partialProofData),
                                                            __compactRuntime.convertFieldToBytes(32,
                                                                                                 _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                                           partialProofData,
                                                                                                                                                           [
                                                                                                                                                            { dup: { n: 0 } },
                                                                                                                                                            { idx: { cached: false,
                                                                                                                                                                     pushPath: false,
                                                                                                                                                                     path: [
                                                                                                                                                                            { tag: 'value',
                                                                                                                                                                              value: { value: _descriptor_10.toValue(2n),
                                                                                                                                                                                       alignment: _descriptor_10.alignment() } }] } },
                                                                                                                                                            { popeq: { cached: true,
                                                                                                                                                                       result: undefined } }]).value),
                                                                                                 'certificate-verification.compact line 66 char 9'))),
                            'Only the issuer can revoke this certificate');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(2),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _publicKey_0(sk_0, sequenceNumber_0) {
    return this._persistentHash_0([new Uint8Array([99, 101, 114, 116, 105, 102, 105, 99, 97, 116, 101, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sequenceNumber_0,
                                   sk_0]);
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get state() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_10.toValue(0n),
                                                                                                   alignment: _descriptor_10.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get certificateHash() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_10.toValue(1n),
                                                                                                   alignment: _descriptor_10.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get sequence() {
      return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_10.toValue(2n),
                                                                                                   alignment: _descriptor_10.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get issuer() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_10.toValue(3n),
                                                                                                   alignment: _descriptor_10.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  issuerSecretKey: (...args) => undefined
});
export const pureCircuits = {
  publicKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`publicKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    const sequenceNumber_0 = args_0[1];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('publicKey',
                                 'argument 1',
                                 'certificate-verification.compact line 74 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    if (!(sequenceNumber_0.buffer instanceof ArrayBuffer && sequenceNumber_0.BYTES_PER_ELEMENT === 1 && sequenceNumber_0.length === 32)) {
      __compactRuntime.typeError('publicKey',
                                 'argument 2',
                                 'certificate-verification.compact line 74 char 1',
                                 'Bytes<32>',
                                 sequenceNumber_0)
    }
    return _dummyContract._publicKey_0(sk_0, sequenceNumber_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
