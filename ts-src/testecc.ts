import { TinySecp256k1Interface } from './bip32';

const h = (hex: string): Buffer => Buffer.from(hex, 'hex');

export function testEcc(ecc: TinySecp256k1Interface): void {
  assert(
    ecc.isPoint(
      h('0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
    ),
  );
  assert(
    !ecc.isPoint(
      h('030000000000000000000000000000000000000000000000000000000000000005'),
    ),
  );
  assert(
    ecc.isPrivate(
      h('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
    ),
  );
  // order - 1
  assert(
    ecc.isPrivate(
      h('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140'),
    ),
  );
  // 0
  assert(
    !ecc.isPrivate(
      h('0000000000000000000000000000000000000000000000000000000000000000'),
    ),
  );
  // order
  assert(
    !ecc.isPrivate(
      h('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'),
    ),
  );
  // order + 1
  assert(
    !ecc.isPrivate(
      h('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364142'),
    ),
  );
  assert(
    Buffer.from(
      ecc.pointFromScalar(
        h('b1121e4088a66a28f5b6b0f5844943ecd9f610196d7bb83b25214b60452c09af'),
      )!,
    ).equals(
      h('02b07ba9dca9523b7ef4bd97703d43d20399eb698e194704791a25ce77a400df99'),
    ),
  );
  assert(
    Buffer.from(
      ecc.pointAddScalar(
        h('0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
        h('0000000000000000000000000000000000000000000000000000000000000003'),
      )!,
    ).equals(
      h('02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5'),
    ),
  );
  assert(
    Buffer.from(
      ecc.privateAdd(
        h('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036413e'),
        h('0000000000000000000000000000000000000000000000000000000000000002'),
      )!,
    ).equals(
      h('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140'),
    ),
  );
  assert(
    Buffer.from(
      ecc.sign(
        h('5e9f0a0d593efdcf78ac923bc3313e4e7d408d574354ee2b3288c0da9fbba6ed'),
        h('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140'),
      )!,
    ).equals(
      h(
        '54c4a33c6423d689378f160a7ff8b61330444abb58fb470f96ea16d99d4a2fed07082304410efa6b2943111b6a4e0aaa7b7db55a07e9861d1fb3cb1f421044a5',
      ),
    ),
  );
  assert(
    ecc.verify(
      h('5e9f0a0d593efdcf78ac923bc3313e4e7d408d574354ee2b3288c0da9fbba6ed'),
      h('0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
      h(
        '54c4a33c6423d689378f160a7ff8b61330444abb58fb470f96ea16d99d4a2fed07082304410efa6b2943111b6a4e0aaa7b7db55a07e9861d1fb3cb1f421044a5',
      ),
    ),
  );
  if (ecc.signSchnorr) {
    assert(
      Buffer.from(
        ecc.signSchnorr(
          h('7e2d58d8b3bcdf1abadec7829054f90dda9805aab56c77333024b9d0a508b75c'),
          h('c90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b14e5c9'),
          h('c87aa53824b4d7ae2eb035a2b5bbbccc080e76cdc6d1692c4b0b62d798e6d906'),
        )!,
      ).equals(
        h(
          '5831aaeed7b44bb74e5eab94ba9d4294c49bcf2a60728d8b4c200f50dd313c1bab745879a5ad954a72c45a91c3a51d3c7adea98d82f8481e0e1e03674a6f3fb7',
        ),
      ),
    );
  }
  if (ecc.verifySchnorr) {
    assert(
      ecc.verifySchnorr(
        h('7e2d58d8b3bcdf1abadec7829054f90dda9805aab56c77333024b9d0a508b75c'),
        h('dd308afec5777e13121fa72b9cc1b7cc0139715309b086c960e18fd969774eb8'),
        h(
          '5831aaeed7b44bb74e5eab94ba9d4294c49bcf2a60728d8b4c200f50dd313c1bab745879a5ad954a72c45a91c3a51d3c7adea98d82f8481e0e1e03674a6f3fb7',
        ),
      ),
    );
  }
}

function assert(bool: boolean): void {
  if (!bool) throw new Error('ecc library invalid');
}
