import {gethash} from "./sha256.js";
import {getMerkleroot} from "./merkle_tree.js";
//Structure for Each Blocks
class block{
    constructor(block_number,data,pre_hash=''){
        this.nounce = 0;
        this.block_number = block_number;
        this.timestamp = this.getTimeStamp();
        this.data = data;
        this.pre_hash = pre_hash;
        this.hash = this.calculate_hash();
        this.next_hash = '';
        this.merkleroot = getMerkleroot(data);
    }
    calculate_hash(){
        return gethash(this.nounce+' '+this.block_number +' '+ this.timestamp +' '+ JSON.stringify(this.data) +' '+ this.pre_hash);
    }
    proof_of_work(){
        while(this.hash.substring(0,3) != '000'){
            this.nounce++;
            this.hash = this.calculate_hash();
        }
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
        return new block(0,'');
    }
    lastBlock(){
        return this.blockchain[this.blockchain.length -1];
    }
    addBlock(newBlock){
        // console.log(this.lastBlock().block_number);
        newBlock.pre_hash = this.lastBlock().hash;
        newBlock.hash = newBlock.calculate_hash();
        newBlock.proof_of_work();
        this.lastBlock().next_hash = newBlock.hash;
        this.blockchain.push(newBlock);
    }

    valid_chain(){
        for (let i = 1; i < this.blockchain.length; i++) {
            const pre_node = this.blockchain[i-1];
            const cur_node = this.blockchain[i];
            // console.log(cur_node.data);
            if(cur_node.hash !== cur_node.calculate_hash() || cur_node.pre_hash !== pre_node.hash || pre_node.next_hash !== cur_node.hash){
                return [false,i];
            }
        }
        return [true,this.blockchain.length];
    }
}
var b1 = new Blockchain;
b1.addBlock(new block(1,[
    {   from:'Adarsh',
        to:'Abhay',
        amount:100},
    {   from:'Krutharth',
        to:'Akshay',
        amount:1100},
    {   from:'Milan',
        to:'Arjun',
        amount:50},
    {   from:'karan',
        to:'Nikul',
        amount:1560},
    {   from:'Jenish',
        to:'Arpit',
        amount:10550},
    ]));
b1.addBlock(new block(2,[
    {from:'Pratik',to:'Nihal',amount:500},
    {from:'Pratik',to:'Nayan',amount:80},
    {from:'Pratik',to:'Bhautik',amount:500},
    {from:'Miraj',to:'Nihal',amount:55}
]));
b1.addBlock(new block(3,[{from:'Kishan',to:'Rajat',amount:250}]));
b1.addBlock(new block(4,[{from:'Maulik',to:'Yatharth',amount:1000}]));
b1.addBlock(new block(5,[{from:'Nayan',to:'Vivek',amount:355}]));

// console.log(JSON.stringify(b1,null,4));

// b1.blockchain[3].data = {from:'Arjun'};
// b1.blockchain[3].hash = b1.blockchain[3].calculate_hash();
// setInterval(function () {
//     console.log(b1.valid_chain());
// },5000);
// console.log(JSON.stringify(b1,null,4));


//dynamically print blockchain
const display_block = document.querySelector('.block');
let data_string ="";
for (let i = 0; i < b1.blockchain.length; i++) {
    let transaction = JSON.stringify(b1.blockchain[i].data,null,3);
    data_string += `<div id="each-block" style="background-color: white; padding:5px 3px" >
                    Index: ${b1.blockchain[i].block_number} <br>
                    Nounce: ${b1.blockchain[i].nounce} <br>
                    Timestamp: ${b1.blockchain[i].timestamp} <br>
                    Data: ${transaction} <br>
                    Previous Hash: ${b1.blockchain[i].pre_hash} <br>
                    Hash         : ${b1.blockchain[i].hash} <br>
                    Next Hash    : ${b1.blockchain[i].next_hash} <br>
                    Merkle Root    : ${b1.blockchain[i].merkleroot} <br>
                    </div>`
    
}
display_block.innerHTML = data_string;