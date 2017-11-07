var SL = SL || {};

SL.LpcElementDirection = {
  "NORTH":"NORTH",
  "EAST":"EAST",
  "SOUTH":"SOUTH",
  "WEST":"WEST"
};

SL.LpcElementId = {
  "STAND":"stand",
  "WALK":"walk",
  "SPELLCAST":"spellCast",
  "THRUST":"thrust",
  "SLASH":"slash",
  "SHOOT":"shoot",
  "BIGATTACK":"bigAttack"
};

SL.LpcTimeConstants = {
  shootSpeed : 160,
  bigAttackSpeed : 125
};

SL.LpcConstants = {
  width: 64,
  height : 64,
  stand : {
    north : {sx:0, sy:512,},
    south : {sx:0, sy:640},
    east : {sx:0, sy:704},
    west : {sx:0, sy:576}
  },
  castHold : {
    north : {sx:128, sy:0,},
    south : {sx:128, sy:64},
    east : {sx:128, sy:128},
    west : {sx:128, sy:192}
  },
  castDone : {
    north : {sx:320, sy:0,},
    south : {sx:320, sy:64},
    east : {sx:320, sy:128},
    west : {sx:320, sy:192}
  },
  walk : {
    duration:50,
    north : [
      {sx:64, sy:512},
      {sx:128, sy:512},
      {sx:192, sy:512},
      {sx:256, sy:512},
      {sx:320, sy:512},
      {sx:384, sy:512},
      {sx:448, sy:512},
      {sx:512, sy:512}
    ],
    south : [
      {sx:64, sy:640},
      {sx:128, sy:640},
      {sx:192, sy:640},
      {sx:256, sy:640},
      {sx:320, sy:640},
      {sx:384, sy:640},
      {sx:448, sy:640},
      {sx:512, sy:640}
    ],
    east : [
      {sx:64, sy:704},
      {sx:128, sy:704},
      {sx:192, sy:704},
      {sx:256, sy:704},
      {sx:320, sy:704},
      {sx:384, sy:704},
      {sx:448, sy:704},
      {sx:512, sy:704}
    ],
    west : [
      {sx:64, sy:576},
      {sx:128, sy:576},
      {sx:192, sy:576},
      {sx:256, sy:576},
      {sx:320, sy:576},
      {sx:384, sy:576},
      {sx:448, sy:576},
      {sx:512, sy:576}
    ]
  },
  spellCast : {
    duration:140,
    north : [
      {sx:0, sy:0},
      {sx:64, sy:0},
      {sx:128, sy:0},
      {sx:192, sy:0},
      {sx:256, sy:0},
      {sx:320, sy:0},
      {sx:384, sy:0}
    ],
    south : [
      {sx:0, sy:64},
      {sx:64, sy:64},
      {sx:128, sy:64},
      {sx:192, sy:64},
      {sx:256, sy:64},
      {sx:320, sy:64},
      {sx:384, sy:64}
    ],
    east : [
      {sx:0, sy:128},
      {sx:64, sy:128},
      {sx:128, sy:128},
      {sx:192, sy:128},
      {sx:256, sy:128},
      {sx:320, sy:128},
      {sx:384, sy:128}
    ],
    west : [
      {sx:0, sy:192},
      {sx:64, sy:192},
      {sx:128, sy:192},
      {sx:192, sy:192},
      {sx:256, sy:192},
      {sx:320, sy:192},
      {sx:384, sy:192}
    ]
  },
  thrust : {
    duration:125,
    north : [
      {sx:0, sy:256},
      {sx:64, sy:256},
      {sx:128, sy:256},
      {sx:192, sy:256},
      {sx:256, sy:256},
      {sx:320, sy:256},
      {sx:384, sy:256},
      {sx:448, sy:256}
    ],
    south : [
      {sx:0, sy:320},
      {sx:64, sy:320},
      {sx:128, sy:320},
      {sx:192, sy:320},
      {sx:256, sy:320},
      {sx:320, sy:320},
      {sx:384, sy:320},
      {sx:448, sy:320}
    ],
    east : [
      {sx:0, sy:384},
      {sx:64, sy:384},
      {sx:128, sy:384},
      {sx:192, sy:384},
      {sx:256, sy:384},
      {sx:320, sy:384},
      {sx:384, sy:384},
      {sx:448, sy:384}
    ],
    west : [
      {sx:0, sy:448},
      {sx:64, sy:448},
      {sx:128, sy:448},
      {sx:192, sy:448},
      {sx:256, sy:448},
      {sx:320, sy:448},
      {sx:384, sy:448},
      {sx:448, sy:448}
    ]
  },
  slash : {
    duration:125,
    north : [
      {sx:0, sy:768},
      {sx:64, sy:768},
      {sx:128, sy:768},
      {sx:192, sy:768},
      {sx:256, sy:768},
      {sx:320, sy:768}
    ],
    south : [
      {sx:0, sy:832},
      {sx:64, sy:832},
      {sx:128, sy:832},
      {sx:192, sy:832},
      {sx:256, sy:832},
      {sx:320, sy:832}
    ],
    east : [
      {sx:0, sy:896},
      {sx:64, sy:896},
      {sx:128, sy:896},
      {sx:192, sy:896},
      {sx:256, sy:896},
      {sx:320, sy:896}
    ],
    west : [
      {sx:0, sy:960},
      {sx:64, sy:960},
      {sx:128, sy:960},
      {sx:192, sy:960},
      {sx:256, sy:960},
      {sx:320, sy:960}
    ]
  },
  shoot : {
    duration:SL.LpcTimeConstants.shootSpeed,
    north : [
      {sx:0, sy:1216},
      {sx:64, sy:1216},
      {sx:128, sy:1216},
      {sx:192, sy:1216},
      {sx:256, sy:1216},
      {sx:320, sy:1216},
      {sx:384, sy:1216},
      {sx:448, sy:1216, duration:Math.floor(SL.LpcTimeConstants.shootSpeed * 1.013)},
      {sx:512, sy:1216, duration:Math.floor(SL.LpcTimeConstants.shootSpeed * 6)},
      {sx:576, sy:1216},
      {sx:640, sy:1216}
    ],
    south : [
      {sx:0, sy:1088},
      {sx:64, sy:1088},
      {sx:128, sy:1088},
      {sx:192, sy:1088},
      {sx:256, sy:1088},
      {sx:320, sy:1088},
      {sx:384, sy:1088},
      {sx:448, sy:1088, duration:Math.floor(SL.LpcTimeConstants.shootSpeed * 1.013)},
      {sx:512, sy:1088, duration:Math.floor(SL.LpcTimeConstants.shootSpeed * 6)},
      {sx:576, sy:1088},
      {sx:640, sy:1088}
    ],
    east : [
      {sx:0, sy:1152},
      {sx:64, sy:1152},
      {sx:128, sy:1152},
      {sx:192, sy:1152},
      {sx:256, sy:1152},
      {sx:320, sy:1152},
      {sx:384, sy:1152},
      {sx:448, sy:1152, duration:Math.floor(SL.LpcTimeConstants.shootSpeed * 1.013)},
      {sx:512, sy:1152, duration:Math.floor(SL.LpcTimeConstants.shootSpeed * 6)},
      {sx:576, sy:1152},
      {sx:640, sy:1152}
    ],
    west : [
      {sx:0, sy:1216},
      {sx:64, sy:1216},
      {sx:128, sy:1216},
      {sx:192, sy:1216},
      {sx:256, sy:1216},
      {sx:320, sy:1216},
      {sx:384, sy:1216},
      {sx:448, sy:1216, duration:Math.floor(SL.LpcTimeConstants.shootSpeed * 1.013)},
      {sx:512, sy:1216, duration:Math.floor(SL.LpcTimeConstants.shootSpeed * 6)},
      {sx:576, sy:1216},
      {sx:640, sy:1216}
    ]
  },
  bigAttack : {
    duration:SL.LpcTimeConstants.bigAttackSpeed,
    width: 192,
    height : 192,
    north : [
      {sx:0, sy:1344},
      {sx:192, sy:1344},
      {sx:384, sy:1344},
      {sx:576, sy:1344},
      {sx:768, sy:1344}
    ],
    south : [
      {sx:0, sy:1536},
      {sx:192, sy:1536},
      {sx:384, sy:1536},
      {sx:576, sy:1536},
      {sx:768, sy:1536}
    ],
    east : [
      {sx:0, sy:1728},
      {sx:192, sy:1728},
      {sx:384, sy:1728},
      {sx:576, sy:1728},
      {sx:768, sy:1728}
    ],
    west : [
      {sx:0, sy:1920},
      {sx:192, sy:1920},
      {sx:384, sy:1920},
      {sx:576, sy:1920},
      {sx:768, sy:1920}
    ]
  }
};
