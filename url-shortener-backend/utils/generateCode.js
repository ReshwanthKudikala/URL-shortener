const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

let urlCode;
let existing;

function generateCode(length=7){
    let res="";
    for(let i=0;i<length;i++){
        const randomIndex=Math.floor(Math.random()*chars.length);
        res+=chars[randomIndex];
    }
    return res;
}
module.exports=generateCode;