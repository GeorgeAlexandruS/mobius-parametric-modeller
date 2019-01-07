import {__new__, __merge__} from './_model';

export const _parameterTypes = {
    constList: '__constList__',
    model: '__model__',
    input: '__input__',

    new: '_model.__new__', // TODO - make this genric
    newFn: __new__,

    merge: '_model.__merge__', // TODO - make this genric
    mergeFn: __merge__,

    addData: '_model.addGiData', // TODO - make this genric

    preprocess: '_model.__preprocess__', // TODO - make this genric
    postprocess: '_model.__postprocess__', // TODO - make this genric

    setattrib: '_model.__setAttrib__', // TODO - make this genric
    getattrib: '_model.__getAttrib__', // TODO - make this genric

    return: '_Output.Return'
};

export const _varString = `
PI = Math.PI;
min = Math.min;
max = Math.max;
pow = Math.pow;
sqrt = Math.sqrt;
exp = Math.exp;
log = Math.log;
round = Math.round;
ceil = Math.ceil;
floor = Math.floor;
abs = Math.abs;
sin = Math.sin;
asin = Math.asin;
sinh = Math.sinh;
asinh = Math.asinh;
cos = Math.cos;
acos = Math.acos;
cosh = Math.cosh;
acosh = Math.acosh;
tan = Math.tan;
atan = Math.atan;
tanh = Math.tanh;
atanh = Math.atanh;
atan2 = Math.atan2;
boolean = __modules__._mathjs.boolean;
number = __modules__._mathjs.number;
string = __modules__._mathjs.string;
mad = __modules__._mathjs.mad;
mean = __modules__._mathjs.mean;
median = __modules__._mathjs.median;
mode = __modules__._mathjs.mode;
prod = __modules__._mathjs.prod;
std = __modules__._mathjs.std;
vari = __modules__._mathjs.var;
sum = __modules__._mathjs.sum;
hypot = __modules__._mathjs.hypot;
norm = __modules__._mathjs.norm;
mod = __modules__._mathjs.mod;
square = __modules__._mathjs.square;
cube = __modules__._mathjs.cube;
distance = __modules__._mathjs.distance;
random = __modules__._mathjs.random;
randomInt = __modules__._mathjs.randomInt;
pickRandom = __modules__._mathjs.pickRandom;
range = __modules__._list.range;
length = __modules__._list.length;
`;
