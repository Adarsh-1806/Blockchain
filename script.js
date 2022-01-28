import {gethash} from "./sha256.js";
// var obj = [
//     {   from : 'Adarsh',
//         to: 'Nihal',
//         amount: 500},
//     {   from : 'Adarsh',
//         to: 'Nihal',
//         amount: 500}
// ]

// var hash = gethash(JSON.stringify(obj));
// console.log(hash);

//Structure for Each Blocks
class block{
    constructor(block_number,data,pre_hash=''){
        this.block_number = block_number;
        this.timestamp = this.getTimeStamp();
        this.data = data;
        this.pre_hash = pre_hash;
        this.hash = this.calculate_hash();
        this.next_hash = '';
    }
    calculate_hash(){
        return gethash(this.block_number + this.timestamp + this.data + this.pre_hash);
    }

    getTimeStamp(){
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date+' '+time;
    }
}

//Linked Blockchain
class Blockchain{
    constructor(){
        this.blockchain = [this.firstBlock()];
    }
    firstBlock(){
        return new block(0,'28-01-2021 17.38','First Block Ever','');
    }
    lastBlock(){
        return this.blockchain[this.blockchain.length -1];
    }
    addBlock(newBlock){
        newBlock.pre_hash = gethash(this.lastBlock());
        newBlock.hash = gethash(newBlock);
        this.blockchain.push(newBlock);
    }
}
var b1 = new Blockchain;
b1.addBlock(new block(1,{from:'Adarsh'}));
b1.addBlock(new block(2,{from:'Pratik'}));
console.log(JSON.stringify(b1,null,4));